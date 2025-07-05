"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBooksZodSchema = exports.booksZodSchema = void 0;
const zod_1 = require("zod");
exports.booksZodSchema = zod_1.z.object({
    title: zod_1.z
        .string({ required_error: "Title is required" })
        .min(1, { message: "Title cannot be empty" }),
    author: zod_1.z
        .string({ required_error: "Author is required" })
        .min(1, { message: "Author name cannot be empty" }),
    genre: zod_1.z.enum(["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"], {
        required_error: "Genre is required",
        invalid_type_error: "Genre must be one of the specified options",
    }),
    isbn: zod_1.z
        .string({ required_error: "ISBN is required" })
        .regex(/^\d{10}(\d{3})?$/, {
        message: "ISBN must be a valid 10 or 13 digit number",
    }),
    description: zod_1.z.string().optional().or(zod_1.z.literal("")), // allow empty string too
    copies: zod_1.z
        .number({ required_error: "Copies is required" })
        .int({ message: "Copies must be an integer" })
        .min(0, { message: "Copies must be a positive number" }),
    available: zod_1.z
        .boolean({
        required_error: "Availability is required and must be a boolean",
    })
        .default(true),
});
exports.updateBooksZodSchema = exports.booksZodSchema.partial();
