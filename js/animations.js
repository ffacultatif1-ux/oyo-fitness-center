/* OYO FITNESS CENTER — animations au scroll, compteurs, tilt, parallaxe */
(function(){
"use strict";
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Liens externes sécurisés */
document.querySelectorAll('a[target="_blank"]').forEach(a=>a.setAttribute('rel','noopener noreferrer'));

/* ---------- Barre de progression + header compact/parallaxe ---------- */
const bar=document.createElement('div');bar.id='progress';document.body.appendChild(bar);
const header=document.querySelector('.header');
const mobile=document.querySelector('.mobile');
const heroimg=document.querySelector('.heroimg');
const energybg=document.querySelector('.energybg');
let ticking=false;
function onScroll(){
  const y=window.scrollY;
  const max=document.documentElement.scrollHeight-window.innerHeight;
  bar.style.width=(max>0?(y/max)*100:0)+'%';
  if(header){
    header.classList.toggle('scrolled',y>40);
    header.classList.toggle('hide',y>520&&!(mobile&&mobile.classList.contains('open')));
  }
  if(!reduce){
    if(heroimg&&y<window.innerHeight)heroimg.style.transform='translateY('+(y*.18)+'px)';
    if(energybg){const r=energybg.parentElement.getBoundingClientRect();
      if(r.top<window.innerHeight&&r.bottom>0)energybg.style.transform='translateY('+((r.top-window.innerHeight/2)*-.06)+'px)';}
  }
  ticking=false;
}
window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
onScroll();

/* ---------- Diaporama de la bannière (4 images) ---------- */
const slides=[...document.querySelectorAll('.heroimg span')];
const dotsBox=document.querySelector('.herodots');
if(slides.length&&dotsBox){
  let cur=0,timer=null;
  slides.forEach((s,i)=>{
    const b=document.createElement('button');
    b.type='button';
    b.setAttribute('aria-label','Afficher l\'image '+(i+1)+' du diaporama');
    if(i===0)b.classList.add('on');
    b.addEventListener('click',()=>{go(i);restart()});
    dotsBox.appendChild(b);
  });
  const dots=[...dotsBox.children];
  function go(i){
    cur=(i+slides.length)%slides.length;
    slides.forEach((s,j)=>s.classList.toggle('on',j===cur));
    dots.forEach((d,j)=>d.classList.toggle('on',j===cur));
  }
  function restart(){
    clearInterval(timer);
    if(!reduce)timer=setInterval(()=>go(cur+1),6000);
  }
  restart();
}

/* ---------- Reveal au scroll (stagger) ---------- */
const groups=[
  '.about .copy>*','.about .num','.about img',
  '.stats article','.stats>p',
  '.services>p,.services h2','.cards article',
  '.dark>p,.dark h2','.coaches article',
  '.pricing>p,.pricing h2','.prices article',
  '.gallery button',
  '.energy>div>*',
  '.hours>p,.hours h2','.schedule div',
  '.contact>p,.contact h2','.contactgrid>div>*','#form'
];
const revealEls=document.querySelectorAll(groups.join(','));
revealEls.forEach(el=>el.classList.add('rv'));
/* décalage en cascade à l'intérieur d'un même parent */
document.querySelectorAll('.cards,.prices,.coaches,.gallery,.schedule,.stats>div,.contactgrid>div').forEach(g=>{
  [...g.children].forEach((c,i)=>c.style.setProperty('--d',(i*0.09)+'s'));
});
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});
revealEls.forEach(el=>io.observe(el));

/* ---------- Compteurs (suffixe conservé, easing) ---------- */
document.querySelectorAll('[data-count]').forEach(el=>{
  const target=+el.dataset.count;
  const suffix=el.dataset.suffix??(el.textContent.match(/[^\d\s].*$/)?.[0]??'');
  const dur=1600;
  const o=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;o.unobserve(el);
    if(reduce){el.textContent=target.toLocaleString('fr-FR')+suffix;return}
    let t0=null;
    function step(ts){
      if(!t0)t0=ts;
      const p=Math.min((ts-t0)/dur,1);
      const eased=1-Math.pow(1-p,3);
      el.textContent=Math.round(target*eased).toLocaleString('fr-FR')+suffix;
      if(p<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }),{threshold:.7});
  o.observe(el);
});

/* ---------- Tilt 3D au survol (desktop uniquement) ---------- */
if(!reduce&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
  document.querySelectorAll('.cards article,.prices article,.coaches article').forEach(card=>{
    card.addEventListener('pointermove',ev=>{
      const r=card.getBoundingClientRect();
      const x=(ev.clientX-r.left)/r.width-.5;
      const y=(ev.clientY-r.top)/r.height-.5;
      card.style.transform='perspective(900px) rotateX('+(-y*6)+'deg) rotateY('+(x*6)+'deg) translateY(-8px)';
    });
    card.addEventListener('pointerleave',()=>{card.style.transform=''});
  });
}
})();
