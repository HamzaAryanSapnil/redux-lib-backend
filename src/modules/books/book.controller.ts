import { Request, Response } from "express";
import Book from "./book.model";
import { booksZodSchema, updateBooksZodSchema } from "./book.zodSchema";

// * Get all books
export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const filterOption = req?.query?.filter as string | undefined;
    const sortBy = req?.query?.sortBy as string | undefined;
    const sortRule = req.query.sort as "asc" | "desc" | undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (filterOption) {
      query.genre = filterOption;
    }
    const sortQuery: Record<string, 1 | -1> = {};
    if (sortBy) {
      sortQuery[sortBy] = sortRule === "desc" ? -1 : 1;
    }

    const totalBooks = await Book.countDocuments(query);

    const books = await Book.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalBooks / limit);

    res.status(201).send({
      success: true,
      message: "Books retrieved successfully",
      meta: {
        page,
        limit,
        total: totalBooks,
        totalPages,
      },
      data: books,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({
        message: "Validation Failed",
        success: false,
        error: {
          name: error.name,
          message: error,
        },
      });
    } else {
      res.status(400).send({
        message: "Unknown error occurred",
        success: false,
        error: {
          name: "UnknownError",
          message: JSON.stringify(error),
        },
      });
    }
  }
};
// * get a single book
export const getSingleBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookId = req.params.bookId;
    const data = await Book.findById(bookId);
    res.status(201).send({
      success: true,
      message: "Book Created Successfully",
      data,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({
        message: "Validation Failed",
        success: false,
        error: {
          name: error.name,
          message: error,
        },
      });
    } else {
      res.status(400).send({
        message: "Unknown error occurred",
        success: false,
        error: {
          name: "UnknownError",
          message: JSON.stringify(error),
        },
      });
    }
  }
};
// * save books
export const postBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;
    const parsedData = await booksZodSchema.parseAsync(payload);
    const data = await Book.create(parsedData);
    res.status(201).send({
      success: true,
      message: "Book Created Successfully",
      data,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({
        message: "Validation Failed",
        success: false,
        error: {
          name: error.name,
          message: error,
        },
      });
    } else {
      res.status(400).send({
        message: "Unknown error occurred",
        success: false,
        error: {
          name: "UnknownError",
          message: JSON.stringify(error),
        },
      });
    }
  }
};
// * update a book
export const updateBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookId = req.params.bookId;
    const payload = req.body;
    const parsedData = await updateBooksZodSchema.parseAsync(payload);
    await Book.findOneAndUpdate({ _id: bookId }, parsedData, {
      runValidators: true,
      new: true,
    });
    await Book.updateAvailability(bookId);
    const data = await Book.findById(bookId);
    res.status(201).send({
      success: true,
      message: "Book Updated Successfully",
      data,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({
        message: "Validation Failed",
        success: false,
        error: {
          name: error.name,
          message: error,
        },
      });
    } else {
      res.status(400).send({
        message: "Unknown error occurred",
        success: false,
        error: {
          name: "UnknownError",
          message: JSON.stringify(error),
        },
      });
    }
  }
};

// * delete single books
export const deleteSingleBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookId = req.params.bookId;
    await Book.findByIdAndDelete(bookId);
    res.status(201).send({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({
        message: "Validation Failed",
        success: false,
        error: {
          name: error.name,
          message: error,
        },
      });
    } else {
      res.status(400).send({
        message: "Unknown error occurred",
        success: false,
        error: {
          name: "UnknownError",
          message: JSON.stringify(error),
        },
      });
    }
  }
};
