import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const TextBalance = () => {
  const [balance, setBalance] = useState(0);
  const [fetched, setFetched] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

    if (tgUser?.id) {
      sessionStorage.setItem("tgUserId", tgUser.id.toString());
      sessionStorage.setItem("tgUser", JSON.stringify(tgUser));
    } else {
      console.warn("Telegram user not found");
    }

    const userId = tgUser?.id?.toString() || sessionStorage.getItem("tgUserId");

    if (!userId) return;

    fetch(import.meta.env.VITE_API_URL + "/api/balance/", {
      headers: {
        "X-User-ID": userId,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && typeof data.balance !== "undefined") {
          setBalance(data.balance);
          setFetched(true);
        } else {
          console.error("Balance not found in response", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching balance:", error);
      });
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
