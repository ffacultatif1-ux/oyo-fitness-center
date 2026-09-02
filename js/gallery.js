/* OYO FITNESS CENTER — lightbox galerie (fermeture fond + clavier) */
(function(){
"use strict";
const box=document.querySelector('#lightbox');
if(!box)return;
const lbimg=box.querySelector('img');
const caption=box.querySelector('span');
const items=[...document.querySelectorAll('.gallery button img')];
let idx=0;
function show(i){
  idx=(i+items.length)%items.length;
  lbimg.src=items[idx].src;
  lbimg.alt=items[idx].alt;
  if(caption)caption.textContent=items[idx].alt;
  box.classList.add('open');
}
function close(){box.classList.remove('open');lbimg.removeAttribute('src')}
items.forEach((img,i)=>img.parentElement.addEventListener('click',()=>show(i)));
box.querySelector('button')?.addEventListener('click',close);
box.addEventListener('click',e=>{if(e.target===box)close()});
document.addEventListener('keydown',e=>{
  if(!box.classList.contains('open'))return;
  if(e.key==='Escape')close();
  if(e.key==='ArrowRight')show(idx+1);
  if(e.key==='ArrowLeft')show(idx-1);
});
})();
