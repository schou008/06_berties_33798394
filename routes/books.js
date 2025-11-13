//Create a new router
const express = require("express")
const router = express.Router()

router.get('/search', function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    //Searching in the database
    res.send("You searched for: " + req.query.keyword)
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

//Export the router object so index.js can access it
module.exports = router

