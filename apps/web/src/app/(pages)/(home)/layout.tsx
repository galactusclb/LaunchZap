import { ReactNode } from 'react';

export default function HomeLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-background font-sans">
            <main className="mx-auto w-full max-w-5xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
