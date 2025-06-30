import { createFileRoute } from "@tanstack/react-router";
import { Games } from "../pages/games";

export const Route = createFileRoute("/games")({
  component: () => <Games />,
});
