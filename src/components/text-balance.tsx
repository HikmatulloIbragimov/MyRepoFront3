import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTelegramUser } from "../hooks/useTelegramUser";

const TextBalance = () => {
  const [balance, setBalance] = useState(0);
  const [fetched, setFetched] = useState(false);
  const { t } = useTranslation();
  const tgUser = useTelegramUser();

  useEffect(() => {
    if (!tgUser?.id) return;

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
  }, [tgUser]);

  return fetched ? (
    <p className="text-[#8c8b5f] text-base font-normal leading-normal capitalize">
      {t("balance")}: {balance} so'm
    </p>
  ) : (
    <p className="text-[#8c8b5f] text-base font-normal leading-normal h-5 w-12 animate-pulse" />
  );
};

export default TextBalance;
