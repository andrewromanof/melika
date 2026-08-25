(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();const m=[{href:"#/",label:"Worship"},{href:"#/archive",label:"Date archive"}],c={Beach:["IMG_4779.jpeg","IMG_4780.jpeg"],Wonderland:["IMG_3330.jpeg","IMG_3341.jpeg","IMG_3371.jpeg","IMG_3527.jpeg"]};function r(s,e){return`<div class="site-shell">
    <div class="layout">
      <aside class="sidebar">
        <nav aria-label="Main navigation">${m.map(t=>`<a class="nav-link ${e===t.href?"active":""}" href="${t.href}">${t.label}</a>`).join("")}</nav>
      </aside>
      <main>${s}</main>
    </div>
  </div>`}function d(){return r(`<section class="worship-stage">
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
  </section>`,"#/")}function o(s,e){const t=c[s][e];return`<figure class="archive-photo"><img src="/pics/date/${s.toLowerCase()}/${t}" alt="${s} memory ${e+1}" /></figure>`}function u(){const s=Object.keys(c)[0];return r(`<section class="archive-view" aria-label="Date archive">
    <aside class="archive-tabs" aria-label="Date archive categories">
      <div class="archive-tab-list" role="tablist" aria-orientation="vertical">
        ${Object.keys(c).map((e,t)=>`<button class="archive-tab ${t===0?"active":""}" role="tab" aria-selected="${t===0}" data-category="${e}">${e}</button>`).join("")}
      </div>
    </aside>
    <div class="archive-gallery-wrap">
      <div class="archive-gallery" id="archive-gallery" data-category="${s}" tabindex="0" aria-label="${s} photo gallery">
        ${o(s,0)}
      </div>
      <button class="next-image" id="next-image" type="button">Next image <span>↗</span></button>
    </div>
  </section>`,"#/archive")}function g(){return r('<section class="empty-page" aria-label="Big question"></section>',"#/question")}function p(){const s=window.location.hash||"#/";document.querySelector("#app").innerHTML=s==="#/archive"?u():s==="#/question"?g():d(),h()}function h(){var s;document.querySelectorAll(".archive-tab").forEach(e=>e.addEventListener("click",()=>{const t=e.dataset.category;document.querySelectorAll(".archive-tab").forEach(a=>{const i=a===e;a.classList.toggle("active",i),a.setAttribute("aria-selected",i)});const n=document.querySelector("#archive-gallery");n.dataset.category=t,n.setAttribute("aria-label",`${t} photo gallery`),n.dataset.index="0",n.innerHTML=o(t,0),n.scrollTop=0})),(s=document.querySelector("#next-image"))==null||s.addEventListener("click",()=>{const e=document.querySelector("#archive-gallery"),t=e.dataset.category,n=(Number(e.dataset.index||0)+1)%c[t].length;e.dataset.index=String(n),e.innerHTML=o(t,n)})}window.addEventListener("hashchange",p);p();
