import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

const archiveDefs = [
  { name: 'Beach', dir: 'pics/date/beach' },
  { name: 'KBBQ', dir: 'pics/date/kbbq' },
  { name: 'Wonderland', dir: 'pics/date/wonderland' },
]

async function ensureBucket() {
  const { error } = await supabase.storage.createBucket('archive-images', {
    public: true,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    fileSizeLimit: 10485760,
  })

  if (error && !error.message.includes('already exists')) {
    throw error
  }
}

async function upsertTab(name) {
  const { data, error } = await supabase
    .from('archive_tabs')
    .upsert({ name }, { onConflict: 'name' })
    .select('id, name')
    .single()

  if (error) throw error
  return data
}

async function uploadImage(tabId, filePath, altText) {
  const buffer = fs.readFileSync(filePath)
  const safeName = path.basename(filePath).replace(/[^a-zA-Z0-9._-]/g, '-')
  const storagePath = `${tabId}/${safeName}`

  const { error: uploadError } = await supabase.storage
    .from('archive-images')
    .upload(storagePath, buffer, {
      upsert: true,
      contentType: 'image/jpeg',
    })

  if (uploadError) throw uploadError

  const { data: publicUrlData } = supabase.storage
    .from('archive-images')
    .getPublicUrl(storagePath)

  const { error: rowError } = await supabase.from('archive_images').insert({
    tab_id: tabId,
    image_url: publicUrlData.publicUrl,
    alt_text: altText,
  })

  if (rowError) throw rowError
  console.log(`Uploaded ${safeName} -> ${publicUrlData.publicUrl}`)
}

async function main() {
  await ensureBucket()

  for (const archive of archiveDefs) {
    const tab = await upsertTab(archive.name)
    const dirEntries = fs.readdirSync(archive.dir, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .sort()

    for (const fileName of dirEntries) {
      const fullPath = path.join(process.cwd(), archive.dir, fileName)
      await uploadImage(tab.id, fullPath, `${archive.name} memory ${fileName}`)
    }
  }

  console.log('Archive migration complete')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
