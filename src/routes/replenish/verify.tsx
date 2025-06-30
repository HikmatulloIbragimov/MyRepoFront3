import { createFileRoute } from "@tanstack/react-router";
import { Verify } from "../../pages/verify";

export const Route = createFileRoute("/replenish/verify")({
  component: () => <Verify />,
});
