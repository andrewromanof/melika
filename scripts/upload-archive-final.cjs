const fs = require('fs')
const path = require('path')
const { WebSocket } = require('ws')
global.WebSocket = WebSocket
const { createClient } = require('@supabase/supabase-js')

const url = 'https://iatydlfnlqqbfotadfvs.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhdHlkbGZubHFxYmZvdGFkZnZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Nzk0ODIwOSwiZXhwIjoyMTAzNTI0MjA5fQ.TdTQKscDyL1EA0UoMABPr_tZXMIS6wWDW3DFFVNXOqg'
const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

const tabs = {
  Beach: '5390ab7b-42e3-46b8-bfb3-9e331f2fd11d',
  KBBQ: 'f96a0e71-cc23-4b35-b418-545f1ce52a3a',
  Wonderland: '97e02640-5c72-4ef7-925c-13818d4594c9',
}

async function main() {
  for (const [name, tabId] of Object.entries(tabs)) {
    const folderName = name === 'KBBQ' ? 'kbbq' : name.toLowerCase()
    const folder = path.join(process.cwd(), 'pics', 'date', folderName)

    const files = fs.readdirSync(folder)
      .filter((file) => ['.png', '.jpg', '.jpeg'].includes(path.extname(file).toLowerCase()))
      .sort()

    for (const file of files) {
      const filePath = path.join(folder, file)
      const buffer = fs.readFileSync(filePath)
      const storageName = `${tabId}/${file}`

      const { error: uploadError } = await supabase.storage
        .from('archive-images')
        .upload(storageName, buffer, {
          upsert: true,
          contentType: file.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
        })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('archive-images')
        .getPublicUrl(storageName)

      const { error: rowError } = await supabase
        .from('archive_images')
        .insert({
          tab_id: tabId,
          image_url: publicUrlData.publicUrl,
          alt_text: file,
        })

      if (rowError) throw rowError
      console.log('uploaded', name, file)
    }
  }

  console.log('done')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
