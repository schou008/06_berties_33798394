# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;

# Password is 'smiths', stored as a bcrypt hash
INSERT INTO users (username, firstName, lastName, email, hashedPassword)
VALUES
('gold', 'Gold', 'User', 'gold@example.com', '$2b$10$ElB7hpK/3pzOOFRdNzBEMOqzrdtN3dDl3l6h93FQIQWIk8vsfGH/q');