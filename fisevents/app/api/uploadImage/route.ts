import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity.cli";
import { getSession } from "@/lib/auth";
import arcjet, { fixedWindow } from "@/lib/arcjet";

type StatusResponseType = { status: "success" | "fail"; };
type SuccessResponseType = StatusResponseType & { id: string; url: string; };
type ErrorResponseType = StatusResponseType & { error: unknown; };

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    max: 2,
    window: '60s',
  }),
);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = /^image\/(jpeg|png|webp|gif|avif)$/;

export async function POST(req: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ status: "fail", error: "unauthorized" });
  }

  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    return NextResponse.json({ status: "fail", error: "too_many_requests" });
  }

  try {
    const formData = await req.formData();

    const file = formData.get("file");

    if (!(file instanceof File) || !file.name) {
      return NextResponse.json({ status: "fail", error: "no_file" });
    }

    if (!ALLOWED_MIME.test(file.type)) {
      return NextResponse.json({ status: "fail", error: "invalid_type" });
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ status: "fail", error: "file_too_large" });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const res = await sanityClient.assets.upload('image', buffer, {
      filename: file.name,
      contentType: file.type,
    });

    const response: SuccessResponseType = {
      status: "success",
      id: res._id,
      url: res.url,
    };

    return NextResponse.json(response);
  } catch (e) {
    console.error('Image upload failed:', e);
    const response: ErrorResponseType = { status: "fail", error: e };
    return NextResponse.json(response);
  }
}