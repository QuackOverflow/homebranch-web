import {LibraryPage} from "@/pages/library";
import type {Route} from "./+types/library";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Homebranch - Library" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Library() {
    return <LibraryPage />;
}
