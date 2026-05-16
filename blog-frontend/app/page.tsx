"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BlogPost } from "@/lib/types";
import { api, getAuthToken } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/blog/header";
import { Hero } from "@/components/blog/hero";
import { PostList } from "@/components/blog/post-list";
import { PostViewer } from "@/components/blog/post-viewer";
import { PostEditor } from "@/components/blog/post-editor";
import { PostEditModal } from "@/components/blog/post-edit-modal";
import { Footer } from "@/components/blog/footer";
import { defaultFeaturedPosts } from "@/lib/sample-posts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function BlogPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load default featured posts for non-authenticated users or user's posts for authenticated users
  useEffect(() => {
    const loadPosts = async () => {
      try {
        if (user) {
          // If user is logged in, fetch their posts from backend
          const data = await api.getPosts();
          const transformedPosts = data.map((post: any) => ({
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
          // If not logged in, show default featured posts
          setPosts(defaultFeaturedPosts);
        }
      } catch (error) {
        console.error("Failed to load posts:", error);
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
      window.history.replaceState({}, "", "/");
    }
  }, [selectedPost]);

  const handleCreatePost = async (newPost: Omit<BlogPost, "id" | "createdAt" | "readTime" | "author">) => {
    try {
      // Ensure we have authentication
      const token = getAuthToken();
      if (!token) {
        alert("Please login to create posts");
        return;
      }

      const createdPost = await api.createPost({
        title: newPost.title,
        excerpt: newPost.excerpt,
        content: newPost.content,
        imageUrl: newPost.imageUrl,
        category: newPost.category,
        readTime: Math.ceil(newPost.content.split(" ").length / 200),
      });

      setPosts([createdPost, ...posts]);
      setIsEditorOpen(false);
    } catch (error: any) {
      console.error("Failed to create post:", error);
      alert(error?.data?.error || error?.message || "Failed to create post. Please try again.");
    }
  };

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

  return (
    <main className="min-h-screen bg-background">
      <Header onCreatePost={() => setIsEditorOpen(true)} />
      <Hero user={user} />
      {isLoading ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      ) : (
        <PostList posts={posts} onPostClick={setSelectedPost} onEdit={setEditingPost} onDelete={handleDeletePost} currentUserId={user?.id} />
      )}
      <Footer />

      {isEditorOpen && (
        <PostEditor onClose={() => setIsEditorOpen(false)} onSubmit={handleCreatePost} />
      )}

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
    </main>
  );
}
