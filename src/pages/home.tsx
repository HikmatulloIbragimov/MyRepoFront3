import { useState, useEffect, useMemo } from "react";

import yaml from "js-yaml";

import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";


import { Route } from "../routes/__root";
import LangSwitcher from "../components/langSwitcher";
import HomeBalance from "../components/home-balance";

interface Game {
  name: string;
  name_ru: string;
  name_en: string;
  slug: string;
  image_path: string;
}

interface GameDetails extends Game {
  servers: Array<{
    name: string;
    name_ru: string;
    name_en: string;
    slug: string;
  }>;
  merchandise: Array<{
    name: string;
    name_ru: string;
    name_en: string;
    prices: Array<{
      price: number;
      currency: string;
      currency_ru: string;
      currency_en: string;
    }>;
    category: string;
    category_ru: string;
    category_en: string;
    category_description: string;
    category_description_ru: string;
    category_description_en: string;
    tags: Array<{
      name: string;
    }>;
    server: string;
  }>;
}

interface AppData {
  games: Game[];
  cards: Array<{
    number: string;
    cardholder_name: string;
  }>;
}

interface SearchResult {
  type: "game" | "merchandise";
  game: Game;
  merchandise?: GameDetails["merchandise"][0];
}

export const Home = () => {
  const { t, i18n } = useTranslation();
  const { data } = Route.useLoaderData() as { data: AppData };

  const [searchQuery, setSearchQuery] = useState("");
  const [gameDetails, setGameDetails] = useState<Record<string, GameDetails>>(
    {}
  );
  const [loading, setLoading] = useState(false);

  // Fetch game details for all games
  useEffect(() => {
    const fetchGameDetails = async () => {
      setLoading(true);
      const details: Record<string, GameDetails> = {};

      for (const game of data.games) {
        try {
          const res = await fetch(import.meta.env.VITE_API_URL + `/cdn/config/game/${game.slug}.yaml`);
          if (res.ok) {
            const text = await res.text();
            const parsed = yaml.load(text) as { game: GameDetails };
            details[game.slug] = parsed.game;
          }
        } catch (error) {
          console.error(`Failed to fetch details for ${game.slug}:`, error);
        }
      }

      setGameDetails(details);
      setLoading(false);
    };

    if (data.games && data.games.length > 0) {
      fetchGameDetails();
    }
  }, [data.games]);

  // Search functionality - returns both games and merchandise
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    (data.games || []).forEach((game) => {
      const gameDetail = gameDetails[game.slug];

      // Check if game matches
      const gameMatch =
        game.name.toLowerCase().includes(query) ||
        game.name_ru.toLowerCase().includes(query) ||
        game.name_en.toLowerCase().includes(query) ||
        game.slug.toLowerCase().includes(query);

      if (gameMatch) {
        results.push({ type: "game", game });
      }

      // Check merchandise matches
      if (gameDetail?.merchandise) {
        gameDetail.merchandise.forEach((item) => {
          const merchandiseMatch =
            item.name.toLowerCase().includes(query) ||
            item.name_ru.toLowerCase().includes(query) ||
            item.name_en.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.tags?.some((tag) => tag.name.toLowerCase().includes(query));

          if (merchandiseMatch) {
            results.push({ type: "merchandise", game, merchandise: item });
          }
        });
      }
    });

    return results;
  }, [searchQuery, data.games, gameDetails]);

  // Get popular games (first 5 for the carousel)
  const popularGames = useMemo(() => {
    return data.games || [];
  }, [data.games]);

  // Get all merchandise items from all games
  const allMerchandise = useMemo(() => {
    const merchandise: (GameDetails["merchandise"][0] & { game: Game })[] = [];
    (data.games || []).forEach((game) => {
      const detail = gameDetails[game.slug];
      if (detail?.merchandise) {
        detail.merchandise.forEach((item) => {
          merchandise.push({
            ...item,
            game: game,
          });
        });
      }
    });
    return merchandise;
  }, [data.games, gameDetails]);

  const getCurrentLanguageName = (item: {
    name: string;
    name_ru?: string;
    name_en?: string;
  }) => {
    const currentLang = i18n.language;
    if (currentLang === "ru" && item.name_ru) return item.name_ru;
    // Fix for Unexpected any. Specify a different type.
    if (currentLang === "en" && item.name_en) return item.name_en;
    return item.name;
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="bg-white">
      <div className="flex items-center p-4 justify-between w-full ">
        <img src={"/logo.png"} className="h-10 rounded-md" />
        <div className="flex items-center justify-end gap-4">
          <LangSwitcher />
          <HomeBalance />
        </div>
      </div>

      {/* Search Section */}
      <section>
        <div className="flex flex-col items-center w-full">
          <div className="p-4 w-full">
            <label className="flex flex-col min-w-40 h-12">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div
                  className="text-[#8c8b5f] flex border-none bg-[#f5f5f0] items-center justify-center pl-4 rounded-l-xl border-r-0"
                  data-icon="MagnifyingGlass"
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
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                  </svg>
                </div>
                <input
                  placeholder={t("home.search_placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#181811] focus:outline-0 focus:ring-0 border-none bg-[#f5f5f0] focus:border-none h-full placeholder:text-[#8c8b5f] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                />
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="text-[#8c8b5f] text-sm">
            {t("home.search_loading")}
          </div>
        </div>
      )}

      {/* Search Results */}
      {isSearching && (
        <section className="px-4">
          <h2 className="text-[rgb(24,24,17)] text-[20px] font-bold leading-tight tracking-[-0.015em] py-2">
            {t("home.search_results", { count: searchResults.length })}
          </h2>
          {searchResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#8c8b5f] text-base">
                {t("home.no_results", { query: searchQuery })}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pb-4">
              {searchResults.map((result, index) => {
                if (result.type === "game") {
                  const detail = gameDetails[result.game.slug];
                  const firstMerchandise = detail?.merchandise?.[0];
                  const price = firstMerchandise?.prices?.[0];

                  return (
                    <Link
                      className="flex flex-col gap-2 pb-2"
                      key={`game-${result.game.slug}-${index}`}
                      to={`/game/${result.game.slug}`}
                    >
                      <div
                        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                        style={{
                          backgroundImage: `url('${result.game.image_path}')`,
                        }}
                      ></div>
                      <div>
                        <p className="text-[#181811] text-sm font-medium leading-normal">
                          {getCurrentLanguageName(result.game)}
                        </p>
                        <p className="text-[#8c8b5f] text-xs font-normal leading-normal">
                          Game
                        </p>
                        {price && (
                          <p className="text-[#8c8b5f] text-xs font-normal leading-normal">
                            From {price.price.toLocaleString()} {price.currency}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                } else if (
                  result.type === "merchandise" &&
                  result.merchandise
                ) {
                  const price = result.merchandise.prices?.[0];

                  return (
                    <Link
                      className="flex flex-col gap-2 pb-2"
                      key={`merch-${result.game.slug}-${result.merchandise.name}-${index}`}
                      to={`/game/${result.game.slug}`}
                    >
                      <div
                        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                        style={{
                          backgroundImage: `url('${result.game.image_path}')`,
                        }}
                      ></div>
                      <div>
                        <p className="text-[#181811] text-sm font-medium leading-normal truncate">
                          {getCurrentLanguageName(result.merchandise)}
                        </p>
                        <p className="text-[#8c8b5f] text-xs font-normal leading-normal truncate">
                          {getCurrentLanguageName(result.game)} •{" "}
                          {getCurrentLanguageName(
                            result.merchandise.category
                              ? {
                                  name: result.merchandise.category,
                                  name_ru: result.merchandise.category_ru,
                                  name_en: result.merchandise.category_en,
                                }
                              : { name: "Item" }
                          )}
                        </p>
                        {price && (
                          <p className="text-[#8c8b5f] text-xs font-normal leading-normal">
                            {price.price.toLocaleString()} {price.currency}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                }
                return null;
              })}
            </div>
          )}
        </section>
      )}

      {!isSearching && (
        <section>
          <div>
            <h2 className="text-[#181811] text-[20px] font-bold leading-tight tracking-[-0.015em] px-4 py-1">
              {t("home.popular_games")}
            </h2>
            <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden">
              <div className="flex items-stretch p-4 gap-2">
                {popularGames.map((game) => (
                  <Link
                    to={`/game/${game.slug}`}
                    className="flex flex-col gap-2 rounded-lg min-w-40 w-40"
                    key={game.slug}
                  >
                    <div
                      className="w-full aspect-video rounded-xl bg-center bg-no-repeat bg-cover"
                      style={{
                        backgroundImage: `url('${game.image_path}')`,
                      }}
                    ></div>
                    <p className="text-[#181811] text-base font-medium leading-normal whitespace-nowrap overflow-hidden mr-2">
                      {getCurrentLanguageName(game)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Merchandise Section - Only show when not searching */}
      {!isSearching && (
        <section>
          <div>
            <h2 className="text-[#181811] text-[20px] font-bold leading-tight tracking-[-0.015em] px-4 py-1">
              {t("home.currencies")}
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {allMerchandise.map((item, index) => {
                const price = item.prices?.[0];

                return (
                  <Link
                    className="flex flex-col gap-3 pb-3"
                    key={`${item.game.slug}-${item.name}-${index}`}
                    to={`/game/${item.game.slug}`}
                  >
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                      style={{
                        backgroundImage: `url('${item.game.image_path}')`,
                      }}
                    ></div>
                    <div>
                      <p className="text-[#181811] text-base font-medium leading-normal">
                        {getCurrentLanguageName(item)}
                      </p>
                      <p className="text-[#8c8b5f] text-sm font-normal leading-normal">
                        {price
                          ? `${price.price.toLocaleString()} ${price.currency}`
                          : "Price not available"}
                      </p>
                      <p className="text-[#8c8b5f] text-xs font-normal leading-normal truncate">
                        {getCurrentLanguageName(item.game)} •{" "}
                        {getCurrentLanguageName({
                          name: item.category,
                          name_ru: item.category_ru,
                          name_en: item.category_en,
                        })}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
