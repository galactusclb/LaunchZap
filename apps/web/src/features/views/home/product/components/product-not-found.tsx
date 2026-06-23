import { Rocket } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function ProductNotFound() {
    return (
        <div className="flex flex-col items-center gap-8 py-24 text-center">
            <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 88, height: 88, background: 'oklch(0.93 0.05 55)' }}
                aria-hidden
            >
                <Rocket size={40} strokeWidth={1.5} style={{ color: 'oklch(0.58 0.22 50)' }} />
            </div>

            <div className="flex flex-col gap-3 max-w-sm">
                <p
                    className="font-black tracking-tight"
                    style={{
                        fontSize: 'clamp(2rem, 6vw, 3rem)',
                        color: 'oklch(0.18 0.015 58)',
                        lineHeight: 1.1,
                    }}
                >
                    Product not found
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                    This product may have been removed or the link is incorrect.
                </p>
            </div>

            <Button
                asChild
                className="rounded-full gap-2 bg-brand text-brand-foreground hover:bg-brand/90 border-transparent"
            >
                <Link href="/">
                    <Rocket className="size-3.5" />
                    Browse Products
                </Link>
            </Button>
        </div>
    );
}
