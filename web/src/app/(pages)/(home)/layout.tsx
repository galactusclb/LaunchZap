import { ReactNode } from "react";

export default function HomeLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black">
			<main className="flex h-full w-full max-w-7xl flex-col items-center justify-between my-8 py-16 px-0 dark:bg-black sm:items-start">
				{children}
			</main>
		</div>
	);
}
