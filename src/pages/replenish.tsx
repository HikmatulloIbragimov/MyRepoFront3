import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Link } from "@tanstack/react-router";

import { Route } from "../routes/__root";
import TextBalance from "../components/text-balance";

interface AppData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  games: any[];
  cards: Array<{
    number: string;
    cardholder_name: string;
  }>;
}

export const Replenish = () => {
  const { t } = useTranslation();
  const { data } = Route.useLoaderData() as { data: AppData };

  const user = sessionStorage.getItem("tgUser");

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  

  const handleCopy = (number: string, index: number) => {
    navigator.clipboard.writeText(number.replace(/\s/g, ''))
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1500)
  }


  return (
    <div className="bg-white">
      <div className="flex items-center p-2 px-4 justify-between">
        <Link
          to="/"
          className="text-[#181811] flex size-12 shrink-0 items-center"
          data-icon="ArrowLeft"
          data-size="24px"
          data-weight="regular"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
          </svg>
        </Link>
        <h2 className="text-[#181811] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          {t("replenish.title")}
        </h2>
      </div>
      <div className="flex items-start justify-between w-full py-4 @xl:px-4 px-4 mb-4">
        <div className="flex w-full grow flex-col items-stretch">
          <p className="text-[#181811] text-[18px] font-bold leading-tight tracking-[-0.015em]">
            {user ? JSON.parse(atob(user)).first_name : ""}
          </p>
          <TextBalance />
        </div>
        <button
          className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#d6d604] text-[#181811] text-sm font-medium leading-normal capitalize"
          onClick={() => window.location.reload()}
        >
          <span>{t("refresh")}</span>
        </button>
      </div>

      {data?.cards?.map((card, index) => (
        <div
          className="relative flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between cursor-pointer transition-all duration-300 hover:bg-gray-100"
          key={`card-${index}`}
          onClick={() => handleCopy(card.number, index)}
        >
          <div className="flex items-center gap-4">
            <div className="bg-center bg-no-repeat aspect-video bg-contain h-6 w-10 shrink-0 bg-[url('/card.svg')]"></div>
            <div className="flex flex-col justify-center">
              <p className="text-[#181811] text-base font-medium leading-normal line-clamp-1">
                {card.number.match(/.{1,4}/g)?.join(" ")}
              </p>
              <p className="text-[#8c8c5f] text-sm font-normal leading-normal line-clamp-2">
                {card.cardholder_name}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <div
              className="text-[#181811] flex size-7 items-center justify-center"
              data-icon="Copy"
              data-size="24px"
              data-weight="regular"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path>
              </svg>
            </div>
          </div>

          {/* Copied Badge */}
          {copiedIndex === index && (
            <div className="absolute top-1 right-1 bg-green-200 text-green-900 text-xs px-2 py-1 rounded-full shadow-sm animate-pulse">
              Copied!
            </div>
          )}
        </div>
      ))}

      <h3 className="text-[#181811] text-lg font-medium leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        {t("replenish.description")}
      </h3>

      <Link to="/replenish/verify" className="flex px-4 py-3">
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-[#d6d604] text-[#181811] text-base font-bold leading-normal tracking-[0.015em]">
          <span className="truncate">{t("replenish.done")}</span>
        </button>
      </Link>
    </div>
  );
};
