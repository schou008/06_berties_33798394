//Create a new router
const express = require("express")
const router = express.Router()

//bcrypt requirements
const bcrypt = require('bcrypt')
const saltRounds = 10

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    //Retrieves the Plain Password from the Form
    const plainPassword = req.body.password
    //Hash the password before storing it in the database
    try {
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
    if (err) return next(err)

    //Saving data in database
    const sql = 'INSERT INTO users (username, firstName, lastName, email, hashedPassword) VALUES (?, ?, ?, ?, ?)';
    const values = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword];

    db.query(sql, values, function(error, _results) {
    if (error) return next(error);

    // Build result message including plain and hashed password
    let result = 'Hello '+ req.body.first + ' ' + req.body.last +' you are now registered! We will send an email to you at ' + req.body.email;
    result += ' Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
    res.send(result);
  });
});
} catch (error) {
next(error)
}
})

//List all users
router.get('/list', function (req, res, next) {
    const sqlquery = "SELECT username, firstName, lastName, email FROM users";

    db.query(sqlquery, (err, results) => {
        if (err) return next(err);

        //Render listusers.ejs with the user data
        res.render('listusers.ejs', { users: results });
    });
});

//Export the router object so index.js can access it
module.exports = router
