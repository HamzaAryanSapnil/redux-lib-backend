"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowedBooksRoute = void 0;
const express_1 = require("express");
const borrowBooks_controller_1 = require("./borrowBooks.controller");
exports.borrowedBooksRoute = (0, express_1.Router)();
exports.borrowedBooksRoute.get("/", borrowBooks_controller_1.borrowedBookSummery);
exports.borrowedBooksRoute.post("/", borrowBooks_controller_1.saveBorrowBook);
