import { useEffect } from "react";

// const data = new URLSearchParams(
//   "#tgWebAppData=user%3D%257B%2522id%2522%253A8146970004%252C%2522first_name%2522%253A%2522Abror%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522kachka_pachka%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FimV10HkJM016QIwfK7xLR7KlX5TtX2Lco9WsdrWUR6HRl5sclOVR7DjsX4Kxhw2p.svg%2522%257D%26chat_instance%3D6162323687907346027%26chat_type%3Dsender%26auth_date%3D1748872539%26signature%3DBoexRngfMuV8YT6PvuzKTlFf4XPAnzBmJeffdgzS64RvBOU-5eXMgVvhWHpCOvHVrwQkZ63E5yyjdM8ymuD6DQ%26hash%3D6f74cd86d764eec7ce1416dd5eb8973d129550369259ee20151df59f62e487b6&tgWebAppVersion=9.0&tgWebAppPlatform=tdesktop&tgWebAppThemeParams=%7B%22accent_text_color%22%3A%22%236ab2f2%22%2C%22bg_color%22%3A%22%2317212b%22%2C%22bottom_bar_bg_color%22%3A%22%2317212b%22%2C%22button_color%22%3A%22%235288c1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22destructive_text_color%22%3A%22%23ec3942%22%2C%22header_bg_color%22%3A%22%2317212b%22%2C%22hint_color%22%3A%22%23708499%22%2C%22link_color%22%3A%22%236ab3f3%22%2C%22secondary_bg_color%22%3A%22%23232e3c%22%2C%22section_bg_color%22%3A%22%2317212b%22%2C%22section_header_text_color%22%3A%22%236ab3f3%22%2C%22section_separator_color%22%3A%22%23111921%22%2C%22subtitle_text_color%22%3A%22%23708499%22%2C%22text_color%22%3A%22%23f5f5f5%22%7D".slice(
//     1
//   )
// ).get("tgWebAppData");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const decodeNget = (source: string, key: string): any => {
  const params = new URLSearchParams(decodeURIComponent(source));
  return params.get(key);
};

export default function UpdateUser() {
  useEffect(() => {
    const seen = sessionStorage.getItem("tgUser");

    if (!seen) {
      try {
        const userJSON = JSON.parse(
          !decodeURIComponent(window.location.hash).startsWith(
            "#tgWebAppData=query_id="
          )
            ? decodeNget(window.location.hash.slice(1), "tgWebAppData").slice(5)
            : decodeNget(window.location.hash.slice(14), "user")
        );

        sessionStorage.setItem("tgUser", btoa(JSON.stringify(userJSON)));

        fetch(
          import.meta.env.VITE_API_URL +
            "/api/update-user/?" +
            new URLSearchParams(userJSON).toString()
        );
      } catch {
        console.log("baa");
      }
    }
  }, []);

  return null;
}
