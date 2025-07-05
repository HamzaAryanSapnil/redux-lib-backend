import { model, Schema } from "mongoose";
import { BookStaticMethods, IBooks } from "./book.interface";

const bookSchema = new Schema<IBooks, BookStaticMethods>(
  {
    title: {
      type: String,
      required: [true, "Title is required and it must be a string"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required and it must be a string"],
    },
    genre: {
      type: String,
      required: [true, "Genre is required and it must be a string"],
      enum: {
        values: [
          "FICTION",
          "NON_FICTION",
          "SCIENCE",
          "HISTORY",
          "BIOGRAPHY",
          "FANTASY",
        ],
        message: "{VALUE} is not supported",
      },
    },
    isbn: {
      type: String,
      required: [true, "Isbn is required and it must be a string"],
    },
    description: { type: String },
    copies: {
      type: Number,
      required: [true, "Copies is required and it must be a number"],
      min: [0, "Copies must be a positive number"],
    },
    available: {
      type: Boolean,
      required: [true, "Availability is required and it must be a boolean"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

bookSchema.static(
  "updateAvailability",
  async function updateAvailability(bookId: Schema.Types.ObjectId) {

    const book = await this.findById(bookId);
    if (book && book.copies === 0 && book.available === true) {
      book.available = false;
      await book.save();
    }
  }
);

bookSchema.post("findOneAndUpdate", async function (doc, next) {
  if (doc && doc.copies > 0 && doc.available === false) {
    doc.available = true;
    await doc.save();
    next();
  }
 
  next();
});

const Book = model<IBooks, BookStaticMethods>("Book", bookSchema);

export default Book;
