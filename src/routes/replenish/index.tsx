import { createFileRoute } from "@tanstack/react-router";
import { Replenish } from "../../pages/replenish";

export const Route = createFileRoute("/replenish/")({
  component: () => <Replenish />,
});
