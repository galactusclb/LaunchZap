'use client';

import { constants } from '@/utils/constants';
import { useAuthStore } from '@/store/auth.store';
import { ReactNode, useEffect } from 'react';

export default function AuthProvider({ children }: { children: ReactNode }) {
    const { setUser, clearUser, setLoading } = useAuthStore();

    useEffect(() => {
        setLoading(true);

        fetch(`${constants.API.BROWSER_URL}/auth/me`, {
            credentials: 'include',
        })
            .then((res) => {
                if (!res.ok) throw new Error('Unauthenticated');
                return res.json();
            })
            .then((user) => setUser(user))
            .catch(() => clearUser())
            .finally(() => setLoading(false));
    }, [setUser, clearUser, setLoading]);

    return <>{children}</>;
}
