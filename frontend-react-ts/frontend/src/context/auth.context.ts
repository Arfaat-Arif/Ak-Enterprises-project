import { createContext } from 'react';

interface AuthContextValue {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    clearSession: () => void;
}

export type { AuthContextValue };
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
