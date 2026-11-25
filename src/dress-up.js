const dressUpStorageKey = 'melika-dress-up-look-v1'

const wardrobe = {
  top: [
    { id: 'tee', label: 'Sunday tee', icon: '👕' },
    { id: 'hoodie', label: 'Cloud hoodie', icon: '🧥' },
    { id: 'jacket', label: 'Denim jacket', icon: '🧥' },
    { id: 'sweater', label: 'Cozy sweater', icon: '🧶' },
  ],
  bottom: [
    { id: 'denim', label: 'Blue jeans', icon: '👖' },
    { id: 'cargo', label: 'Cargo pants', icon: '🪡' },
    { id: 'chinos', label: 'Olive chinos', icon: '👖' },
    { id: 'shorts', label: 'Weekend shorts', icon: '🩳' },
  ],
  shoes: [
    { id: 'sneakers', label: 'Fresh sneakers', icon: '👟' },
    { id: 'boots', label: 'Adventure boots', icon: '🥾' },
    { id: 'slides', label: 'Comfy slides', icon: '🩴' },
  ],
  accessory: [
    { id: 'none', label: 'No accessory', icon: '✨' },
    { id: 'cap', label: 'Favorite cap', icon: '🧢' },
    { id: 'beanie', label: 'Cozy beanie', icon: '🧶' },
    { id: 'sunglasses', label: 'Cool shades', icon: '🕶️' },
  ],
}

const categoryLabels = {
  top: 'Tops',
  bottom: 'Bottoms',
  shoes: 'Shoes',
  accessory: 'Extras',
}

const defaultLook = {
  top: 'tee',
  bottom: 'denim',
  shoes: 'sneakers',
  accessory: 'none',
}

function readLook() {
  try {
    const saved = JSON.parse(localStorage.getItem(dressUpStorageKey) || '{}')
    return Object.fromEntries(Object.entries(defaultLook).map(([category, fallback]) => {
      const validIds = wardrobe[category].map(option => option.id)
      return [category, validIds.includes(saved[category]) ? saved[category] : fallback]
    }))
  } catch {
    return { ...defaultLook }
  }
}

function optionMarkup(category, look) {
  return wardrobe[category].map(option => `
    <button class="dress-option ${look[category] === option.id ? 'selected' : ''}" type="button" data-dress-option="${option.id}" aria-pressed="${look[category] === option.id}">
      <span class="dress-option-icon" aria-hidden="true">${option.icon}</span>
      <span>${option.label}</span>
      <span class="dress-option-check" aria-hidden="true">✓</span>
    </button>`).join('')
}

export function dressUpGameMarkup() {
  const look = readLook()
  const categories = Object.keys(wardrobe)

  return `<section class="dress-up-page" aria-labelledby="dress-up-title">
    <header class="dress-game-heading">
      <div>
        <p class="dress-game-kicker">The tiny fashion studio</p>
        <h1 id="dress-up-title">Dress your Boyfriend</h1>
        <p class="dress-game-intro">Pick a fit, add a little flair, and make him Melika-approved.</p>
      </div>
      <div class="dress-game-actions">
        <button class="dress-randomize" id="dress-randomize" type="button"><span aria-hidden="true">✦</span> Surprise me</button>
        <button class="dress-reset" id="dress-reset" type="button">Start over</button>
      </div>
    </header>

    <div class="dress-game-board">
      <section class="dress-stage" aria-label="Boyfriend outfit preview">
        <span class="dress-stage-label">LOOKBOOK <span>NO. 01</span></span>
        <span class="dress-stage-sparkle sparkle-one" aria-hidden="true">✦</span>
        <span class="dress-stage-sparkle sparkle-two" aria-hidden="true">✧</span>
        <span class="dress-stage-heart" aria-hidden="true">♡</span>
        <div class="dress-avatar-wrap">
          <svg id="dress-avatar" class="dress-avatar" viewBox="0 0 360 520" role="img" aria-labelledby="dress-avatar-title dress-avatar-description" data-top="${look.top}" data-bottom="${look.bottom}" data-shoes="${look.shoes}" data-accessory="${look.accessory}">
            <title id="dress-avatar-title">Your boyfriend's outfit</title>
            <desc id="dress-avatar-description">A cartoon character wearing the outfit you choose.</desc>
            <ellipse cx="180" cy="492" rx="103" ry="15" fill="#72575d" opacity=".14" />
            <path d="M143 305h74l-7 144-19 6-11-104-12 104-20-6z" fill="#d5a07d" />
            <path class="avatar-bottom-pants" d="M139 300h82l-7 152-26 4-8-106-11 106-26-4z" />
            <path class="avatar-bottom-shorts" d="M139 300h82l-4 78-35 5-2-29-3 29-34-5z" />
            <path class="avatar-cargo-pocket" d="M145 345h22v27h-22zm48 0h22v27h-22z" />
            <path d="M151 438q15 0 27 9l2 15h-55q0-18 26-24zm58 0q-15 0-27 9l-2 15h55q0-18-26-24z" fill="#c58360" />
            <g class="avatar-shoes avatar-sneakers">
              <path class="avatar-shoe-color" d="M126 456q22 0 34 8l12 8q6 4 3 11h-61q-9-3-7-11 3-13 19-16zm108 0q-22 0-34 8l-12 8q-6 4-3 11h61q9-3 7-11-3-13-19-16z" />
              <path d="M111 475h64m-50-8 9 2m99 6h-64m50-8-9 2" fill="none" stroke="#fff8ef" stroke-width="3" stroke-linecap="round" />
            </g>
            <g class="avatar-shoes avatar-boots">
              <path class="avatar-shoe-color" d="M137 430h29l8 40q11 6 8 15h-69q-5-7 3-14l13-10zm57 0h29l8 31 13 10q8 7 3 14h-69q-3-9 8-15z" />
              <path d="M132 458h31m-25 8h29m44-8h31m-38 8h29" stroke="#fff1dc" stroke-width="3" stroke-linecap="round" />
            </g>
            <g class="avatar-shoes avatar-slides">
              <path class="avatar-shoe-color" d="M127 461q27-6 49 9 7 8 2 15h-65q-8-4-3-13zm106 0q-27-6-49 9-7 8-2 15h65q8-4 3-13z" />
              <path d="M129 465q17 0 31 9m71-9q-17 0-31 9" stroke="#fff5e9" stroke-width="7" stroke-linecap="round" />
            </g>
            <path d="M136 177q-20 1-29 23l-22 71q-7 19 9 26l13 5q12 4 19-9l32-67m66-49q20 1 29 23l22 71q7 19-9 26l-13 5q-12 4-19-9l-32-67" fill="#d5a07d" />
            <path d="M154 148h52v50h-52z" fill="#d5a07d" />
            <path class="avatar-top-color avatar-sleeves" d="M142 164l-24 10q-17 7-23 27l-5 18 31 13 20-30zm76 0 24 10q17 7 23 27l5 18-31 13-20-30z" />
            <path class="avatar-top-color avatar-torso" d="M145 160q15-9 35-9t35 9l18 19-12 30-7 104h-78l-7-104-12-30z" />
            <g class="hoodie-detail">
              <path d="M151 166q29 23 58 0m-34 22v20m10-20v20m-37 47h64l-5 30h-54z" fill="none" stroke="#fff1df" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <g class="jacket-detail">
              <path d="m155 157 25 20 25-20m-25 20v132m-30-56h18v23h-18zm42 0h18v23h-18z" fill="none" stroke="#d7e3ea" stroke-width="3" stroke-linejoin="round" />
              <circle cx="180" cy="202" r="2.5" fill="#f7ead8" /><circle cx="180" cy="224" r="2.5" fill="#f7ead8" /><circle cx="180" cy="246" r="2.5" fill="#f7ead8" />
            </g>
            <g class="sweater-detail" fill="#f3dfc5" opacity=".75">
              <path d="M111 215h138v8H111zm3 18h132v5H114z" />
            </g>
            <path d="M138 157q2-63 42-63t42 63l-11 29q-31-13-62 0z" fill="#493832" />
            <circle cx="128" cy="111" r="9" fill="#d5a07d" /><circle cx="232" cy="111" r="9" fill="#d5a07d" />
            <ellipse cx="180" cy="111" rx="50" ry="59" fill="#e2b18e" />
            <path d="M132 104q0-56 48-56 43 0 49 49-18-17-35-20-24 19-62 15z" fill="#493832" />
            <path d="M148 113q10-8 20 0m24 0q10-8 20 0" fill="none" stroke="#493832" stroke-width="4" stroke-linecap="round" />
            <circle cx="158" cy="123" r="3" fill="#302725" /><circle cx="202" cy="123" r="3" fill="#302725" />
            <path d="M180 124l-3 13 7 1m-15 13q11 10 23 0" fill="none" stroke="#a65e55" stroke-width="3" stroke-linecap="round" />
            <ellipse cx="147" cy="137" rx="8" ry="4" fill="#df8c81" opacity=".35" /><ellipse cx="213" cy="137" rx="8" ry="4" fill="#df8c81" opacity=".35" />
            <g class="avatar-accessory avatar-cap">
              <path d="M134 94q5-47 48-47 39 0 45 45-38-17-93 2z" fill="#668876" />
              <path d="M178 87q43-1 67 11-27 10-66 1" fill="#4d6e5c" />
            </g>
            <g class="avatar-accessory avatar-beanie">
              <path d="M131 92q4-48 49-48t49 48q-49-16-98 0z" fill="#bc6749" />
              <path d="M130 88q50-13 100 0v12q-50-12-100 0z" fill="#a6533d" />
              <circle cx="180" cy="43" r="8" fill="#d9997b" />
            </g>
            <g class="avatar-accessory avatar-sunglasses">
              <path d="M135 111h40q4 24-19 24-20 0-21-24zm50 0h40q-1 24-21 24-23 0-19-24zm-8 7h16" fill="#3d4846" stroke="#f2d5a6" stroke-width="3" stroke-linejoin="round" />
              <path d="M143 116h25m35 0h15" stroke="#8eaaa0" stroke-width="3" stroke-linecap="round" />
            </g>
          </svg>
        </div>
        <p class="dress-look-caption" id="dress-look-caption" aria-live="polite"></p>
        <span class="dress-stage-sticker" aria-hidden="true">100%<br />cutie</span>
      </section>

      <section class="dress-closet" aria-label="Outfit closet">
        <div class="dress-closet-heading">
          <div><p class="dress-closet-kicker">THE CLOSET</p><h2>Pick your pieces</h2></div>
          <span class="dress-closet-count" aria-hidden="true">01 — 04</span>
        </div>
        <div class="dress-category-tabs" role="tablist" aria-label="Clothing categories">
          ${categories.map((category, index) => `<button class="dress-category ${index === 0 ? 'active' : ''}" id="dress-tab-${category}" type="button" role="tab" aria-selected="${index === 0}" aria-controls="dress-options" tabindex="${index === 0 ? '0' : '-1'}" data-dress-category="${category}">${categoryLabels[category]}</button>`).join('')}
        </div>
        <div class="dress-closet-note"><span aria-hidden="true">✦</span> Tap a piece to try it on</div>
        <div class="dress-options" id="dress-options" role="tabpanel" aria-labelledby="dress-tab-top" tabindex="0">
          ${optionMarkup('top', look)}
        </div>
        <p class="dress-game-status" id="dress-game-status" role="status" aria-live="polite">Tap a wardrobe tab to start styling.</p>
      </section>
    </div>
  </section>`
}

function saveLook(look) {
  try {
    localStorage.setItem(dressUpStorageKey, JSON.stringify(look))
  } catch {
    // The outfit still works for this visit if storage is unavailable.
  }
}

function updateLook(look) {
  const avatar = document.querySelector('#dress-avatar')
  if (!avatar) return

  Object.entries(look).forEach(([category, item]) => {
    avatar.dataset[category] = item
  })

  const outfitNames = Object.entries(look).map(([category, item]) => {
    const option = wardrobe[category].find(entry => entry.id === item)
    return option?.label
  }).filter(Boolean)
  const caption = document.querySelector('#dress-look-caption')
  if (caption) caption.textContent = `Melika-approved: ${outfitNames.join(' · ')}`
}

function setCategory(category) {
  const selectedTab = document.querySelector(`#dress-tab-${category}`)
  if (!selectedTab) return

  document.querySelectorAll('.dress-category').forEach(tab => {
    const selected = tab === selectedTab
    tab.classList.toggle('active', selected)
    tab.setAttribute('aria-selected', String(selected))
    tab.tabIndex = selected ? 0 : -1
  })

  const options = document.querySelector('#dress-options')
  options.setAttribute('aria-labelledby', selectedTab.id)
  options.innerHTML = optionMarkup(category, readLook())
}

export function initDressUpGame() {
  const avatar = document.querySelector('#dress-avatar')
  if (!avatar) return

  const look = readLook()
  updateLook(look)

  document.querySelectorAll('.dress-category').forEach(tab => {
    tab.addEventListener('click', () => setCategory(tab.dataset.dressCategory))
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
      event.preventDefault()
      const tabs = [...document.querySelectorAll('.dress-category')]
      const currentIndex = tabs.indexOf(tab)
      const nextIndex = event.key === 'Home' ? 0
        : event.key === 'End' ? tabs.length - 1
          : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
      tabs[nextIndex].focus()
      setCategory(tabs[nextIndex].dataset.dressCategory)
    })
  })

  document.querySelector('#dress-options').addEventListener('click', event => {
    const optionButton = event.target.closest('[data-dress-option]')
    const categoryTab = document.querySelector('.dress-category.active')
    if (!optionButton || !categoryTab) return

    const category = categoryTab.dataset.dressCategory
    const nextLook = { ...readLook(), [category]: optionButton.dataset.dressOption }
    saveLook(nextLook)
    updateLook(nextLook)
    setCategory(category)

    const selectedOption = wardrobe[category].find(option => option.id === nextLook[category])
    document.querySelector('#dress-game-status').textContent = `${selectedOption.label} selected. Looking good!`
  })

  document.querySelector('#dress-randomize').addEventListener('click', () => {
    const randomLook = Object.fromEntries(Object.entries(wardrobe).map(([category, options]) => {
      const choice = options[Math.floor(Math.random() * options.length)]
      return [category, choice.id]
    }))
    saveLook(randomLook)
    updateLook(randomLook)
    const activeCategory = document.querySelector('.dress-category.active')?.dataset.dressCategory || 'top'
    setCategory(activeCategory)
    document.querySelector('#dress-game-status').textContent = 'A fresh look from the style machine!'
  })

  document.querySelector('#dress-reset').addEventListener('click', () => {
    const resetLook = { ...defaultLook }
    saveLook(resetLook)
    updateLook(resetLook)
    setCategory('top')
    document.querySelector('#dress-game-status').textContent = 'Back to the classic look.'
  })
}
