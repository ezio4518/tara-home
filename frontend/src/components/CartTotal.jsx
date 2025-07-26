import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, coin, getCartAmount } = useContext(ShopContext);

  const subtotal = getCartAmount();
  const discount = Math.min(subtotal + delivery_fee, coin);
  const total = subtotal + delivery_fee - discount;

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div
        className="flex flex-col gap-2 mt-2 text-sm"
        style={{ color: "#40350A" }}
      >
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency} {subtotal}.00
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Discount</p>
          <p>
            - {currency} {discount}.00
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency} {delivery_fee}.00
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {currency}{" "}
            {total < 0 ? 0 : total}.00
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;