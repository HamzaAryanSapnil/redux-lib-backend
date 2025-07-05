import { Router } from "express";
import booksRoute from "../books/book.routes";
import { borrowedBooksRoute } from "../borrowBooks/borrowBooks.routes";

const routes = Router();

routes.use("/api/books", booksRoute);
routes.use("/api/borrow", borrowedBooksRoute);

export default routes;
