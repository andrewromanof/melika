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
  { href: '#/confessions', label: 'Confessions' },
  { href: '#/wheel', label: 'The Wheel' },
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
      <p class="question-response yes-response" aria-live="polite">🎉 SHE SAID YES!!! 🎉</p>
    </div>
    <div class="question-images" aria-label="Celebration photos">
      <img class="question-image question-image-left" src="${questionOne}" alt="Celebration photo" />
      <img class="question-image question-image-right" src="${questionTwo}" alt="Celebration photo" />
    </div>
  </section>`, '#/question')
}

function confessionsPage() {
  return shell(`<section class="page-panel confessions-page" aria-label="Confessions">
    <div class="confession-shell">
      <div class="section-toolbar confession-toolbar">
        <button class="primary-button compact-button" id="create-confession-button" type="button">Create post</button>
      </div>
      <div class="confession-list" id="confession-list" aria-live="polite"></div>
    </div>
    <div class="modal-backdrop hidden" id="confession-modal" aria-hidden="true">
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="confession-modal-title">
        <div class="modal-header">
          <h2 id="confession-modal-title">New confession</h2>
          <button class="close-button" id="close-confession-modal" type="button" aria-label="Close">×</button>
        </div>
        <form id="confession-form" class="modal-form">
          <div class="editor-tools" role="toolbar" aria-label="Text formatting">
            <button type="button" data-editor-command="bold" aria-label="Bold"><strong>B</strong></button>
            <button type="button" data-editor-command="italic" aria-label="Italic"><em>I</em></button>
            <button type="button" data-editor-command="underline" aria-label="Underline"><u>U</u></button>
            <button type="button" data-editor-command="strikeThrough" aria-label="Strikethrough"><s>S</s></button>
            <button type="button" data-editor-effect="highlight" aria-label="Highlight">A</button>
            <span class="palette-divider" aria-hidden="true"></span>
            ${[
              '#242a25', '#5b645d', '#8a9087', '#bc6749', '#d54d76', '#e25477',
              '#8c65ac', '#6b4f92', '#4a75a0', '#789bce', '#2e6f95', '#4b8c76',
              '#425847', '#6f8f55', '#a7b2a0', '#e19a34', '#d28a24', '#c36d2d',
              '#f1d7b2', '#d8c7b4', '#d5b8bb', '#ecc7d0', '#b0c4e2', '#c8d5d3',
              '#c4d2a5', '#d0d6c8', '#f4c2c2', '#f6df8b', '#b7d7c2', '#d9c2f0',
            ].map(color => `<button type="button" class="color-swatch" style="--swatch-color:${color}" data-editor-color="${color}" aria-label="${color} text"></button>`).join('')}
          </div>
          <div class="editor-field">
            <span>Title</span>
            <div class="rich-editor rich-editor-title" id="confession-title-editor" contenteditable="true" role="textbox" aria-label="Confession title"></div>
            <input type="hidden" name="title" id="confession-title-value" />
          </div>
          <div class="editor-field">
            <span>Author</span>
            <div class="rich-editor rich-editor-author" id="confession-author-editor" contenteditable="true" role="textbox" aria-label="Confession author"></div>
            <input type="hidden" name="author" id="confession-author-value" />
          </div>
          <div class="editor-field">
            <span>Body</span>
            <div class="rich-editor" id="confession-body-editor" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Confession body"></div>
            <input type="hidden" name="body" id="confession-body-value" />
          </div>
          <p class="form-status" id="confession-form-status" role="status" aria-live="polite"></p>
          <button class="primary-button" type="submit">Post confession</button>
        </form>
      </div>
    </div>
  </section>`, '#/confessions')
}

async function loadConfessions() {
  try {
    const { data, error } = await supabase
      .from('confessions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.warn('Could not load confessions', error)
    return []
  }
}

function renderConfessions(posts) {
  const list = document.querySelector('#confession-list')
  if (!list) return

  if (!posts.length) {
    list.innerHTML = '<p class="empty-state">No confessions yet. Be the first to write one.</p>'
    return
  }

  list.innerHTML = posts.map(post => {
    const date = post.created_at ? new Date(post.created_at).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }) : 'Unknown date'

    const title = post.title ? `<div class="confession-title">${sanitizeConfessionBody(post.title)}</div>` : ''
    const author = post.author ? `By ${sanitizeConfessionBody(post.author)} on ${date}` : `On ${date}`

    return `
      <article class="confession-item">
        ${title}
        <div class="confession-meta">
          <span class="confession-author">${author}</span>
        </div>
        <p>${sanitizeConfessionBody((post.body || '').replace(/\n/g, '<br>'))}</p>
      </article>
    `
  }).join('')
}

function sanitizeConfessionBody(value) {
  const template = document.createElement('template')
  template.innerHTML = value
  const allowedTags = new Set(['B', 'BR', 'EM', 'FONT', 'I', 'S', 'SPAN', 'STRIKE', 'STRONG', 'U'])
  const allowedColors = new Set([
    '#242a25', '#5b645d', '#8a9087', '#bc6749', '#d54d76', '#e25477', '#8c65ac', '#6b4f92',
    '#4a75a0', '#789bce', '#2e6f95', '#4b8c76', '#425847', '#6f8f55', '#a7b2a0', '#e19a34',
    '#d28a24', '#c36d2d', '#f1d7b2', '#d8c7b4', '#d5b8bb', '#ecc7d0', '#b0c4e2', '#c8d5d3',
    '#c4d2a5', '#d0d6c8', '#f4c2c2', '#f6df8b', '#b7d7c2', '#d9c2f0',
  ])
  const normalizedColors = new Set(allowedColors)
  allowedColors.forEach(color => {
    const probe = document.createElement('span')
    probe.style.color = color
    normalizedColors.add(probe.style.color)
  })
  const allowedHighlight = new Set(['#f1d7b2', 'rgb(241, 215, 178)'])

  function cleanNode(node) {
    if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.nodeValue)
    if (node.nodeType !== Node.ELEMENT_NODE) return document.createDocumentFragment()

    if (!allowedTags.has(node.tagName)) {
      const fragment = document.createDocumentFragment()
      Array.from(node.childNodes).forEach(child => fragment.append(cleanNode(child)))
      return fragment
    }

    const clean = document.createElement(node.tagName.toLowerCase())
    const textColor = node.getAttribute('color')?.toLowerCase()
    if (node.tagName === 'FONT' && normalizedColors.has(textColor)) {
      clean.setAttribute('color', textColor)
    }
    if (node.tagName === 'SPAN' && normalizedColors.has(node.style.color.toLowerCase())) {
      clean.style.color = node.style.color
    }
    if (allowedHighlight.has(node.style.backgroundColor.toLowerCase())) clean.style.backgroundColor = '#f1d7b2'
    Array.from(node.childNodes).forEach(child => clean.append(cleanNode(child)))
    return clean
  }

  const output = document.createDocumentFragment()
  Array.from(template.content.childNodes).forEach(node => output.append(cleanNode(node)))
  const container = document.createElement('div')
  container.append(output)
  return container.innerHTML
}

async function refreshConfessions() {
  const posts = await loadConfessions()
  renderConfessions(posts)
}

function wheelPage() {
  return shell(`<section class="page-panel wheel-page" aria-label="The Wheel">
    <div class="wheel-layout">
      <aside class="token-counter" aria-label="Good Girl tokens">
        <span class="token-counter-label">Good Girl tokens</span>
        <strong id="good-girl-tokens">0</strong>
      </aside>
      <div class="wheel-content">
        <p id="wheel-result" class="wheel-result" aria-live="polite"></p>
        <div class="wheel-stage">
          <div class="wheel-pointer" aria-hidden="true"></div>
          <div class="fortune-wheel" id="wheel-visual" aria-label="Fortune wheel"></div>
        </div>
      </div>
    </div>
  </section>`, '#/wheel')
}

async function loadLatestWheel() {
  try {
    const { data, error } = await supabase
      .from('fortune_wheels')
      .select('id, options, last_winner, question, good_girl_tokens')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') throw error
    return data || null
  } catch (error) {
    console.warn('Could not load wheel', error)
    return null
  }
}

function buildWheelGradient(options) {
  if (!options.length) return 'conic-gradient(#d8c7b4 0deg 360deg)'
  const segment = 360 / options.length
  const palette = ['#d8c7b4', '#f1d7b2', '#c8d5d3', '#d5b8bb', '#c4d2a5', '#b0c4e2', '#e5c5a4', '#d0d6c8', '#ecc7d0', '#cdd7b8']

  const stops = options.map((_, index) => {
    const start = index * segment
    const end = (index + 1) * segment
    return `${palette[index % palette.length]} ${start}deg ${end}deg`
  })

  return `conic-gradient(${stops.join(', ')})`
}

function renderWheelOptions(options) {
  const wheel = document.querySelector('#wheel-visual')
  const result = document.querySelector('#wheel-result')
  if (!wheel) return

  if (!options.length) {
    wheel.innerHTML = ''
    wheel.style.background = buildWheelGradient([])
    if (result) result.textContent = ''
    return
  }

  const segmentSize = 360 / options.length
  wheel.style.background = buildWheelGradient(options)
  wheel.innerHTML = options.map((option, index) => {
    const angle = (index + 0.5) * segmentSize
    return `<span class="wheel-label" style="--angle:${angle}deg;">${option}</span>`
  }).join('')
  const centerButton = document.createElement('button')
  centerButton.className = 'wheel-center'
  centerButton.id = 'spin-wheel-button'
  centerButton.type = 'button'
  centerButton.textContent = 'Spin'
  centerButton.setAttribute('aria-label', 'Spin wheel')
  centerButton.addEventListener('click', spinCurrentWheel)
  wheel.appendChild(centerButton)

  if (result) result.textContent = ''
}

let currentWheelRotation = 0
let currentWheelOptions = []
let currentWheelId = null
let currentGoodGirlTokens = 0

function renderGoodGirlTokens() {
  const tokens = document.querySelector('#good-girl-tokens')
  if (tokens) tokens.textContent = String(currentGoodGirlTokens)
}

async function refreshWheel() {
  const wheel = await loadLatestWheel()
  currentWheelId = wheel?.id || null
  currentWheelOptions = wheel?.options || []
  currentGoodGirlTokens = Math.max(0, Number(wheel?.good_girl_tokens ?? 0))
  currentWheelRotation = 0
  renderWheelOptions(currentWheelOptions)
  renderGoodGirlTokens()
  const result = document.querySelector('#wheel-result')
  if (result && wheel?.last_winner) result.textContent = `Winner: ${wheel.last_winner}`
}

async function spinCurrentWheel() {
  const wheel = document.querySelector('#wheel-visual')
  const result = document.querySelector('#wheel-result')
  const spinButton = document.querySelector('#spin-wheel-button')

  if (!wheel || !currentWheelOptions.length) {
    if (result) result.textContent = 'Create a wheel first.'
    return
  }

  if (currentGoodGirlTokens <= 0) {
    if (result) result.textContent = 'No Good Girl tokens left.'
    return
  }

  if (spinButton) spinButton.disabled = true
  let remainingTokens = currentGoodGirlTokens - 1

  if (currentWheelId) {
    const { data, error } = await supabase.rpc('consume_good_girl_token', { wheel_id: currentWheelId })
    const tokenValue = Array.isArray(data) ? data[0] : data
    if (error || tokenValue == null) {
      if (spinButton) spinButton.disabled = false
      if (result) result.textContent = error ? 'Could not use a token. Please try again.' : 'No Good Girl tokens left.'
      if (error) console.warn('Could not use Good Girl token', error)
      if (!error) {
        currentGoodGirlTokens = 0
        renderGoodGirlTokens()
      }
      return
    }
    remainingTokens = Number(tokenValue)
  }

  currentGoodGirlTokens = Math.max(0, remainingTokens)
  renderGoodGirlTokens()

  const segmentSize = 360 / currentWheelOptions.length
  const winnerIndex = Math.floor(Math.random() * currentWheelOptions.length)
  const winnerAngle = (winnerIndex + 0.5) * segmentSize
  const spins = 7 + Math.random() * 4
  const currentAngle = ((currentWheelRotation % 360) + 360) % 360
  const alignment = (360 - ((currentAngle + winnerAngle) % 360)) % 360
  const targetRotation = currentWheelRotation + spins * 360 + alignment
  currentWheelRotation = targetRotation
  const winner = currentWheelOptions[winnerIndex]

  wheel.style.transition = 'transform 5.2s cubic-bezier(0.12, 0.72, 0.2, 1)'
  wheel.style.transform = `rotate(${targetRotation}deg)`

  window.setTimeout(() => {
    if (result) result.textContent = `Winner: ${winner}`
    if (spinButton) spinButton.disabled = false
  }, 5300)

  if (currentWheelId) {
    supabase
      .from('fortune_wheels')
      .update({ last_winner: winner })
      .eq('id', currentWheelId)
      .then(({ error }) => {
        if (error) console.warn('Could not save wheel winner', error)
      })
  }
}

async function render() {
  const route = window.location.hash || '#/'
  document.querySelectorAll('body > .question-button.evading, body > .confetti').forEach(element => element.remove())

  if (route === '#/archive') {
    document.querySelector('#app').innerHTML = await archivePage()
  } else if (route === '#/confessions') {
    document.querySelector('#app').innerHTML = confessionsPage()
  } else if (route === '#/wheel') {
    document.querySelector('#app').innerHTML = wheelPage()
  } else if (route === '#/question') {
    document.querySelector('#app').innerHTML = questionPage()
  } else {
    document.querySelector('#app').innerHTML = worshipPage()
  }

  wireInteractions()
  if (route === '#/question') celebrateYes()
}

function celebrateYes() {
  const actions = document.querySelector('.question-actions')
  const response = document.querySelector('.question-response')
  const questionPageElement = document.querySelector('.question-page')
  const questionImages = document.querySelector('.question-images')
  if (!response || !questionPageElement || !questionImages || document.querySelector('.confetti')) return

  if (actions) {
    document.querySelector('[data-answer="no"]')?.remove()
    actions.hidden = true
  }

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

async function wireInteractions() {
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

  document.querySelector('#create-confession-button')?.addEventListener('click', () => {
    document.querySelector('#confession-modal')?.classList.remove('hidden')
    document.querySelector('#confession-modal')?.setAttribute('aria-hidden', 'false')
  })

  document.querySelector('#close-confession-modal')?.addEventListener('click', () => {
    document.querySelector('#confession-modal')?.classList.add('hidden')
    document.querySelector('#confession-modal')?.setAttribute('aria-hidden', 'true')
  })

  document.querySelectorAll('[data-editor-command]').forEach(button => {
    button.addEventListener('mousedown', event => {
      event.preventDefault()
      document.execCommand(button.dataset.editorCommand)
    })
  })

  document.querySelectorAll('[data-editor-color]').forEach(button => {
    button.addEventListener('mousedown', event => {
      event.preventDefault()
      document.execCommand('foreColor', false, button.dataset.editorColor)
    })
  })

  document.querySelectorAll('[data-editor-effect]').forEach(button => {
    button.addEventListener('mousedown', event => {
      event.preventDefault()
      if (button.dataset.editorEffect === 'highlight') {
        document.execCommand('backColor', false, '#f1d7b2')
      }
    })
  })

  document.querySelector('#confession-form')?.addEventListener('submit', async event => {
    event.preventDefault()
    const form = event.currentTarget
    const status = document.querySelector('#confession-form-status')
    const editors = [
      ['#confession-title-editor', '#confession-title-value'],
      ['#confession-author-editor', '#confession-author-value'],
      ['#confession-body-editor', '#confession-body-value'],
    ]
    editors.forEach(([editorSelector, valueSelector]) => {
      const editor = document.querySelector(editorSelector)
      const value = document.querySelector(valueSelector)
      if (editor && value) value.value = editor.innerHTML
    })
    const formData = new FormData(form)
    const payload = {
      title: String(formData.get('title') || '').trim(),
      author: String(formData.get('author') || '').trim(),
      body: String(formData.get('body') || '').trim(),
    }

    if (!payload.title || !payload.author || !payload.body) {
      if (status) status.textContent = 'Please complete every field.'
      return
    }

    try {
      if (status) status.textContent = 'Posting...'
      const { error } = await supabase.from('confessions').insert(payload)
      if (error) throw error

      form.reset()
      editors.forEach(([editorSelector, valueSelector]) => {
        const editor = document.querySelector(editorSelector)
        const value = document.querySelector(valueSelector)
        if (editor) editor.innerHTML = ''
        if (value) value.value = ''
      })
      document.querySelector('#confession-modal')?.classList.add('hidden')
      await refreshConfessions()
    } catch (error) {
      console.error('Could not create confession', error)
      if (status) status.textContent = `Could not post: ${error.message || 'Please try again.'}`
    }
  })

  if (window.location.hash === '#/confessions') {
    await refreshConfessions()
  }

  if (window.location.hash === '#/wheel') {
    await refreshWheel()
  }
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
