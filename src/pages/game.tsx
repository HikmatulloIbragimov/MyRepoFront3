import { useState } from "react";

import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";

import { Route } from "../routes/game/$gameSlug";
import { BuyButton } from "../components/buy-button";

interface Price {
  price: number;
  currency: string;
  currency_ru: string;
  currency_en: string;
}

interface Tag {
  name: string;
}

interface MerchandiseItem {
  id: number;
  name: string;
  name_ru: string;
  name_en: string;
  category: string;
  slug: string;
  prices: Price[];
  tags?: Tag[];
  server: string;
}

interface Server {
  name: string;
  name_ru: string;
  name_en: string;
  slug: string;
}

interface Category {
  name: string;
  name_ru: string;
  name_en: string;
  description: string;
  description_ru: string;
  description_en: string;
  slug: string;
}

interface Game {
  name: string;
  name_ru: string;
  name_en: string;
  slug: string;
  image_path: string;
  servers: Server[];
  merchandise: MerchandiseItem[];
  categories: Category[];
}

interface GameData {
  game: Game;
}

interface Quantities {
  [key: string]: number;
}

export const Game: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { gameSlug } = Route.useParams();
  const { gameData }: { gameData: GameData } = Route.useLoaderData();

  const [selectedServer, setSelectedServer] = useState<string>(
    gameData.game.servers[0]?.slug || ""
  );
  const [quantities, setQuantities] = useState<Quantities>({});

  const updateQuantity = (itemKey: string, change: number): void => {
    setQuantities((prev) => ({
      ...prev,
      [itemKey]: Math.max(0, (prev[itemKey] || 0) + change),
    }));
  };

  const getQuantity = (itemKey: string): number => quantities[itemKey] || 0;

  const handleBuyClick = (itemKey: string): void => {
    setQuantities((prev) => ({
      ...prev,
      [itemKey]: 1,
    }));
  };

  // Helper function to get localized text
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getCurrentLanguageName = (item: any) => {
    const currentLang = i18n.language;
    if (currentLang === "ru" && item.name_ru) return item.name_ru;
    if (currentLang === "en" && item.name_en) return item.name_en;
    return item.name;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getCurrentLanguageDescription = (item: any) => {
    const currentLang = i18n.language;
    if (currentLang === "ru" && item.description_ru) return item.description_ru;
    if (currentLang === "en" && item.description_en) return item.description_en;
    return item.description;
  };

  // Get category info by slug
  const getCategoryInfo = (categorySlug: string): Category | undefined => {
    return gameData.game.categories?.find((cat) => cat.slug === categorySlug);
  };

  // Filter merchandise by selected server FIRST, then group by category
  const filteredMerchandise = gameData.game.merchandise.filter(
    (item) => item.server === selectedServer
  );

  const merchandiseByCategory = filteredMerchandise.reduce(
    (acc, item) => {
      const category = item.category || "other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, MerchandiseItem[]>
  );

  return (
    <div className="relative bg-white">
      <div className="absolute top-0 left-0 right-0 z-0 opacity-75">
        <div className="relative">
          <img
            src={gameData.game.image_path}
            alt={gameData.game.name}
            className="object-cover w-full h-full"
          />

          <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-white to-transparent" />
        </div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center p-4 pb-2 justify-between gap-4">
          <Link
            to="/"
            className="text-[#181811] flex size-12 shrink-0 items-center bg-white justify-center rounded-xl"
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
          <h2 className="flex text-[#181811] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 justify-center bg-white h-12 rounded-xl items-center">
            {getCurrentLanguageName(gameData.game)}
          </h2>
        </div>

        <div className="relative mt-[250px] bg-white">
          {gameData.game.servers.length > 0 && (
            <>
              <h3 className="text-[#181811] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
                {t("game.region")}
              </h3>
              <div className="flex flex-wrap gap-3 p-4">
                {gameData.game.servers.map((server, index) => (
                  <label
                    key={index}
                    className="text-sm font-medium leading-normal flex items-center justify-center rounded-xl border border-[#e6e6db] px-4 h-11 text-[#181811] has-[:checked]:border-[3px] has-[:checked]:px-3.5 has-[:checked]:border-[#d6d604] relative cursor-pointer"
                  >
                    {getCurrentLanguageName(server)}
                    <input
                      type="radio"
                      className="invisible absolute"
                      name="server-selection"
                      value={server.slug}
                      checked={selectedServer === server.slug}
                      onChange={(e) => setSelectedServer(e.target.value)}
                    />
                  </label>
                ))}
              </div>
            </>
          )}

          {Object.keys(merchandiseByCategory).length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-[#8c8c5f] text-base">
                {t("game.no_merchandise")}
              </p>
            </div>
          )}

          {Object.entries(merchandiseByCategory).map(
            ([categorySlug, items]) => {
              const categoryInfo = getCategoryInfo(categorySlug);

              return (
                <div key={categorySlug}>
                  <h1 className="text-[#181811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5 capitalize">
                    {categoryInfo
                      ? getCurrentLanguageName(categoryInfo)
                      : categorySlug.replace("-", " ")}
                  </h1>

                  {categoryInfo && (
                    <p className="text-[#181811] text-base font-normal leading-normal pb-3 pt-1 px-4">
                      {getCurrentLanguageDescription(categoryInfo)}
                    </p>
                  )}

                  <div className="">
                    {items.map((item, itemIndex) => {
                      const itemKey =
                        item.slug || `${categorySlug}-${itemIndex}`;
                      const quantity = getQuantity(itemKey);

                      return (
                        <div
                          key={itemKey}
                          className="flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between"
                        >
                          <div className="flex flex-col justify-center">
                            <p className="text-[#181811] text-base font-medium leading-normal line-clamp-1">
                              {item.prices[0]?.price.toLocaleString()}{" "}
                              {item.prices[0]?.currency}
                            </p>
                            <p className="text-[#8c8c5f] text-sm font-normal leading-normal line-clamp-2">
                              {getCurrentLanguageName(item)}
                              {/* {item.tags?.some(tag => tag.name === 'popular') && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Popular
                        </span>
                      )} */}
                            </p>
                          </div>

                          <div className="shrink-0">
                            {quantity === 0 ? (
                              <BuyButton
                                handleBuyClick={() => handleBuyClick(itemKey)}
                              />
                            ) : (
                              <div className="flex items-center gap-2 text-[#181811]">
                                <button
                                  className="text-base font-medium leading-normal flex h-7 w-7 items-center justify-center rounded-full bg-[#f5f5f0] cursor-pointer"
                                  onClick={() => updateQuantity(itemKey, -1)}
                                >
                                  -
                                </button>
                                <input
                                  className="text-base font-medium leading-normal w-4 p-0 text-center bg-transparent focus:outline-0 focus:ring-0 focus:border-none border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                  type="number"
                                  value={quantity}
                                  onChange={(e) =>
                                    setQuantities((prev) => ({
                                      ...prev,
                                      [itemKey]: Math.max(
                                        0,
                                        parseInt(e.target.value) || 0
                                      ),
                                    }))
                                  }
                                />
                                <button
                                  className="text-base font-medium leading-normal flex h-7 w-7 items-center justify-center rounded-full bg-[#f5f5f0] cursor-pointer"
                                  onClick={() => updateQuantity(itemKey, 1)}
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
          )}
        </div>

        {Object.keys(quantities).length > 0 &&
          Object.values(quantities).some((q) => q > 0) && (
            <Link
              to={`/game/${gameSlug}/checkout?${Object.entries(quantities)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .filter(([_, q]) => q > 0)
                .map(
                  ([k, v]) =>
                    `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
                )
                .join("&")}`}
              className="flex px-4 py-3 fixed bottom-20 right-0"
            >
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-[#d6d604] text-[#181811] text-base font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">{t("game.checkout")}</span>
              </button>
            </Link>
          )}
      </div>

      <div className="h-[80px]" />
    </div>
  );
};
