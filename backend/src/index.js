const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(cors({ origin: config.FRONTEND_ORIGIN }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorHandler);

const port = config.PORT || 4000;
app.listen(port, () => {
  console.log(`Shopeasy backend running on port ${port}`);
});
