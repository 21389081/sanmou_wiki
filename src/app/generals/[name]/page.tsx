import { getGeneralByName, getFatesByIds } from '@/lib/api';
import GeneralDetailContent from './general-detail-content';
import { Link } from 'lucide-react';

export default async function GeneralDetailPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    const decodedName = decodeURIComponent(name);

    const general = await getGeneralByName(decodedName);

    if (!general) {
        return (
            <div className='py-20 text-center'>
                <h1 className='text-2xl font-serif mb-4'>找不到該武將</h1>
                <Link href='/generals' className='text-accent-gold flex items-center gap-2 mx-auto'>
                    返回圖鑑
                </Link>
            </div>
        );
    }

    const fateIds = [general.fate_id_1, general.fate_id_2, general.fate_id_3, general.fate_id_4];

    const fates = await getFatesByIds(fateIds);

    return <GeneralDetailContent general={general} fates={fates} />;
}
