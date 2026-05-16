import { createRoot } from "react-dom/client";
import { Deck } from "@/components/deck/Deck";
import "@/styles.css";

createRoot(document.getElementById("root")!).render(<Deck />);
