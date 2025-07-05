import { z } from "zod";



export const booksZodSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, { message: "Title cannot be empty" }),

  author: z
    .string({ required_error: "Author is required" })
    .min(1, { message: "Author name cannot be empty" }),

  genre: z.enum(
    ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
    {
      required_error: "Genre is required",
      invalid_type_error: "Genre must be one of the specified options",
    }
  ),

  isbn: z
    .string({ required_error: "ISBN is required" })
    .regex(/^\d{10}(\d{3})?$/, {
      message: "ISBN must be a valid 10 or 13 digit number",
    }),

  description: z.string().optional().or(z.literal("")), // allow empty string too

  copies: z
    .number({ required_error: "Copies is required" })
    .int({ message: "Copies must be an integer" })
    .min(0, { message: "Copies must be a positive number" }),

  available: z
    .boolean({
      required_error: "Availability is required and must be a boolean",
    })
    .default(true),
});


export const updateBooksZodSchema = booksZodSchema.partial();
