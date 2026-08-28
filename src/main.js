import './style.css'
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

const archiveCategories = {
  Beach: [beachOne, beachTwo],
  KBBQ: [kbbqOne],
  Wonderland: [wonderlandOne, wonderlandTwo, wonderlandThree, wonderlandFour],
}

const celebrationStorageKey = `melika-question-answered-${__BUILD_ID__}`

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

function archiveImage(category, index) {
  const image = archiveCategories[category][index]
  return `<figure class="archive-photo"><img src="${image}" alt="${category} memory ${index + 1}" /></figure>`
}

function archivePage() {
  const activeCategory = Object.keys(archiveCategories)[0]
  return shell(`<section class="archive-view" aria-label="Date archive">
    <aside class="archive-tabs" aria-label="Date archive categories">
      <div class="archive-tab-list" role="tablist" aria-orientation="vertical">
        ${Object.keys(archiveCategories).map((category, index) => `<button class="archive-tab ${index === 0 ? 'active' : ''}" role="tab" aria-selected="${index === 0}" data-category="${category}">${category}</button>`).join('')}
      </div>
    </aside>
    <div class="archive-gallery-wrap">
      <div class="archive-gallery" id="archive-gallery" data-category="${activeCategory}" tabindex="0" aria-label="${activeCategory} photo gallery">
        ${archiveImage(activeCategory, 0)}
      </div>
      <button class="next-image" id="next-image" type="button">Next image <span>↗</span></button>
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

function render() {
  const route = window.location.hash || '#/'
  document.querySelectorAll('body > .question-button.evading, body > .confetti').forEach(element => element.remove())
  document.querySelector('#app').innerHTML = route === '#/archive' ? archivePage() : route === '#/question' ? questionPage() : worshipPage()
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
  document.querySelectorAll('.archive-tab').forEach(tab => tab.addEventListener('click', () => {
    const category = tab.dataset.category
    document.querySelectorAll('.archive-tab').forEach(item => {
      const selected = item === tab
      item.classList.toggle('active', selected)
      item.setAttribute('aria-selected', selected)
    })
    const gallery = document.querySelector('#archive-gallery')
    gallery.dataset.category = category
    gallery.setAttribute('aria-label', `${category} photo gallery`)
    gallery.dataset.index = '0'
    gallery.innerHTML = archiveImage(category, 0)
    gallery.scrollTop = 0
  }))
  document.querySelector('#next-image')?.addEventListener('click', () => {
    const gallery = document.querySelector('#archive-gallery')
    const category = gallery.dataset.category
    const nextIndex = (Number(gallery.dataset.index || 0) + 1) % archiveCategories[category].length
    gallery.dataset.index = String(nextIndex)
    gallery.innerHTML = archiveImage(category, nextIndex)
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

window.addEventListener('hashchange', render)
render()
