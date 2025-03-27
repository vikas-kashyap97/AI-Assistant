"use client";
import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/convex/_generated/api";
import { GetAuthUserData } from "@/services/GlobalApi";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { CoolMode } from "@/components/magicui/cool-mode";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import { BlurFade } from "@/components/magicui/blur-fade";

const AIAssistantSignIn = () => {
  const CreateUser = useMutation(api.users.CreateUser);
  const { setUser } = useContext(AuthContext);
  const router = useRouter();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (typeof window !== "undefined") {
        localStorage.setItem('user_token', tokenResponse.access_token);
      }
      const user = await GetAuthUserData(tokenResponse.access_token);
      const result = await CreateUser({
        name: user?.name,
        email: user?.email,
        picture: user?.picture
      });
      setUser(result);
      router.replace('/ai-assistants');
    },
    onError: errorResponse => console.log(errorResponse),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-4">
      <BlurFade delay={0.1} inView>
        <NeonGradientCard className="w-full max-w-md p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl dark:shadow-lg dark:shadow-indigo-500/20">
          <div className="flex flex-col items-center space-y-6">
            <VelocityScroll className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Welcome to AI Companion
            </VelocityScroll>
            
            <div className="w-full">
              <CoolMode>
                <Button 
                  onClick={() => googleLogin()} 
                  className="w-full py-6 text-base sm:text-lg flex items-center justify-center space-x-3 bg-white dark:bg-slate-800 text-black dark:text-white border-2 border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z" opacity=".1"/>
                    <path d="M12 23c2.97 0 5.46-1 7.28-2.72l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.87 0-5.3-1.94-6.16-4.55H2.18v2.84C4 20.13 7.69 23 12 23z" opacity=".2"/>
                    <path d="M5.84 14.09c-.23-.69-.36-1.43-.36-2.21s.13-1.52.36-2.21V7.84H2.18C1.43 9.14 1 10.53 1 12s.43 2.86 1.18 4.16l3.66-2.84z" opacity=".3"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.69 1 4 3.87 2.18 7.84l3.66 2.84c.86-2.61 3.29-4.55 6.16-4.55z"/>
                  </svg>
                  <span>Sign In with Google</span>
                </Button>
              </CoolMode>
            </div>
            
            <p className="text-xs sm:text-lg text-center bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-500 dark:to-blue-400 text-transparent bg-clip-text px-4">
                Securely sign in to access your personalized AI Companion experience
            </p>

          </div>
        </NeonGradientCard>
      </BlurFade>
    </div>
  );
};

export default AIAssistantSignIn;