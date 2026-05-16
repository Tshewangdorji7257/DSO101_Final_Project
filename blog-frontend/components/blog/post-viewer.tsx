"use client";

import { BlogPost } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, Share2, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";

interface PostViewerProps {
  post: BlogPost;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PostViewer({ post, onBack, onEdit, onDelete }: PostViewerProps) {
  let formattedDate: string;
  try {
    const date = typeof post.createdAt === 'string' ? new Date(post.createdAt) : post.createdAt;
    formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch (error) {
    formattedDate = "Date unavailable";
  }

  return (
    <article className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-32 relative z-10">
        <span className="inline-block px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-full mb-6">
          {post.category}
        </span>

        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-10 pb-10 border-b border-border">
          <div className="flex items-center gap-3">
            {post.author.avatar && (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            )}
            <div>
              <span className="font-medium text-foreground block">{post.author.name}</span>
              <span className="text-xs text-muted-foreground">{post.author.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {post.readTime} min read
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          {post.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="text-foreground/90 leading-relaxed mb-6 text-lg">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-border">
          <div className="flex items-center gap-4 p-6 bg-muted/50 rounded-2xl">
            {post.author.avatar && (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="font-serif font-bold text-lg mb-1">Written by {post.author.name}</h3>
              <p className="text-muted-foreground text-sm">{post.author.email}</p>
            </div>
          </div>
        </div>

        <div className="py-16" />
      </div>
    </article>
  );
}
