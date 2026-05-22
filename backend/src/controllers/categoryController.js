const categories = [
  {
    id: 1,
    name: 'Electronics',
    description: 'Phones, laptops, gadgets and accessories',
    image_url: '/uploads/categories/Electronics.jpg',
  },
  {
    id: 2,
    name: 'Fashion',
    description: 'Clothing, shoes and trending outfits',
    image_url: '/uploads/categories/Fashion.jpg',
  },
  {
    id: 3,
    name: 'Accessories',
    description: 'Bags, watches, and lifestyle accessories',
    image_url: '/uploads/categories/Accessories.jpg',
  },
  {
    id: 4,
    name: 'Home & Living',
    description: 'Furniture, kitchen and home essentials',
    image_url: '/uploads/categories/Home and living.jpg',
  },
];

async function list(req, res, next) {
  try {
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

module.exports = { list };