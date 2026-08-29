import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

global.WebSocket = ws

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://iatydlfnlqqbfotadfvs.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhdHlkbGZubHFxYmZvdGFkZnZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Nzk0ODIwOSwiZXhwIjoyMTAzNTI0MjA5fQ.TdTQKscDyL1EA0UoMABPr_tZXMIS6wWDW3DFFVNXOqg'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

async function initSchema() {
  const query = `
    create extension if not exists pgcrypto;
    create table if not exists public.archive_tabs (
      id uuid primary key default gen_random_uuid(),
      name text not null unique,
      created_at timestamptz not null default now()
    );
    create table if not exists public.archive_images (
      id uuid primary key default gen_random_uuid(),
      tab_id uuid not null references public.archive_tabs(id) on delete cascade,
      image_url text not null,
      alt_text text,
      created_at timestamptz not null default now()
    );
  `

  const response = await fetch(`${SUPABASE_URL}/rest/v1/sql`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`Schema setup failed: ${response.status} ${text}`)
  }

  console.log('Schema ready')
}

async function ensureBucket() {
  const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets()
  if (listError) throw listError

  const bucketExists = existingBuckets.some(bucket => bucket.name === 'archive-images')
  if (!bucketExists) {
    const { error } = await supabase.storage.createBucket('archive-images', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      fileSizeLimit: 10 * 1024 * 1024,
    })
    if (error) throw error
  }

  console.log('Storage bucket ready')
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

async function uploadForTab(tabId, folder, fileName) {
  const filePath = path.join(process.cwd(), folder, fileName)
  const buffer = fs.readFileSync(filePath)
  const storageName = `${tabId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('archive-images')
    .upload(storageName, buffer, {
      upsert: true,
      contentType: fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
    })

  if (uploadError) throw uploadError

  const { data: publicUrlData } = supabase.storage
    .from('archive-images')
    .getPublicUrl(storageName)

  const { error: insertError } = await supabase.from('archive_images').insert({
    tab_id: tabId,
    image_url: publicUrlData.publicUrl,
    alt_text: `${fileName}`,
  })

  if (insertError) throw insertError
  console.log(`Uploaded ${fileName}`)
}

async function migrateArchive() {
  const tabs = [
    { name: 'Beach', folder: 'pics/date/beach' },
    { name: 'KBBQ', folder: 'pics/date/kbbq' },
    { name: 'Wonderland', folder: 'pics/date/wonderland' },
  ]

  for (const tab of tabs) {
    const tabRecord = await upsertTab(tab.name)
    const files = fs.readdirSync(tab.folder).filter(name => name.toLowerCase().endsWith('.png') || name.toLowerCase().endsWith('.jpeg') || name.toLowerCase().endsWith('.jpg')).sort()

    for (const fileName of files) {
      await uploadForTab(tabRecord.id, tab.folder, fileName)
    }
  }

  console.log('Migration complete')
}

async function main() {
  await initSchema()
  await ensureBucket()
  await migrateArchive()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
