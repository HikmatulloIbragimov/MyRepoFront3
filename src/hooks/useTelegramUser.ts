import { useEffect, useState } from "react";

export const useTelegramUser = () => {
  const [user, setUser] = useState<null | { id: number }>(null);

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

    if (tgUser?.id) {
      sessionStorage.setItem("tgUserId", tgUser.id.toString());
      sessionStorage.setItem("tgUser", JSON.stringify(tgUser));
      setUser(tgUser);
    } else {
      const stored = sessionStorage.getItem("tgUser");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        } catch (e) {
          console.warn("tgUser session parse error");
        }
      }
    }
  }, []);

  return user;
};
