import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import axios from 'axios';
import * as jwtDecode from 'jwt-decode';
import { useSWRConfig } from 'swr';

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface Counters {
  favorites: number;
  messages: number;
  notifications: number;
}

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export function useAuth() {
  const { data: session, status } = useSession();
  const { cache } = useSWRConfig();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [counters, setCounters] = useState<Counters>({
    favorites: 0,
    messages: 0,
    notifications: 0,
  });
  const [tokenExpired, setTokenExpired] = useState(false);

  // Memoize clearSWRCache so that logout can safely depend on it.
  const clearSWRCache = useCallback(() => {
    if (typeof cache.keys === 'function') {
      for (const key of cache.keys()) {
        cache.delete(key);
      }
    } else {
      console.warn('SWR cache does not support keys() method.');
    }
  }, [cache]);

  const logout = useCallback(async () => {
    try {
      await signOut({ redirect: false });
      setUser(null);
      setCounters({
        favorites: 0,
        messages: 0,
        notifications: 0,
      });
      localStorage.clear();
      clearSWRCache();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [clearSWRCache]);

  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      if (session?.accessToken) {
        config.headers['Authorization'] = `Token ${session.accessToken}`;
      }
      return config;
    });
    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [session]);

  useEffect(() => {
    if (session?.accessToken) {
      if (session.accessToken.split('.').length !== 3) {
        console.warn('Invalid JWT token format. Skipping token decode.');
        return;
      }

      try {
        const decodeJwt = jwtDecode as unknown as <T>(token: string) => T;
        const decoded = decodeJwt<DecodedToken>(session.accessToken);
        const tokenExpirationTime = decoded.exp * 1000;
        const now = Date.now();

        if (tokenExpirationTime <= now) {
          setTokenExpired(true);
          logout();
        } else {
          const timeout = tokenExpirationTime - now;
          const timer = setTimeout(() => {
            setTokenExpired(true);
            logout();
          }, timeout);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [session, logout]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user) {
        setUser({
          id: session.user.id as string,
          name: session.user.name || '',
          email: session.user.email || '',
          image: session.user.image || '',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    if (status !== 'loading') {
      fetchUserData();
    }
  }, [session, status]);

  return {
    user,
    loading: status === 'loading' || loading,
    logout,
    counters,
    tokenExpired,
  };
}
