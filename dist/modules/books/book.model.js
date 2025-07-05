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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
    versionKey: false,
});
bookSchema.static("updateAvailability", function updateAvailability(bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield this.findById(bookId);
        if (book && book.copies === 0 && book.available === true) {
            book.available = false;
            yield book.save();
        }
    });
});
bookSchema.post("findOneAndUpdate", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc && doc.copies > 0 && doc.available === false) {
            doc.available = true;
            yield doc.save();
            next();
        }
        next();
    });
});
const Book = (0, mongoose_1.model)("Book", bookSchema);
exports.default = Book;
