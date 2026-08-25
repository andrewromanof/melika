(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function a(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(t){if(t.ep)return;t.ep=!0;const s=a(t);fetch(t.href,s)}})();const p=""+new URL("IMG_3545-kREpoObD.jpeg",import.meta.url).href,d=""+new URL("IMG_4779-DyZx07eH.jpeg",import.meta.url).href,u=""+new URL("IMG_4780-Bq9u-VIq.jpeg",import.meta.url).href,g=""+new URL("IMG_3330-3DNaR_8z.jpeg",import.meta.url).href,h=""+new URL("IMG_3341-B7vjYtPj.jpeg",import.meta.url).href,v=""+new URL("IMG_3371-eFMNs5Jy.jpeg",import.meta.url).href,f=""+new URL("IMG_3527-D_U11Nqv.jpeg",import.meta.url).href,y=[{href:"#/",label:"Worship"},{href:"#/archive",label:"Date archive"}],r={Beach:[d,u],Wonderland:[g,h,v,f]};function l(n,e){return`<div class="site-shell">
    <div class="layout">
      <aside class="sidebar">
        <nav aria-label="Main navigation">${y.map(a=>`<a class="nav-link ${e===a.href?"active":""}" href="${a.href}">${a.label}</a>`).join("")}</nav>
      </aside>
      <main>${n}</main>
    </div>
  </div>`}function b(){return l(`<section class="worship-stage">
    <div class="compliment-cloud compliment-left" aria-label="Compliments">
      <span class="compliment compliment-a">WOW SHE'S SO PRETTY 😍</span>
      <span class="compliment compliment-b">beautiful eyes 💕</span>
      <span class="compliment compliment-c">absolute angel 😍</span>
      <span class="compliment compliment-d">gorgeous!</span>
      <span class="compliment compliment-e">glowing ✨</span>
      <span class="compliment compliment-f">always making me blush 💗</span>
      <span class="compliment compliment-g">biggest and sweetest smile</span>
    </div>
    <img src="${p}" alt="Worship" />
    <div class="compliment-cloud compliment-right" aria-label="Compliments">
      <span class="compliment compliment-e">you light up every room 💖</span>
      <span class="compliment compliment-f">so lovely 😍</span>
      <span class="compliment compliment-g">stunning always</span>
      <span class="compliment compliment-h">pretty princess</span>
      <span class="compliment compliment-a">cutest ever 🥰</span>
      <span class="compliment compliment-b">radiant beauty</span>
      <span class="compliment compliment-c">she's magic ✨</span>
    </div>
  </section>`,"#/")}function o(n,e){return`<figure class="archive-photo"><img src="${r[n][e]}" alt="${n} memory ${e+1}" /></figure>`}function w(){const n=Object.keys(r)[0];return l(`<section class="archive-view" aria-label="Date archive">
    <aside class="archive-tabs" aria-label="Date archive categories">
      <div class="archive-tab-list" role="tablist" aria-orientation="vertical">
        ${Object.keys(r).map((e,a)=>`<button class="archive-tab ${a===0?"active":""}" role="tab" aria-selected="${a===0}" data-category="${e}">${e}</button>`).join("")}
      </div>
    </aside>
    <div class="archive-gallery-wrap">
      <div class="archive-gallery" id="archive-gallery" data-category="${n}" tabindex="0" aria-label="${n} photo gallery">
        ${o(n,0)}
      </div>
      <button class="next-image" id="next-image" type="button">Next image <span>↗</span></button>
    </div>
  </section>`,"#/archive")}function L(){return l('<section class="empty-page" aria-label="Big question"></section>',"#/question")}function m(){const n=window.location.hash||"#/";document.querySelector("#app").innerHTML=n==="#/archive"?w():n==="#/question"?L():b(),$()}function $(){var n;document.querySelectorAll(".archive-tab").forEach(e=>e.addEventListener("click",()=>{const a=e.dataset.category;document.querySelectorAll(".archive-tab").forEach(t=>{const s=t===e;t.classList.toggle("active",s),t.setAttribute("aria-selected",s)});const i=document.querySelector("#archive-gallery");i.dataset.category=a,i.setAttribute("aria-label",`${a} photo gallery`),i.dataset.index="0",i.innerHTML=o(a,0),i.scrollTop=0})),(n=document.querySelector("#next-image"))==null||n.addEventListener("click",()=>{const e=document.querySelector("#archive-gallery"),a=e.dataset.category,i=(Number(e.dataset.index||0)+1)%r[a].length;e.dataset.index=String(i),e.innerHTML=o(a,i)})}window.addEventListener("hashchange",m);m();
