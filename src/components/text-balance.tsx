import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTelegramUser } from "../hooks/useTelegramUser";

const TextBalance = () => {
  const [balance, setBalance] = useState(0);
  const [fetched, setFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const tgUser = useTelegramUser();

  useEffect(() => {
    if (!tgUser?.id) {
      console.log('❗ Пользователь не найден, пропускаем запрос баланса');
      return;
    }

    const fetchBalance = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔄 Запрашиваем баланс для пользователя:', tgUser.id);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/balance/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': tgUser.id.toString(),
          },
        });

        console.log('📡 Ответ сервера:', response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('📊 Данные баланса:', data);

        if (typeof data.balance !== "undefined") {
          setBalance(data.balance);
          setFetched(true);
          console.log('✅ Баланс успешно получен:', data.balance);
        } else {
          console.error('❗ Баланс не найден в ответе:', data);
          setError('Баланс не найден в ответе сервера');
        }
      } catch (err) {
        console.error('❌ Ошибка при получении баланса:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [tgUser]);

  if (loading) {
    return (
      <p className="text-[#8c8b5f] text-base font-normal leading-normal h-5 w-24 bg-gray-200 animate-pulse rounded" />
    );
  }

  if (error) {
    return (
      <p className="text-red-500 text-base font-normal leading-normal">
        Ошибка загрузки баланса
      </p>
    );
  }

  return fetched ? (
    <p className="text-[#8c8b5f] text-base font-normal leading-normal capitalize">
      {t("balance")}: {balance.toLocaleString()} so'm
    </p>
  ) : (
    <p className="text-[#8c8b5f] text-base font-normal leading-normal h-5 w-24 bg-gray-200 animate-pulse rounded" />
  );
};

export default TextBalance;