'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { constants } from '@/utils/constants';
import { useAuthStore } from '@/store/auth.store';
import { meFullResponseSchema } from '@/models/user.schema';

import type { ReactNode } from 'react';

export default function AuthProvider({ children }: { children: ReactNode }) {
    const { setUser, clearUser, setLoading } = useAuthStore();

    const { data, isLoading } = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const res = await fetch(`${constants.API.BROWSER_URL}/auth/me`, {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Unauthenticated');
            return meFullResponseSchema.parse(await res.json()).data;
        },
        retry: false,
    });

    useEffect(() => {
        setLoading(isLoading);
        if (!isLoading) {
            if (data) setUser(data);
            else clearUser();
        }
    }, [isLoading, data, setUser, clearUser, setLoading]);

    return <>{children}</>;
}
