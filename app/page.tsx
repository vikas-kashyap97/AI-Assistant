"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
import { AuroraText } from "@/components/magicui/aurora-text";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "./(main)/_components/Header";
import { Lens } from "@/components/magicui/lens";
import { WarpBackground } from "@/components/magicui/warp-background";
import React, { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetStarted = () => {
    router.push("/sign-in"); // Sign-in page pe redirect karega
  };

  return (
    <div>
      <Header />
      {mounted && (
        <WarpBackground>
          <Lens zoomFactor={2} lensSize={150} isStatic={false} ariaLabel="Zoom Area">
            <div className="mt-32 p-4 flex flex-col items-center text-center">
              {/* ✨ Animated Gradient Text */}
              <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
                <span
                  className={cn(
                    "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
                  )}
                  style={{
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "destination-out",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "subtract",
                    WebkitClipPath: "padding-box",
                  }}
                />
                🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
                <AnimatedGradientText className="text-sm font-medium">
                  Introducing Personal AI Assistant
                </AnimatedGradientText>
                <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </div>

              {/* 🌟 AuroraText Heading */}
              <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl mt-2">
                Your Personal <AuroraText>AI Assistant</AuroraText>
              </h1>

              {/* 🚀 Get Started Button */}
              <Button className="mt-6" onClick={handleGetStarted}>
                Get Started
              </Button>

              {/* 🖼️ Workspace Image */}
              <div className="mt-10">
                <Image
                  src="/main-page-image.png" // Ensure this file is inside the "public" folder
                  alt="Workspace Preview"
                  width={800}
                  height={450}
                  className="rounded-lg shadow-lg h-[385px] w-[700px] border"
                />
              </div>
            </div>
          </Lens>
        </WarpBackground>
      )}
    </div>
  );
}
