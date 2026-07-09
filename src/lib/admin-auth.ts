import { NextResponse } from "next/server";

export function requireAdmin(request: Request): NextResponse | null {
  const password = request.headers.get("x-admin-password");
  const expected = process.env.ADMIN_PASSWORD || "change_me";
  if (!password || password !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || `package-${Date.now()}`;
}
