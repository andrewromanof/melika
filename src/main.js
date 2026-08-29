import './style.css'
import { createClient } from '@supabase/supabase-js'
import worshipImage from '../pics/worship/IMG_3545.jpeg'
import beachOne from '../pics/date/beach/IMG_4779.jpeg'
import beachTwo from '../pics/date/beach/IMG_4780.jpeg'
import kbbqOne from '../pics/date/kbbq/IMG_5760.jpeg'
import wonderlandOne from '../pics/date/wonderland/IMG_3330.jpeg'
import wonderlandTwo from '../pics/date/wonderland/IMG_3341.jpeg'
import wonderlandThree from '../pics/date/wonderland/IMG_3371.jpeg'
import wonderlandFour from '../pics/date/wonderland/IMG_3527.jpeg'
import questionOne from '../pics/question/IMG_3556.png'
import questionTwo from '../pics/question/IMG_3557.png'

const nav = [
  { href: '#/', label: 'Worship' },
  { href: '#/archive', label: 'Date archive' },
  { href: '#/question', label: '???' },
]

const archiveStorageKey = 'melika-archive-v1'
const selectedArchiveTabStorageKey = 'melika-archive-selected-tab-v1'
const celebrationStorageKey = `melika-question-answered-${__BUILD_ID__}`
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://iatydlfnlqqbfotadfvs.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_q9zoSOvb9lUsf0CfhBSTdg_8KkmjAyl',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
)

function makeId(prefix = 'archive') {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') return `${prefix}-${window.crypto.randomUUID()}`
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function buildDefaultArchiveData() {
  return {
    tabs: [
      {
        id: 'beach',
        name: 'Beach',
        images: [
          { id: 'beach-1', src: beachOne, alt: 'Beach memory 1' },
          { id: 'beach-2', src: beachTwo, alt: 'Beach memory 2' },
        ],
      },
      {
        id: 'kbbq',
        name: 'KBBQ',
        images: [
          { id: 'kbbq-1', src: kbbqOne, alt: 'KBBQ memory 1' },
        ],
      },
      {
        id: 'wonderland',
        name: 'Wonderland',
        images: [
          { id: 'wonderland-1', src: wonderlandOne, alt: 'Wonderland memory 1' },
          { id: 'wonderland-2', src: wonderlandTwo, alt: 'Wonderland memory 2' },
          { id: 'wonderland-3', src: wonderlandThree, alt: 'Wonderland memory 3' },
          { id: 'wonderland-4', src: wonderlandFour, alt: 'Wonderland memory 4' },
        ],
      },
    ],
  }
}

function normalizeArchiveState(rawState) {
  const defaults = buildDefaultArchiveData()
  if (!rawState || !Array.isArray(rawState.tabs) || rawState.tabs.length === 0) {
    return defaults
  }

  const tabs = rawState.tabs.map((tab, tabIndex) => ({
    id: tab.id || makeId(`tab-${tabIndex}`),
    name: typeof tab.name === 'string' && tab.name.trim() ? tab.name.trim() : `Tab ${tabIndex + 1}`,
    images: Array.isArray(tab.images)
      ? tab.images.filter(Boolean).map((image, imageIndex) => ({
          id: image.id || makeId(`image-${tabIndex}-${imageIndex}`),
          src: typeof image.src === 'string' && image.src ? image.src : '',
          alt: typeof image.alt === 'string' && image.alt ? image.alt : `${tab.name || 'Memory'} ${imageIndex + 1}`,
        })).filter(image => image.src)
      : [],
  })).filter(tab => tab.name)

  return {
    tabs: tabs.length ? tabs : defaults.tabs,
  }
}

async function loadArchiveState() {
  const fallback = buildDefaultArchiveData()

  try {
    const { data: tabs, error: tabsError } = await supabase
      .from('archive_tabs')
      .select('*')
      .order('created_at', { ascending: true })

    if (tabsError) throw tabsError

    if (tabs && tabs.length) {
      const { data: imageRows, error: imageError } = await supabase
        .from('archive_images')
        .select('*')
        .order('created_at', { ascending: true })

      if (imageError) throw imageError

      const normalized = {
        tabs: tabs.map((tab) => ({
          id: tab.id,
          name: tab.name,
          images: (imageRows || [])
            .filter((image) => image.tab_id === tab.id)
            .map((image) => ({
              id: image.id,
              src: image.image_url,
              alt: image.alt_text || `${tab.name} memory`,
            })),
        })),
      }

      localStorage.setItem(archiveStorageKey, JSON.stringify(normalized))
      return normalized
    }
  } catch (error) {
    console.warn('Falling back to local archive data', error)
  }

  try {
    const saved = localStorage.getItem(archiveStorageKey)
    if (!saved) {
      localStorage.setItem(archiveStorageKey, JSON.stringify(fallback))
      return fallback
    }
    const parsed = JSON.parse(saved)
    const normalized = normalizeArchiveState(parsed)
    localStorage.setItem(archiveStorageKey, JSON.stringify(normalized))
    return normalized
  } catch (error) {
    localStorage.setItem(archiveStorageKey, JSON.stringify(fallback))
    return fallback
  }
}

function saveArchiveState(state) {
  const normalized = normalizeArchiveState(state)
  localStorage.setItem(archiveStorageKey, JSON.stringify(normalized))
  return normalized
}

function getSelectedArchiveTabId(state) {
  const saved = localStorage.getItem(selectedArchiveTabStorageKey)
  if (!saved) {
    const firstTab = state.tabs[0]
    if (firstTab) {
      localStorage.setItem(selectedArchiveTabStorageKey, firstTab.id)
      return firstTab.id
    }
    return null
  }

  const tabExists = state.tabs.some(tab => tab.id === saved)
  if (!tabExists) {
    const firstTab = state.tabs[0]
    if (firstTab) {
      localStorage.setItem(selectedArchiveTabStorageKey, firstTab.id)
      return firstTab.id
    }
    return null
  }

  return saved
}

function setSelectedArchiveTab(tabId) {
  localStorage.setItem(selectedArchiveTabStorageKey, tabId)
}

function getSelectedArchiveTab(state) {
  const selectedTabId = getSelectedArchiveTabId(state)
  if (!state.tabs.length) return null
  return state.tabs.find(tab => tab.id === selectedTabId) || state.tabs[0]
}

function shell(content, active) {
  return `<div class="site-shell">
    <div class="layout">
      <aside class="sidebar">
        <nav aria-label="Main navigation">${nav.map(item => `<a class="nav-link ${active === item.href ? 'active' : ''}" href="${item.href}">${item.label}</a>`).join('')}</nav>
      </aside>
      <main>${content}</main>
    </div>
  </div>`
}

function worshipPage() {
  return shell(`<section class="worship-stage">
    <div class="compliment-cloud compliment-left" aria-label="Compliments">
      <span class="compliment compliment-a">WOW SHE'S SO PRETTY 😍</span>
      <span class="compliment compliment-b">beautiful eyes 💕</span>
      <span class="compliment compliment-c">absolute angel 😍</span>
      <span class="compliment compliment-d">gorgeous!</span>
      <span class="compliment compliment-e">glowing ✨</span>
      <span class="compliment compliment-f">always making me blush 💗</span>
      <span class="compliment compliment-g">biggest and sweetest smile</span>
    </div>
    <img src="${worshipImage}" alt="Worship" />
    <div class="compliment-cloud compliment-right" aria-label="Compliments">
      <span class="compliment compliment-e">you light up every room 💖</span>
      <span class="compliment compliment-f">so lovely 😍</span>
      <span class="compliment compliment-g">stunning always</span>
      <span class="compliment compliment-h">pretty princess</span>
      <span class="compliment compliment-a">cutest ever 🥰</span>
      <span class="compliment compliment-b">radiant beauty</span>
      <span class="compliment compliment-c">she's magic ✨</span>
    </div>
  </section>`, '#/')
}

function getMediaType(url) {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv']
  const urlLower = url.toLowerCase()
  return videoExtensions.some(ext => urlLower.endsWith(ext)) ? 'video' : 'image'
}

function archiveImage(tab, index) {
  const image = tab?.images?.[index]
  if (!image) {
    return `<figure class="archive-photo archive-empty"><div class="archive-empty-copy">No image yet</div></figure>`
  }
  
  const mediaType = getMediaType(image.src)
  const label = image.alt || `${tab.name} memory ${index + 1}`
  
  if (mediaType === 'video') {
    return `<figure class="archive-photo archive-video"><video controls><source src="${image.src}" />${label}</video></figure>`
  }
  
  return `<figure class="archive-photo"><img src="${image.src}" alt="${label}" /></figure>`
}

async function archivePage() {
  const state = await loadArchiveState()
  const activeTab = getSelectedArchiveTab(state) || state.tabs[0]
  if (!activeTab) {
    return shell(`<section class="archive-view" aria-label="Date archive"><p class="archive-empty-state">No archive tabs yet.</p></section>`, '#/archive')
  }

  return shell(`<section class="archive-view" aria-label="Date archive">
    <aside class="archive-tabs" aria-label="Date archive categories">
      <div class="archive-tab-list" role="tablist" aria-orientation="vertical">
        ${state.tabs.map(tab => `<button class="archive-tab ${tab.id === activeTab.id ? 'active' : ''}" role="tab" aria-selected="${tab.id === activeTab.id}" data-tab-id="${tab.id}">${tab.name}</button>`).join('')}
      </div>
      <form class="archive-create-tab" id="archive-create-tab" aria-label="Create a new archive tab">
        <label class="archive-create-label" for="archive-new-tab-input">Add tab</label>
        <input id="archive-new-tab-input" name="tabName" type="text" maxlength="28" placeholder="New tab name" />
        <button type="submit">Create</button>
      </form>
    </aside>
    <div class="archive-gallery-wrap">
      <div class="archive-gallery" id="archive-gallery" data-tab-id="${activeTab.id}" data-index="0" tabindex="0" aria-label="${activeTab.name} photo gallery">
        ${archiveImage(activeTab, 0)}
      </div>
      <div class="archive-controls">
        <button class="next-image" id="next-image" type="button">Next image <span>↗</span></button>
        <label class="archive-upload" for="archive-upload-input">
          Add media
          <input id="archive-upload-input" type="file" accept="image/*,video/*" />
        </label>
      </div>
    </div>
  </section>`, '#/archive')
}

function questionPage() {
  return shell(`<section class="question-page" aria-labelledby="question-title">
    <div class="question-heading">
      <p class="eyebrow">A little question</p>
      <h1 id="question-title">👉 👈 😳</h1>
    </div>
    <div class="question-prompt">
      <p>Will you, gorgeous Melika from Mashhad, be my girlfriend?</p>
      <div class="question-actions" role="group" aria-label="Answer the question">
        <button class="question-button question-button-primary" type="button" data-answer="yes">Yes, handsome <span aria-hidden="true">↗</span></button>
        <button class="question-button question-button-secondary" type="button" data-answer="no">No :(</button>
      </div>
      <p class="question-response" aria-live="polite"></p>
    </div>
    <div class="question-images" hidden aria-label="Celebration photos">
      <img class="question-image question-image-left" src="${questionOne}" alt="Celebration photo" />
      <img class="question-image question-image-right" src="${questionTwo}" alt="Celebration photo" />
    </div>
  </section>`, '#/question')
}

async function render() {
  const route = window.location.hash || '#/'
  document.querySelectorAll('body > .question-button.evading, body > .confetti').forEach(element => element.remove())

  if (route === '#/archive') {
    document.querySelector('#app').innerHTML = await archivePage()
  } else if (route === '#/question') {
    document.querySelector('#app').innerHTML = questionPage()
  } else {
    document.querySelector('#app').innerHTML = worshipPage()
  }

  wireInteractions()
  if (route === '#/question' && localStorage.getItem(celebrationStorageKey) === 'yes') celebrateYes()
}

function celebrateYes() {
  const actions = document.querySelector('.question-actions')
  const response = document.querySelector('.question-response')
  const questionPageElement = document.querySelector('.question-page')
  const questionImages = document.querySelector('.question-images')
  if (!actions || !response || !questionPageElement || !questionImages || document.querySelector('.confetti')) return
  document.querySelector('[data-answer="no"]')?.remove()
  actions.hidden = true
  questionImages.hidden = false
  response.className = 'question-response yes-response'
  response.textContent = '🎉 SHE SAID YES!!! 🎉'
  questionPageElement.classList.add('celebrating')
  const confetti = document.createElement('div')
  confetti.className = 'confetti'
  for (let index = 0; index < 80; index += 1) {
    const piece = document.createElement('span')
    piece.style.setProperty('--x', `${Math.random() * 100}vw`)
    piece.style.setProperty('--delay', `${Math.random() * 1.8}s`)
    piece.style.setProperty('--duration', `${2.4 + Math.random() * 2.4}s`)
    piece.style.setProperty('--drift', `${-80 + Math.random() * 160}px`)
    piece.style.setProperty('--color', ['#e25477', '#e19a34', '#789bce', '#4b8c76', '#8c65ac'][index % 5])
    confetti.append(piece)
  }
  document.body.append(confetti)
}

function wireInteractions() {
  attachTabHandlers()

  document.querySelector('#archive-create-tab')?.addEventListener('submit', async event => {
    event.preventDefault()
    const input = document.querySelector('#archive-new-tab-input')
    const name = input?.value.trim()
    if (!name) return

    try {
      const { data, error } = await supabase
        .from('archive_tabs')
        .insert({ name })
        .select('id, name')
        .single()

      if (error) throw error

      document.querySelector('#archive-new-tab-input').value = ''
      
      // Reload state from Supabase to get the new tab
      const updatedState = await loadArchiveState()
      await renderArchiveFromState(updatedState, data.id)
    } catch (error) {
      console.error('Could not create archive tab', error)
    }
  })

  document.querySelector('#next-image')?.addEventListener('click', async () => {
    const gallery = document.querySelector('#archive-gallery')
    const state = await loadArchiveState()
    const tabId = gallery?.dataset.tabId || getSelectedArchiveTabId(state)
    const activeTab = state.tabs.find(item => item.id === tabId) || state.tabs[0]
    if (!gallery || !activeTab || !activeTab.images.length) return
    const nextIndex = (Number(gallery.dataset.index || 0) + 1) % activeTab.images.length
    gallery.dataset.index = String(nextIndex)
    gallery.innerHTML = archiveImage(activeTab, nextIndex)
  })

  document.querySelector('#archive-upload-input')?.addEventListener('change', async event => {
    const file = event.target.files?.[0]
    const isImage = file?.type.startsWith('image/')
    const isVideo = file?.type.startsWith('video/')
    if (!file || (!isImage && !isVideo)) return

    const state = await loadArchiveState()
    const tabId = document.querySelector('#archive-gallery')?.dataset.tabId || getSelectedArchiveTabId(state)
    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('archive-images')
        .upload(`${tabId}/${uniqueName}`, file, {
          upsert: true,
          contentType: file.type,
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('archive-images')
        .getPublicUrl(`${tabId}/${uniqueName}`)

      const { error: insertError } = await supabase
        .from('archive_images')
        .insert({
          tab_id: tabId,
          image_url: urlData.publicUrl,
          alt_text: `${file.name}`,
        })

      if (insertError) throw insertError

      const updatedState = await loadArchiveState()
      const activeTab = updatedState.tabs.find(item => item.id === tabId) || updatedState.tabs[0]
      if (activeTab) {
        await renderArchiveFromState(updatedState, activeTab.id)
      }
      event.target.value = ''
    } catch (error) {
      console.error('Could not upload archive image', error)
    }
  })

  const noButton = document.querySelector('[data-answer="no"]')
  const moveNoButton = () => {
    const viewport = window.visualViewport
    const viewportWidth = Math.floor(viewport?.width || document.documentElement.clientWidth)
    const viewportHeight = Math.floor(viewport?.height || document.documentElement.clientHeight)
    const viewportLeft = Math.floor(viewport?.offsetLeft || 0)
    const viewportTop = Math.floor(viewport?.offsetTop || 0)
    if (!noButton.classList.contains('evading')) document.body.append(noButton)
    const buttonWidth = Math.min(noButton.offsetWidth, viewportWidth - 16)
    const buttonHeight = Math.min(noButton.offsetHeight, viewportHeight - 16)
    const maxLeft = Math.max(8, viewportWidth - buttonWidth - 8)
    const maxTop = Math.max(8, viewportHeight - buttonHeight - 8)
    noButton.classList.add('evading')
    noButton.style.left = `${viewportLeft + 8 + Math.random() * (maxLeft - 8)}px`
    noButton.style.top = `${viewportTop + 8 + Math.random() * (maxTop - 8)}px`
  }
  noButton?.addEventListener('pointerenter', moveNoButton)
  noButton?.addEventListener('click', moveNoButton)
  document.querySelector('[data-answer="yes"]')?.addEventListener('click', () => {
    localStorage.setItem(celebrationStorageKey, 'yes')
    celebrateYes()
  })
}

function attachTabHandlers() {
  document.querySelectorAll('.archive-tab').forEach(tab => tab.addEventListener('click', async () => {
    const tabId = tab.dataset.tabId
    if (!tabId) return
    setSelectedArchiveTab(tabId)
    const state = await loadArchiveState()
    await renderArchiveFromState(state, tabId)
  }))
}

async function renderArchiveFromState(state, tabId) {
  const selectedTabId = tabId || getSelectedArchiveTabId(state)
  const selectedTab = state.tabs.find(tab => tab.id === selectedTabId) || state.tabs[0]
  if (!selectedTab) return
  setSelectedArchiveTab(selectedTab.id)
  
  // Rebuild the tab list in case new tabs were added
  const tabList = document.querySelector('.archive-tab-list')
  if (tabList) {
    tabList.innerHTML = state.tabs.map(tab => `<button class="archive-tab ${tab.id === selectedTab.id ? 'active' : ''}" role="tab" aria-selected="${tab.id === selectedTab.id}" data-tab-id="${tab.id}">${tab.name}</button>`).join('')
    // Re-attach handlers to newly created tab elements
    attachTabHandlers()
  }
  
  const gallery = document.querySelector('#archive-gallery')
  if (!gallery) return
  gallery.dataset.tabId = selectedTab.id
  gallery.dataset.index = '0'
  gallery.setAttribute('aria-label', `${selectedTab.name} photo gallery`)
  gallery.innerHTML = archiveImage(selectedTab, 0)
}

window.addEventListener('hashchange', render)
render()
