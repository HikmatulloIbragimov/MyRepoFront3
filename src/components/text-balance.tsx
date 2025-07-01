import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const TextBalance = () => {
  const [balance, setBalance] = useState(0);
  const [fetched, setFetched] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const loadUserAndBalance = () => {
      const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
      const isTelegramAvailable = !!window.Telegram?.WebApp;

      alert("Telegram SDK доступен: " + isTelegramAvailable);
      alert("tgUser: " + JSON.stringify(tgUser));

      if (!tgUser?.id) {
        alert("❗ initData.user не найден!");
        return;
      }

      // Сохраняем в sessionStorage
      sessionStorage.setItem("tgUserId", tgUser.id.toString());
      sessionStorage.setItem("tgUser", JSON.stringify(tgUser));

      // Загружаем баланс
      fetch(import.meta.env.VITE_API_URL + "/api/balance/", {
        headers: {
          "X-User-ID": tgUser.id.toString(),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.balance !== "undefined") {
            setBalance(data.balance);
            setFetched(true);
          } else {
            console.error("❗ balance не найден в ответе:", data);
          }
        })
        .catch((err) => {
          console.error("❗ Ошибка запроса:", err);
        });
    };

    // Если Telegram WebApp загружен — вызываем
    if (document.readyState === "complete") {
      setTimeout(loadUserAndBalance, 300); // задержка на инициализацию
    } else {
      window.addEventListener("load", () =>
        setTimeout(loadUserAndBalance, 300)
      );
    }
  }, []);

  return fetched ? (
    <p className="text-[#8c8b5f] text-base font-normal leading-normal capitalize">
      {t("balance")}: {balance} so'm
    </p>
  ) : (
    <p className="text-[#8c8b5f] text-base font-normal leading-normal h-5 w-12 animate-pulse" />
  );
};

export default TextBalance;
