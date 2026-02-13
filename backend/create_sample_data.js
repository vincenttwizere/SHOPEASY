const db = require('./src/config/db');

async function createSampleData() {
    try {
        console.log('Creating sample order data for analytics...');

        // Get existing products and users
        const [products] = await db.query('SELECT id FROM products LIMIT 5');
        const [users] = await db.query('SELECT id FROM users WHERE role = "customer" LIMIT 3');

        if (products.length === 0) {
            console.log('⚠️  No products found. Please add products first.');
            return;
        }

        if (users.length === 0) {
            console.log('⚠️  No customer users found. Creating a sample customer...');
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash('customer123', 10);
            const [result] = await db.query(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                ['Sample Customer', 'customer@test.com', hashedPassword, 'customer']
            );
            users.push({ id: result.insertId });
        }

        // Create sample orders over the last 7 days
        const statuses = ['pending', 'shipped', 'delivered'];
        let ordersCreated = 0;

        for (let i = 0; i < 15; i++) {
            const userId = users[Math.floor(Math.random() * users.length)].id;
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const daysAgo = Math.floor(Math.random() * 7);
            const createdAt = new Date();
            createdAt.setDate(createdAt.getDate() - daysAgo);

            // Calculate total
            const numItems = Math.floor(Math.random() * 3) + 1;
            let total = 0;
            const orderItems = [];

            for (let j = 0; j < numItems; j++) {
                const product = products[Math.floor(Math.random() * products.length)];
                const quantity = Math.floor(Math.random() * 3) + 1;
                const price = (Math.random() * 50 + 10).toFixed(2);
                total += parseFloat(price) * quantity;
                orderItems.push({ product_id: product.id, quantity, price });
            }

            // Insert order
            const [orderResult] = await db.query(
                'INSERT INTO orders (user_id, total, status, created_at) VALUES (?, ?, ?, ?)',
                [userId, total.toFixed(2), status, createdAt]
            );

            // Insert order items
            for (const item of orderItems) {
                await db.query(
                    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderResult.insertId, item.product_id, item.quantity, item.price]
                );
            }

            ordersCreated++;
        }

        console.log(`✅ Created ${ordersCreated} sample orders with items`);
        console.log('📊 Analytics dashboard should now show data!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error creating sample data:', err.message);
        process.exit(1);
    }
}

createSampleData();
