import { Suspense } from "react";
import { constants } from "@/utils/constants";


function safeReturnTo(input: unknown): string {
  if (typeof input !== "string") return "/dashboard";
  if (!input.startsWith("/")) return "/";
  if (input.startsWith("//")) return "/";
  return input;
}

async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>
}) {
  const {returnTo} = await searchParams
  const returnTox = safeReturnTo(returnTo)

  const apiBase = constants.API.BROWSER_URL;
  const googleStartUrl = apiBase
    ? `${apiBase}/auth/google/start?returnTo=${encodeURIComponent(returnTox)}`
    : null;

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-red-300">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-semibold">Login</h1>

        {googleStartUrl ? (
          <a
            href={googleStartUrl}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Google Auth
          </a>
        ) : (
          <p className="text-sm text-muted-foreground">
            Missing <code>NEXT_PUBLIC_API_BASE_URL</code>
          </p>
        )}
      </div>
    </div>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>
}) {
  return (
    <Suspense fallback={<div className="flex w-full min-h-screen items-center justify-center">Loading...</div>}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}
