import { createFileRoute } from "@tanstack/react-router";
import { Deck } from "@/components/deck/Deck";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <Deck />;
}
