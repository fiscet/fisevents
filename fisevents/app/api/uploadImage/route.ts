import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

type StatusResponseType = { status: "success" | "fail"; };
type SuccessResponseType = StatusResponseType & { id: string; };
type ErrorResponseType = StatusResponseType & { error: unknown; };

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    const res = await sanityClient.assets
      .upload('image', file, {
        filename: file.name,
      });

    const response: SuccessResponseType = { status: "success", id: res._id };

    return NextResponse.json(response);
  } catch (e) {
    console.error(e);
    const response: ErrorResponseType = { status: "fail", error: e };
    return NextResponse.json(response);
  }
}