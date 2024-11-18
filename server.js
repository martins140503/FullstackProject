// Import required modules
const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');

// Create an Express application
const app = express();

// MongoDB Atlas connection
const MONGO_URI = 'mongodb+srv://project2024:project2024@cluster0.dhp5l.mongodb.net/'; // Replace with your MongoDB Atlas URI
const client = new MongoClient(MONGO_URI);

let productsCollection;

// Connect to MongoDB Atlas
(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    const database = client.db('webstore'); // Replace with your database name
    productsCollection = database.collection('products'); // Replace with your collection name
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err);
  }
})();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// API route to fetch all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await productsCollection.find({}).toArray(); // Fetch all products
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Other routes (e.g., /api/orders) can be similarly modified...

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
