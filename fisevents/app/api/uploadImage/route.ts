import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity.cli";

type StatusResponseType = { status: "success" | "fail"; };
type SuccessResponseType = StatusResponseType & { id: string; url: string; };
type ErrorResponseType = StatusResponseType & { error: unknown; };

export async function POST(req: Request) {
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