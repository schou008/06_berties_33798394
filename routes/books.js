const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');

//Redirect middleware
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/users/login');
    } else {
        next();
    }
}

router.get('/search', function(req, res, next){
    res.render("search.ejs")
});

//Search for books
router.get('/search-result', function (req, res, next) {
    const keyword = req.query.keyword;
    if (!keyword) return res.send("Please enter a search keyword.");

    const sqlquery = "SELECT name, price FROM books WHERE name LIKE ?";
    db.query(sqlquery, [`%${keyword}%`], (err, result) => {
        if (err) return next(err);
        res.render('search-result', { books: result, keyword: keyword });
    });
});

//Route to display all books
router.get('/list', function(req, res, next) {
    const sqlquery = "SELECT * FROM books";
    db.query(sqlquery, (err, result) => {
        if (err) return next(err);
        res.render("list.ejs", { availableBooks: result });
    });
});

//Shows the Add Book form
router.get('/addbook', redirectLogin, (req, res) => {
    res.render("addbook.ejs", { errors: [], body: {} });
});

//Handle Add Book submission with validation and sanitisation
router.post('/bookadded', 
    redirectLogin,
    [
        check('name')
            .notEmpty().withMessage("Book name cannot be empty.")
            .isLength({ min: 2 }).withMessage("Book name must be at least 2 characters long."),
        check('price')
            .notEmpty().withMessage("Price cannot be empty.")
            .isFloat({ gt: 0 }).withMessage("Price must be a positive number.")
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('addbook', { errors: errors.array(), body: req.body });
        }

        //Sanitize book name to prevent XSS
        const bookName = req.sanitize(req.body.name);
        const price = req.body.price; // Numeric, no sanitization needed

        const sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
        const newrecord = [bookName, price];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) return next(err);
            res.send('This book is added to database. Name: '+ bookName + ', Price: £' + price +
                     ' <a href="/books/list">View Books</a>');
        });
    }
);

// Route to display bargain books (price < £20)
router.get('/bargainbooks', (req, res, next) => {
    const sqlquery = "SELECT name, price FROM books WHERE price < 20";
    db.query(sqlquery, (err, result) => {
        if (err) return next(err);
        res.render('bargainbooks', { bargainBooks: result });
    });
});

module.exports = router;