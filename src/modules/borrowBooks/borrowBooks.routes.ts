import { Router } from "express";
import { borrowedBookSummery, saveBorrowBook } from "./borrowBooks.controller";


export const borrowedBooksRoute = Router();

borrowedBooksRoute.get("/", borrowedBookSummery);
borrowedBooksRoute.post("/", saveBorrowBook);


