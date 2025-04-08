import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

interface ApiUserData {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  user_profile_picture?: string;
  // user_role must always be "Client" or "Vendor"
  user_role?: 'Client' | 'Vendor';
}

interface LoginResponse {
  status: number;
  message?: string;
  user_data?: {
    token?: string;
    user_data?: ApiUserData;
  };
}

// Extend NextAuth's default types to include custom fields
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string | null;
      role: 'Client' | 'Vendor'; // must be one of these, not null
    };
    accessToken: string; // always a string
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: 'Client' | 'Vendor'; // must be one of these
    token: string; // always a string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    email: string;
    picture: string | null;
    role: 'Client' | 'Vendor'; // always defined
    accessToken: string; // always defined
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: 'openid email profile',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username or Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Username or password missing');
        }

        try {
          const response = await axios.post<LoginResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/login/`,
            {
              username: credentials.username,
              password: credentials.password,
            },
            {
              validateStatus: (status) => status === 200 || status === 202,
            },
          );

          const { status, user_data, message } = response.data;

          if (status !== 202 || !user_data?.user_data) {
            console.error('Invalid login response:', response.data);
            throw new Error(message || 'Invalid login response');
          }

          const userInfo = user_data.user_data;

          if (!userInfo.id || !userInfo.email) {
            console.error(
              'Incomplete user data returned from login API:',
              userInfo,
            );
            throw new Error('Incomplete user data returned from login API');
          }

          // Ensure role and token are always defined (fallbacks provided)
          return {
            id: userInfo.id.toString(),
            name: `${userInfo.first_name || ''} ${userInfo.last_name || ''}`.trim(),
            email: userInfo.email,
            image: userInfo.user_profile_picture ?? null,
            role: userInfo.user_role ?? 'Client',
            token: user_data.token ?? '',
          };
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // When first logging in, user and account will be defined
      if (account && user) {
        if (account.provider === 'google') {
          try {
            const response = await axios.post<LoginResponse>(
              `${process.env.NEXT_PUBLIC_API_URL}/googlelogin/`,
              {
                google_token: account.id_token,
                user_role: 'Client',
              },
            );

            const { user_data } = response.data;
            const userInfo = user_data?.user_data;

            if (!userInfo || !userInfo.id) {
              throw new Error(
                'Invalid Google login response or user info missing',
              );
            }

            token.id = userInfo.id.toString();
            token.name =
              `${userInfo.first_name || ''} ${userInfo.last_name || ''}`.trim();
            token.email = userInfo.email;
            token.picture = userInfo.user_profile_picture ?? null;
            token.role = userInfo.user_role ?? 'Client';
            token.accessToken = user_data?.token ?? '';
          } catch (error) {
            console.error('Error during Google login:', error);
            throw error;
          }
        } else if (account.provider === 'credentials') {
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
          token.picture = user.image ?? null;
          token.role = user.role;
          token.accessToken = user.token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
