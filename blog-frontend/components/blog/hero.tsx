import { User } from "@/lib/auth-context";
import { PenLine } from "lucide-react";

interface HeroProps {
  user: User | null;
}

export function Hero({ user }: HeroProps) {
  // If user is logged in, show personalized hero
  if (user) {
    return (
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-lg" />
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="relative w-[160px] h-[160px] rounded-full object-cover border-4 border-background shadow-xl"
                />
              ) : (
                <div className="relative w-[160px] h-[160px] rounded-full bg-gradient-to-br from-primary via-blue-600 to-red-500 flex items-center justify-center border-4 border-background shadow-xl">
                  <PenLine className="w-20 h-20 text-white" />
                </div>
              )}
            </div>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
            Welcome, {user.name}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            {user.bio || "Share your thoughts, stories, and reflections with the world."}
          </p>
        </div>
      </section>
    );
  }

  // Generic landing page for non-authenticated users
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-lg" />
            <img
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&auto=format&fit=crop&q=60"
              alt="Blogging inspiration"
              className="relative w-[160px] h-[160px] rounded-full object-cover border-4 border-background shadow-xl"
            />
          </div>
        </div>
        
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
          Discover Inspiring <br />
          <span className="text-primary">Stories & Reflections</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
          Explore thoughtful articles on travel, lifestyle, and personal growth. Share your own voice and connect with a community of writers and thinkers.
        </p>

        <div className="mt-10 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Travel
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Lifestyle
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-muted-foreground" />
            Wellness
          </div>
        </div>
      </div>
    </section>
  );
}
