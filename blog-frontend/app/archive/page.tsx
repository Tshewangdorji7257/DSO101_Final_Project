"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/blog/header";
import { Footer } from "@/components/blog/footer";
import { PostViewer } from "@/components/blog/post-viewer";
import { PostEditModal } from "@/components/blog/post-edit-modal";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { BlogPost } from "@/lib/types";
import { defaultFeaturedPosts } from "@/lib/sample-posts";
import { api } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ArchivePage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        if (user) {
          // Load user's own posts
          const userPosts = await api.getPosts();
          const transformedPosts = userPosts.map((post: any) => ({
            ...post,
            createdAt: new Date(post.createdAt),
            updatedAt: post.updatedAt ? new Date(post.updatedAt) : undefined,
            author: {
              ...post.author,
              id: String(post.author.id)
            }
          }));
          setPosts(transformedPosts);
        } else {
          // Show default featured posts for anonymous users
          setPosts(defaultFeaturedPosts);
        }
      } catch (err) {
        console.error("Failed to load posts:", err);
        setError("Failed to load posts");
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, [user]);

  // Listen for post creation from global editor
  useEffect(() => {
    const handlePostCreated = (event: Event) => {
      const customEvent = event as CustomEvent;
      const newPost = customEvent.detail;
      setPosts([newPost, ...posts]);
    };

    window.addEventListener("postCreated", handlePostCreated);
    return () => window.removeEventListener("postCreated", handlePostCreated);
  }, [posts]);

  // Check URL for postId parameter and load that post if it exists
  useEffect(() => {
    const postId = searchParams.get("postId");
    if (postId && posts.length > 0) {
      const post = posts.find(p => p.id === postId);
      if (post) {
        setSelectedPost(post);
      }
    }
  }, [searchParams, posts]);

  // Update URL when selectedPost changes
  useEffect(() => {
    if (selectedPost) {
      window.history.replaceState({}, "", `?postId=${selectedPost.id}`);
    } else {
      window.history.replaceState({}, "", "/archive");
    }
  }, [selectedPost]);

  const handleEditPost = async (postData: Partial<BlogPost>) => {
    if (!editingPost) return;

    setIsSaving(true);
    try {
      const updatedPost = await api.updatePost(editingPost.id, {
        title: postData.title || editingPost.title,
        excerpt: postData.excerpt || editingPost.excerpt,
        content: postData.content || editingPost.content,
        imageUrl: postData.imageUrl || editingPost.imageUrl,
        category: postData.category || editingPost.category,
        readTime: postData.readTime || editingPost.readTime,
      });

      setPosts(posts.map(p => p.id === editingPost.id ? updatedPost : p));
      if (selectedPost?.id === editingPost.id) {
        setSelectedPost(updatedPost);
      }
      setEditingPost(null);
    } catch (error: any) {
      console.error("Failed to update post:", error);
      alert(error?.data?.error || "Failed to update post");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    setDeletePostId(postId);
  };

  const confirmDelete = async () => {
    if (!deletePostId) return;

    setIsDeleting(true);
    try {
      await api.deletePost(deletePostId);
      setPosts(posts.filter(p => p.id !== deletePostId));
      if (selectedPost?.id === deletePostId) {
        setSelectedPost(null);
      }
      setDeletePostId(null);
    } catch (error: any) {
      console.error("Failed to delete post:", error);
      alert(error?.data?.error || "Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  if (selectedPost) {
    return (
      <>
        <PostViewer 
          post={selectedPost} 
          onBack={() => {
            setSelectedPost(null);
            setEditingPost(null);
          }}
          onEdit={user?.id === selectedPost.author.id ? () => setEditingPost(selectedPost) : undefined}
          onDelete={user?.id === selectedPost.author.id ? () => handleDeletePost(selectedPost.id) : undefined}
        />
        {editingPost && (
          <PostEditModal
            post={editingPost}
            onClose={() => setEditingPost(null)}
            onSubmit={handleEditPost}
            isLoading={isSaving}
          />
        )}
        <AlertDialog open={!!deletePostId} onOpenChange={(open) => !open && setDeletePostId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this post? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Group posts by year
  const postsByYear = posts.reduce((acc, post) => {
    const year = new Date(post.createdAt).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<number, BlogPost[]>);

  const sortedYears = Object.keys(postsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <Link href="/">
          <Button variant="ghost" className="gap-2 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3 tracking-tight">
          Archive
        </h1>
        <p className="text-muted-foreground mb-12">
          {user ? `All posts by ${user.name}` : "Featured posts organized by year"}
        </p>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No posts yet</p>
            <p className="text-sm text-muted-foreground">Start writing to see your posts here!</p>
          </div>
        ) : (
          <div className="space-y-12">
            {sortedYears.map((year) => (
              <div key={year}>
                <h2 className="font-serif text-2xl font-semibold mb-6 text-foreground">
                  {year}
                </h2>
                <div className="space-y-4">
                  {postsByYear[year].map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="group cursor-pointer p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/5 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
