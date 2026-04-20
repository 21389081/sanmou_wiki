import { getTactics } from "@/lib/api";
import TacticGrid from "./tactic-grid";

export default async function TacticsPage() {
  const tactics = await getTactics();

  return <TacticGrid tactics={tactics} />;
}