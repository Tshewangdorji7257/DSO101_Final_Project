"use client";

import { useState, useRef, useEffect } from "react";
import { BlogPost } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, ImagePlus, Sparkles } from "lucide-react";
import Image from "next/image";

interface PostEditorProps {
  onClose: () => void;
  onSubmit: (post: Omit<BlogPost, "id" | "createdAt" | "readTime" | "author" | "updatedAt">) => void;
  isLoading?: boolean;
}

const categories = ["Travel", "Lifestyle", "Wellness", "Technology", "Culture"];

export function PostEditor({ onClose, onSubmit, isLoading }: PostEditorProps) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Lifestyle");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    
    // Use a default image if none is provided
    const defaultImageUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60";
    
    onSubmit({
      title,
      excerpt: excerpt || content.substring(0, 150) + "...",
      content,
      category,
      imageUrl: imageUrl || defaultImageUrl,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-xl font-bold">Create New Post</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-6 py-10">
          <div 
            className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-muted mb-8 cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <>
                <Image
                  src={imagePreview}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white font-medium">Click to change image</p>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                <ImagePlus className="w-12 h-12 mb-3" />
                <p className="font-medium">Click to add cover image</p>
                <p className="text-sm">Recommended: 1920 x 800</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

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
              placeholder="Write a brief excerpt (optional)..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="border-0 border-b rounded-none px-0 text-lg text-muted-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 h-auto py-3"
            />

            <Textarea
              placeholder="Start writing your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] border-0 px-0 text-lg leading-relaxed placeholder:text-muted-foreground/50 focus-visible:ring-0 resize-none"
            />
          </div>

          <div className="flex items-center gap-4 mt-10 pt-10 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-full px-8">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="rounded-full px-8"
              disabled={!title || !content}
            >
              Publish Article
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
