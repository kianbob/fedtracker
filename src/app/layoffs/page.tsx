import { LayoffsClient } from "./LayoffsClient";
import separations from "../../../public/data/separations.json";
import agencyList from "../../../public/data/agency-list.json";

export const metadata = {
  title: "Federal Layoffs & Separations (2020-2025)",
  description: "Track every federal workforce separation from FY2020 to FY2025: RIFs (layoffs), terminations, quits, and retirements broken down by type and month.",
  alternates: { canonical: "/layoffs" },
};

export default function LayoffsPage() {
  return <LayoffsClient separations={separations} agencies={agencyList} />;
}
