const {Client} = require("pg")
const  { drizzle } = require('drizzle-orm/node-postgres')

const client = new Client({
	user: "postgres",
	password: '351885',
	host: 'localhost',
	port: 5432,
	database: 'Appointments',
});

const db = drizzle(client)

const connectDB =()=>{
    client.connect()
        .then(() => {
            console.log('Connected to PostgreSQL database');
        })
        .catch((err) => {
            console.error('Error connecting to PostgreSQL database', err);
        });
}

module.exports = {connectDB, db}

