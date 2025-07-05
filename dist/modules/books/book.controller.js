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
exports.deleteSingleBook = exports.updateBook = exports.postBook = exports.getSingleBook = exports.getBooks = void 0;
const book_model_1 = __importDefault(require("./book.model"));
const book_zodSchema_1 = require("./book.zodSchema");
// * Get all books
const getBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const filterOption = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.filter;
        const sortBy = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.sortBy;
        const sortRule = req.query.sort;
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query = {};
        if (filterOption) {
            query.genre = filterOption;
        }
        const sortQuery = {};
        if (sortBy) {
            sortQuery[sortBy] = sortRule === "desc" ? -1 : 1;
        }
        const totalBooks = yield book_model_1.default.countDocuments(query);
        const books = yield book_model_1.default.find(query)
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
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).send({
                message: "Validation Failed",
                success: false,
                error: {
                    name: error.name,
                    message: error,
                },
            });
        }
        else {
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
});
exports.getBooks = getBooks;
// * get a single book
const getSingleBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const data = yield book_model_1.default.findById(bookId);
        res.status(201).send({
            success: true,
            message: "Book Created Successfully",
            data,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).send({
                message: "Validation Failed",
                success: false,
                error: {
                    name: error.name,
                    message: error,
                },
            });
        }
        else {
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
});
exports.getSingleBook = getSingleBook;
// * save books
const postBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const parsedData = yield book_zodSchema_1.booksZodSchema.parseAsync(payload);
        console.log(parsedData);
        const data = yield book_model_1.default.create(parsedData);
        res.status(201).send({
            success: true,
            message: "Book Created Successfully",
            data,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).send({
                message: "Validation Failed",
                success: false,
                error: {
                    name: error.name,
                    message: error,
                },
            });
        }
        else {
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
});
exports.postBook = postBook;
// * update a book
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const payload = req.body;
        const parsedData = yield book_zodSchema_1.updateBooksZodSchema.parseAsync(payload);
        yield book_model_1.default.findOneAndUpdate({ _id: bookId }, parsedData, {
            runValidators: true,
            new: true,
        });
        yield book_model_1.default.updateAvailability(bookId);
        const data = yield book_model_1.default.findById(bookId);
        res.status(201).send({
            success: true,
            message: "Book Updated Successfully",
            data,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).send({
                message: "Validation Failed",
                success: false,
                error: {
                    name: error.name,
                    message: error,
                },
            });
        }
        else {
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
});
exports.updateBook = updateBook;
// * delete single books
const deleteSingleBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        yield book_model_1.default.findByIdAndDelete(bookId);
        res.status(201).send({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).send({
                message: "Validation Failed",
                success: false,
                error: {
                    name: error.name,
                    message: error,
                },
            });
        }
        else {
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
});
exports.deleteSingleBook = deleteSingleBook;
