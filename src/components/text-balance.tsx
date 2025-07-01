import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const TextBalance = () => {
  const [balance, setBalance] = useState(0);
  const [fetched, setFetched] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const { t } = useTranslation();
  
  
  // Загружаем tgUser из sessionStorage при первом рендере
  useEffect(() => {
    const stored = sessionStorage.getItem("tgUser");
    if (stored) {
      setUser(stored);
    }
  }, []);

  // Отправляем fetch только если user есть
  useEffect(() => {
    if (!user) return;

    console.log("🔁 Fetching balance with user:", atob(user)); // для отладки

    fetch(import.meta.env.VITE_API_URL + "/api/balance/", {
      headers: {
        "X-User-ID": user,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && typeof data.balance !== "undefined") {
          setBalance(data.balance);
          setFetched(true);
        } else {
          console.error("⚠️ Balance not found in response", data);
        }
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
      });
  }, [user]);

  return fetched ? (
    <p className="text-[#8c8b5f] text-base font-normal leading-normal capitalize">
      {t("balance")}: {balance} so'm
    </p>
  ) : (
    <p className="text-[#8c8b5f] text-base font-normal leading-normal h-5 w-12 animate-pulse">
      {/* Показать, что идёт загрузка */}
    </p>
  );
};

export default TextBalance;
