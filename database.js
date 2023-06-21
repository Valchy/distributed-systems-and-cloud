const mysql = require('mysql2');

// Create a connection to the MySQL server
const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

// Connect to the MySQL server
module.exports = () =>
	connection.connect(err => {
		if (err) {
			console.error('Error connecting to the database:', err);
			return;
		}
		console.log('Connected to the database');

		// Create the database if it doesn't exist
		connection.query('CREATE DATABASE IF NOT EXISTS coffee-app', err => {
			if (err) {
				console.error('Error creating the database:', err);
				connection.end();
				return;
			}
			console.log('Database "coffee-app" created or already exists');

			// Switch to the coffee-app database
			connection.query('USE coffee-app', err => {
				if (err) {
					console.error('Error switching to the "coffee-app" database:', err);
					connection.end();
					return;
				}
				console.log('Using "coffee-app" database');

				// Create the "favourite_drinks" table if it doesn't exist
				const createTableQuery = `
				CREATE TABLE IF NOT EXISTS favourite_drinks (
					id INT PRIMARY KEY AUTO_INCREMENT,
					drink_name VARCHAR(255) NOT NULL,
					rating INT NOT NULL
				)
			`;
				connection.query(createTableQuery, err => {
					if (err) {
						console.error('Error creating the "favourite_drinks" table:', err);
					} else {
						console.log('Table "favourite_drinks" created or already exists');
					}

					// Close the database connection
					connection.end();
				});
			});
		});
	});
