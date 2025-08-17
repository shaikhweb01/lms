import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import z from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/S3Client";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "FileName is required" }),
  contentType: z.string().min(1, { message: "Content Type is required" }),
  size: z.number().min(1, { message: "Size is required" }),
  isImage: z.boolean().optional(),
});

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [], // Block all bots
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5, // Adjusted for file uploads
    })
  );

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Reject unauthenticated requests
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decision = await aj.protect(request, {
      fingerprint: session.user.id, // Ensures rate-limiting is user-specific
    });

    if (decision.isDenied()) {
      console.log("Arcjet Denied:", decision.reason);
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "validation failed" },
        { status: 400 }
      );
    }

    const { fileName, contentType, size } = validation.data;
    const uniqueKey = `${session.user.id}/${uuidv4()}-${fileName}`; // User-specific paths

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: uniqueKey,
      ContentType: contentType,
      ContentLength: size,
    });

    const presignedUrl = await getSignedUrl(s3, command, {
      expiresIn: 360, // 6 minutes
    });

    const response = NextResponse.json({ presignedUrl, key: uniqueKey });
    response.headers.set("Access-Control-Allow-Origin", "*"); // CORS
    return response;

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
