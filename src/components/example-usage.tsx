"use client"

// Placeholder for Firebase session logic to be added later.

export function ExampleComponent() {
  return <div>Example usage will be updated for Firebase Auth.</div>;
}

// Example of a component that needs session data but doesn't make API calls
export function SessionInfo() {
  const { session, isAuthenticated, getProvider } = useGlobalSession()

  if (!isAuthenticated) {
    return <div>Not authenticated</div>
  }

  return (
    <div>
      <p>Logged in as: {session?.user?.email}</p>
      <p>Provider: {getProvider}</p>
    </div>
  )
} 