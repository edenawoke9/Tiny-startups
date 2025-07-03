// ✅ FILE: app/api/protected-route/route.ts

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  return new Response(
    JSON.stringify({
      message: "You are authorized",
      user: session.user,
      token: session.accessToken,
    })
  );
}
