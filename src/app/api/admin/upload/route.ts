import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  ALLOWED_MIME,
  MAX_UPLOAD_BYTES,
  extFromMime,
  getSupabaseAdmin,
  getSupabaseBucket,
  isImageMime,
  isPdfMime,
  validateSupabaseEnv,
} from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const env = validateSupabaseEnv();
  return NextResponse.json({
    ok: env.ok,
    issues: env.issues,
    bucket: getSupabaseBucket(),
    maxBytes: MAX_UPLOAD_BYTES,
    maxMb: MAX_UPLOAD_BYTES / (1024 * 1024),
    allowed: [...ALLOWED_MIME],
  });
}

export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const env = validateSupabaseEnv();
  if (!env.ok) {
    return NextResponse.json(
      {
        error: "Supabase not configured",
        issues: env.issues,
        hint: "Add SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in Vercel env, create public bucket (default: tour-media).",
      },
      { status: 503 }
    );
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    const folderRaw = String(form.get("folder") || "packages");
    const folder = folderRaw.replace(/[^a-zA-Z0-9/_-]/g, "").replace(/^\/+|\/+$/g, "") || "packages";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    if (file.size <= 0) {
      return NextResponse.json({ error: "Empty file" }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: `File too large (max ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB)` },
        { status: 400 }
      );
    }

    const mime = (file.type || "application/octet-stream").toLowerCase();
    if (!ALLOWED_MIME.has(mime)) {
      return NextResponse.json(
        {
          error: `File type not allowed: ${mime || "unknown"}. Use images (jpg/png/webp/gif), PDF, or DOC/DOCX.`,
        },
        { status: 400 }
      );
    }

    const ext = extFromMime(mime, file.name);
    const safeBase = (file.name || "file")
      .replace(ext, "")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 40);
    const objectPath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeBase}${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const supabase = getSupabaseAdmin();
    const bucket = getSupabaseBucket();

    const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
      contentType: mime,
      upsert: false,
      cacheControl: "3600",
    });

    if (uploadError) {
      console.error("[supabase upload]", uploadError);
      // Common: bucket missing
      const msg = uploadError.message || "Upload failed";
      if (/bucket|not found/i.test(msg)) {
        return NextResponse.json(
          {
            error: `Bucket "${bucket}" not found or not accessible. Create it in Supabase → Storage (public).`,
            detail: msg,
          },
          { status: 500 }
        );
      }
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(objectPath);
    const publicUrl = publicData.publicUrl;

    return NextResponse.json({
      ok: true,
      url: publicUrl,
      path: objectPath,
      bucket,
      mime,
      size: file.size,
      kind: isImageMime(mime) ? "image" : isPdfMime(mime) ? "pdf" : "document",
      fieldHint: isImageMime(mime) ? "imageUrl" : "documentUrl",
    });
  } catch (error) {
    console.error("[admin upload]", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
