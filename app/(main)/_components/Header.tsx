"use client";

import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext } from "react";

const Header = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname(); 
  
  if (pathname === "/workspace") return null;

  const handleGetStarted = () => {
    router.push("/sign-in"); // Sign-in page pe redirect karega
  };

  return (
    <header className="p-4 fixed w-full top-0 shadow-md bg-white dark:bg-gray-900 flex justify-between items-center z-50">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <Image
          src={"/logo.svg"}
          alt="Logo"
          width={40}
          height={40}
          className="transition-transform duration-300 hover:scale-110"
        />
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
          AI Assistant
        </h1>
      </div>

      {/* User Profile ya "Get Started" Button */}
      {user ? (
        <Image
          src={user.picture}
          alt={user?.name ? `${user.name}'s Profile Picture` : "User Profile"}
          width={40}
          height={40}
          className="rounded-full border-2 border-gray-300 dark:border-gray-600 shadow-md transition-transform duration-300 hover:scale-110"
        />
      ) : (
        <Button onClick={handleGetStarted}>Get Started</Button>
      )}
    </header>
  );
};

export default Header;
