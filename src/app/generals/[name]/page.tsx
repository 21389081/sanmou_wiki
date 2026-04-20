import { getGeneralByName, getFatesByIds } from "@/lib/api";
import GeneralDetailContent from "./general-detail-content";

export default async function GeneralDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  
  const general = await getGeneralByName(decodedName);

  if (!general) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-serif mb-4">找不到該武將</h1>
        <a href="/generals" className="text-accent-gold flex items-center gap-2 mx-auto">
          返回圖鑑
        </a>
      </div>
    );
  }

  const fateIds = [
    general.緣分一id,
    general.緣分二id,
    general.緣分三id,
    general.緣分四id,
  ].filter((id): id is number => id !== null);

  const fates = await getFatesByIds(fateIds);

  return <GeneralDetailContent general={general} fates={fates} />;
}