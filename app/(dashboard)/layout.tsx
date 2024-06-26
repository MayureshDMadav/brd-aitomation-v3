import React, { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Logo from "@/components/providers/Logo";

// Function to view Main Layout Page for form builder
const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
      {/* Header Section */}
      <nav className="flex justify-between items-center border-b border-border h-[60px] px-4 py-2">
        {/* Setup Logo For Project */}
        <Logo />
        <div className="flex gap-4 items-center">
          {/* To change From Drak and light Theme using shadcdn */}
          <ThemeSwitcher />
          {/* Singin Button To initiate Sing in using Clerk */}
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
      {/* Body Section */}
      <main className="flex w-full flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
