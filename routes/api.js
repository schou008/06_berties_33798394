//Create a new router
const express = require('express');
const router = express.Router();

//API route to get books with search, price range, and sorting
router.get('/books', function (req, res, next) {
    // Get query parameters
    const searchTerm = req.query.search;
    const minPrice = parseFloat(req.query.minprice);
    const maxPrice = parseFloat(req.query.maxprice);
    const sortBy = req.query.sort;

    //Base SQL
    let sqlquery = "SELECT * FROM books WHERE 1=1";
    let params = [];

    //Add search term filter
    if (searchTerm) {
        sqlquery += " AND name LIKE ?";
        params.push(`%${searchTerm}%`);
    }

    //Add minimum price filter
    if (!isNaN(minPrice)) {
        sqlquery += " AND price >= ?";
        params.push(minPrice);
    }

    //Add maximum price filter
    if (!isNaN(maxPrice)) {
        sqlquery += " AND price <= ?";
        params.push(maxPrice);
    }

    //Add sorting
    if (sortBy === 'name') {
        sqlquery += " ORDER BY name ASC";
    } else if (sortBy === 'price') {
        sqlquery += " ORDER BY price ASC";
    }

    //Execute the SQL query
    db.query(sqlquery, params, (err, result) => {
        if (err) {
            res.json({ error: err });
            return next(err);
        } else {
            res.json(result);
        }
    });
});

module.exports = router;