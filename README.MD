# Berties Books

In Week 6, I extended my Node.js web application, berties-books, by integrating it with a MySQL database. I started by installing MySQL on my local computer and creating a new database. Then, I set up the tables and inserted some data. I practiced executing SQL statements to explore the schema and the data it contains. After that, I queried the database from my Node.js application to display books. Finally, I installed MySQL on my virtual server and deployed my application, connecting it to the database.

In Week 7, I enhanced my Berties Books Node.js web application by implementing user authentication and password security. I installed the bcrypt module and updated my registration form to include username and password fields. I created a users table in MySQL with columns for username, first name, last name, email, and hashed passwords, and updated my /registered route to hash user passwords before storing them in the database, displaying both the plain and hashed passwords for testing. I then added a /users/list route to view all registered users without showing passwords. Finally, I implemented a login system with /users/login and /users/loggedin routes, which verify a user’s credentials by comparing the submitted password with the hashed password in the database, ensuring that only correct username and password combinations allow login.

## dotenv

To avoid storing sensitive database credentials directly in the source code, I implemented the dotenv module.

How I Implemented it

1.Installed the dotenv package:

npm install dotenv

2.Created a .env file containing the required variables:

BB_USER='berties_books_app'
BB_PASSWORD='qwertyuiop'
BB_DATABASE='berties_books'

3.Updated the database connection file to load environment variables:

require('dotenv').config();

const db = mysql.createPool({
    host: 'localhost',
    user: process.env.BB_USER,
    password: process.env.BB_PASSWORD,
    database: process.env.BB_DATABASE
});

4.Added .env to .gitignore so credentials remain private.

This approach prevents passwords from being exposed in the repository while still allowing the application to run correctly during marking by using the required default environment variable names.

## audit

To improve security, I added an audit logging system to record all login attempts.

How I Implemented it:

1.I created a new table audit_log:

CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100),
    success BOOLEAN NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


2.Every time a user attempts to log in:

I check if the username exists.

I compare the submitted password with the hashed password in the database.

I insert a new record in audit_log marking the attempt as:

success = 1 for successful logins

success = 0 for failed logins

3.I created a new route /users/audit that queries the audit_log table and displays the full login history.

This provides a full audit trail of who logged in, when, and whether each attempt was successful or failed.

## Technologies Used

Node.js - Running the Server with node.js

EJS (Embedded JavaScript Templates) – Templating engine used to generate dynamic HTML pages

Express Framework - Manages Routing requests

JavaScript - The Programming Language

HTML - Displays the Web Application in the Browser

CSS – Used to style the webpages

SQL - Used to Interact with Databases

bcrypt - Password Hashing

## How to Install and Run Locally

1. Clone the Repository You can clone the repository by typing the command below: git clone https://github.com/schou008/06_berties_33798394 cd 06_berties_33798394

2. Install Node.js if you have not, you can do this from nodejs.org. 
If you have already installed Node.js you can skip this step

3. Install the Express Framework, you can do this by typing in the command below: npm install express
If you already have the express framework then you can skip this step

4. Install the EJS Package, you can do this by typing in the command below: npm install ejs 
If you already have the EJS package then you can skip this step

5. run npm install mysql2

6. run npm install bcrypt

7. run npm install dotenv

8. run npm install express-session 

9. Run the Web Application You can run the web application by typing the command below: node index.js

10. Open your Browser Type in http://localhost:8000 in the search bar, you should see the web application

## Versions

1.0 Initial Version of the Web Application

1.1 Added README.md file

1.2 Added information about the web application such as what it is about, what technologies used, explaining how to run and use the app to the README.md file

1.3 Added comments to main.js file, about.ejs file, index.ejs file, register.ejs file and search.ejs file so it is more clear and understandable

1.4 Added links.txt file

1.5 Added code to users.js file, register.ejs file and create_db.sql file to allow password hashing

1.6 Added code to users.js and created a new file called listusers.ejs so that user detail is visible such as username, first name, last name and email

1.7 Added code to users.js and created new file called login.ejs

1.8 Added .env file to create a enviroment for data

1.9 Added dotenv section in the README.md file

2.0 Added code to users.js and created audit.ejs file for user logging

2.1 Added audit section in the README.md file

2.2 Added code to insert_text_data.sql

2.3 Added more information about the app covering Week 7

2.4 Added code to index.js and users.js to allow a redirectLogin function