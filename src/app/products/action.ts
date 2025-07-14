'use server';
import axios from "axios";
// Placeholder for Firebase session logic to be added later.

export async function getAllProducts() {
  try {
    const response = await axios.get(`${process.env.API_URL}/products`)
    return response.data
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

export async function getProduct(id: string) {
  try {
    const response = await axios.get(`${process.env.API_URL}/products/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching product:", error)
    throw error
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const response = await axios.patch(`${process.env.API_URL}/products/${id}`, data)
    return response.data
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

export async function deleteProduct(id: string) {
  try {
    const response = await axios.delete(`${process.env.API_URL}/products/${id}`)
    
    if (response.status === 200) {
      return { success: true, message: "Product deleted successfully" }
    } else {
      throw new Error("Failed to delete product")
    }
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}