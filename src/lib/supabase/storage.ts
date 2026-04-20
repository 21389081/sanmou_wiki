export function getStorageUrl(bucket: string, path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
}

export function getGeneralImage(filename: string) {
  return getStorageUrl('img', `generals/${filename}`)
}

export function getTacticImage(filename: string) {
  return getStorageUrl('img', `tactics/${filename}`)
}

export function getGeneralTacticImage(filename: string) {
  return getStorageUrl('img', `general's tactics/${filename}`)
}