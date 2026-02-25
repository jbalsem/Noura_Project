import { useEffect, useMemo, useState } from "react";

const KEY = "toy_store_cart_v1";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart:changed"));
}

export function useCart() {
  const [items, setItems] = useState(() => readCart());

  useEffect(() => {
    const onChange = () => setItems(readCart());
    window.addEventListener("cart:changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("cart:changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const count = useMemo(
    () => items.reduce((sum, it) => sum + (it.qty || 0), 0),
    [items]
  );

  function add(product) {
    const current = readCart();
    const idx = current.findIndex((x) => x.productId === product._id);

    // store BOTH original price + discountPercent so cart totals stay correct
    const discountPercent = Number(product.discountPercent || 0);
    const unitPrice = Number(product.price);
    const finalUnitPrice = unitPrice * (1 - discountPercent / 100);

    if (idx >= 0) {
      current[idx].qty += 1;
    } else {
      current.push({
        productId: product._id,
        name: product.name,
        image: product.image || null,
        qty: 1,

        // pricing
        price: unitPrice,
        discountPercent,
        finalPrice: finalUnitPrice,
      });
    }

    writeCart(current);
    setItems(current);
  }

  function setQty(productId, qty) {
    const current = readCart()
      .map((x) => (x.productId === productId ? { ...x, qty } : x))
      .filter((x) => x.qty > 0);

    writeCart(current);
    setItems(current);
  }

  function remove(productId) {
    const current = readCart().filter((x) => x.productId !== productId);
    writeCart(current);
    setItems(current);
  }

  function clear() {
    writeCart([]);
    setItems([]);
  }

  return { items, count, add, setQty, remove, clear };
}