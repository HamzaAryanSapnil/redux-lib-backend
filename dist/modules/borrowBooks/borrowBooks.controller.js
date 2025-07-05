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
exports.borrowedBookSummery = exports.saveBorrowBook = void 0;
const borrowBooks_model_1 = __importDefault(require("./borrowBooks.model"));
const book_model_1 = __importDefault(require("../books/book.model"));
const borrowBooks_zod_schema_1 = require("./borrowBooks.zod.schema");
const zod_1 = require("zod");
// * Save borrow book
const saveBorrowBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const parsedData = yield borrowBooks_zod_schema_1.borrowedBooksZodSchema.parseAsync(payload);
        const data = yield borrowBooks_model_1.default.create(parsedData);
        yield book_model_1.default.updateAvailability(data.book);
        res.status(201).send({
            success: true,
            message: "Book borrowed successfully",
            data,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
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
});
exports.saveBorrowBook = saveBorrowBook;
const borrowedBookSummery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield borrowBooks_model_1.default.aggregate([
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
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
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
});
exports.borrowedBookSummery = borrowedBookSummery;
