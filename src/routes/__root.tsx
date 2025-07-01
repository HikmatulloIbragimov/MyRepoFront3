import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";

import yaml from "js-yaml";

import Navbar from "../components/navbar";
import UpdateUser from "../components/update-user";

export const Route = createRootRoute({
  loader: async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/cdn/config/app.yaml");
      if (!res.ok) throw new Error("config file not found");
  
      const text = await res.text();
      const parsed = yaml.load(text);
      return { data: parsed };
    } catch (err) {
      console.warn("⚠ Не удалось загрузить config, продолжаем без него", err);
      return { data: null };
    }
  },
  
  component: () => (
    <div className="w-full min-h-screen h-lvh bg-white">
      <UpdateUser />

      <Outlet />
      <Navbar />

      <div className="h-[80px] bg-white" />
    </div>
  ),
});
