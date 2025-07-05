import { z } from "zod";


const today = new Date();
today.setHours(0, 0, 0, 0); // ignore time part


export const borrowedBooksZodSchema = z.object({
  book: z
    .string({ required_error: "Book ID is required" })
    .regex(/^[a-f\d]{24}$/i, { message: "Invalid MongoDB ObjectId format" }),

  quantity: z
    .number({ required_error: "Quantity is required" })
    .int({ message: "Quantity must be an integer" })
    .positive({ message: "Quantity must be greater than 0" }),

  dueDate: z.string({ required_error: "Due date is required" }).refine(
    (dateStr) => {
      const inputDate = new Date(dateStr);
      inputDate.setHours(0, 0, 0, 0); // compare only dates, not times
      return inputDate >= today;
    },
    {
      message: "Due date must be today or a future date",
    }
  ),
});