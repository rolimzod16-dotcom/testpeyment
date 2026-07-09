import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ensureSchema } from "@/lib/ensure-schema";
import { requireAdmin, slugify } from "@/lib/admin-auth";

const updateSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  category: z.enum(["tours", "hunting", "survival"]).optional(),
  description: z.string().min(2).max(500).optional(),
  longDescription: z.string().min(2).max(10000).optional(),
  destination: z.string().min(1).max(200).optional(),
  duration: z.string().min(1).max(100).optional(),
  difficulty: z.string().optional().nullable(),
  species: z.string().optional().nullable(),
  priceUsd: z.number().positive().max(1_000_000).optional(),
  depositPercent: z.number().int().min(1).max(100).optional(),
  maxGuests: z.number().int().min(1).max(100).optional(),
  imageUrl: z.string().optional(),
  documentUrl: z.string().max(2000).optional().nullable(),
  highlights: z.array(z.string()).optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  slug: z.string().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, ctx: Ctx) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { id } = await ctx.params;
  await ensureSchema();
  const pkg = await prisma.package.findUnique({
    where: { id },
    include: { _count: { select: { bookings: true } } },
  });
  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(pkg);
}

export async function PUT(request: Request, ctx: Ctx) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await ctx.params;
    await ensureSchema();
    const body = updateSchema.parse(await request.json());

    const existing = await prisma.package.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let slug = existing.slug;
    if (body.slug?.trim()) {
      const next = slugify(body.slug);
      if (next !== existing.slug) {
        const clash = await prisma.package.findUnique({ where: { slug: next } });
        if (clash && clash.id !== id) {
          return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
        }
        slug = next;
      }
    }

    const updated = await prisma.package.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.longDescription !== undefined && { longDescription: body.longDescription }),
        ...(body.destination !== undefined && { destination: body.destination }),
        ...(body.duration !== undefined && { duration: body.duration }),
        ...(body.difficulty !== undefined && { difficulty: body.difficulty }),
        ...(body.species !== undefined && { species: body.species }),
        ...(body.priceUsd !== undefined && { priceUsd: body.priceUsd }),
        ...(body.depositPercent !== undefined && { depositPercent: body.depositPercent }),
        ...(body.maxGuests !== undefined && { maxGuests: body.maxGuests }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.documentUrl !== undefined && { documentUrl: body.documentUrl }),
        ...(body.highlights !== undefined && { highlights: JSON.stringify(body.highlights) }),
        ...(body.included !== undefined && { included: JSON.stringify(body.included) }),
        ...(body.excluded !== undefined && { excluded: JSON.stringify(body.excluded) }),
        ...(body.active !== undefined && { active: body.active }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
        slug,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[admin packages PUT]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Validation error" }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await ctx.params;
    await ensureSchema();
    const { searchParams } = new URL(request.url);
    const hard = searchParams.get("hard") === "1";

    const existing = await prisma.package.findUnique({
      where: { id },
      include: { _count: { select: { bookings: true } } },
    });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (hard) {
      if (existing._count.bookings > 0) {
        return NextResponse.json(
          {
            error: `Cannot hard-delete: ${existing._count.bookings} booking(s) linked. Hide the package instead.`,
          },
          { status: 400 }
        );
      }
      await prisma.package.delete({ where: { id } });
      return NextResponse.json({ ok: true, deleted: true });
    }

    // Soft delete — hide from site
    const updated = await prisma.package.update({
      where: { id },
      data: { active: false },
    });
    return NextResponse.json({ ok: true, softDeleted: true, package: updated });
  } catch (error) {
    console.error("[admin packages DELETE]", error);
    const message = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
