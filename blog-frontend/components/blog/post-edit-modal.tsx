"use client";

import { useState, useEffect } from "react";
import { BlogPost } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Sparkles } from "lucide-react";

interface PostEditModalProps {
  post: BlogPost;
  onClose: () => void;
  onSubmit: (postData: Partial<BlogPost>) => Promise<void>;
  isLoading?: boolean;
}

const categories = ["Travel", "Lifestyle", "Wellness", "Technology", "Culture"];

export function PostEditModal({ post, onClose, onSubmit, isLoading }: PostEditModalProps) {
  const [title, setTitle] = useState(post.title);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [content, setContent] = useState(post.content);
  const [category, setCategory] = useState(post.category);
  const [imageUrl, setImageUrl] = useState(post.imageUrl);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      await onSubmit({
        title,
        excerpt,
        content,
        category,
        imageUrl,
      });
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-xl font-bold">Edit Post</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} disabled={isLoading}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <Input
              placeholder="Enter your article title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-0 border-b rounded-none px-0 text-3xl font-serif font-bold placeholder:text-muted-foreground/50 focus-visible:ring-0 h-auto py-3"
            />

            <Input
              placeholder="Write a brief excerpt..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="border-0 border-b rounded-none px-0 text-lg text-muted-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 h-auto py-3"
            />

            <Input
              placeholder="Image URL (optional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="border-0 border-b rounded-none px-0 text-sm placeholder:text-muted-foreground/50 focus-visible:ring-0 h-auto py-3"
            />

            <Textarea
              placeholder="Start writing your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] border-0 px-0 text-lg leading-relaxed placeholder:text-muted-foreground/50 focus-visible:ring-0 resize-none"
            />
          </div>

          <div className="flex items-center gap-4 mt-10 pt-10 border-t border-border">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="rounded-full px-8"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="rounded-full px-8"
              disabled={!title || !content || isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
