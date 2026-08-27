(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const a of e)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function s(e){const a={};return e.integrity&&(a.integrity=e.integrity),e.referrerPolicy&&(a.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?a.credentials="include":e.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(e){if(e.ep)return;e.ep=!0;const a=s(e);fetch(e.href,a)}})();const b=""+new URL("IMG_3545-kREpoObD.jpeg",import.meta.url).href,q=""+new URL("IMG_4779-DyZx07eH.jpeg",import.meta.url).href,w=""+new URL("IMG_4780-Bq9u-VIq.jpeg",import.meta.url).href,M=""+new URL("IMG_3330-3DNaR_8z.jpeg",import.meta.url).href,L=""+new URL("IMG_3341-B7vjYtPj.jpeg",import.meta.url).href,$=""+new URL("IMG_3371-eFMNs5Jy.jpeg",import.meta.url).href,S=""+new URL("IMG_3527-D_U11Nqv.jpeg",import.meta.url).href,E=""+new URL("IMG_3556-B9mXDfzq.png",import.meta.url).href,x=""+new URL("IMG_3557-C8M5GXYi.png",import.meta.url).href,I=[{href:"#/",label:"Worship"},{href:"#/archive",label:"Date archive"},{href:"#/question",label:"???"}],l={Beach:[q,w],Wonderland:[M,L,$,S]},u="melika-question-answered-1787792660501";function d(t,n){return`<div class="site-shell">
    <div class="layout">
      <aside class="sidebar">
        <nav aria-label="Main navigation">${I.map(s=>`<a class="nav-link ${n===s.href?"active":""}" href="${s.href}">${s.label}</a>`).join("")}</nav>
      </aside>
      <main>${t}</main>
    </div>
  </div>`}function P(){return d(`<section class="worship-stage">
    <div class="compliment-cloud compliment-left" aria-label="Compliments">
      <span class="compliment compliment-a">WOW SHE'S SO PRETTY 😍</span>
      <span class="compliment compliment-b">beautiful eyes 💕</span>
      <span class="compliment compliment-c">absolute angel 😍</span>
      <span class="compliment compliment-d">gorgeous!</span>
      <span class="compliment compliment-e">glowing ✨</span>
      <span class="compliment compliment-f">always making me blush 💗</span>
      <span class="compliment compliment-g">biggest and sweetest smile</span>
    </div>
    <img src="${b}" alt="Worship" />
    <div class="compliment-cloud compliment-right" aria-label="Compliments">
      <span class="compliment compliment-e">you light up every room 💖</span>
      <span class="compliment compliment-f">so lovely 😍</span>
      <span class="compliment compliment-g">stunning always</span>
      <span class="compliment compliment-h">pretty princess</span>
      <span class="compliment compliment-a">cutest ever 🥰</span>
      <span class="compliment compliment-b">radiant beauty</span>
      <span class="compliment compliment-c">she's magic ✨</span>
    </div>
  </section>`,"#/")}function m(t,n){return`<figure class="archive-photo"><img src="${l[t][n]}" alt="${t} memory ${n+1}" /></figure>`}function O(){const t=Object.keys(l)[0];return d(`<section class="archive-view" aria-label="Date archive">
    <aside class="archive-tabs" aria-label="Date archive categories">
      <div class="archive-tab-list" role="tablist" aria-orientation="vertical">
        ${Object.keys(l).map((n,s)=>`<button class="archive-tab ${s===0?"active":""}" role="tab" aria-selected="${s===0}" data-category="${n}">${n}</button>`).join("")}
      </div>
    </aside>
    <div class="archive-gallery-wrap">
      <div class="archive-gallery" id="archive-gallery" data-category="${t}" tabindex="0" aria-label="${t} photo gallery">
        ${m(t,0)}
      </div>
      <button class="next-image" id="next-image" type="button">Next image <span>↗</span></button>
    </div>
  </section>`,"#/archive")}function j(){return d(`<section class="question-page" aria-labelledby="question-title">
    <div class="question-heading">
      <p class="eyebrow">A little question</p>
      <h1 id="question-title">👉 👈 😳</h1>
    </div>
    <div class="question-prompt">
      <p>Will you, gorgeous Melika from Mashhad, be my boyfriend?</p>
      <div class="question-actions" role="group" aria-label="Answer the question">
        <button class="question-button question-button-primary" type="button" data-answer="yes">Yes, handsome <span aria-hidden="true">↗</span></button>
        <button class="question-button question-button-secondary" type="button" data-answer="no">No :(</button>
      </div>
      <p class="question-response" aria-live="polite"></p>
    </div>
    <div class="question-images" hidden aria-label="Celebration photos">
      <img class="question-image question-image-left" src="${E}" alt="Celebration photo" />
      <img class="question-image question-image-right" src="${x}" alt="Celebration photo" />
    </div>
  </section>`,"#/question")}function p(){const t=window.location.hash||"#/";document.querySelectorAll("body > .question-button.evading, body > .confetti").forEach(n=>n.remove()),document.querySelector("#app").innerHTML=t==="#/archive"?O():t==="#/question"?j():P(),T(),t==="#/question"&&localStorage.getItem(u)==="yes"&&h()}function h(){var a;const t=document.querySelector(".question-actions"),n=document.querySelector(".question-response"),s=document.querySelector(".question-page"),r=document.querySelector(".question-images");if(!t||!n||!s||!r||document.querySelector(".confetti"))return;(a=document.querySelector('[data-answer="no"]'))==null||a.remove(),t.hidden=!0,r.hidden=!1,n.className="question-response yes-response",n.textContent="🎉 SHE SAID YES!!! 🎉",s.classList.add("celebrating");const e=document.createElement("div");e.className="confetti";for(let o=0;o<80;o+=1){const i=document.createElement("span");i.style.setProperty("--x",`${Math.random()*100}vw`),i.style.setProperty("--delay",`${Math.random()*1.8}s`),i.style.setProperty("--duration",`${2.4+Math.random()*2.4}s`),i.style.setProperty("--drift",`${-80+Math.random()*160}px`),i.style.setProperty("--color",["#e25477","#e19a34","#789bce","#4b8c76","#8c65ac"][o%5]),e.append(i)}document.body.append(e)}function T(){var s,r;document.querySelectorAll(".archive-tab").forEach(e=>e.addEventListener("click",()=>{const a=e.dataset.category;document.querySelectorAll(".archive-tab").forEach(i=>{const c=i===e;i.classList.toggle("active",c),i.setAttribute("aria-selected",c)});const o=document.querySelector("#archive-gallery");o.dataset.category=a,o.setAttribute("aria-label",`${a} photo gallery`),o.dataset.index="0",o.innerHTML=m(a,0),o.scrollTop=0})),(s=document.querySelector("#next-image"))==null||s.addEventListener("click",()=>{const e=document.querySelector("#archive-gallery"),a=e.dataset.category,o=(Number(e.dataset.index||0)+1)%l[a].length;e.dataset.index=String(o),e.innerHTML=m(a,o)});const t=document.querySelector('[data-answer="no"]'),n=()=>{const e=window.visualViewport,a=Math.floor((e==null?void 0:e.width)||document.documentElement.clientWidth),o=Math.floor((e==null?void 0:e.height)||document.documentElement.clientHeight),i=Math.floor((e==null?void 0:e.offsetLeft)||0),c=Math.floor((e==null?void 0:e.offsetTop)||0);t.classList.contains("evading")||document.body.append(t);const g=Math.min(t.offsetWidth,a-16),f=Math.min(t.offsetHeight,o-16),y=Math.max(8,a-g-8),v=Math.max(8,o-f-8);t.classList.add("evading"),t.style.left=`${i+8+Math.random()*(y-8)}px`,t.style.top=`${c+8+Math.random()*(v-8)}px`};t==null||t.addEventListener("pointerenter",n),t==null||t.addEventListener("click",n),(r=document.querySelector('[data-answer="yes"]'))==null||r.addEventListener("click",()=>{localStorage.setItem(u,"yes"),h()})}window.addEventListener("hashchange",p);p();
