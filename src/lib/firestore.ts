import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, User, Comment, CreateProductInput, CreateCommentInput } from './types';
import { getAuth } from "firebase/auth";

// Collection references
export const productsCollection = collection(db, 'products');
export const usersCollection = collection(db, 'users');
export const commentsCollection = collection(db, 'comments');

// ===== PRODUCTS =====

export const createProduct = async (productData: CreateProductInput, userId: string): Promise<string> => {
 
  // Get current month in 'YYYY-MM' format
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const product: Omit<Product, 'id'> = {
    ...productData,
    userId,
    createdAt: new Date(),
    upvotes: 0,
    upvotedBy: [],
    commentsCount: 0,
    month, // Add month field
    productImage: productData.productImage || [],
    image: productData.image || (productData.productImage && productData.productImage[0]) || ""
  };

  

  try {
    const docRef = await addDoc(productsCollection, product);
    console.log("✅ Document added successfully with ID:", docRef.id)
    
    // Update user's productsSubmitted count in a separate operation
    // This can be done asynchronously to not block the product creation
    console.log("🔄 Updating user products count...")
    const userRef = doc(usersCollection, userId);
    updateDoc(userRef, {
      productsSubmitted: increment(1)
    }).then(() => {
      console.log("✅ User products count updated successfully")
    }).catch(err => {
      console.error("❌ Error updating user products count:", err)
    });

    console.log("🏁 createProduct completed successfully")
    return docRef.id;
  } catch (error) {
    console.error("❌ Error in createProduct:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      error: error
    })
    throw error;
  }
};

export const getProducts = async (limitCount: number = 20): Promise<Product[]> => {
  console.log("=== FIRESTORE getProducts DEBUG ===")
  console.log("Attempting to fetch products with limit:", limitCount)
  
  try {
    const q = query(
      productsCollection,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    console.log("Query created, executing...")
    const querySnapshot = await getDocs(q);
    console.log("Query executed successfully, found", querySnapshot.docs.length, "documents")
    
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    
    console.log("Products processed:", products.length)
    return products;
  } catch (error) {
    console.error("❌ Error in getProducts:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    throw error;
  }
};

export const getProduct = async (productId: string): Promise<Product | null> => {
  const docRef = doc(productsCollection, productId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Product;
  }
  return null;
};

export const getUserProducts = async (userId: string): Promise<Product[]> => {
  const q = query(
    productsCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
};

export const upvoteProduct = async (productId: string, userId: string): Promise<void> => {
  const productRef = doc(productsCollection, productId);
  const productSnap = await getDoc(productRef);
  
  if (!productSnap.exists()) {
    throw new Error('Product not found');
  }
  
  const product = productSnap.data() as Product;
  const hasUpvoted = product.upvotedBy.includes(userId);
  
  if (hasUpvoted) {
    // Remove upvote
    await updateDoc(productRef, {
      upvotes: increment(-1),
      upvotedBy: arrayRemove(userId)
    });
  } else {
    // Add upvote
    await updateDoc(productRef, {
      upvotes: increment(1),
      upvotedBy: arrayUnion(userId)
    });
  }
};

export const deleteProduct = async (productId: string, userId: string): Promise<void> => {
  const productRef = doc(productsCollection, productId);
  const productSnap = await getDoc(productRef);
  
  if (!productSnap.exists()) {
    throw new Error('Product not found');
  }
  
  const product = productSnap.data() as Product;
  if (product.userId !== userId) {
    throw new Error('Unauthorized to delete this product');
  }
  
  await deleteDoc(productRef);
  
  // Decrease user's productsSubmitted count
  const userRef = doc(usersCollection, userId);
  await updateDoc(userRef, {
    productsSubmitted: increment(-1)
  });
};

export const updateProduct = async (productId: string, userId: string, updates: Partial<Product>): Promise<void> => {
  const productRef = doc(productsCollection, productId);
  const productSnap = await getDoc(productRef);
  if (!productSnap.exists()) {
    throw new Error('Product not found');
  }
  const product = productSnap.data() as Product;
  if (product.userId !== userId) {
    throw new Error('Unauthorized to update this product');
  }
  // Ensure productImage is always an array
  const updateData = {
    ...updates,
    productImage: updates.productImage || product.productImage || [],
    image: updates.image || (updates.productImage && updates.productImage[0]) || product.image || ""
  };
  await updateDoc(productRef, updateData);
};

// ===== USERS =====

export const createUser = async (userData: Omit<User, 'id' | 'joinedAt' | 'productsSubmitted'>): Promise<string> => {
  const user: Omit<User, 'id'> = {
    ...userData,
    joinedAt: new Date(),
    productsSubmitted: 0,
  };

  const docRef = await addDoc(usersCollection, user);
  return docRef.id;
};

export const getUser = async (userId: string): Promise<User | null> => {
  const docRef = doc(usersCollection, userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as User;
  }
  return null;
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<void> => {
  const userRef = doc(usersCollection, userId);
  await updateDoc(userRef, updates);
};

export async function ensureUserDocument(user: any) {
  const userRef = doc(usersCollection, user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      name: user.displayName || user.email || "Anonymous",
      email: user.email,
      profilePic: user.photoURL || "",
      joinedAt: new Date(),
      productsSubmitted: 0,
    });
  }
}

// ===== COMMENTS =====

export const createComment = async (commentData: CreateCommentInput, userId: string): Promise<string> => {
  const comment: Omit<Comment, 'id'> = {
    ...commentData,
    userId,
    createdAt: new Date(),
  };

  const docRef = await addDoc(commentsCollection, comment);
  
  // Update product's commentsCount asynchronously to not block comment creation
  const productRef = doc(productsCollection, commentData.productId);
  updateDoc(productRef, {
    commentsCount: increment(1)
  }).catch(err => {
    console.error("Error updating product comments count:", err);
  });

  return docRef.id;
};

export const getProductComments = async (productId: string): Promise<Comment[]> => {
  const q = query(
    commentsCollection,
    where('productId', '==', productId),
    orderBy('createdAt', 'asc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Comment[];
};

export const deleteComment = async (commentId: string, userId: string): Promise<void> => {
  const commentRef = doc(commentsCollection, commentId);
  const commentSnap = await getDoc(commentRef);
  
  if (!commentSnap.exists()) {
    throw new Error('Comment not found');
  }
  
  const comment = commentSnap.data() as Comment;
  if (comment.userId !== userId) {
    throw new Error('Unauthorized to delete this comment');
  }
  
  await deleteDoc(commentRef);
  
  // Decrease product's commentsCount
  const productRef = doc(productsCollection, comment.productId);
  await updateDoc(productRef, {
    commentsCount: increment(-1)
  });
}; 

export const updateComment = async (commentId: string, userId: string, updates: Partial<Comment>): Promise<void> => {
  const commentRef = doc(commentsCollection, commentId);
  const commentSnap = await getDoc(commentRef);
  if (!commentSnap.exists()) {
    throw new Error('Comment not found');
  }
  const comment = commentSnap.data() as Comment;
  if (comment.userId !== userId) {
    throw new Error('Unauthorized to update this comment');
  }
  await updateDoc(commentRef, updates);
}; 