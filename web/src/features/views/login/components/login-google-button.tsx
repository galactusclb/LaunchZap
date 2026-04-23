import Image from 'next/image';
import { constants } from '@/utils/constants';
import { loginSearchParamsSchema, type LoginSearchParams } from '../schemas/login.schema';

export default async function LoginGoogleButton({
    searchParams,
}: {
    searchParams: Promise<LoginSearchParams>;
}) {
    const { returnTo } = loginSearchParamsSchema.parse(await searchParams);
    const googleStartUrl = constants.API.BROWSER_URL
        ? `${constants.API.BROWSER_URL}/auth/google/start?returnTo=${encodeURIComponent(returnTo)}`
        : null;

    return googleStartUrl ? (
        <a
            href={googleStartUrl}
            className="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
            <Image src="/google.svg" alt="Google" width={18} height={18} />
            Continue with Google
        </a>
    ) : (
        <p className="text-sm text-destructive">
            Missing{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
                NEXT_PUBLIC_API_BASE_URL
            </code>
        </p>
    );
}
