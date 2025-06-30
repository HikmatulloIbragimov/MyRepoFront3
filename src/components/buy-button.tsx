import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  handleBuyClick: () => void;
}

export const BuyButton = ({ handleBuyClick }: Props) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const { t } = useTranslation()

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      handleBuyClick();
    }, 200);
  };

  return (
    <div className="flex items-center justify-center">
      <button
        className={`relative flex items-center cursor-pointer select-none transition-all duration-300 overflow-hidden
          ${isAnimating ? 'scale-105 shadow-2xl' : 'hover:scale-102 hover:shadow-lg'}
          bg-gradient-to-r to-amber-700 from-black  blur-[0.5px]
          p-1 px-2 rounded-xl gap-4`}
        onClick={handleClick}
        style={{
          background: isAnimating 
            ? 'linear-gradient(-45deg, #1e1b4b, #312e81, #1e3a8a, #1e1b4b)' 
            : undefined,
          backgroundSize: isAnimating ? '400% 400%' : undefined,
          animation: isAnimating ? 'gradientShift 0.8s ease-in-out' : undefined
        }}
      >
        {/* Epic lightning with multiple bolts */}
        <div className="relative w-6 h-7">
          {/* Main lightning bolt */}
          <svg 
            width="24" 
            height="28" 
            viewBox="0 0 24 28" 
            className={`relative z-10 ${isAnimating ? 'animate-pulse' : ''}`}
          >
            {/* Multiple lightning paths for more dramatic effect */}
            <path
              d="M12 0 L7 10 L10 10 L5 28 L17 8 L13 8 L12 0 Z"
              fill="url(#lightning-gradient)"
              className="drop-shadow-lg"
              style={{
                filter: isAnimating 
                  ? 'drop-shadow(0 0 15px #60a5fa) drop-shadow(0 0 25px #3b82f6) brightness(1.5)' 
                  : 'drop-shadow(0 0 3px #60a5fa)'
              }}
            />
            {/* Secondary bolt for more complexity */}
            <path
              d="M12 0 L9 8 L11 8 L7 20 L15 6 L12 6 L12 0 Z"
              fill="url(#lightning-gradient-2)"
              opacity={isAnimating ? "0.7" : "0.3"}
              className="drop-shadow-md"
            />
            
            <defs>
              <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#60a5fa" />
                <stop offset="70%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient id="lightning-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Epic glow effects */}
          {isAnimating && (
            <>
              {/* Intense center glow */}
              <div className="absolute inset-0 bg-white opacity-80 blur-sm rounded-lg animate-ping" />
              {/* Medium glow */}
              <div className="absolute inset-0 bg-blue-400 opacity-60 blur-md rounded-lg animate-pulse" 
                   style={{ animationDelay: '0.1s' }} />
              {/* Outer glow */}
              <div className="absolute inset-0 bg-blue-500 opacity-40 blur-lg rounded-xl animate-pulse" 
                   style={{ animationDelay: '0.2s' }} />
              {/* Massive outer glow */}
              <div className="absolute -inset-2 bg-blue-600 opacity-20 blur-xl rounded-2xl animate-pulse" 
                   style={{ animationDelay: '0.3s' }} />
            </>
          )}
        </div>

        {/* Text with glow effect */}
        <div className={`text-lg font-bold transition-all duration-300 
          ${isAnimating ? 'text-white drop-shadow-lg' : 'text-blue-100'}`}
          style={{
            textShadow: isAnimating ? '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(96,165,250,0.6)' : undefined
          }}
        >
          {t(`game.buy_button`)}
        </div>

        {/* Screen flash effect */}
        {isAnimating && (
          <>
            <div className="absolute inset-0 bg-white opacity-30 animate-ping rounded-xl" />
            <div className="absolute -inset-4 bg-blue-400 opacity-20 blur-2xl animate-pulse rounded-2xl" />
            {/* Expanding ring effect */}
            <div className="absolute -inset-8 border-2 border-blue-400 opacity-60 rounded-3xl animate-ping" />
          </>
        )}
      </button>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};