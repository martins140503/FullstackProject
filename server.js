// Import required modules
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');

// Create an Express application
const app = express();

app.use(express.json())

// MongoDB Atlas connection
const MONGO_URI = 'mongodb+srv://project2024:project2024@cluster0.dhp5l.mongodb.net/'; // Replace with your MongoDB Atlas URI
const client = new MongoClient(MONGO_URI);

let productsCollection;
let ordersCollection;

// Connect to MongoDB Atlas
(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    const database = client.db('webstore'); // Replace with your database name
    productsCollection = database.collection('products'); // Replace with your collection name
    ordersCollection = database.collection('orders'); // Replace with your collection name
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err);
  }
})();

// Define the file path to store orders
const ordersFilePath = path.join(__dirname, 'orders.json');


app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;
    console.log('Received order:', order); // Log the incoming order for debugging

    if (!order.customer || !order.items || !order.total) {
      console.error('Invalid order data:', order);
      return res.status(400).json({ success: false, message: 'Invalid order data' });
    }

    // let orders = [];
    // if (fs.existsSync(ordersFilePath)) {
    //   const fileData = fs.readFileSync(ordersFilePath, 'utf-8');
    //   orders = JSON.parse(fileData);
    // }

    // orders.push(order);

    // fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf-8');
    ordersCollection.insertOne(order);
    res.json({ success: true, message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});

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
