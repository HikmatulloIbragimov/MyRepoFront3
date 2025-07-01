import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTelegramUser } from "../hooks/useTelegramUser";

const HomeBalance = () => {
  const [balance, setBalance] = useState(0);
  const [fetched, setFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

        if (data && typeof data.balance !== "undefined") {
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
      <div className="bg-orange-300 select-none rounded-md animate-pulse">
        <div className="flex p-1 pl-2 gap-2 items-center">
          <div className="flex flex-row sm:flex-col text-sm font-bold items-end gap-1 select-none w-16 h-7 bg-orange-200 rounded" />
          <div className="rounded-md bg-orange-400 p-1 h-7 w-7" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-300 select-none rounded-md">
        <div className="flex p-1 pl-2 gap-2 items-center">
          <div className="flex flex-row sm:flex-col text-sm font-bold items-end gap-1 select-none">
            <div className="text-xs leading-5">Ошибка</div>
          </div>
          <div className="rounded-md bg-red-400 p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return fetched ? (
    <Link to="/replenish" className="bg-orange-300 select-none rounded-md hover:bg-orange-400 transition-colors">
      <div className="flex p-1 pl-2 gap-2 items-center">
        <div className="flex flex-row sm:flex-col text-sm font-bold items-end gap-1 select-none">
          <div className="text-base leading-5">{balance.toLocaleString()}</div> so'm
        </div>
        <div className="rounded-md bg-orange-400 p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
      </div>
    </Link>
  ) : (
    <div className="bg-orange-300 select-none rounded-md animate-pulse">
      <div className="flex p-1 pl-2 gap-2 items-center">
        <div className="flex flex-row sm:flex-col text-sm font-bold items-end gap-1 select-none w-16 h-7" />
        <div className="rounded-md bg-orange-400 p-1 h-7 w-7" />
      </div>
    </div>
  );
};

export default HomeBalance;