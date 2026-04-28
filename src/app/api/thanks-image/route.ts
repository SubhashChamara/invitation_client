import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];

// ─── GET: Serve current thanks image ────────────────────────────────────────
export async function GET() {
  const imageDir = process.env.THANKS_IMAGE_DIR;

  if (!imageDir) {
    return NextResponse.json(
      { error: "THANKS_IMAGE_DIR is not configured in .env.local" },
      { status: 500 }
    );
  }

  if (!fs.existsSync(imageDir)) {
    return NextResponse.json(
      { error: `Image directory not found: ${imageDir}` },
      { status: 404 }
    );
  }

  const files = fs.readdirSync(imageDir);
  const imageFile = files.find((file) =>
    IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase())
  );

  if (!imageFile) {
    return NextResponse.json(
      { error: "No image found in thanks directory" },
      { status: 404 }
    );
  }

  const imagePath = path.join(imageDir, imageFile);
  const imageBuffer = fs.readFileSync(imagePath);
  const ext = path.extname(imageFile).toLowerCase();

  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".avif": "image/avif",
  };

  return new NextResponse(imageBuffer, {
    status: 200,
    headers: {
      "Content-Type": mimeTypes[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
    },
  });
}

// ─── POST: Upload / replace thanks image ────────────────────────────────────
export async function POST(request: Request) {
  const imageDir = process.env.THANKS_IMAGE_DIR;

  if (!imageDir) {
    return NextResponse.json(
      { error: "THANKS_IMAGE_DIR is not configured in .env.local" },
      { status: 500 }
    );
  }

  // Create directory if it doesn't exist
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!IMAGE_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use jpg, png, webp, gif or avif." },
      { status: 400 }
    );
  }

  // Delete all existing image files in the folder before saving the new one
  const existingFiles = fs.readdirSync(imageDir);
  for (const f of existingFiles) {
    if (IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase())) {
      fs.unlinkSync(path.join(imageDir, f));
    }
  }

  // Save the new file as "thanks<ext>"
  const saveName = `thanks${ext}`;
  const savePath = path.join(imageDir, saveName);
  const arrayBuffer = await file.arrayBuffer();
  fs.writeFileSync(savePath, Buffer.from(arrayBuffer));

  return NextResponse.json({ success: true, fileName: saveName }, { status: 200 });
}
