# 📚 Library Management System API
## Level 2 Mongoose Assignment
একটা সিম্পল Library Management System Api Project যা টাইপস্ক্রিপ, Mongoose, Express এর উপর বিল্ড করা। এই Api User কে book manage করতে, borrow করতে এবং borrow books গুলোর real time summery track করতে সাহায্য করে। এখানে Proper Validation Business logic ব্যবহার করা হয়েছে।

## 🚀 Features
📖 Book CRUD operations (Create, Read, Update, Delete)\
🔄 Borrow books with availability check\
✅ Validation using Zod and Mongoose\
📊 Borrow summary using aggregation pipeline\
🧠 Business logic with middleware & static methods\
📎 Genre-based filtering, and with any field sorting\


**More in Final Notes at the end**








## 🛠 Installation & Setup Instructions
### ✅ Prerequisites
Node.js (v18 or above)

MongoDB (Local or Atlas)


### 📦 Install Project
```
https://github.com/HamzaAryanSapnil/mongoose-assignment-ph-level2-repo
```




### 🔐 Environment Variables
PORT=5000\
DB_URL= MongoUrl\
NODE_ENV=development

**Replace MongoDB URI and other env variables as needed**

### 🚀 Run the Server

npm run dev

Server will start at: http://localhost:5000



### 📁 Project Structure

**moduler pettern**

### 📌 API Endpoints


**1. 📘 Create Book**

POST **/api/books**

**Request Body**
```
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "Cosmology explained simply",
  "copies": 5
}
```
2. **📚 Get All Books**
```
GET /api/books?filter=FICTION&sortBy=createdAt&sort=desc&limit=5
```
3. **📖 Get Book By ID**
```
GET /api/books/:bookId
```
4. **✏️ Update Book**
```
PUT /api/books/:bookId
```
5. **❌ Delete Book**
```
DELETE /api/books/:bookId
```
6. **🔄 Borrow Book**

POST /api/borrow

**Request Body**
```
{
  "book": "<book_id>",
  "quantity": 2,
  "dueDate": "2025-07-18"
}
```
7. 📊 Borrow Summary

GET /api/borrow

Response Format
```
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    },
    {
      "book": {
        "title": "1984",
        "isbn": "9780451524935"
      },
      "totalQuantity": 3
    }
  ]
}
```
**🚨 Error Response Structure**
```
{
  "message": "Validation failed",
  "success": false,
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a positive number",
        "name": "ValidatorError",
        "properties": {
          "message": "Copies must be a positive number",
          "type": "min",
          "min": 0
        },
        "kind": "min",
        "path": "copies",
        "value": -5
      }
    }
  }
}
```
### 🧠 Technologies Used

Express.js

TypeScript

Mongoose

Zod

## 🏁 Final Notes
Create And Update methods এ Proper Zod Validation করা হয়েছে। \
যখন কোন বই Borrow করা হচ্ছে যদি বইয়ের কপি যতগুলা বই Borrow করা হচ্ছে তার চেয়ে কম থাকে তাহলে \
```
"error": {
        "name": "UnavailabilityBookError",
        "message": "This book is unavailable to borrow right now."
    }
```


এই কাস্টম মেসেজ দেখানো হচ্ছে। এইটা borrowbookSchema Pre method দিয়ে Handle করা হচ্ছে। 
আবার borrowBookSchema Post Method দিয়ে যতগুলা বই Borrow করা হয়েছে তা Decrement করা হচ্ছে। অর্থাৎ এখানে Middleware এর ব্যবহার করা হচ্ছে। 
Book Schema তে Static Method Use করা হয়েছে যদি কখন ম্যানুয়ালি Book Copies 0 করতে হয় বা Borrow করতে গিয়ে Decrement হতে গিয়ে Book Copies 0 হয়ে যায় তখন যেন Automatically Available False হয়ে যায়।
Book Schema তে একটি Post Middleware ব্যবহার করা হয়েছে যাতে যদি কখনো Book Copies Increment করা হয় fineOneAndUpdate ব্যবহার করে তাহলে Available true হয়ে যায়। অর্থাৎ এক্ষেত্রেও Static Method And Middleware এর ব্যবহার করা হচ্ছে।

### Enjoy Coding🎉🎉🎉 
