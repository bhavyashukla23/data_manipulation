const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Password@123',
  database: 'data_manipulation'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.use(bodyParser.json());


//to add data into db
app.post('/api/add', (req, res) => {
  const { data } = req.body;
  db.query('INSERT INTO components (data) VALUES (?)', [data], (err, result) => {
    if (err) {
      console.error('Error adding data to MySQL:', err);
      res.status(500).json({ message: 'Error adding data' });
      return;
    }
    
    res.json({ message: 'Data added successfully' });
  });
});


//to update already existing data
app.put('/api/update', (req, res) => {
    const { id, data } = req.body;
    db.query('SELECT * FROM components WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error('Error checking if ID exists:', err);
        res.status(500).json({ message: 'Error updating data' });
        return;
      }

      if (result.length === 0) {
        res.status(404).json({ message: 'ID does not exist' });
        return;
      }

      db.query('UPDATE components SET data = ? , isUpdated = 1 WHERE id = ?', [data, id], (err, result) => {
        if (err) {
          console.error('Error updating data in MySQL:', err);
          res.status(500).json({ message: 'Error updating data' });
          return;
        }
        res.json({ message: 'Data updated successfully' });
      });
    });
});



//to count both the number of times data added and updated
// app.get('/api/count', (req, res) => {
//   res.json({ add: addCount, update: updateCount });
// });
app.get('/api/count', (req, res) => {
    db.query('SELECT COUNT(*) AS idCount FROM components', (err, result) => {
      if (err) {
        console.error('Error counting IDs:', err);
        res.status(500).json({ message: 'Error counting IDs' });
        return;
      }
  
      db.query('SELECT COUNT(*) AS updatedCount FROM components WHERE isUpdated = 1', (err, result2) => {
        if (err) {
          console.error('Error counting updated rows:', err);
          res.status(500).json({ message: 'Error counting updated rows' });
          return;
        }
  
        const addCount = result[0].idCount;
        const updatedCount = result2[0].updatedCount;
  
        res.json({ add: addCount, update: updatedCount });
      });
    });
  });
  
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
