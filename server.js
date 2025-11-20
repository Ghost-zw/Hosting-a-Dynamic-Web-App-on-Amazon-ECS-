const express = require('express');
//const mysql = require('mysql2');
const app = express();

// Serve frontend files
app.use(express.static('public'));
app.use(express.json());

// Connect to RDS

const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'database-1.ccvw48c4oye3.us-east-1.rds.amazonaws.com',
  port: process.env.DB_PORT || 3306, 
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'Tanaka!234#',
  database: process.env.DB_NAME || 'mydb'

});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to RDS!');
});

app.post('/Bookings', (req, res) => {
  const { booking_id, car_type, pickup_location, dropoff_location, pickup_date, pickup_time, dropoff_date, dropoff_time, created_at } = req.body;
  const query = 'INSERT INTO Bookings (booking_id, car_type, pickup_location, dropoff_location, pickup_date, pickup_time, dropoff_date, dropoff_time, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [booking_id, car_type, pickup_location, dropoff_location, pickup_date, pickup_time, dropoff_date, dropoff_time, created_at], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ booking_id: result.insertId });
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
