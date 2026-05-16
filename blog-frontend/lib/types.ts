export interface Author {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  createdAt: Date;
  updatedAt?: Date;
  readTime: number;
  author: Author;
}
