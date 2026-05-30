import { getGenerals } from "@/lib/api/generals";
import GeneralGrid from "./general-grid";

export default async function GeneralsPage() {
  const generals = await getGenerals();

  return <GeneralGrid generals={generals} />;
}
