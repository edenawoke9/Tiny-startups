// ✅ FILE: app/dashboard/page.tsx

"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { status, data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session?.user?.name}</p>
    </div>
  );
}
