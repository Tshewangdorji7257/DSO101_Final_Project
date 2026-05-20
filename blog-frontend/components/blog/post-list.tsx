"use client";

import { BlogPost } from "@/lib/types";
import { blogStyles } from "@/lib/blog-styles";
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
      <div className={blogStyles.text.emptyState}>
        <p className={blogStyles.text.emptyStateMessage}>No posts yet. Start writing your first article!</p>
      </div>
    );
  }

  const [featuredPost, ...otherPosts] = posts;

  return (
    <section className={blogStyles.layout.container}>
      <div className={blogStyles.layout.headerGap}>
        <h2 className={blogStyles.text.heading}>Latest Articles</h2>
        <div className={blogStyles.layout.divider} />
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
        <div className={blogStyles.layout.grid2}>
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
