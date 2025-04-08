import NextAuth from 'next-auth';
import { authOptions } from '@/@core/auth/auth';

const handler = NextAuth(authOptions);

// Export only the route handlers
export { handler as GET, handler as POST };
