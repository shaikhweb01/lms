"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/tpes";
import { CourseInput, courseSchema } from "@/lib/zodSchemas";
import { cookies } from "next/headers";

export async function CreateCourse(values: CourseInput): Promise<ApiResponse> {
  try {
    // 1. Check session
    const session = await auth.api.getSession({
      headers: { cookie: cookies().toString() },
    });

    if (!session?.user?.id) {
      return {
        status: "error",
        message: "Unauthorized: Please log in.",
      };
    }

    // 2. Validate input
    const validation = courseSchema.safeParse(values);
    if (!validation.success) {
      console.log("Validation Error:", validation.error);
      return {
        status: "error",
        message: "Invalid data: " + validation.error.errors.map(e => e.message).join(", "),
      };
    }

    // 3. Create course
    console.log("Creating course with:", validation.data);
    await prisma.$connect();
    const data = await prisma.course.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    });

    return {
      status: "success",
      message: "Course created successfully!",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      status: "error",
      message: "Failed to create course. Please try again.",
    };
  } finally {
    await prisma.$disconnect();
  }
}