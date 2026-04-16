import { Suspense } from "react";
import Image from "next/image";
import { constants } from "@/utils/constants";

function safeReturnTo(input: unknown): string {
  if (typeof input !== "string") return "/";
  if (!input.startsWith("/")) return "/";
  if (input.startsWith("//")) return "/";
  return input;
}

async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo } = await searchParams;
  const returnTox = safeReturnTo(returnTo);

  const apiBase = constants.API.BROWSER_URL;
  const googleStartUrl = apiBase
    ? `${apiBase}/auth/google/start?returnTo=${encodeURIComponent(returnTox)}`
    : null;

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

          {googleStartUrl ? (
            <a
              href={googleStartUrl}
              className="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Image src="/google.svg" alt="Google" width={18} height={18} />
              Continue with Google
            </a>
          ) : (
            <p className="text-sm text-destructive">
              Missing <code className="rounded bg-muted px-1 py-0.5 text-xs">NEXT_PUBLIC_API_BASE_URL</code>
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By continuing, you agree to our
          <a href="/terms" className="underline underline-offset-2 hover:text-foreground">
            Terms of Service
          </a>
          and
          <a href="/privacy" className="underline underline-offset-2 hover:text-foreground">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
        </div>
      }
    >
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}
