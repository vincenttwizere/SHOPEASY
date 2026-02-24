const db = require('../config/db');

async function getWishlist(req, res, next) {
    try {
        const userId = req.user.id; // Assumes auth middleware populates req.user
        const [rows] = await db.query(
            `SELECT w.product_id, p.name, p.price, p.image_url, p.description 
       FROM wishlists w 
       JOIN products p ON w.product_id = p.id 
       WHERE w.user_id = ?`,
            [userId]
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
}

async function addToWishlist(req, res, next) {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        if (!productId) return res.status(400).json({ message: 'Product ID is required' });

        try {
            await db.query('INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)', [userId, productId]);
            res.status(201).json({ message: 'Added to wishlist' });
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Product already in wishlist' });
            }
            throw err;
        }
    } catch (err) {
        next(err);
    }
}

async function removeFromWishlist(req, res, next) {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;

        await db.query('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?', [userId, productId]);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
