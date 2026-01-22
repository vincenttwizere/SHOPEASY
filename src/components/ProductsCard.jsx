
const ProductsCard = ({ name, price, category, image }) => {

    return (
        <div className="product-card">
            <h1>{name}</h1>
            <p>{price}</p>
            <p>{category}</p>
            <img src={image} alt={name} />
        </div>
    );
}

export default ProductsCard;