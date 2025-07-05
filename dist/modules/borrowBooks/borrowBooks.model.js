"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const book_model_1 = __importDefault(require("../books/book.model"));
const borrowBookSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    versionKey: false,
    timestamps: true,
});
borrowBookSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const book = yield book_model_1.default.findById(this.book, "copies available");
            if (!book || book.copies <= 0 || book.available === false) {
                const error = new Error("This book is unavailable to borrow right now.");
                error.name = "UnavailabilityBookError";
                return next(error);
            }
            if (this.quantity > book.copies) {
                const error = new Error(`Your request quantity is ${this.quantity}. And Available number of Copies is only ${book.copies}.  ${book.copies > 1
                    ? `You can only borrow less than ${book.copies} books`
                    : "You can borrow only 1 book now"}`);
                error.name = "InsufficientBookCopiesError";
                return next(error);
            }
            next();
        }
        catch (err) {
            next(err);
        }
    });
});
borrowBookSchema.post("save", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield book_model_1.default.findByIdAndUpdate(doc.book, {
            $inc: { copies: -doc.quantity },
        }, { new: true });
        next();
    });
});
const BorrowBook = (0, mongoose_1.model)("BorrowBook", borrowBookSchema);
exports.default = BorrowBook;
