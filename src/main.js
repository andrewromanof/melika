import './style.css'

const nav = [
  { href: '#/', label: 'Worship' },
  { href: '#/archive', label: 'Date archive' },
]

const archiveCategories = {
  Beach: ['IMG_4779.jpeg', 'IMG_4780.jpeg'],
  Wonderland: ['IMG_3330.jpeg', 'IMG_3341.jpeg', 'IMG_3371.jpeg', 'IMG_3527.jpeg'],
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
    <img src="/pics/worship/IMG_3545.jpeg" alt="Worship" />
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
  const file = archiveCategories[category][index]
  return `<figure class="archive-photo"><img src="/pics/date/${category.toLowerCase()}/${file}" alt="${category} memory ${index + 1}" /></figure>`
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
  return shell('<section class="empty-page" aria-label="Big question"></section>', '#/question')
}

function render() {
  const route = window.location.hash || '#/'
  document.querySelector('#app').innerHTML = route === '#/archive' ? archivePage() : route === '#/question' ? questionPage() : worshipPage()
  wireInteractions()
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
}

window.addEventListener('hashchange', render)
render()
