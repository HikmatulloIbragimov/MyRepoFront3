import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Route } from "../routes/__root";

interface Game {
  name: string;
  name_ru: string;
  name_en: string;
  slug: string;
  image_path: string;
}

interface AppData {
  games: Game[];
  cards: Array<{
    number: string;
    cardholder_name: string;
  }>;
}

export const Games = () => {
  const { t, i18n } = useTranslation();
  const { data } = Route.useLoaderData() as { data: AppData };

  const popularGames = useMemo(() => {
    return data.games || [];
  }, [data.games]);

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

  return (
    <div className="bg-white">
      <div className="flex items-center bg-white px-4 py-2 justify-between">
        <div
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
        </div>
        <h2 className="text-[#181811] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          {t("games.title")}
        </h2>
      </div>

      <section>
        <div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
            {popularGames.map((game) => (
              <Link
                className="flex flex-col gap-3 pb-3"
                key={game.slug}
                to={`/game/${game.slug}`}
              >
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                  style={{
                    backgroundImage: `url('${game.image_path}')`,
                  }}
                ></div>
                <div>
                  <p className="text-sm font-medium leading-normal truncate">
                    {getCurrentLanguageName(game)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
