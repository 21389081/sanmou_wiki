import { createClient } from './supabase/server'
import { getGeneralImage, getTacticImage, getGeneralTacticImage } from './supabase/storage'

const rarityMap: Record<string, string> = {
  orange: '橙',
  purple: '紫',
  blue: '藍',
}

export type General = {
  gid: number
  name: string
  avatar: string
  rarity: '橙' | '紫' | '藍'
  camp: '魏' | '蜀' | '吳' | '群'
  soldier_type: string
  strength: string
  intelligence: string
  leadership: string
  initiative: string
  tactic_name: string
  tactic_icon: string
  tactic_type: string
  tactic_trait: string
  tactic_chance: string
  tactic_effect_base: string
  tactic_effect_max: string
  season: string
  fate_id_1: number | null
  fate_id_2: number | null
  fate_id_3: number | null
  fate_id_4: number | null
}

export type Fate = {
  fid: number
  name: string
  members: string | null
  effect: string
}

export type Tactic = {
  tid: number
  name: string
  icon: string
  rarity: '橙' | '紫' | '藍'
  type: string
  soldier_type: string
  trait: string
  chance: string
  effect_base: string
  effect_max: string
  season: string
}

export async function getGenerals(): Promise<General[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from('generals_info').select('*')

  if (error) {
    throw new Error(error.message)
  }

  return (data || []).map((g) => ({
    ...g,
    rarity: rarityMap[g.rarity as keyof typeof rarityMap] as '橙' | '紫' | '藍',
    avatar: getGeneralImage(g.avatar),
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
    rarity: rarityMap[t.rarity as keyof typeof rarityMap] as '橙' | '紫' | '藍',
    icon: getTacticImage(t.icon),
  }))
}

export async function getGeneralByName(name: string): Promise<General | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('generals_info')
    .select('*')
    .eq('name', name)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw new Error(error.message)
  }

  return {
    ...data,
    rarity: rarityMap[data.rarity as keyof typeof rarityMap] as '橙' | '紫' | '藍',
    avatar: getGeneralImage(data.avatar),
    tactic_icon: getGeneralTacticImage(data.tactic_icon),
  }
}

export async function getFatesByIds(ids: (number | null)[]): Promise<Fate[]> {
  const validIds = ids.filter((id): id is number => id !== null && id !== undefined)
  if (validIds.length === 0) return []
  
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('fate_info')
    .select('*')
    .in('fid', validIds)

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function getTacticByName(name: string): Promise<Tactic | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tactics_info')
    .select('*')
    .eq('name', name)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(error.message)
  }

  return {
    ...data,
    rarity: rarityMap[data.rarity as keyof typeof rarityMap] as '橙' | '紫' | '藍',
    icon: getTacticImage(data.icon),
  }
}