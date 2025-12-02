"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type CartItem = {
  id: string;
  name: string;
  price: number;
  comment?: string;
  quantity: number;
  image?: { url: string; width: number; height: number };
};

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CartItem[];
        setCart(Array.isArray(parsed) ? parsed : []);
      } catch {
        setCart([]);
      }
    }
  }, []);

  const updateCart = (next: CartItem[]) => {
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const removeAt = (index: number) => {
    const next = cart.filter((_, i) => i !== index);
    updateCart(next);
  };

  const changeQty = (index: number, delta: number) => {
    const next = cart.map((item, i) =>
      i === index
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
        : item
    );
    updateCart(next);
  };

  const clearCart = () => {
    if (confirm("本当にすべての注文をキャンセルしますか？")) {
      setCart([]);
      localStorage.removeItem("cart");
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handlePayment = () => {
    if (cart.length === 0) {
      alert("カートが空です。");
      return;
    }
    // Fake payment then clear + notify home page banner
    localStorage.setItem("orderComplete", "true");
    localStorage.setItem("paidAmount", String(total));
    setCart([]);
    localStorage.removeItem("cart");
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>カート内容</h1>

      {cart.length === 0 ? (
        <>
          <p className={styles.empty}>カートに商品がありません。</p>
          <Link href="/" className={styles.backLink}>
            ← メニューに戻る
          </Link>
        </>
      ) : (
        <>
          <ul className={styles.cartList}>
            {cart.map((item, index) => (
              <li key={item.id + index} className={styles.cartItem}>
                {item.image ? (
                  <Image
                    src={item.image.url}
                    alt={item.name}
                    width={80}
                    height={60}
                    className={styles.image}
                  />
                ) : (
                  <div
                    style={{
                      width: 80,
                      height: 60,
                      background: "#eee",
                      borderRadius: 6,
                    }}
                  />
                )}
                <div className={styles.info}>
                  <p>{item.name}</p>
                  <p>
                    {item.price}円 × {item.quantity || 1}
                  </p>
                </div>
                <div className={styles.controls}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => changeQty(index, -1)}
                  >
                    -
                  </button>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => changeQty(index, 1)}
                  >
                    +
                  </button>
                  <button
                    className={styles.removeButton}
                    onClick={() => removeAt(index)}
                  >
                    ✕ 削除
                  </button>
                </div>
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

          <Link href="/" className={styles.backLink}>
            ← メニューに戻る
          </Link>
        </>
      )}
    </div>
  );
}
