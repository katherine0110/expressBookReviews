const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).send("User successfully registred. Now you can login");
    } else {
      return res.status(404).send("User already exists!");
    }
  }
  return res.status(404).send("Please provide both username and password.");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const myPromise = new Promise((resolve,reject) => {
    resolve(JSON.stringify(books,null,4))
  })
    
  myPromise.then((result) => {
    return res.status(200).send(result);
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const myPromise = new Promise((resolve,reject) => {
    if(books[isbn]){
      resolve(books[isbn]);
    }else{
      reject("Book with ISBN " + isbn + " not exist");
    }
  })
    
  myPromise.then((result) => {
    return res.status(200).send(result);
  },
  (error) => {
    return res.status(404).send(error);
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const tgtAuthor = req.params.author;
  const allBooks = Object.values(books);

  const myPromise = new Promise((resolve,reject) => {
    const result = allBooks.filter((book) => {
      return book.author === tgtAuthor;
    })
  
    if(result.length > 0){
      resolve(result);
    }else{
      reject("Book with author " + tgtAuthor + " not exist");
    }
  });
    
  myPromise.then((result) => {
    return res.status(200).send(result);
  },
  (error) => {
    return res.status(404).send(error);
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const allBooks = Object.values(books);

  const myPromise = new Promise((resolve,reject) => {
    const result = allBooks.filter((book) => {
      return book.title === title;
    })

    if(result.length > 0){
      resolve(result);
    }else{
      reject("Book with title " + title + " not exist");
    }
  });
    
  myPromise.then((result) => {
    return res.status(200).send(result);
  },
  (error) => {
    return res.status(404).send(error);
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(books[isbn]){
    return res.status(200).send(books[isbn].reviews);
  }
  return res.status(404).send("Book not exist");
});

module.exports.general = public_users;
