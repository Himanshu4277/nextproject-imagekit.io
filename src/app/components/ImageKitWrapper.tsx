
"use client";

import { ImageKitProvider } from "imagekitio-next";

export default function ImageKitWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ImageKitProvider
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!}
    >
      {children}
    </ImageKitProvider>
  );
}
