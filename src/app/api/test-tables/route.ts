import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const TABLES = ['fate_info', 'tactics_info', 'generals_info']

export async function GET() {
  try {
    const supabase = await createClient()

    const result: Record<string, unknown> = {}

    for (const tableName of TABLES) {
      const { data: rows, error } = await supabase.from(tableName).select('*')

      if (error) {
        result[tableName] = { error: error.message }
      } else {
        result[tableName] = rows
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}