//Create a new router
const express = require("express")
const router = express.Router()

router.get('/search', function(req, res, next){
    res.render("search.ejs")
});

//Search for books
router.get('/search-result', function (req, res, next) {
    const keyword = req.query.keyword;

    if (!keyword) {
        return res.send("Please enter a search keyword.");
    }

    //Advanced search
    const sqlquery = "SELECT name, price FROM books WHERE name LIKE ?";
    
    db.query(sqlquery, [`%${keyword}%`], (err, result) => {
        if (err) return next(err);

        //Render search results using EJS template
        res.render('search-result', { books: result, keyword: keyword });
    });
});

//Route to display all books
router.get('/list', function(req, res, next) {
    //Query database to get all the books
    const sqlquery = "SELECT * FROM books";

    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err);
        }
        //Render the result using EJS template
        res.render("list.ejs", { availableBooks: result });
    });
});

//Shows the Add Book form
router.get('/addbook', (req, res) => {
    res.render('addbook'); // renders addbook.ejs
});

//Handles form submission and save book to database
router.post('/bookadded', function (req, res, next) {
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
    let newrecord = [req.body.name, req.body.price];

    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.send('This book is added to database. Name: '+ req.body.name + ', Price: $' + req.body.price);
        }
    });
});

// Route to display bargain books (price < £20)
router.get('/bargainbooks', (req, res, next) => {
    const sqlquery = "SELECT name, price FROM books WHERE price < 20";

    db.query(sqlquery, (err, result) => {
        if (err) return next(err);

        // Render a new EJS template (bargainbooks.ejs) with the result
        res.render('bargainbooks', { bargainBooks: result });
    });
});

//Export the router object so index.js can access it
module.exports = router

