import { Router } from "express";
import { deleteSingleBook, getBooks, getSingleBook, postBook, updateBook} from "./book.controller";

const booksRoute = Router();

booksRoute.get("/", getBooks)
booksRoute.get("/:bookId", getSingleBook);
booksRoute.post("/", postBook)
booksRoute.put("/:bookId", updateBook);
booksRoute.delete("/:bookId", deleteSingleBook);


export default booksRoute;