const mysql = require('mysql2');

// Create a connection to the MySQL server
const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD
});

// By default run db and table create
connection.connect(err => {
	if (err) return console.error('Error connecting to the database:', err);
	else console.log('Connected to database');

	// Create the database if it doesn't exist
	connection.query('CREATE DATABASE IF NOT EXISTS coffeeapp', err => {
		if (err) return console.error('Error creating the database:', err);
		else console.log('Database coffeeapp created or already exists');

		// Switch to the coffeeapp database
		connection.query('USE coffeeapp', err => {
			if (err) return console.error('Error switching to the coffeeapp database:', err);
			else console.log('Using "coffeeapp" database');

			// Create the "favourite_coffee" table if it doesn't exist
			const createTableQuery = `
				CREATE TABLE IF NOT EXISTS favourite_coffee (
					id INT PRIMARY KEY AUTO_INCREMENT,
					coffee_name VARCHAR(255) NOT NULL
				)
			`;

			connection.query(createTableQuery, err => {
				if (err) console.error('Error creating the "favourite_coffee" table:', err);
				else console.log('Table "favourite_coffee" created or already exists');
			});
		});
	});
});

function getAllCoffee(callback) {
	connection.query('SELECT * FROM favourite_coffee', (err, results) => {
		if (err) {
			console.error('Error executing the query:', err);
			return callback([]);
		}

		let coffees = {};
		results.forEach(({ coffee_name }) => {
			coffees[coffee_name] = (coffees[coffee_name] || 0) + 1;
		});

		// Return the coffeeeees
		return callback(coffees);
	});
}

async function getFavCoffee(callback) {
	getAllCoffee(coffees => {
		if (Object.keys(coffees).length === 0) return callback('There are no favourite coffees');

		let coffee = '';
		let votes = 0;

		for (const [key, value] of Object.entries(coffees)) {
			if (value > votes) {
				coffee = key;
				votes = value;
			}
		}

		callback(`${coffee} with ${votes} votes`);
	});
}

async function getCoffeeLeaderboard(callback) {
	getAllCoffee(coffees => {
		callback(coffees);
	});
}

function saveFavCoffee(coffee_name, callback) {
	connection.query('INSERT INTO favourite_coffee SET ?', { coffee_name }, err => {
		if (err) {
			console.error('Error executing the query:', err);
			return callback(false);
		} else callback(true);
	});
}

// Connect to the MySQL server
module.exports = {
	getFavCoffee,
	getCoffeeLeaderboard,
	saveFavCoffee
};
