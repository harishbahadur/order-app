"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaFacebook, FaInstagram, FaEnvelope } from "react-icons/fa";
import styles from "./page.module.css";

const MENU_API_URL = "https://2uo0wskuv5.microcms.io/api/v1/menu";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  comment?: string;
  image?: {
    url: string;
    width: number;
    height: number;
  };
};

type CartItem = MenuItem & { quantity: number };

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);
  const [isPaying, setIsPaying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(MENU_API_URL, {
          headers: {
            "X-API-KEY": process.env.NEXT_PUBLIC_MICROCMS_API_KEY || "",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch menu");
        const data = await res.json();
        setMenu(data.contents);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchMenu();

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {}
    }

    const orderFlag = localStorage.getItem("orderComplete");
    const paid = localStorage.getItem("paidAmount");
    if (orderFlag === "true" && paid) {
      setOrderComplete(true);
      setPaidAmount(Number(paid));
    }
  }, []);

  useEffect(() => {
    if (orderComplete) {
      const timer = setTimeout(() => {
        setOrderComplete(false);
        localStorage.removeItem("orderComplete");
        localStorage.removeItem("paidAmount");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [orderComplete]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.id === id);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((ci) => ci.id !== id);
      }
      return prev.map((ci) =>
        ci.id === id ? { ...ci, quantity: ci.quantity - 1 } : ci
      );
    });
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePayment = () => {
    if (isPaying || cart.length === 0) return;

    setIsPaying(true);

    setTimeout(() => {
      setPaidAmount(totalPrice);
      setCart([]);
      localStorage.removeItem("cart");
      localStorage.setItem("orderComplete", "true");
      localStorage.setItem("paidAmount", totalPrice.toString());
      setOrderComplete(true);
      setIsPaying(false);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <main className={styles.menuList}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 className={styles.title}>Best Nepali Food</h1>
          <div>
            <button
              onClick={() => router.push("/gallery")}
              className={styles.navButton}
            >
              📷 ギャラリー
            </button>
            <button
              onClick={() => router.push("/drinks")}
              className={styles.navButton}
              style={{ marginLeft: "0.5rem" }}
            >
              🍹 ドリンク
            </button>
          </div>
        </div>

        <ul className={styles.list}>
          {menu.map((item) => (
            <li key={item.id} className={styles.item}>
              {item.image && (
                <Image
                  src={item.image.url}
                  alt={item.name}
                  width={item.image.width}
                  height={item.image.height}
                  className={styles.menuImage}
                />
              )}
              <p className={styles.name}>
                {item.name} — {item.price}円
              </p>
              <button
                className={styles.addButton}
                onClick={() => handleAddToCart(item)}
              >
                追加（カート）
              </button>
              {item.comment && <p className={styles.comment}>{item.comment}</p>}
              <hr className={styles.separator} />
            </li>
          ))}
        </ul>

        <Link href="/cart" className={styles.checkoutLink}>
          注文確認へ進む
        </Link>
      </main>

      <aside className={styles.cart}>
        <h2 className={styles.cartTitle}>注文状況</h2>

        {orderComplete ? (
          <p className={styles.thankYou}>
            🎉 ご注文ありがとうございました！ 🎉
            <br />
            🧾 お支払い金額: <strong>{paidAmount}円</strong> 🧾
            <br />
            🍣 またのご来店をお待ちしております！😊🍀
          </p>
        ) : cart.length === 0 ? (
          <p className={styles.empty}>まだ注文はありません。</p>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                {item.image && (
                  <Image
                    src={item.image.url}
                    alt={item.name}
                    width={60}
                    height={60}
                    className={styles.cartImage}
                  />
                )}
                <div>
                  <p className={styles.cartName}>
                    {item.name} — {item.price}円 × {item.quantity}
                  </p>
                  <button
                    className={styles.confirmButton}
                    onClick={() => handleRemoveFromCart(item.id)}
                    style={{
                      marginTop: "0.3rem",
                      padding: "0.2rem 0.5rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    1つ減らす
                  </button>
                </div>
              </div>
            ))}
            <p className={styles.totalPrice}>合計金額: {totalPrice}円</p>
            <button
              className={styles.paymentButton}
              onClick={handlePayment}
              disabled={isPaying}
            >
              {isPaying ? "支払い中..." : "支払い"}
            </button>
          </>
        )}

        <div className={styles.socialButtons}>
          <a
            href="https://www.facebook.com/yourfacebookurl"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
            aria-label="Facebook"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com/yourinstagramurl"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="mailto:youremail@example.com"
            className={styles.socialIcon}
            aria-label="Email"
          >
            <FaEnvelope />
          </a>
        </div>
      </aside>
    </div>
  );
}
