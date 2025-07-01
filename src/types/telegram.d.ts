export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData?: string;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
          };
        };
        ready?: () => void;
        close?: () => void;
        expand?: () => void;
        sendData?: (data: string) => void;
        version?: string;
        isExpanded?: boolean;
        viewportHeight?: number;
      };
    };
  }
}
