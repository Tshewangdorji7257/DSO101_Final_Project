"use client";

import { BlogPost } from "@/lib/types";
import { blogStyles } from "@/lib/blog-styles";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";

interface PostCardProps {
  post: BlogPost;
  featured?: boolean;
  onClick: () => void;
  onEdit?: (post: BlogPost) => void;
  onDelete?: (postId: string) => void;
}

export function PostCard({ post, featured = false, onClick, onEdit, onDelete }: PostCardProps) {
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

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(post);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(post.id);
  };

  if (featured) {
    return (
      <Card 
        className={blogStyles.card.featured}
        onClick={onClick}
      >
        <div className={blogStyles.card.grid}>
          <div className={blogStyles.image.aspect}>
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <span className={`absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground ${blogStyles.text.category}`}>
              {post.category}
            </span>
          </div>
          
          <div className="p-8 md:p-10 flex flex-col justify-between bg-card">
            <div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>{formattedDate}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime} min read
                </span>
              </div>
              
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors text-balance">
                {post.title}
              </h2>
              
              <p className="text-muted-foreground leading-relaxed mb-6 text-pretty">
                {post.excerpt}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                Read Article
                <ArrowRight className="w-4 h-4" />
              </div>
              {(onEdit || onDelete) && (
                <div className={blogStyles.buttons.container} onClick={(e) => e.stopPropagation()}>
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditClick}
                      className={`${blogStyles.buttons.action} text-muted-foreground`}
                    >
                      <Edit2 className={blogStyles.buttons.icon} />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDeleteClick}
                      className={`${blogStyles.buttons.action} text-destructive`}
                    >
                      <Trash2 className={blogStyles.buttons.icon} />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={blogStyles.card.regular}
      onClick={onClick}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className={`absolute top-4 left-4 px-3 py-1 bg-background/90 backdrop-blur-sm text-foreground ${blogStyles.text.category}`}>
          {post.category}
        </span>
        {(onEdit || onDelete) && (
          <div className={blogStyles.buttons.container} onClick={(e) => e.stopPropagation()}>
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleEditClick}
                className={blogStyles.buttons.action}
              >
                <Edit2 className={blogStyles.buttons.icon} />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteClick}
                className={blogStyles.buttons.action}
              >
                <Trash2 className={blogStyles.buttons.icon} />
              </Button>
            )}
          </div>
        )}
      </div>
      
      <div className="p-4 md:p-5">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
          <span>{formattedDate}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime} min
          </span>
        </div>
        
        <h3 className={blogStyles.text.title}>
          {post.title}
        </h3>
        
        <p className={blogStyles.text.excerpt}>
          {post.excerpt}
        </p>
      </div>
    </Card>
  );
}

  if (featured) {
    return (
      <Card 
        className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500"
        onClick={onClick}
      >
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
              {post.category}
            </span>
          </div>
          
          <div className="p-8 md:p-10 flex flex-col justify-between bg-card">
            <div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>{formattedDate}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime} min read
                </span>
              </div>
              
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors text-balance">
                {post.title}
              </h2>
              
              <p className="text-muted-foreground leading-relaxed mb-6 text-pretty">
                {post.excerpt}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                Read Article
                <ArrowRight className="w-4 h-4" />
              </div>
              {(onEdit || onDelete) && (
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditClick}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDeleteClick}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 relative"
      onClick={onClick}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute top-4 left-4 px-3 py-1 bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium rounded-full">
          {post.category}
        </span>
        {(onEdit || onDelete) && (
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleEditClick}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteClick}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span>{formattedDate}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime} min
          </span>
        </div>
        
        <h3 className="font-serif text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
      </div>
    </Card>
  );
}
