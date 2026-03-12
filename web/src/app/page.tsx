import { ImageWrapper, LoginForm } from "@/features/auth";

// Premium SVG Page Transition in Next.js (GSAP + Next Transition Router)
// https://youtu.be/Y_xP_IRGvbM
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex h-full w-full max-w-3xl flex-col items-center justify-between my-12 py-12 px-16 bg-white dark:bg-black sm:items-start">
       <LoginForm />
      
      </main>
    </div>
  );
}
