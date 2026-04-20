import { getGenerals } from "@/lib/api";
import GeneralGrid from "./general-grid";

export default async function GeneralsPage() {
  const generals = await getGenerals();

  return <GeneralGrid generals={generals} />;
}