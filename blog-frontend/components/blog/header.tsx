"use client";

import Link from "next/link";
import { PenLine, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useEditor } from "@/lib/editor-context";

interface HeaderProps {
  onCreatePost?: () => void;
}

export function Header({ onCreatePost }: HeaderProps) {
  const { user, logout } = useAuth();
  const { openEditor } = useEditor();

  const handleWriteClick = () => {
    if (onCreatePost) {
      onCreatePost();
    } else {
      openEditor();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-blue-600 to-red-500 flex items-center justify-center shadow-lg">
            <PenLine className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-semibold tracking-tight">
              {user?.name || 'BlogPlatform'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {user ? 'Your Blog' : 'Share Your Stories'}
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/archive" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Archive
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button onClick={handleWriteClick} className="gap-2 rounded-full">
                <PenLine className="w-4 h-4" />
                <span className="hidden sm:inline">Write</span>
              </Button>

              <Button 
                onClick={logout} 
                variant="outline" 
                className="gap-2 rounded-full"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="rounded-full">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="rounded-full">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
