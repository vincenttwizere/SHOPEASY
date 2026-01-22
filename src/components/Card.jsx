
import {
  Truck,
  RefreshCcw,
  ShieldCheck,
  BadgeCheck,
  Tv,
  ShoppingBag,
  Home,
  Heart,
} from "lucide-react";

// Map icon strings to icon components
const iconMap = {
  // Original icons
  shipping: Truck,
  returns: RefreshCcw,
  payment: ShieldCheck,
  quality: BadgeCheck,

  // New category icons
  Electronics: Tv,
  Fashion: ShoppingBag,
  "Home & Kitchen": Home,
  "Beauty & Health": Heart,
};

// Define which icons should show the Browse button
const showButtonFor = ["Electronics", "Fashion", "Home & Kitchen", "Beauty & Health"];

const Card = ({ title, description, icon }) => {
  const Icon = iconMap[icon];

  if (!Icon) {
    console.error(`Invalid icon prop: "${icon}"`);
    return null;
  }

  return (
    <div className="card">
      <div className="card-icon">
        <Icon size={28} />
      </div>

      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>

      {showButtonFor.includes(icon) && (
        <button className="card-button">Browse</button>
      )}
    </div>
  );
};

export default Card;
