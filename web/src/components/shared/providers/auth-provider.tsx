'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { meFullResponseSchema } from '@/models/user.schema';
import { useAuthStore } from '@/store/auth.store';

import { apiGet } from '@/utils/api/api-client';
import type { ReactNode } from 'react';

export default function AuthProvider({ children }: { children: ReactNode }) {
    const { setUser, clearUser, setLoading } = useAuthStore();

    const { data, isLoading } = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const res = await apiGet(`/auth/me`,meFullResponseSchema);
            if (!res.success) throw new Error('Unauthenticated');
            return res.data;
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
