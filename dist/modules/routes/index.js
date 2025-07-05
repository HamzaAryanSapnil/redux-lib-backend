"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const book_routes_1 = __importDefault(require("../books/book.routes"));
const borrowBooks_routes_1 = require("../borrowBooks/borrowBooks.routes");
const routes = (0, express_1.Router)();
routes.use("/api/books", book_routes_1.default);
routes.use("/api/borrow", borrowBooks_routes_1.borrowedBooksRoute);
exports.default = routes;
