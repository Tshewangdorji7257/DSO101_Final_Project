import { BlogPost } from "./types";

export const samplePosts: BlogPost[] = [
  {
    id: "1",
    title: "The Art of Mindful Living in a Digital Age",
    excerpt: "Exploring how we can maintain presence and awareness while navigating the complexities of modern technology.",
    content: `In our hyperconnected world, finding moments of stillness has become both more challenging and more essential than ever before.

The constant buzz of notifications, the endless scroll of social media feeds, and the pressure to always be available have created a new kind of mental fatigue that our ancestors never experienced.

But within this challenge lies an opportunity. By consciously choosing when and how we engage with technology, we can create pockets of peace in our daily lives. It starts with small steps: perhaps a morning hour without screens, or a mindful walk without earbuds.

The key is not to reject technology entirely, but to use it with intention. When we pick up our phones, we can ask ourselves: "What am I seeking right now?" This simple question can transform mindless scrolling into conscious choice.

Remember, our attention is our most precious resource. How we choose to spend it shapes not just our days, but our entire lives.`,
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60",
    category: "Lifestyle",
    createdAt: new Date("2024-03-15"),
    readTime: 5,
  },
  {
    id: "2",
    title: "Journey Through the Himalayas: Finding Peace at High Altitude",
    excerpt: "A personal account of trekking through some of the world's most breathtaking mountain landscapes.",
    content: `There's something profoundly humbling about standing at 4,500 meters, surrounded by peaks that have witnessed millennia of human history.

My journey through the Himalayan trails began not as an adventure, but as a search—a search for clarity that the bustling cities could never provide. The mountains, with their timeless presence, seemed to hold answers to questions I hadn't yet learned to ask.

Each step at altitude is a meditation. The thin air forces you to slow down, to be present with each breath. There's no rushing here; the mountains teach patience through necessity.

The local communities along these trails carry wisdom passed down through generations. Their resilience, their connection to the land, and their unwavering hospitality reminded me of what truly matters: community, purpose, and harmony with nature.

As I descended back to lower elevations, I carried with me not souvenirs, but a shifted perspective—a reminder that our daily struggles, when viewed from sufficient height, are but ripples in an infinite ocean.`,
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=60",
    category: "Travel",
    createdAt: new Date("2024-03-10"),
    readTime: 7,
  },
  {
    id: "3",
    title: "The Quiet Power of Daily Rituals",
    excerpt: "How small, consistent practices can transform our lives in profound and unexpected ways.",
    content: `Every morning, before the world awakens, I sit with a cup of tea and watch the sky slowly brighten. This simple ritual has become the foundation of my day.

There's a common misconception that transformation requires dramatic change. We imagine complete lifestyle overhauls, radical decisions, and sudden pivots. But the truth is far gentler: lasting change comes through small, consistent actions repeated over time.

A daily ritual doesn't need to be elaborate. It could be five minutes of journaling, a short walk around the block, or simply taking three deep breaths before starting work. What matters is the consistency—the commitment to showing up for yourself, day after day.

These rituals create anchors in our lives. In a world of constant change and uncertainty, they provide stability. They remind us who we are and what we value.

Start small. Choose one thing. Do it tomorrow. And the day after. Watch how these tiny seeds of intention bloom into a garden of transformation.`,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=60",
    category: "Wellness",
    createdAt: new Date("2024-03-05"),
    readTime: 4,
  },
];

export const defaultFeaturedPosts: BlogPost[] = [
  {
    id: "featured-1",
    title: "Getting Started with Your Blog",
    excerpt: "Learn how to create engaging content and build your audience from the ground up.",
    content: `Welcome to your blogging journey! Whether you're sharing your expertise, documenting your adventures, or exploring your creative side, this platform is designed to help you reach an audience that cares about your voice.

The best blogs start with a clear purpose. Ask yourself: What do I want to share? Who is my audience? What value can I provide? These questions will guide your content creation.

Start with topics you're passionate about. Your genuine interest will shine through in your writing. Don't worry about being perfect—authenticity resonates far more than polish.

Consistency matters. Whether you post weekly or monthly, maintain a schedule that works for you. Your readers will come to expect and appreciate regular updates.

Remember, every successful blogger started with their first post. That could be you today. Start writing, share your story, and connect with your community.`,
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60",
    category: "Writing",
    createdAt: new Date("2026-05-15"),
    readTime: 5,
    author: {
      id: "blog-admin",
      name: "BlogPlatform",
      email: "admin@blogplatform.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60"
    }
  },
  {
    id: "featured-2",
    title: "Finding Your Unique Voice as a Writer",
    excerpt: "Discover what makes your perspective valuable and how to express it authentically.",
    content: `Your voice is what sets you apart from every other writer. It's the combination of your perspective, experience, and personality that makes your words worth reading.

Many new writers try to imitate others, thinking they need to sound a certain way to be taken seriously. But the truth is far more liberating: your unique voice is your greatest asset.

Your background, your failures, your victories, your quirks—these are the things that make your writing compelling. Don't hide them. Embrace them.

Start by writing as if you're talking to a friend. Inject your personality into your words. Use examples from your life. Share your genuine opinions. Let your readers get to know you.

Over time, as you write consistently, your voice will become clearer and stronger. It's like a muscle—the more you exercise it, the more developed it becomes.

Stop trying to sound like someone else. Your readers are waiting for you.`,
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
    category: "Writing",
    createdAt: new Date("2026-05-10"),
    readTime: 4,
    author: {
      id: "blog-admin",
      name: "BlogPlatform",
      email: "admin@blogplatform.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60"
    }
  },
  {
    id: "featured-3",
    title: "Building a Community Around Your Content",
    excerpt: "Strategies for engaging with your audience and creating meaningful connections.",
    content: `Writing is not a solitary act when you share it with the world. Every post is an invitation to connect with others who share your interests and passions.

Engagement is key. Respond to comments, ask questions in your posts, and genuinely interact with your readers. Show them that you value their thoughts and perspectives.

Share your work on social media, but do it authentically. Don't spam—share your best content and let your work speak for itself. Quality over quantity always wins.

Collaborate with other writers. Guest posts, interviews, and cross-promotions introduce you to new audiences while providing fresh perspectives for your readers.

Remember that building a community takes time. Don't expect thousands of followers overnight. Focus on quality engagement with the people who are interested in your content. Real connections lead to lasting communities.

Your readers are not just numbers—they're people who believe in what you're doing. Honor that by showing up consistently and sharing your best work.`,
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
    category: "Community",
    createdAt: new Date("2026-05-05"),
    readTime: 5,
    author: {
      id: "blog-admin",
      name: "BlogPlatform",
      email: "admin@blogplatform.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60"
    }
  },
  {
    id: "featured-4",
    title: "The Power of Consistent Storytelling",
    excerpt: "How regular publishing builds trust, authority, and lasting impact with your audience.",
    content: `Consistency is the secret ingredient that separates successful creators from those who fade away. It's not about writing the most viral post—it's about showing up, week after week, with valuable content.

When you publish on a schedule, you create predictability. Your readers know when to expect new content from you. They mark their calendars, check back regularly, and begin to depend on your voice.

This consistency builds trust. Every time you deliver, you prove to your audience that you're reliable, committed, and serious about your craft. Over time, this trust becomes the foundation of a loyal community.

Your first ten readers matter as much as your millionth. Each person who reads your work was introduced to you because they believed in what you had to say. Honor that by being consistent with your message and your schedule.

The compound effect of regular publishing cannot be overstated. One article might reach a few people. But fifty articles over time, combined with reader recommendations and search engine visibility, can change your life and career.

Start today. Commit to a publishing schedule. Whether it's weekly, bi-weekly, or monthly—pick something you can sustain. Your future self will thank you for the consistency you're building today.`,
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&auto=format&fit=crop&q=60",
    category: "Publishing",
    createdAt: new Date("2026-04-30"),
    readTime: 5,
    author: {
      id: "blog-admin",
      name: "BlogPlatform",
      email: "admin@blogplatform.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60"
    }
  },
];

export const author = {
  name: "Tshewang Dorji",
  bio: "Writer, traveler, and seeker of quiet moments. Sharing thoughts on mindful living, travel, and the art of slowing down.",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60",
};
