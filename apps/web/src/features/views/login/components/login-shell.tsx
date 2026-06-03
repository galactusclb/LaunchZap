import { ReactNode } from 'react';

export default async function LoginShell({ children }: { children: ReactNode }) {
    'use cache';

    return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground text-lg font-bold">
                        Z
                    </div>
                    <h1 className="text-xl font-semibold text-foreground">LaunchZap</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Discover and launch your next big thing
                    </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="mb-1 text-base font-semibold text-foreground">Sign in</h2>
                    <p className="mb-5 text-sm text-muted-foreground">
                        Welcome back. Sign in to your account.
                    </p>
                    {children}
                </div>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                    By continuing, you agree to our
                    <a href="/terms" className="underline underline-offset-2 hover:text-foreground">
                        Terms of Service
                    </a>
                    and
                    <a
                        href="/privacy"
                        className="underline underline-offset-2 hover:text-foreground"
                    >
                        Privacy Policy
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}
