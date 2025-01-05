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

    const file = formData.get("file") as File;

    const response: SuccessResponseType = { status: "success", id: '', url: '' };

    if (file.name) {
      const res = await sanityClient.assets
        .upload('image', file, {
          filename: file.name,
        });

      response.id = res._id;
      response.url = res.url;
    }

    return NextResponse.json(response);
  } catch (e) {
    console.error(e);
    const response: ErrorResponseType = { status: "fail", error: e };
    return NextResponse.json(response);
  }
}