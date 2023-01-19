import React from "react";
import { Link } from "react-router-dom";
import "./CartItemsCard.css";
const CartItemsCard = ({ item, deleteCartItems }) => {
  return (
    <div className="carditemscard">
      <img src={item.image} alt="ssa" />
      <div>
        <Link to={`/product/${item.product}`}>{item.name}</Link>
        <span>{`Price: ${item.price}`}</span>
        <p onClick={() => deleteCartItems(item.product)}>Remove</p>
      </div>
    </div>
  );
};

export default CartItemsCard;
