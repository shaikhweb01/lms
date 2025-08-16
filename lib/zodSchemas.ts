import { z } from "zod";

export const  courseLevel = ["Beginner", "Intermediate", "Advanced"]
export const courseStatus=["Draft", "Published", "Archived"]
export const courseCategories = [
  "Development",
  "Business",
  "Design",
  "Marketing",
  "Finance & Accounting",
  "IT & Software",
  "Personal Development",
  "Photography & Video",
  "Health & Fitness",
  "Music",
  "Teaching & Academics",
  "Lifestyle",
  "Language Learning",
  "Data Science",
  "Engineering",
  "Science",
  "Mathematics",
] as const;


export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title is required" }),
  description: z
    .string()
    .min(3, { message: "Description is required" }),
  fileKey: z
    .string()
    .min(1, { message: "File key is required" }),
  price: z.coerce
    .number({ message: "Price is required" })
    .int({ message: "Price must be an integer" })
    .nonnegative({ message: "Price must be a non-negative integer" }),
  duration: z.coerce
    .number({message: "Duration is required" })
    .int({ message: "Duration must be an integer" })
    .positive({ message: "Duration must be greater than 0" }),
  level: z.enum(courseLevel).default("Beginner"),

  category: z
    .enum(courseCategories,{ message: "Category is required" }),
  smallDescription: z
    .string()
    .min(3, { message: "Small description is required" }),
  slug: z
    .string()
    .min(3, { message: "Slug is required" }),

  status: z.enum(courseStatus).default("Draft"),
});

export type CourseInput = z.infer<typeof courseSchema>;

