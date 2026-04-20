import { getTacticByName } from "@/lib/api";
import TacticDetailContent from "./tactic-detail-content";

export default async function TacticDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  
  const tactic = await getTacticByName(decodedName);

  if (!tactic) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-serif mb-4">找不到該戰法</h1>
        <a href="/tactics" className="text-accent-gold flex items-center gap-2 mx-auto">
          返回圖鑑
        </a>
      </div>
    );
  }

  return <TacticDetailContent tactic={tactic} />;
}