import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ensureSchema } from "@/lib/ensure-schema";
import { requireAdmin, slugify } from "@/lib/admin-auth";

const packageSchema = z.object({
  title: z.string().min(2).max(200),
  category: z.enum(["tours", "hunting", "survival"]),
  description: z.string().min(2).max(500),
  longDescription: z.string().min(2).max(10000),
  destination: z.string().min(1).max(200),
  duration: z.string().min(1).max(100),
  difficulty: z.string().optional().nullable(),
  species: z.string().optional().nullable(),
  priceUsd: z.number().positive().max(1_000_000),
  depositPercent: z.number().int().min(1).max(100).default(30),
  maxGuests: z.number().int().min(1).max(100).default(12),
  imageUrl: z.string().min(1).max(2000),
  highlights: z.array(z.string()).default([]),
  included: z.array(z.string()).default([]),
  excluded: z.array(z.string()).default([]),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  slug: z.string().optional(),
});

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  await ensureSchema();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const packages = await prisma.package.findMany({
    where: category ? { category } : undefined,
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { bookings: true } } },
  });

  return NextResponse.json(packages);
}

export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    await ensureSchema();
    const body = packageSchema.parse(await request.json());

    let slug = body.slug?.trim() ? slugify(body.slug) : slugify(body.title);
    const existing = await prisma.package.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const created = await prisma.package.create({
      data: {
        slug,
        title: body.title,
        category: body.category,
        description: body.description,
        longDescription: body.longDescription,
        destination: body.destination,
        duration: body.duration,
        difficulty: body.difficulty || null,
        species: body.category === "hunting" ? body.species || null : null,
        priceUsd: body.priceUsd,
        depositPercent: body.depositPercent,
        maxGuests: body.maxGuests,
        imageUrl: body.imageUrl,
        highlights: JSON.stringify(body.highlights),
        included: JSON.stringify(body.included),
        excluded: JSON.stringify(body.excluded),
        active: body.active,
        featured: body.featured,
        sortOrder: body.sortOrder,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[admin packages POST]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Validation error" }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
