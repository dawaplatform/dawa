// src/types/next-auth.d.ts

import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

/**
 * Extends the default Session interface to include custom user properties.
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name: string;
      image: string | null;
      role: 'Client' | 'Vendor'; // Restricting to two roles
    };
    accessToken: string;
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    name: string;
    image: string | null;
    role: 'Client' | 'Vendor'; // Restricting to two roles
    token: string;
  }
}

/**
 * Extends the default JWT interface to include custom token properties.
 */
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    name: string;
    picture: string | null;
    role: 'Client' | 'Vendor'; // Restricting to two roles
    accessToken: string;
  }
}

/**
 * Extends the NextRequest interface from 'next/server' to include the 'nextauth' property.
 */
declare module 'next/server' {
  interface NextRequest {
    nextauth: {
      token: JWT | null; // Token can be null if not authenticated
      session: Session | null; // Session can be null if not authenticated
    };
  }
}
