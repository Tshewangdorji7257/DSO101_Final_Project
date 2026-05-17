"use client";

import Link from "next/link";
import { PenLine } from "lucide-react";

export function Footer() {

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-blue-600 to-red-500 flex items-center justify-center shadow-lg">
                <PenLine className="w-6 h-6 text-white" />
              </div>
              <span className="font-serif text-xl font-semibold">
                BlogPlatform
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A platform for sharing stories, thoughts, and reflections. Join our community of writers and readers.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/archive" className="hover:text-foreground transition-colors">Archive</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Stay Connected</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe to receive new articles directly in your inbox.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 rounded-full bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BlogPlatform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
