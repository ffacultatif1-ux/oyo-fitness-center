/* OYO FITNESS CENTER — menu mobile, horaires du jour, formulaire */
(function(){
"use strict";
const menu=document.querySelector('#menu'),mobile=document.querySelector('.mobile');
menu?.addEventListener('click',()=>mobile.classList.toggle('open'));
document.querySelectorAll('.mobile a').forEach(a=>a.addEventListener('click',()=>mobile.classList.remove('open')));

/* Jour courant dans les horaires */
document.querySelectorAll('.schedule div').forEach(x=>x.classList.toggle('current',+x.dataset.day===new Date().getDay()));

/* Formulaire (frontend only) */
const form=document.querySelector('#form');
form?.addEventListener('submit',e=>{
  e.preventDefault();
  if(!form.checkValidity()){form.reportValidity();return}
  const status=document.querySelector('#status');
  status.textContent='Message enregistré localement. Le backend devra être connecté pour un envoi réel.';
  form.classList.add('sent');
  form.reset();
  setTimeout(()=>form.classList.remove('sent'),6000);
});
})();
