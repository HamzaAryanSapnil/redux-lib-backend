import { CallbackError, model, Schema } from "mongoose";
import { IBorrowBooks } from "./borrowBooks.interface";
import Book from "../books/book.model";

const borrowBookSchema = new Schema<IBorrowBooks>(
  {
    book: {
      type: Schema.Types.ObjectId,
      required: [true, "Must Have Book Reference Id"],
      ref: "Book"
    },
    quantity: {
      type: Number,
      required: [true, "Number Of Quantity Of a Book Is Must Required"],
      min: [1, "Quantity must be a positive number"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due Date Must Required"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

borrowBookSchema.pre("save", async function (next) {
  try {
    const book = await Book.findById(this.book, "copies available");

    if (!book || book.copies <= 0 || book.available === false) {
      const error = new Error("This book is unavailable to borrow right now.");
      error.name = "UnavailabilityBookError";

      return next(error);
    }

    if (this.quantity > book.copies) {
      const error = new Error(
        `Your request quantity is ${
          this.quantity
        }. And Available number of Copies is only ${book.copies}.  ${
          book.copies > 1
            ? `You can only borrow less than ${book.copies} books`
            : "You can borrow only 1 book now"
        }`
      );
      error.name = "InsufficientBookCopiesError";
      
      return next(error);
    }

    next();
  } catch (err) {
    next(err as CallbackError );
  }
});

borrowBookSchema.post("save", async function (doc, next) {
  await Book.findByIdAndUpdate(
    doc.book,
    {
      $inc: { copies: -doc.quantity },
    },
    { new: true }
  );

 
  next();
});

const BorrowBook = model<IBorrowBooks>("BorrowBook", borrowBookSchema);
export default BorrowBook;
