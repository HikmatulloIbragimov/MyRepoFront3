import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const TextBalance = () => {
  const [balance, setBalance] = useState(0);
  const [fetched, setFetched] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const { t } = useTranslation();

  // 1. Загружаем tgUser из sessionStorage при первом рендере
  useEffect(() => {
    const stored = sessionStorage.getItem("tgUser");
    if (!stored) {
      alert("❌ tgUser не найден в sessionStorage");
    } else {
      try {
        const decoded = atob(stored);
        alert("✅ tgUser найден:\n" + decoded);
        setUser(stored);
      } catch (err) {
        alert("❌ tgUser найден, но не удалось расшифровать");
      }
    }
  }, []);

  // 2. Отправляем запрос на баланс
  useEffect(() => {
    if (!user) return;

    try {
      alert("📡 Отправка запроса на баланс...");
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
            alert("✅ Баланс получен: " + data.balance + " so'm");
          } else {
            alert("⚠️ Ответ сервера без баланса:\n" + JSON.stringify(data));
          }
        })
        .catch((err) => {
          alert("❌ Ошибка сети:\n" + err.message);
          alert("🌐 API_URL = " + import.meta.env.VITE_API_URL);
        });
    } catch (err) {
      alert("❌ Ошибка при отправке запроса");
    }
    
  }, [user]);

  // 3. UI
  return fetched ? (
    <p className="text-[#8c8b5f] text-base font-normal leading-normal capitalize">
      {t("balance")}: {balance} so'm
    </p>
  ) : (
    <p className="text-[#8c8b5f] text-base font-normal leading-normal h-5 w-12 animate-pulse">
      {/* Идёт загрузка */}
    </p>
  );
};

export default TextBalance;
