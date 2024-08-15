const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });

      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    if (!books) {
      reject(new Error("Books not found!"));
    }
    resolve(books);
  });

  getBooks
    .then((res) => res.status(200).json(res))
    .catch((error) => res.status(404).json({ message: error }));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const getBook = new Promise((resolve, reject) => {
    const { isbn } = req.params;
    if (!isbn || !books[isbn]) {
      reject(new Error("Book not found!"));
    }
    resolve(books[isbn]);
  });

  getBook
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json({ message: error }));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    if (!req.params.author) {
      reject(new Error("Author not found!"));
    }

    let booksList = [];
    Object.values(booksList).map((book) => {
      if (book.author === req.params.author) {
        booksList.push(book);
      }
    });

    resolve(booksList);
  });

  getBooks
    .then((result) => res.status(200).json(result))
    .catch((error) => res.status(400).send(error));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const getBook = new Promise((resolve, reject) => {
    if (!req.params.title) {
      reject(new Error("Title not found!"));
    }

    let result = {};
    Object.values(books).map((book) => {
      if (book.title === req.params.title) {
        result = book;
      }
    });
    resolve(result);
  });

  getBook
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json(error));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  if (!books[isbn]) {
    return res.status(400).json({ message: "Book not found !" });
  }
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
