# Global Session Management Guide

This guide explains how to use the global session management system across your application.

## Overview

The global session system provides:
- **Server-side session access** for API routes and server actions
- **Client-side session access** for React components
- **Authenticated API helpers** for making requests with proper tokens
- **Consistent token formatting** across Google and GitHub providers

## File Structure

```
src/
├── lib/
│   └── session.ts              # Core session utilities
├── hooks/
│   └── useGlobalSession.ts     # React hooks for client-side usage
└── app/
    └── products/
        └── action.ts           # Example server action usage
```

## Usage Examples

### 1. Server-Side Usage (API Routes, Server Actions)

```typescript
// In server actions or API routes
import { getGlobalSession, makeAuthenticatedRequest } from "@/lib/session"

export async function myServerAction() {
  // Get session data
  const session = await getGlobalSession()
  
  if (!session) {
    throw new Error("Not authenticated")
  }

  // Make authenticated API calls
  const data = await makeAuthenticatedRequest(`${process.env.API_URL}/endpoint`)
  return data
}
```

### 2. Client-Side Usage (React Components)

```typescript
// In React components
import { useGlobalSession, useAuthenticatedApi } from "@/hooks/useGlobalSession"

export function MyComponent() {
  const { 
    session, 
    isAuthenticated, 
    getAuthToken, 
    isLoading 
  } = useGlobalSession()
  
  const { makeRequest } = useAuthenticatedApi()

  const handleApiCall = async () => {
    try {
      const result = await makeRequest(`${process.env.NEXT_PUBLIC_API_URL}/endpoint`)
      console.log(result)
    } catch (error) {
      console.error("API call failed:", error)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please sign in</div>

  return (
    <div>
      <h1>Welcome, {session?.user?.name}!</h1>
      <button onClick={handleApiCall}>Make API Call</button>
    </div>
  )
}
```

### 3. Session Information Access

```typescript
const { session, isAuthenticated, getProvider } = useGlobalSession()

// Access session data
console.log(session?.user?.email)    // User email
console.log(session?.provider)       // "google" or "github"
console.log(getProvider)             // Provider name
console.log(isAuthenticated)         // true/false
```

## Available Functions

### Server-Side (`src/lib/session.ts`)

- `getGlobalSession()`: Get session data on server
- `makeAuthenticatedRequest(url, options)`: Make authenticated API calls
- `createClientSessionHelper()`: Helper functions for client-side

### Client-Side (`src/hooks/useGlobalSession.ts`)

- `useGlobalSession()`: Main hook for session data
- `useAuthenticatedApi()`: Hook for making authenticated API calls

### Session Helper Functions

- `getAuthToken()`: Get formatted auth token
- `isAuthenticated()`: Check if user is authenticated
- `getProvider()`: Get authentication provider

## Token Format

The system automatically formats tokens based on the provider:

- **Google**: `google:${accessToken}`
- **GitHub**: `github:${accessToken}`

## Environment Variables

Make sure to set these in your `.env.local`:

```bash
# For server-side API calls
API_URL=https://your-api.com

# For client-side API calls
NEXT_PUBLIC_API_URL=https://your-api.com
```

## Error Handling

The system includes built-in error handling:

```typescript
try {
  const data = await makeAuthenticatedRequest('/api/endpoint')
  // Handle success
} catch (error) {
  if (error.message === "Not authenticated") {
    // Redirect to login
  } else {
    // Handle other errors
  }
}
```

## Best Practices

1. **Always check authentication** before making API calls
2. **Use loading states** to improve UX
3. **Handle errors gracefully** with user-friendly messages
4. **Use server-side session** for sensitive operations
5. **Use client-side session** for UI state and user experience

## Migration from Old Approach

If you were using the old approach with `useSession()` in server actions:

**Before:**
```typescript
// ❌ This doesn't work
let session = useSession()
```

**After:**
```typescript
// ✅ Use this instead
const session = await getGlobalSession()
```

This global session system provides a consistent, type-safe way to handle authentication across your entire application while maintaining the benefits of both server-side and client-side session management. 