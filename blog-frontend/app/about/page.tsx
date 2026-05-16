"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/blog/header";
import { Footer } from "@/components/blog/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit2, Save, X, Upload } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function AboutPage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [hobbies, setHobbies] = useState("");
  const [blogFocus, setBlogFocus] = useState("");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse bio on mount
  useEffect(() => {
    if (user?.bio) {
      const parts = user.bio.split("|HOBBIES|");
      if (parts.length > 1) {
        setBio(parts[0]);
        const rest = parts[1].split("|BLOGFOCUS|");
        setHobbies(rest[0] || "");
        setBlogFocus(rest[1] || "");
      } else {
        setBio(user.bio);
      }
    }
  }, [user?.bio]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setAvatar(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateProfile({
        name: user.name,
        bio: `${bio}|HOBBIES|${hobbies}|BLOGFOCUS|${blogFocus}`,
        avatar: avatar || undefined,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

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

        <div className="flex items-center justify-between mb-6">
          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-2"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit
                </>
              )}
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4 mb-8 p-6 border border-border rounded-lg bg-accent/5">
            {/* Avatar Upload */}
            <div>
              <label className="text-sm font-medium mb-3 block">Profile Photo</label>
              <div className="flex items-center gap-6">
                {avatar && (
                  <div className="relative">
                    {avatar.startsWith('http') ? (
                      <Image
                        src={avatar}
                        alt="Profile"
                        width={120}
                        height={120}
                        className="w-[120px] h-[120px] rounded-full object-cover border-2 border-primary"
                      />
                    ) : (
                      <img
                        src={avatar}
                        alt="Profile"
                        className="w-[120px] h-[120px] rounded-full object-cover border-2 border-primary"
                      />
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {avatar ? "Change Photo" : "Upload Photo"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Max 5MB. JPG, PNG, GIF
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Bio Sections */}
            <div>
              <label className="text-sm font-medium mb-4 block">About You - Fill in these sections</label>
              
              {/* About Me Section */}
              <div className="space-y-3 mb-6 p-4 border border-border rounded-lg bg-accent/5">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">About Me</p>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Who are you? Share your background, your story, and what defines you..."
                    className="min-h-[120px] text-sm"
                  />
                </div>
              </div>

              {/* Hobbies Section */}
              <div className="space-y-3 mb-6 p-4 border border-border rounded-lg bg-accent/5">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Hobbies & Interests</p>
                  <Textarea
                    value={hobbies}
                    onChange={(e) => setHobbies(e.target.value)}
                    placeholder="What do you enjoy doing in your free time? What are you passionate about? (e.g., Photography, Reading, Cooking, Travel...)"
                    className="min-h-[100px] text-sm"
                  />
                </div>
              </div>

              {/* Blog Focus Section */}
              <div className="space-y-3 mb-6 p-4 border border-border rounded-lg bg-accent/5">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">What You'll Find Here</p>
                  <Textarea
                    value={blogFocus}
                    onChange={(e) => setBlogFocus(e.target.value)}
                    placeholder="What topics will you write about? What can readers expect from your blog? (e.g., tech tutorials, lifestyle tips, travel stories...)"
                    className="min-h-[100px] text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setBio(user?.bio || "");
                  setHobbies("");
                  setBlogFocus("");
                  setAvatar(user?.avatar || "");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : null}

        <article className="max-w-none">
          <div className="space-y-12 text-foreground/80 leading-relaxed font-sans">
            {/* Profile Card - Only for logged-in users */}
            {user && (
              <>
                <div className="flex flex-col sm:flex-row gap-10 items-start">
                  {(user?.avatar || avatar) && (
                    <div className="flex-shrink-0">
                      {(user?.avatar || avatar).startsWith('http') ? (
                        <Image
                          src={user?.avatar || avatar}
                          alt={user?.name}
                          width={140}
                          height={140}
                          className="w-[140px] h-[140px] rounded-2xl object-cover"
                        />
                      ) : (
                        <img
                          src={user?.avatar || avatar}
                          alt={user?.name}
                          className="w-[140px] h-[140px] rounded-2xl object-cover"
                        />
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-4xl font-bold text-foreground mb-2">{user?.name || "Me"}</h2>
                    <p className="text-sm text-muted-foreground mb-3">Content Creator & Blogger</p>
                    
                    {/* Info Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hobbies && (
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {hobbies.split(",")[0].trim().substring(0, 20)}
                        </span>
                      )}
                      {blogFocus && (
                        <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
                          Blogger
                        </span>
                      )}
                    </div>
                    
                    {/* Bio Preview */}
                    {bio && (
                      <p className="text-sm text-foreground/70 line-clamp-2">
                        {bio.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border my-6" />

                {/* About Me Section */}
                {bio && (
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">About Me</h3>
                    <p className="text-base text-foreground/80 leading-relaxed">
                      {bio}
                    </p>
                  </div>
                )}

                {/* Hobbies & Interests Section */}
                {hobbies && (
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">Hobbies & Interests</h3>
                    <p className="text-base text-foreground/80 leading-relaxed">
                      {hobbies}
                    </p>
                  </div>
                )}

                {/* What You'll Find Here Section */}
                {blogFocus && (
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">What You'll Find Here</h3>
                    <p className="text-base text-foreground/80 leading-relaxed">
                      {blogFocus}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Generic content - Only for anonymous users */}
            {!user && (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">About this blog</h2>
                  <p className="text-foreground/80 leading-relaxed">
                    A space for sharing thoughts, stories, and reflections. Here you'll find articles on topics that matter to me—from personal growth and creativity to explorations across various interests.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">What to expect</h2>
                  <ul className="space-y-2 text-foreground/80">
                    <li>• In-depth articles and insights</li>
                    <li>• Personal reflections and stories</li>
                    <li>• Explorations across various topics</li>
                    <li>• Tips and strategies for growth</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Connect</h2>
                  <p className="text-foreground/80 leading-relaxed">
                    Feel free to engage with posts or reach out through the platform. Looking forward to connecting with fellow readers and writers!
                  </p>
                </div>
              </>
            )}
          </div>
        </article>
      </div>

      <Footer />
    </main>
  );
}
