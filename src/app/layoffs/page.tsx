import { LayoffsClient } from "./LayoffsClient";
import separations from "../../../public/data/separations.json";
import agencyList from "../../../public/data/agency-list.json";

export const metadata = {
  title: "Federal Layoffs & Separations — FedTracker",
  description: "Track federal workforce separations including RIFs, terminations, quits, and retirements by agency and month.",
};

export default function LayoffsPage() {
  return <LayoffsClient separations={separations} agencies={agencyList} />;
}
