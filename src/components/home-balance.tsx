import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const HomeBalance = () => {
  const [balance, setBalance] = useState(0);
  const [fetched, setFetched] = useState(false);

  const user = sessionStorage.getItem("tgUser");

  useEffect(() => {
    if (!user) return;

    fetch(import.meta.env.VITE_API_URL + "/api/balance/", {
      headers: {
        "X-User-ID": user,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && typeof data.balance !== "undefined") {
          setBalance(data.balance);
          setFetched(true);
        } else {
          console.error("Balance not found in response", data);
        }
      }).catch((err) => {
        console.error("Ошибка при получении баланса:", err);
      });;
  }, [user]);

  return fetched ? (
    <Link to="/replenish" className="bg-orange-300 select-none rounded-md">
      <div className="flex p-1 pl-2 gap-2 items-center">
        <div className="flex flex-row sm:flex-col text-sm font-bold items-end gap-1 select-none">
          <div className="text-base leading-5">{balance}</div> so'm
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
    <div>
      <div className="bg-orange-300 select-none rounded-md animate-pulse">
        <div className="flex p-1 pl-2 gap-2 items-center">
          <div className="flex flex-row sm:flex-col text-sm font-bold items-end gap-1 select-none w-16 h-7" />
          <div className="rounded-md bg-orange-400 p-1 h-7 w-7" />
        </div>
      </div>
    </div>
  );
};

export default HomeBalance;
