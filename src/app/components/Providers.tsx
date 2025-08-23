'use client';

import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
    if (!urlEndpoint) {
        console.warn("⚠️ NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is missing");
    }

    return (
        <SessionProvider refetchInterval={5 * 60}>
            <ImageKitProvider urlEndpoint={urlEndpoint || ""}>
                {children}
            </ImageKitProvider>
        </SessionProvider>
    );
}
