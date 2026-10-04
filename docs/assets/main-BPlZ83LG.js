(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`tile-hidden`,t=`tile-correct`,n=`tile-incorrect`,r,i,a,o,s,c,l=e=>new Promise(t=>setTimeout(t,e)),u=()=>{let e=[{breed:`persian`,offset:{x:-5,y:-5}},{breed:`siamese`,offset:{x:-165,y:-5}},{breed:`maine coon`,offset:{x:-325,y:-5}},{breed:`sphynx`,offset:{x:-485,y:-5}},{breed:`scottish fold`,offset:{x:-5,y:-165}},{breed:`bengal`,offset:{x:-165,y:-165}},{breed:`black bombay`,offset:{x:-325,y:-165}},{breed:`calico`,offset:{x:-485,y:-165}}];return{getTileImg:t=>{let n=e[t],r=document.createElement(`button`);return r.id=n.breed,r.alt=n.breed,r.setAttribute(`style`,`
        width: 150px;
        height: 150px;
        background: url('/memory-game/preset_cats.jpg') ${n.offset.x}px ${n.offset.y}px / 640px 316px no-repeat;
      `),r.classList.add(`tile`),r},total:8,tileSize:150}},d=e=>{let t=0,n=()=>{i.innerText=`${t} / ${e}`};return n(),{getScore:()=>t,increase:()=>{t+=1,n()}}},f=()=>{let e=0,t=()=>{a.innerText=e};return t(),{increase:()=>{e+=1,t()},getCount:()=>e}},p=e=>{let t=`scoreboard`,n=()=>JSON.parse(window.localStorage.getItem(t)||`[]`),r=n=>{n.sort((e,t)=>Number(e.steps)-Number(t.steps)).slice(0,e),window.localStorage.setItem(t,JSON.stringify(n))},i=e=>{let t=n();t.push({steps:e,date:new Date}),r(t)},a=()=>{window.localStorage.setItem(t,`[]`)},o=()=>{c.innerHTML=``};return{pushScore:i,reset:a,obtain:n,showModal:(e,t)=>{let r=n();c.innerHTML=`
    <div class="scoreboard-modal">
        <div class="scoreboard-wrapper">
          <div class="scoreboard-content">
              <button class="scoreboard-x"></button>
              <div>
                  <div>
                    <div>Таблица результатов</div>
                    <div>
                        ${r.length?`<table>
                                  <thead>
                                    <tr>
                                      <th>Место</th>
                                      <th>Счёт</th>
                                      <th>Дата</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                  ${r.map((e,t)=>`
                                    <tr>
                                      <td>${t+1}</td>
                                      <td>${e.steps}</td>
                                      <td>${e.date}</td>
                                    </tr>`).join(`
`)}
                                  </tbody>
                                </table>`:`Нет попыток`}
                    </div>
                  </div>
                  <div>${e===void 0?``:`Ваш счёт: ${e}`}</div>
              </div>
              <div>
                  ${e===void 0?``:`<button class="scoreboard-restart">Новая игра</button>`}
                  <button class="scoreboard-close">Закрыть</button>
              </div>
          </div>
        </div>
    </div>
    `,c.querySelector(`.scoreboard-modal`).addEventListener(`mousedown`,e=>{let n=e.target.classList;(n.contains(`scoreboard-modal`)||n.contains(`scoreboard-x`)||n.contains(`scoreboard-close`))&&o(),n.contains(`scoreboard-restart`)&&(t(),o())})}}},m=()=>{let i=u(),a=p(10),o=i.total,s=d(o),c=f(),m=[],h=[],g,_=!1,v=e=>{e.setAttribute(`hash`,crypto.randomUUID())},y=t=>{t.classList.remove(e),t.setAttribute(`revealed`,``)},b=t=>{h.includes(t.id)||(t.classList.add(e),t.removeAttribute(`revealed`))},x=async e=>{if(!(_||h.includes(e.id)||g&&g.getAttribute(`hash`)===e.getAttribute(`hash`))){if(_=!0,!g){g=e,y(e),_=!1;return}if(y(e),c.increase(),g.id===e.id){g.classList.add(t),e.classList.add(t),h.push(g.id),g=void 0,_=!1,s.increase(),h.length===o&&(a.pushScore(c.getCount()),a.showModal(c.getCount(),w));return}g.classList.add(n),e.classList.add(n),await l(1e3),g.classList.remove(n),e.classList.remove(n),b(g),b(e),g=void 0,_=!1}},S=()=>{m=[];for(let t=0;t<i.total*2;t++){let n=t>=i.total?t-i.total:t,r=i.getTileImg(n);r.addEventListener(`click`,e=>x(e.target)),r.classList.add(e),v(r),m.push(r)}m.sort((e,t)=>e.getAttribute(`hash`)>t.getAttribute(`hash`)?1:-1)},C=()=>{r.innerHTML=``,h=[],m=[],s=d(o),c=f()},w=()=>{C(),S(),r.setAttribute(`style`,`display: grid; grid-template: repeat(4, ${i.tileSize}px) / repeat(4, ${i.tileSize}px); grid-gap: 16px; width: fit-content;`);for(let e of m)r.appendChild(e)};return{startGame:w,showScoreboard:()=>{s===o?a.showModal(c.getCount(),w):a.showModal(void 0,w)}}},h;document.body.innerHTML=`
    <div class="game-container">
        <header>
            <div>
                <div>
                    <button id="new-game">Новая игра</button>
                    <button id="scoreboard-trigger">Таблица лидеров</button>
                </div>
            </div>
            <div>
                <div>
                    <div>Шагов:</div>
                    <div id="step-view"></div>
                </div>
                <div>
                    <div>Счёт</div>                    
                    <div id="score-view"></div>
                </div>
            </div>
        </header>
        <div id="game-box"></div>
        <div id="scoreboard-modal"></div>
    </div>
  `,r=document.querySelector(`#game-box`),o=document.querySelector(`#new-game`),s=document.querySelector(`#scoreboard-trigger`),a=document.querySelector(`#step-view`),i=document.querySelector(`#score-view`),c=document.querySelector(`#scoreboard-modal`),h=m(),h.startGame(),s.addEventListener(`click`,h.showScoreboard),o.addEventListener(`click`,h.startGame);
//# sourceMappingURL=main-BPlZ83LG.js.map