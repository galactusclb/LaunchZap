'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/config/routes';

interface SubmitSuccessBannerProps {
    productId: string;
    onDismiss: () => void;
}

export default function SubmitSuccessBanner({ productId, onDismiss }: SubmitSuccessBannerProps) {
    return (
        <Card className="w-full text-center">
            <CardHeader>
                <CardTitle>You&apos;re live!</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-sm">
                    Your product has been submitted successfully.
                </p>
            </CardContent>
            <CardFooter className="justify-center gap-3">
                <Button variant="outline" onClick={onDismiss}>
                    Submit another
                </Button>
                <Button asChild>
                    <Link href={ROUTES.launch(productId)}>View your launch &rarr;</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
