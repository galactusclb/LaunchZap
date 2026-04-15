import { create } from 'zustand';

export type AuthUser = {
    id: string;
    email: string;
    role: string;
};

type AuthState = {
    user: AuthUser | null;
    isLoading: boolean;
    setUser: (user: AuthUser) => void;
    clearUser: () => void;
    setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
    setLoading: (isLoading) => set({ isLoading }),
}));
