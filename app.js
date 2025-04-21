const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const repositoryRoutes = require('./routes/repositoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cors = require('cors');

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/repository', repositoryRoutes);
app.use('/order', orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
