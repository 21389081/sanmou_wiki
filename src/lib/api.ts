import { createClient } from './supabase/server'
import { getGeneralImage, getTacticImage, getGeneralTacticImage } from './supabase/storage'

const rarityMap: Record<string, string> = {
  orange: '橙',
  purple: '紫',
  blue: '藍',
}

type General = {
  gid: number
  名稱: string
  頭像: string
  品質: '橙' | '紫' | '藍'
  陣營: '魏' | '蜀' | '吳' | '群'
  兵種: string
  武力: string
  智力: string
  統率: string
  先攻: string
  自帶戰法名稱: string
  自帶戰法圖示: string
  自帶戰法類型: string
  自帶戰法特性: string
  自帶戰法發動概率: string
  自帶戰法初級效果: string
  自帶戰法滿級效果: string
  登場賽季: string
}

type Tactic = {
  tid: number
  戰法名稱: string
  圖示: string
  品質: '橙' | '紫' | '藍'
  戰法類型: string
  適用兵種: string
  戰法特性: string
  發動概率: string
  初級效果: string
  滿級效果: string
  登場賽季: string
}

export async function getGenerals(): Promise<General[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from('generals_info').select('*')

  if (error) {
    throw new Error(error.message)
  }

  return (data || []).map((g) => ({
    ...g,
    品質: rarityMap[g.品質 as keyof typeof rarityMap] as '橙' | '紫' | '藍',
    頭像: getGeneralImage(g.頭像),
  }))
}

export async function getTactics(): Promise<Tactic[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from('tactics_info').select('*')

  if (error) {
    throw new Error(error.message)
  }

  return (data || []).map((t) => ({
    ...t,
    品質: rarityMap[t.品質 as keyof typeof rarityMap] as '橙' | '紫' | '藍',
    圖示: getTacticImage(t.圖示),
  }))
}