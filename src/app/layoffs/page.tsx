import { LayoffsClient } from "./LayoffsClient";
import separations from "../../../public/data/separations.json";
import agencyList from "../../../public/data/agency-list.json";

export const metadata = {
  title: "Federal Layoffs & Separations 2020-2025",
  description: "Track 335K+ federal separations: RIFs, terminations, quits & retirements by agency and month. FY2020-2025 OPM data.",
  alternates: { canonical: "/layoffs" },
};

export default function LayoffsPage() {
  return <LayoffsClient separations={separations} agencies={agencyList} />;
}
