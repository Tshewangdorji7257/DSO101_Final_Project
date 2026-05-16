"use client";

import React, { createContext, useContext, useState } from "react";
import { BlogPost } from "./types";
import { PostEditor } from "@/components/blog/post-editor";
import { api, getAuthToken } from "./api";

interface EditorContextType {
  isEditorOpen: boolean;
  openEditor: () => void;
  closeEditor: () => void;
  handleCreatePost: (newPost: Omit<BlogPost, "id" | "createdAt" | "readTime" | "author">) => Promise<void>;
  isSaving: boolean;
  error?: string;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>();

  const handleCreatePost = async (
    newPost: Omit<BlogPost, "id" | "createdAt" | "readTime" | "author">
  ) => {
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Please login to create posts");
        return;
      }

      setIsSaving(true);
      setError(undefined);

      const createdPost = await api.createPost({
        title: newPost.title,
        excerpt: newPost.excerpt,
        content: newPost.content,
        imageUrl: newPost.imageUrl,
        category: newPost.category,
        readTime: Math.ceil(newPost.content.split(" ").length / 200),
      });

      setIsEditorOpen(false);
      
      // Dispatch custom event to notify pages that a new post was created
      window.dispatchEvent(
        new CustomEvent("postCreated", { detail: createdPost })
      );
    } catch (err: any) {
      console.error("Failed to create post:", err);
      const errorMsg = err?.data?.error || err?.message || "Failed to create post. Please try again.";
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <EditorContext.Provider
      value={{
        isEditorOpen,
        openEditor: () => setIsEditorOpen(true),
        closeEditor: () => setIsEditorOpen(false),
        handleCreatePost,
        isSaving,
        error,
      }}
    >
      {children}
      {isEditorOpen && (
        <PostEditor
          onClose={() => setIsEditorOpen(false)}
          onSubmit={handleCreatePost}
          isLoading={isSaving}
        />
      )}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within EditorProvider");
  }
  return context;
}
