'use client';

export default function LaunchError({ reset }: { error: Error; reset: () => void }) {
    return (
        <div>
            <p>Something went wrong loading this launch.</p>
            <button onClick={reset}>Try again</button>
        </div>
    );
}
