export interface Game {
    name: string;
    name_ru: string;
    name_en: string;
    slug: string;
    image_path: string;
  }
  
  export interface GameDetails extends Game {
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
  
  export interface AppData {
    games: Game[];
    cards: Array<{
      number: string;
      cardholder_name: string;
    }>;
  }
  
  export interface SearchResult {
    type: "game" | "merchandise";
    game: Game;
    merchandise?: GameDetails["merchandise"][0];
  }