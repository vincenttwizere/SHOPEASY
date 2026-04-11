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
const paymentRoutes = require('./routes/payment');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
// Log incoming requests to help debug "Failed to fetch" issues
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Enable CORS for configured frontend origin. During local development,
// accept any localhost port to support Vite's dynamic port allocation.
let corsOptions;
if (process.env.NODE_ENV === 'production') {
  corsOptions = { origin: config.FRONTEND_ORIGIN };
} else {
  corsOptions = {
    origin: (origin, callback) => {
      // Allow localhost with any port for development
      if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    }
  };
}
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
app.use('/api/wishlist', require('./routes/wishlists'));
app.use('/api/payment', paymentRoutes);

app.use(errorHandler);

const port = config.PORT || 4000;
app.listen(port, () => {
  console.log(`Shopeasy backend running on port ${port}`);
});
