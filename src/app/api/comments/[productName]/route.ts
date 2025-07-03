import { NextResponse } from "next/server";

// In-memory comment store per product
let commentStore: Record<string, any[]> = {};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pathnameParts = url.pathname.split("/");
  const productName = decodeURIComponent(
    pathnameParts[pathnameParts.length - 1]
  );

  const comments = commentStore[productName] || [];
  return Response.json(comments);
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const pathnameParts = url.pathname.split("/");
  const productName = decodeURIComponent(
    pathnameParts[pathnameParts.length - 1]
  );

  const body = await request.json();
  const { user, content } = body;

  if (!user || !content) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
    });
  }

  const newComment = {
    id: Date.now(),
    user,
    content,
    timestamp: "Just now",
    upvotes: 0,
    hasUpvoted: false,
  };

  if (!commentStore[productName]) commentStore[productName] = [];
  commentStore[productName].push(newComment);

  return Response.json(newComment, { status: 201 });
}
