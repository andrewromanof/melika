const fs = require('fs')
const path = require('path')
const { WebSocket } = require('ws')
global.WebSocket = WebSocket
const { createClient } = require('@supabase/supabase-js')

const url = 'https://iatydlfnlqqbfotadfvs.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhdHlkbGZubHFxYmZvdGFkZnZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Nzk0ODIwOSwiZXhwIjoyMTAzNTI0MjA5fQ.TdTQKscDyL1EA0UoMABPr_tZXMIS6wWDW3DFFVNXOqg'

const supabase = createClient(url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

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

  const { data: urlData } = supabase.storage
    .from('archive-images')
    .getPublicUrl(storageName)

  const { error: rowError } = await supabase
    .from('archive_images')
    .insert({
      tab_id: tabId,
      image_url: urlData.publicUrl,
      alt_text: fileName,
    })

  if (rowError) throw rowError
  console.log('uploaded', fileName)
}

async function main() {
  const tabs = [
    { name: 'Beach', folder: 'pics/date/beach' },
    { name: 'KBBQ', folder: 'pics/date/kbbq' },
    { name: 'Wonderland', folder: 'pics/date/wonderland' },
  ]

  for (const tab of tabs) {
    const record = await upsertTab(tab.name)
    const files = fs.readdirSync(tab.folder)
      .filter((name) => ['.png', '.jpg', '.jpeg'].includes(path.extname(name).toLowerCase()))
      .sort()

    for (const fileName of files) {
      await uploadForTab(record.id, tab.folder, fileName)
    }
  }

  console.log('done')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
