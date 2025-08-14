"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  comment?: string;
  image?: { url: string; width: number; height: number };
};

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<MenuItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  // 🗑 Remove one item from cart
  const removeItem = (indexToRemove: number) => {
    const updated = cart.filter((_, index) => index !== indexToRemove);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // 🧹 Clear all cart
  const clearCart = () => {
    if (confirm("本当にすべての注文をキャンセルしますか？")) {
      setCart([]);
      localStorage.removeItem("cart");
    }
  };

  // 💰 Fake payment
  const handlePayment = () => {
    if (cart.length === 0) {
      alert("カートが空です。");
      return;
    }
    alert("お支払いが完了しました。ありがとうございます！");
    setCart([]);
    localStorage.removeItem("cart");
    router.push("/"); // Go to home or thank you page
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>カート内容</h1>

      {cart.length === 0 ? (
        <p className={styles.empty}>カートに商品がありません。</p>
      ) : (
        <>
          <ul className={styles.cartList}>
            {cart.map((item, index) => (
              <li key={index} className={styles.cartItem}>
                {item.image && (
                  <Image
                    src={item.image.url}
                    alt={item.name}
                    width={80}
                    height={60}
                    className={styles.image}
                  />
                )}
                <div className={styles.info}>
                  <p>{item.name}</p>
                  <p>{item.price}円</p>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => removeItem(index)}
                >
                  ✕ 削除
                </button>
              </li>
            ))}
          </ul>

          <p className={styles.total}>合計: {total}円</p>

          <div className={styles.actions}>
            <button className={styles.clearButton} onClick={clearCart}>
              全てキャンセル
            </button>
            <button className={styles.payButton} onClick={handlePayment}>
              支払い
            </button>
          </div>
        </>
      )}
    </div>
  );
}
