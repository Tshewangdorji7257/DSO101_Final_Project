# Component Integration Guide

This guide shows how to update your blog components to work with the real backend API.

## Updated Auth Context

Replace the mock auth context with the real backend integration:

```bash
cp lib/auth-context.tsx lib/auth-context.original.tsx
cp lib/auth-context-new.tsx lib/auth-context.tsx
```

The new context provides:
- `login(email, password)` - Real authentication
- `signup(name, email, password)` - Real user registration  
- `logout()` - Clear session
- `updateProfile(data)` - Update user profile
- `changePassword(old, new)` - Change password
- `user` - Current user object or null
- `isAuthenticated` - Boolean flag
- `isLoading` - Loading state during requests

## Example: Post List Component

```typescript
// components/blog/post-list.tsx
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import PostCard from "./post-card";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await api.getPosts();
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load posts:", err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;
  if (posts.length === 0) return <div>No posts yet</div>;

  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

## Example: Post Editor Component

```typescript
// components/blog/post-editor.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PostEditor({ postId }: { postId?: string }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    category: "General",
    readTime: 5,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <div>Please login to create posts</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (postId) {
        // Update existing post
        await api.updatePost(postId, formData);
      } else {
        // Create new post
        await api.createPost(formData);
      }
      router.push("/archive");
    } catch (err: any) {
      setError(err.data?.error || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "readTime" ? parseInt(value) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500">{error}</div>}
      
      <div>
        <label>Title</label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Excerpt</label>
        <Textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Content</label>
        <Textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={10}
        />
      </div>

      <div>
        <label>Image URL</label>
        <Input
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          type="url"
        />
      </div>

      <div>
        <label>Category</label>
        <Input
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Read Time (minutes)</label>
        <Input
          name="readTime"
          value={formData.readTime}
          onChange={handleChange}
          type="number"
          min="1"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : postId ? "Update Post" : "Create Post"}
      </Button>
    </form>
  );
}
```

## Example: Login Component

```typescript
// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.data?.error || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1>Login</h1>
        
        {error && <div className="text-red-500">{error}</div>}
        
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
```

## Example: User Profile Component

```typescript
// app/profile/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <div>Please login to view your profile</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="space-y-6">
        <div>
          <h1>My Profile</h1>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500">{error}</div>}
            
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            
            <Textarea
              placeholder="Bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
            
            <Input
              placeholder="Avatar URL"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            />
            
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div>
              <h2>{user?.name}</h2>
              <p>{user?.bio}</p>
            </div>
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          </>
        )}

        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
```

## API Response Format

All API endpoints return data in the following formats:

### Login/Register Response
```json
{
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": null
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Post Response
```json
{
  "id": "1",
  "title": "Post Title",
  "excerpt": "Short excerpt",
  "content": "Full content",
  "imageUrl": "https://...",
  "category": "Technology",
  "readTime": 5,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "author": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": null
  }
}
```

## Error Handling

The API client throws `APIError` with the following properties:
- `message` - Human readable error message
- `status` - HTTP status code
- `data` - Response body with additional error details

```typescript
try {
  await api.login(email, password);
} catch (err) {
  if (err instanceof APIError) {
    console.log(`Error ${err.status}: ${err.message}`);
    console.log(err.data); // { error: "Invalid email or password" }
  }
}
```

## Next Steps

1. Update your login page to use the real auth
2. Update post list to fetch from backend
3. Update post editor to save to backend
4. Update post viewer to fetch from backend
5. Add user profile page
6. Add post deletion functionality
7. Deploy backend to production
