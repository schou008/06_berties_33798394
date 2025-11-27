//Create a new router
const express = require("express")
const router = express.Router()

//Express-Validator
const { check, validationResult } = require('express-validator');

//bcrypt requirements
const bcrypt = require('bcrypt')
const saltRounds = 10

//Redirect middleware
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        //Redirect to the login page
        res.redirect('./login')
    } else {
        //Move to the next middleware function
        next()
    }
}

//Register Form Page
router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

//Registered Handler
router.post('/registered',
    [
        check('email')
            .isEmail()
            .withMessage("Please enter a valid email address. Example #####@#####.com or #####@#####.co.uk"),

        check('username')
            .isLength({ min: 5, max: 20 })
            .withMessage("Username must be between 5 and 20 characters."),

        check('password')
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long."),

        check('first')
            .notEmpty()
            .withMessage("First name cannot be empty."),

        check('last')
            .notEmpty()
            .withMessage("Last name cannot be empty.")
    ],
    function (req, res, next) {

        const errors = validationResult(req);

        //If validation fails return to register page
        if (!errors.isEmpty()) {
            return res.render('register.ejs', { errors: errors.array() });
        }

        //Retrieves the Plain Password from the Form
        const plainPassword = req.body.password

        try {
            bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
                if (err) return next(err)

                //Saving data in database
                const sql = 'INSERT INTO users (username, firstName, lastName, email, hashedPassword) VALUES (?, ?, ?, ?, ?)';
                const values = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword];

                db.query(sql, values, function (error, _results) {
                    if (error) return next(error);

                    //Build result message
                    let result = 'Hello ' + req.body.first + ' ' + req.body.last + ' you are now registered! We will send an email to you at ' + req.body.email;

                    res.send(result);
                });
            });
        } catch (error) {
            next(error)
        }
    }
);
//List All Users
router.get('/list', redirectLogin, function (req, res, next) {
    const sqlquery = "SELECT username, firstName, lastName, email FROM users";

    db.query(sqlquery, (err, results) => {
        if (err) return next(err);

        //Render listusers.ejs with the user data
        res.render('listusers.ejs', { users: results });
    });
});

//Login Form Page
router.get('/login', function(req, res, next) {
    res.render('login.ejs')
})

//Login Handler
router.post('/loggedin', function(req, res, next) {

    const username = req.body.username
    const password = req.body.password

    //Select the hashed password for the user from the database
    const sql = "SELECT hashedPassword FROM users WHERE username = ?"

    db.query(sql, [username], function(err, results) {
        if (err) return next(err)

        //Username not found
        if (results.length === 0) {

            //AUDIT: Record failed login (no such username)
            const auditFail = "INSERT INTO audit_log (username, success) VALUES (?, ?)"
            db.query(auditFail, [username, false])

            return res.send("Login failed: Incorrect username or password.")
        }

        const hashedPassword = results[0].hashedPassword

        //Compare the password supplied with the password retrieved from the database
        bcrypt.compare(password, hashedPassword, function(err, same) {
            if (err) return next(err)

            if (same) {

                //AUDIT: Record successful login
                const auditSuccess = "INSERT INTO audit_log (username, success) VALUES (?, ?)"
                db.query(auditSuccess, [username, true])

                //Save user session
                req.session.userId = req.body.username;

                //Send success message
                return res.send("Login successful! Welcome back, " + username + ".")
            } else {

                //AUDIT: Record failed login (wrong password)
                const auditFail = "INSERT INTO audit_log (username, success) VALUES (?, ?)"
                db.query(auditFail, [username, false])

                //Send failure message
                return res.send("Login failed: Incorrect username or password.")
            }
        })
    })
})

//Audit Log History Page
router.get('/audit', redirectLogin, function (req, res, next) {

    //Retrieve the full audit history
    const sql = "SELECT username, success, timestamp FROM audit_log ORDER BY timestamp DESC"

    db.query(sql, function (err, results) {
        if (err) return next(err)

        //Render audit.ejs with the audit log data
        res.render('audit.ejs', { audit: results })
    })
})

//Export the router object so index.js can access it
module.exports = router
