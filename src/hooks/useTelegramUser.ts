import { useState, useEffect } from 'react';
import type { TelegramUser } from '../types/telegram';

export const useTelegramUser = (): TelegramUser | null => {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    // Функция для получения пользователя из Telegram WebApp
    const getTelegramUser = (): TelegramUser | null => {
      try {
        // Сначала пытаемся получить из Telegram WebApp
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
          const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
          console.log('✅ Получен пользователь из Telegram WebApp:', tgUser);
          return tgUser;
        }

        // Если не получилось, пытаемся получить из sessionStorage
        const storedUser = sessionStorage.getItem('tgUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('✅ Получен пользователь из sessionStorage:', parsedUser);
          return parsedUser;
        }

        // Для разработки - создаем тестового пользователя
        if (import.meta.env.DEV) {
          const testUser: TelegramUser = {
            id: 123456789,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser',
            language_code: 'en'
          };
          console.log('🔧 Используется тестовый пользователь для разработки:', testUser);
          return testUser;
        }

        console.warn('❗ Пользователь Telegram не найден');
        return null;
      } catch (error) {
        console.error('❌ Ошибка при получении пользователя Telegram:', error);
        return null;
      }
    };

    // Инициализация Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }

    const telegramUser = getTelegramUser();
    setUser(telegramUser);

    // Сохраняем пользователя в sessionStorage если получили из WebApp
    if (telegramUser && window.Telegram?.WebApp?.initDataUnsafe?.user) {
      sessionStorage.setItem('tgUser', JSON.stringify(telegramUser));
      sessionStorage.setItem('tgUserId', telegramUser.id.toString());
    }
  }, []);

  return user;
};