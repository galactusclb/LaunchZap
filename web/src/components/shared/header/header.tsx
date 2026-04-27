'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/config/routes';
import { logoutResponseSchema } from '@/models/user.schema';
import { useAuthStore } from '@/store/auth.store';
import { apiPost } from '@/utils/api/api-client';

export default function Header() {
    const { user, isLoading, clearUser } = useAuthStore();
    const router = useRouter();

    async function handleLogout() {
        await apiPost(`/auth/logout`, {}, logoutResponseSchema);
        clearUser();
        router.push(ROUTES.login);
    }

    return (
        <header className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="mx-auto h-16 flex max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href={ROUTES.home} className="text-2xl font-black tracking-tight text-brand">
                    LaunchZap
                </Link>

                <nav className="flex items-center gap-3">
                    {isLoading ? (
                        <div className="size-8 animate-pulse rounded-full bg-muted" />
                    ) : user ? (
                        <>
                            <Button asChild size="sm" className="bg-brand text-brand-foreground hover:bg-brand/90 border-transparent">
                                <Link href={ROUTES.submit}>Submit</Link>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild aria-label="User menu">
                                    <Avatar className="size-8 cursor-pointer">
                                        <AvatarImage src={user?.pictureUrl}/>
                                        <AvatarFallback className="bg-brand/15 text-sm font-semibold">
                                            {user.email.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem className="text-muted-foreground text-xs" disabled>
                                        {user.email}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <Button asChild size="sm" className="bg-brand text-brand-foreground hover:bg-brand/90 border-transparent">
                            <Link href={ROUTES.login}>Login</Link>
                        </Button>
                    )}
                </nav>
            </div>
        </header>
    );
}
