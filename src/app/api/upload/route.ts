
import { NextRequest, NextResponse } from "next/server";
import { uploadBuffer } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as unknown as File | null;
  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = (file.type?.split("/")?.[1] || "bin").replace("+xml","");
  const path = `rooms/${Date.now()}.${ext}`;
  const url = await uploadBuffer(path, bytes, file.type || "application/octet-stream");
  return NextResponse.json({ url });
}
