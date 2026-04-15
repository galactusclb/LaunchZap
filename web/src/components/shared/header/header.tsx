'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Header() {
    const { user, isLoading } = useAuthStore();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                <Link href="/" className="text-lg font-bold text-primary">
                    LaunchZap
                </Link>

                <nav className="flex items-center gap-3">
                    {isLoading ? (
                        <div className="size-8 animate-pulse rounded-full bg-gray-200" />
                    ) : user ? (
                        <Avatar className="size-8 cursor-pointer">
                            <AvatarFallback className="bg-purple-100 text-sm font-semibold">
                                {user.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <Button asChild size="sm">
                            <Link href="/login">Login</Link>
                        </Button>
                    )}
                </nav>
            </div>
        </header>
    );
}
