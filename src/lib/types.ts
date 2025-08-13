// Product interface
export interface Product {
  id?: string;
  name: string;
  description: string;
  url: string;
  userId: string;
  createdAt: Date;
  upvotes: number;
  upvotedBy: string[];
  commentsCount: number;
  tags: string[];
  month?: string; 
  /**
   * @deprecated Use productImage instead for multiple images
   */
  image?: string;
  productImage: string[];
}

// User interface
export interface User {
  id?: string;
  name: string;
  email: string;
  profilePic: string;
  joinedAt: Date;
  productsSubmitted: number;
  username?: string;
  linkedin?: string;
  xcom?: string;
  headline?: string;
}

// Comment interface
export interface Comment {
  id?: string;
  productId: string;
  userId: string;
  text: string;
  createdAt: Date;
}

// Create product input (without auto-generated fields)
export interface CreateProductInput {
  name: string;
  description: string;
  url: string;
  tags: string[];
  /**
   * @deprecated Use productImage instead for multiple images
   */
  image?: string;
  productImage: string[];
}

// Create comment input
export interface CreateCommentInput {
  text: string;
  productId: string;
} 