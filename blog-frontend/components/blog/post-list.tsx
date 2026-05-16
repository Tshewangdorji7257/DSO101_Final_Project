"use client";

import { BlogPost } from "@/lib/types";
import { PostCard } from "./post-card";

interface PostListProps {
  posts: BlogPost[];
  onPostClick: (post: BlogPost) => void;
  onEdit?: (post: BlogPost) => void;
  onDelete?: (postId: string) => void;
  currentUserId?: string;
}

export function PostList({ posts, onPostClick, onEdit, onDelete, currentUserId }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">No posts yet. Start writing your first article!</p>
      </div>
    );
  }

  const [featuredPost, ...otherPosts] = posts;

  return (
    <section className="max-w-6xl mx-auto px-6 pb-20">
      <div className="flex items-center gap-4 mb-10">
        <h2 className="font-serif text-2xl font-bold">Latest Articles</h2>
        <div className="flex-1 h-px bg-border" />
      </div>

      {featuredPost && (
        <div className="mb-10">
          <PostCard 
            post={featuredPost} 
            featured 
            onClick={() => onPostClick(featuredPost)}
            onEdit={currentUserId === featuredPost.author.id ? onEdit : undefined}
            onDelete={currentUserId === featuredPost.author.id ? onDelete : undefined}
          />
        </div>
      )}

      {otherPosts.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherPosts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onClick={() => onPostClick(post)}
              onEdit={currentUserId === post.author.id ? onEdit : undefined}
              onDelete={currentUserId === post.author.id ? onDelete : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
