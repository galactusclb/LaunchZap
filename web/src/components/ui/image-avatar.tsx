'use client'

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

type ImageAvatarProps = {
    className?: string
    src?: string
    alt: string
    fallback: string
    size?: number
}

export default function ImageAvatar({ className, src, alt, size =48, fallback }: ImageAvatarProps) {
    const [isError, setError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={cn("rounded-lg relative overflow-hidden shrink-0 bg-brand/15", className)}>
            {!isLoaded && !isError && src && (
                <div className="absolute inset-0 bg-gray-300 animate-pulse" />
            )}
            {
                (src && !isError) ? (
                    <Image
                        src={src}
                        alt={alt}
                        // fill
                        // sizes={sizes}
                        height={size}
                        width={size}
                        className="object-cover size-full"
                        onError={()=>setError(true)}
                        onLoad={()=>setIsLoaded(true)}
                    />
                ) : (
                    <span className="flex justify-center items-center size-full text-2xl font-semibold text-brand-foreground">
                        {fallback}
                    </span>
                )
            }
        </div>
    );
};