/**
 * Next.js instrumentation hook — runs once when the Node.js server starts.
 *
 * Forces IPv4-first DNS resolution for ALL outbound connections (including
 * NextAuth's internal OAuth token exchange with Google and our Django backend
 * calls). On Linux, Node.js defaults to preferring IPv6 (::1 / ::), which
 * causes ETIMEDOUT when the remote endpoint isn't reachable over IPv6.
 *
 * This is intentionally code-based (not a NODE_OPTIONS env var) so it works
 * without any environment-specific configuration in production.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { setDefaultResultOrder } = await import('node:dns');
    setDefaultResultOrder('ipv4first');
  }
}
