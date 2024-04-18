import { createContext } from 'react';
import type { AuthenticationContextType } from '@/types/authentication';

export const AuthenticationContext = createContext(
  {} as AuthenticationContextType,
);
