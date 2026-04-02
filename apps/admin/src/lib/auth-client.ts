import { createAuthClient } from 'better-auth/react';

export const { signIn, signUp, signOut, useSession } = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_BASE_URL,
});
