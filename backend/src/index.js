const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/upload');
const analyticsRoutes = require('./routes/analytics');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
// Log incoming requests to help debug "Failed to fetch" issues
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Enable CORS for configured frontend origin. During local development,
// if FRONTEND_ORIGIN is not set, allow all origins to help debugging.
const corsOptions = config.FRONTEND_ORIGIN ? { origin: config.FRONTEND_ORIGIN } : { origin: true };
app.use(cors(corsOptions));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(errorHandler);

const port = config.PORT || 4000;
app.listen(port, () => {
  console.log(`Shopeasy backend running on port ${port}`);
});
