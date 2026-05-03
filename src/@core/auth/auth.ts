import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

interface ApiUserData {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  /** Backend sends `profile_picture` (not user_profile_picture) */
  profile_picture?: string;
  /** Backend sends `role` (not user_role) */
  role?: 'Client' | 'Vendor' | 'Admin';
}

interface LoginResponse {
  status?: number;
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
              validateStatus: (status) => status >= 200 && status < 300,
            },
          );

          const { user_data, message } = response.data;

          if (!user_data?.user_data) {
            throw new Error(message || 'Invalid login response');
          }

          const userInfo = user_data.user_data;

          if (!userInfo.id || !userInfo.email) {
            throw new Error('Incomplete user data returned from login API');
          }

          if (!user_data.token) {
            throw new Error('Login succeeded but no access token was returned.');
          }

          // Ensure role and token are always defined (fallbacks provided)
          return {
            id: userInfo.id.toString(),
            name: `${userInfo.first_name || ''} ${userInfo.last_name || ''}`.trim(),
            email: userInfo.email,
            image: userInfo.profile_picture ?? null,
            role: (userInfo.role as 'Client' | 'Vendor') ?? 'Client',
            token: user_data.token,
          };
        } catch (error) {
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
            if (!account.id_token) {
              throw new Error(
                'Google did not return an id_token. Ensure "openid" scope is included.',
              );
            }

            const response = await axios.post<LoginResponse>(
              `${process.env.NEXT_PUBLIC_API_URL}/googlelogin/`,
              {
                google_token: account.id_token,
                role: 'Client',
              },
              { timeout: 12_000 },
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
            token.picture = userInfo.profile_picture ?? null;
            token.role = (userInfo.role as 'Client' | 'Vendor') ?? 'Client';
            token.accessToken = user_data?.token ?? '';
          } catch (err: unknown) {
            const e = err as NodeJS.ErrnoException & { response?: { status?: number; data?: unknown } };
            const code = e.code ?? 'UNKNOWN';
            const status = e.response?.status;
            const hint =
              code === 'ECONNREFUSED'
                ? 'Django backend is not running — start it with: python manage.py runserver'
                : code === 'ETIMEDOUT'
                ? 'Connection to Django backend timed out — ensure NEXT_PUBLIC_API_URL is reachable and the server is running'
                : status
                ? `Django returned HTTP ${status}`
                : e.message;
            console.error('[Google OAuth] Backend call failed:', hint, e.response?.data ?? '');
            throw new Error(`Google sign-in failed: ${hint}`);
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
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
