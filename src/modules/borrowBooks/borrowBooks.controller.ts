import { Request, Response } from "express";
import BorrowBook from "./borrowBooks.model";
import Book from "../books/book.model";
import { borrowedBooksZodSchema } from "./borrowBooks.zod.schema";
import { ZodError } from "zod";

// * Save borrow book
export const saveBorrowBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;
    const parsedData = await borrowedBooksZodSchema.parseAsync(payload);
    const data = await BorrowBook.create(parsedData);
    await Book.updateAvailability(data.book);
    res.status(201).send({
      success: true,
      message: "Book borrowed successfully",
      data,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof ZodError) {
       res.status(400).json({
        message: "Validation Failed",
        success: false,
        error: {
          name: error.name,
          issues: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        },
      });
    }

    if (error instanceof Error) {
       res.status(400).json({
        message: "Validation Failed",
        success: false,
        error: {
          name: error.name,
          message: error.message,
        },
      });
    }

     res.status(500).json({
      message: "Unknown error occurred",
      success: false,
      error: {
        name: "UnknownError",
        message: JSON.stringify(error),
      },
    });
  }
};

export const borrowedBookSummery = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await BorrowBook.aggregate([
      {
        $group: { _id: "$book", totalQuantity: { $sum: "$quantity" } },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookinfo",
        },
      },

      { $unwind: "$bookinfo" },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookinfo.title",
            isbn: "$bookinfo.isbn",
          },
          totalQuantity: 1,
        },
      },
    ]);

    res.status(201).send({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
       res.status(400).json({
        message: "Validation Failed",
        success: false,
        error: {
          name: error.name,
          issues: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        },
      });
    }

    if (error instanceof Error) {
       res.status(400).json({
        message: "Validation Failed",
        success: false,
        error: {
          name: error.name,
          message: error.message,
        },
      });
    }

     res.status(500).json({
      message: "Unknown error occurred",
      success: false,
      error: {
        name: "UnknownError",
        message: JSON.stringify(error),
      },
    });
  }
};
