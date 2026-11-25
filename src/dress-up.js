import selfieHead from '../pics/selfie-head.png'

const dressUpStorageKey = 'melika-dress-up-game-v2'
const freeTestingMode = true
const wardrobe = {
  shirts: [
    { id: 'tank-top', label: 'Tank top', icon: '🎽', price: 5 },
    { id: 'white-tshirt', label: 'White T-shirt', icon: '👕', price: 5 },
    { id: 'flannel', label: 'Flannel shirt', icon: '🧥', price: 10 },
    { id: 'show-nipples', label: 'Show nipples', icon: '🫣', price: 50 },
    { id: 'none', label: 'None', icon: '🚫', price: 0 },
  ],
  pants: [
    { id: 'denim', label: 'Blue jeans', icon: '👖', price: 10 },
    { id: 'cargo', label: 'Cargo pants', icon: '👖', price: 10 },
    { id: 'grey-sweatpants', label: 'Grey sweatpants', icon: '👖', price: 5 },
    { id: 'shorts', label: 'Shorts', icon: '🩳', price: 5 },
    { id: 'none', label: 'None', icon: '🚫', price: 0 },
  ],
  dresses: [
    { id: 'pink-dress', label: 'Pink dress', icon: '👗', price: 200 },
    { id: 'none', label: 'None', icon: '🚫', price: 0 },
  ],
  shoes: [
    { id: 'white-running-shoes', label: 'White running shoes', icon: '👟', price: null },
    { id: 'socks', label: 'Socks', icon: '🧦', price: null },
    { id: 'dress-shoes', label: 'Dress shoes', icon: '👞', price: null },
    { id: 'slippers', label: 'Slippers', icon: '🩴', price: null },
    { id: 'none', label: 'None', icon: '🚫', price: 0 },
  ],
  extras: [
    { id: 'sunglasses', label: 'Sunglasses', icon: '🕶️', price: null },
    { id: 'sleeve-tattoos', label: 'Sleeve tattoos', icon: '🖋️', price: null },
    { id: 'none', label: 'None', icon: '🚫', price: 0 },
  ],
  costumes: [
    { id: 'prisoner-suit', label: 'Prisoner suit', icon: '⛓️', price: null },
    { id: 'pyjamas', label: 'Pyjamas', icon: '🌙', price: null },
  ],
}

const categoryLabels = {
  shirts: 'Shirts',
  pants: 'Pants',
  dresses: 'Dresses',
  shoes: 'Shoes',
  extras: 'Extras',
  costumes: 'Full costumes',
}

const defaultLook = { ...Object.fromEntries(Object.keys(wardrobe).map(category => [category, 'none'])), extras: [] }
const defaultGameState = { look: defaultLook, owned: ['none'] }

function readGameState() {
  try {
    const saved = JSON.parse(localStorage.getItem(dressUpStorageKey) || '{}')
    const allItems = Object.values(wardrobe).flat()
    const owned = Array.isArray(saved.owned) ? saved.owned.filter(id => allItems.some(item => item.id === id)) : [...defaultGameState.owned]
    const look = Object.fromEntries(Object.keys(wardrobe).map(category => {
      const itemId = saved.look?.[category]
      if (category === 'extras') {
        const selectedExtras = Array.isArray(itemId) ? itemId : itemId && itemId !== 'none' ? [itemId] : []
        return [category, selectedExtras.filter((id, index) => selectedExtras.indexOf(id) === index && wardrobe.extras.some(item => item.id === id) && (freeTestingMode || owned.includes(id)))]
      }
      const isOwned = wardrobe[category].some(item => item.id === itemId) && (freeTestingMode || owned.includes(itemId))
      return [category, isOwned ? itemId : 'none']
    }))
    return { look, owned }
  } catch {
    return { ...defaultGameState, look: { ...defaultLook }, owned: [] }
  }
}

function saveGameState(state) {
  try {
    localStorage.setItem(dressUpStorageKey, JSON.stringify(state))
  } catch {
    // Keep this play session usable if browser storage is unavailable.
  }
}

function optionMarkup(category, gameState) {
  return wardrobe[category].map(option => {
    const owned = freeTestingMode || gameState.owned.includes(option.id)
    const selected = category === 'extras'
      ? option.id === 'none' ? gameState.look.extras.length === 0 : gameState.look.extras.includes(option.id)
      : gameState.look[category] === option.id
    const disabled = !owned
    const action = owned ? (selected ? 'Wearing ✓' : 'Wear') : 'Locked'
    return `
      <button class="dress-option ${selected ? 'selected' : ''} ${owned ? 'owned' : 'locked'}" type="button" data-dress-option="${option.id}" aria-pressed="${selected}" ${disabled ? 'disabled' : ''}>
        <span class="dress-option-icon" aria-hidden="true">${option.icon}</span>
        <span class="dress-option-name">${option.label}</span>
        <span class="dress-option-action">${action}</span>
      </button>`
  }).join('')
}

export function dressUpGameMarkup() {
  const gameState = readGameState()
  const categories = Object.keys(wardrobe)

  return `<section class="dress-up-page" aria-labelledby="dress-up-title">
    <header class="dress-game-heading">
      <div>
        <p class="dress-game-kicker">The tiny fashion studio</p>
        <h1 id="dress-up-title">Dress your Boyfriend</h1>
        <p class="dress-game-intro">Unlock pieces and build a Melika-approved look.</p>
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
          <svg id="dress-avatar" class="dress-avatar" viewBox="0 0 360 520" role="img" aria-labelledby="dress-avatar-title dress-avatar-description" data-face="selfie" data-shirts="${gameState.look.shirts}" data-pants="${gameState.look.pants}" data-dresses="${gameState.look.dresses}" data-shoes="${gameState.look.shoes}" data-extras="${gameState.look.extras.join(' ')}" data-costumes="${gameState.look.costumes}">
            <title id="dress-avatar-title">Your boyfriend's outfit</title>
            <desc id="dress-avatar-description">A cartoon character previewing the items you have unlocked and selected.</desc>
            <ellipse cx="180" cy="492" rx="103" ry="15" fill="#72575d" opacity=".14" />
            <path class="avatar-skin" d="M143 305h74l-7 144-19 6-11-104-12 104-20-6z" />
            <path class="avatar-bottom-pants" d="M139 300h82l-7 152-26 4-8-106-11 106-26-4z" />
            <path class="avatar-bottom-shorts" d="M139 300h82l-4 78-35 5-2-29-3 29-34-5z" />
            <path class="avatar-bottom-sweats" d="M139 300h82l-7 152h-26l-8-106-11 106h-26z" />
            <path class="avatar-cargo-pocket" d="M145 345h22v27h-22zm48 0h22v27h-22z" />
            <path class="avatar-skin avatar-feet" d="M151 438q15 0 27 9l2 15h-55q0-18 26-24zm58 0q-15 0-27 9l-2 15h55q0-18-26-24z" />
            <g class="avatar-shoes avatar-sneakers">
              <path class="avatar-shoe-color" d="M126 456q22 0 34 8l12 8q6 4 3 11h-61q-9-3-7-11 3-13 19-16zm108 0q-22 0-34 8l-12 8q-6 4-3 11h61q9-3 7-11-3-13-19-16z" />
              <path d="M111 475h64m-50-8 9 2m99 6h-64m50-8-9 2" fill="none" stroke="#fff8ef" stroke-width="3" stroke-linecap="round" />
            </g>
            <g class="avatar-shoes avatar-dress-shoes">
              <path class="avatar-shoe-color" d="M126 456q22 0 34 8l12 8q6 4 3 11h-61q-9-3-7-11 3-13 19-16zm108 0q-22 0-34 8l-12 8q-6 4-3 11h61q9-3 7-11-3-13-19-16z" />
              <path d="M111 475h64m108 0h-64" fill="none" stroke="#8a6047" stroke-width="3" stroke-linecap="round" />
            </g>
            <g class="avatar-shoes avatar-slippers">
              <path class="avatar-shoe-color" d="M127 461q27-6 49 9 7 8 2 15h-65q-8-4-3-13zm106 0q-27-6-49 9-7 8-2 15h65q8-4 3-13z" />
              <path d="M129 465q17 0 31 9m71-9q-17 0-31 9" stroke="#fff5e9" stroke-width="7" stroke-linecap="round" />
            </g>
            <g class="avatar-shoes avatar-socks"><path d="M136 430h28v38h-28zm60 0h28v38h-28z" fill="#f5f3ed" stroke="#d7d4ca" stroke-width="2" /><path d="M138 442h24m36 0h24" stroke="#b6c8c0" stroke-width="4" /></g>
            <path class="avatar-skin" d="M136 177q-20 1-29 23l-22 71q-7 19 9 26l13 5q12 4 19-9l32-67m66-49q20 1 29 23l22 71q7 19-9 26l-13 5q-12 4-19-9l-32-67" />
            <path class="avatar-skin" d="M154 148h52v50h-52z" />
            <path class="avatar-base-torso avatar-skin" d="M145 160q15-9 35-9t35 9l18 19-12 30-7 104h-78l-7-104-12-30z" />
            <path class="avatar-shirt avatar-top-color avatar-sleeves" d="M142 164l-24 10q-17 7-23 27l-5 18 31 13 20-30zm76 0 24 10q17 7 23 27l5 18-31 13-20-30z" />
            <path class="avatar-shirt avatar-top-color avatar-torso" d="M145 160q15-9 35-9t35 9l18 19-12 30-7 104h-78l-7-104-12-30z" />
            <path class="avatar-flannel-detail" d="M180 169v138m-41-55h82m-66-45h50m-50 73h50" fill="none" stroke="#f2d9bf" stroke-width="3" />
            <g class="avatar-nipples"><circle cx="164" cy="210" r="3" /><circle cx="196" cy="210" r="3" /></g>
            <path class="avatar-dress" d="M145 160q15-9 35-9t35 9l18 19-10 34 31 135H106l31-135-10-34z" />
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
            <g class="avatar-costume avatar-costume-prisoner">
              <path d="M145 161q15-9 35-9t35 9l18 19-12 30-7 104h-78l-7-104-12-30z" fill="#ed873a" stroke="#ad5623" stroke-width="3" />
              <path d="M141 300h78l-7 152h-26l-8-106-11 106h-26z" fill="#ed873a" stroke="#ad5623" stroke-width="3" />
              <path d="m118 181 28-15-9 118-29-7zm96-15 28 15 10 96-29 7z" fill="#ed873a" stroke="#ad5623" stroke-width="3" />
              <path d="M125 204h110m-104 32h98m-93 32h89m-82 32h75" stroke="#333d38" stroke-width="12" />
            </g>
            <g class="avatar-costume avatar-costume-pyjamas">
              <path d="M145 161q15-9 35-9t35 9l18 19-12 30-7 104h-78l-7-104-12-30z" fill="#7790b2" stroke="#526884" stroke-width="3" />
              <path d="M141 300h78l-7 152h-26l-8-106-11 106h-26z" fill="#7790b2" stroke="#526884" stroke-width="3" />
              <path d="m118 181 24-15-8 111-28-7zm100-15 24 15 12 89-28 7z" fill="#7790b2" stroke="#526884" stroke-width="3" />
              <g class="pyjama-teddies" fill="#c47d56" stroke="#89563e" stroke-width="1.5" stroke-linejoin="round">
                <g transform="translate(157 202)">
                  <circle cx="0" cy="0" r="5" /><circle cx="-4" cy="-4" r="2.5" /><circle cx="4" cy="-4" r="2.5" />
                  <ellipse cx="0" cy="9" rx="6" ry="7" /><path d="M-5 7-9 12m14-5 4 5m-6 7-2 3m-3-3 2 3" fill="none" stroke-linecap="round" />
                  <circle cx="-1.7" cy="0" r=".7" fill="#342c2b" stroke="none" /><circle cx="1.7" cy="0" r=".7" fill="#342c2b" stroke="none" />
                  <ellipse cx="0" cy="9" rx="2.5" ry="3" fill="#edc39a" stroke="none" />
                </g>
                <g transform="translate(202 255) scale(.9)">
                  <circle cx="0" cy="0" r="5" /><circle cx="-4" cy="-4" r="2.5" /><circle cx="4" cy="-4" r="2.5" />
                  <ellipse cx="0" cy="9" rx="6" ry="7" /><path d="M-5 7-9 12m14-5 4 5m-6 7-2 3m-3-3 2 3" fill="none" stroke-linecap="round" />
                  <circle cx="-1.7" cy="0" r=".7" fill="#342c2b" stroke="none" /><circle cx="1.7" cy="0" r=".7" fill="#342c2b" stroke="none" />
                  <ellipse cx="0" cy="9" rx="2.5" ry="3" fill="#edc39a" stroke="none" />
                </g>
                <g transform="translate(156 333)">
                  <circle cx="0" cy="0" r="5" /><circle cx="-4" cy="-4" r="2.5" /><circle cx="4" cy="-4" r="2.5" />
                  <ellipse cx="0" cy="9" rx="6" ry="7" /><path d="M-5 7-9 12m14-5 4 5m-6 7-2 3m-3-3 2 3" fill="none" stroke-linecap="round" />
                  <circle cx="-1.7" cy="0" r=".7" fill="#342c2b" stroke="none" /><circle cx="1.7" cy="0" r=".7" fill="#342c2b" stroke="none" />
                  <ellipse cx="0" cy="9" rx="2.5" ry="3" fill="#edc39a" stroke="none" />
                </g>
                <g transform="translate(202 393) scale(.9)">
                  <circle cx="0" cy="0" r="5" /><circle cx="-4" cy="-4" r="2.5" /><circle cx="4" cy="-4" r="2.5" />
                  <ellipse cx="0" cy="9" rx="6" ry="7" /><path d="M-5 7-9 12m14-5 4 5m-6 7-2 3m-3-3 2 3" fill="none" stroke-linecap="round" />
                  <circle cx="-1.7" cy="0" r=".7" fill="#342c2b" stroke="none" /><circle cx="1.7" cy="0" r=".7" fill="#342c2b" stroke="none" />
                  <ellipse cx="0" cy="9" rx="2.5" ry="3" fill="#edc39a" stroke="none" />
                </g>
              </g>
            </g>
            <path class="avatar-hair-back" d="M138 157q2-63 42-63t42 63l-11 29q-31-13-62 0z" fill="#493832" />
            <circle class="avatar-ears" cx="128" cy="111" r="9" fill="#d5a07d" /><circle class="avatar-ears" cx="232" cy="111" r="9" fill="#d5a07d" />
            <ellipse class="avatar-face" cx="180" cy="111" rx="50" ry="59" fill="#e2b18e" />
            <path class="avatar-hair-front" d="M132 104q0-56 48-56 43 0 49 49-18-17-35-20-24 19-62 15z" fill="#493832" />
            <path class="avatar-face-details" d="M148 113q10-8 20 0m24 0q10-8 20 0" fill="none" stroke="#493832" stroke-width="4" stroke-linecap="round" />
            <g class="avatar-face-details"><circle cx="158" cy="123" r="3" fill="#302725" /><circle cx="202" cy="123" r="3" fill="#302725" />
              <path d="M180 124l-3 13 7 1m-15 13q11 10 23 0" fill="none" stroke="#a65e55" stroke-width="3" stroke-linecap="round" />
              <ellipse cx="147" cy="137" rx="8" ry="4" fill="#df8c81" opacity=".35" /><ellipse cx="213" cy="137" rx="8" ry="4" fill="#df8c81" opacity=".35" />
            </g>
            <image class="avatar-selfie" href="${selfieHead}" x="125" y="42" width="110" height="144" preserveAspectRatio="none" />
            <path class="avatar-hair-fluffy" d="M131 103q-13-21 7-34 0-22 23-22 13-23 35-5 26-10 32 19 21 9 10 39-25-24-49-25-26 20-58 28z" fill="#493832" />
            <path class="avatar-hair-curly" d="M132 105q-18-17-1-30-5-21 14-26 6-24 29-16 17-17 31 1 24-3 25 22 17 10 8 37-12-14-24-18-13 12-29 1-23 16-53 29z" fill="#493832" />
            <path class="avatar-hair-styled" d="M130 105q-8-29 16-40 7-22 32-17 20-17 37 2 17 3 19 24 8 17-5 33-14-22-35-28-25 16-64 26z" fill="#493832" />
            <g class="avatar-extra avatar-sleeve-tattoos">
              <g fill="none" stroke="#263b36" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M116 208q-12 13-12 29t-11 36m7-27q9-5 17-1m-20 11q9-4 17 2m-19 7q9-3 16 4m-10-45q8-2 14 5m-11 4q8-3 14 4" />
                <path d="M102 222q9-11 19-4 7 7-1 13-8 5-13-2-4-7 5-10m-8 17q11 1 12 10t-10 12m-5-7q9 4 16 0" />
                <path d="M91 267q8-9 16 0t16 0m-31 7q8-9 16 0t16 0m-30 7q7-8 14 0t14 0" />
              </g>
              <g transform="translate(360 0) scale(-1 1)" fill="none" stroke="#263b36" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M116 208q-12 13-12 29t-11 36m7-27q9-5 17-1m-20 11q9-4 17 2m-19 7q9-3 16 4m-10-45q8-2 14 5m-11 4q8-3 14 4" />
                <path d="M102 222q9-11 19-4 7 7-1 13-8 5-13-2-4-7 5-10m-8 17q11 1 12 10t-10 12m-5-7q9 4 16 0" />
                <path d="M91 267q8-9 16 0t16 0m-31 7q8-9 16 0t16 0m-30 7q7-8 14 0t14 0" />
              </g>
              <g fill="#b85049" stroke="#713b36" stroke-width="1.3">
                <circle cx="112" cy="244" r="3.5" /><circle cx="250" cy="244" r="3.5" />
                <path d="M112 237q-5-7-8-1 0 4 8 8 8-4 8-8-3-6-8 1zm138 0q-5-7-8-1 0 4 8 8 8-4 8-8-3-6-8 1z" />
              </g>
              <g fill="#d5b16a" stroke="#6e5840" stroke-width="1">
                <circle cx="101" cy="220" r="2" /><circle cx="259" cy="220" r="2" />
                <circle cx="94" cy="262" r="1.8" /><circle cx="266" cy="262" r="1.8" />
              </g>
            </g>
            <g class="avatar-extra avatar-sunglasses">
              <path d="M135 111h40q4 24-19 24-20 0-21-24zm50 0h40q-1 24-21 24-23 0-19-24zm-8 7h16" fill="#050607" stroke="#050607" stroke-width="3" stroke-linejoin="round" />
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
          <span class="dress-closet-count" aria-hidden="true">01 — 06</span>
        </div>
        <div class="dress-category-tabs" role="tablist" aria-label="Clothing categories">
          ${categories.map((category, index) => `<button class="dress-category ${index === 0 ? 'active' : ''}" id="dress-tab-${category}" type="button" role="tab" aria-selected="${index === 0}" aria-controls="dress-options" tabindex="${index === 0 ? '0' : '-1'}" data-dress-category="${category}">${categoryLabels[category]}</button>`).join('')}
        </div>
        <div class="dress-closet-note"><span aria-hidden="true">✦</span> All wardrobe pieces are free while you test.</div>
        <div class="dress-options" id="dress-options" role="tabpanel" aria-labelledby="dress-tab-shirts" tabindex="0">
          ${optionMarkup('shirts', gameState)}
        </div>
        <p class="dress-game-status" id="dress-game-status" role="status" aria-live="polite">Choose any piece to try it on for free.</p>
      </section>
    </div>
  </section>`
}

function updateLook(look) {
  const avatar = document.querySelector('#dress-avatar')
  if (!avatar) return

  Object.entries(look).forEach(([category, item]) => {
    avatar.dataset[category] = Array.isArray(item) ? item.join(' ') : item
  })

  const caption = document.querySelector('#dress-look-caption')
  const outfitNames = Object.entries(look).flatMap(([category, selected]) => {
    const selectedIds = Array.isArray(selected) ? selected : [selected]
    return selectedIds.map(itemId => wardrobe[category].find(item => item.id === itemId)?.label).filter(label => label && label !== 'None')
  })
  if (caption) caption.textContent = outfitNames.length ? `Melika-approved: ${outfitNames.join(' · ')}` : 'A clean slate — pick a piece when the shop opens.'
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
  options.innerHTML = optionMarkup(category, readGameState())
}

export function initDressUpGame() {
  const avatar = document.querySelector('#dress-avatar')
  if (!avatar) return

  const gameState = readGameState()
  updateLook(gameState.look)

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
    const option = wardrobe[category].find(item => item.id === optionButton.dataset.dressOption)
    if (!option) return

    const currentState = readGameState()
    if (category === 'extras') {
      currentState.look.extras = option.id === 'none'
        ? []
        : currentState.look.extras.includes(option.id)
          ? currentState.look.extras.filter(id => id !== option.id)
          : [...currentState.look.extras, option.id]
    } else {
      currentState.look[category] = option.id
    }
    saveGameState(currentState)
    updateLook(currentState.look)
    setCategory(category)
    document.querySelector('#dress-game-status').textContent = category === 'extras'
      ? option.id === 'none' ? 'Extras cleared.' : `${option.label} ${currentState.look.extras.includes(option.id) ? 'added' : 'removed'}. Looking good!`
      : `${option.label} selected. Looking good!`
  })

  document.querySelector('#dress-randomize').addEventListener('click', () => {
    const currentState = readGameState()
    const randomLook = Object.fromEntries(Object.entries(wardrobe).map(([category, options]) => {
      if (category === 'extras') {
        const availableExtras = options.filter(option => option.id !== 'none' && (freeTestingMode || currentState.owned.includes(option.id)))
        return [category, availableExtras.filter(() => Math.random() < 0.5).map(option => option.id)]
      }
      const available = freeTestingMode ? options : options.filter(option => currentState.owned.includes(option.id))
      const choice = available[Math.floor(Math.random() * available.length)]
      return [category, choice?.id || 'none']
    }))
    if (!freeTestingMode && !currentState.owned.length) {
      document.querySelector('#dress-game-status').textContent = 'Unlock a piece to use Surprise me.'
      return
    }
    currentState.look = randomLook
    saveGameState(currentState)
    updateLook(randomLook)
    const activeCategory = document.querySelector('.dress-category.active')?.dataset.dressCategory || 'shirts'
    setCategory(activeCategory)
    document.querySelector('#dress-game-status').textContent = 'A fresh look from the style machine!'
  })

  document.querySelector('#dress-reset').addEventListener('click', () => {
    const currentState = readGameState()
    currentState.look = { ...defaultLook }
    saveGameState(currentState)
    updateLook(currentState.look)
    setCategory('shirts')
    document.querySelector('#dress-game-status').textContent = 'Everything cleared off the outfit. Pick a fresh look!'
  })
}
