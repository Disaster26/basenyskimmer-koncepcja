(function(){
 'use strict';
 var d=document;

 /* menu na telefonie */
 var b=d.querySelector('.burger'),m=d.getElementById('menu');
 if(b&&m){
  b.addEventListener('click',function(){var o=m.classList.toggle('otw');b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&m.classList.contains('otw')){m.classList.remove('otw');b.setAttribute('aria-expanded','false');b.focus()}});
 }

 /* pasy zdjec: palec, mysz, strzalki */
 [].forEach.call(d.querySelectorAll('[data-pas]'),function(box){
  var t=box.querySelector('.tor'),st=box.querySelectorAll('.strz button'),lc=box.querySelector('.licz');
  if(!t)return;
  var n=t.children.length;
  function krok(){var f=t.children[0];return f?f.getBoundingClientRect().width+parseFloat(getComputedStyle(t).columnGap||16):t.clientWidth}
  function stan(){
   var max=t.scrollWidth-t.clientWidth-2;
   if(st.length){st[0].disabled=t.scrollLeft<=2;st[1].disabled=t.scrollLeft>=max}
   if(lc){var i=Math.min(n,Math.round(t.scrollLeft/krok())+1);lc.textContent=i+' / '+n}
  }
  [].forEach.call(st,function(x){x.addEventListener('click',function(){t.scrollBy({left:(+x.dataset.k)*krok(),behavior:'smooth'})})});
  t.addEventListener('scroll',function(){requestAnimationFrame(stan)},{passive:true});
  addEventListener('resize',stan);stan();
  var dn=false,sx=0,sl=0,ruch=0;
  t.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0)return;dn=true;ruch=0;sx=e.clientX;sl=t.scrollLeft});
  addEventListener('pointermove',function(e){if(!dn)return;var dx=e.clientX-sx;ruch=Math.max(ruch,Math.abs(dx));if(ruch>4){t.classList.add('ciagnie');t.scrollLeft=sl-dx}});
  addEventListener('pointerup',function(){if(!dn)return;dn=false;if(t.classList.contains('ciagnie')){var k=krok(),c=Math.round(t.scrollLeft/k)*k;t.classList.remove('ciagnie');t.scrollTo({left:c,behavior:'smooth'})}});
  t.addEventListener('click',function(e){if(ruch>6){e.preventDefault();e.stopPropagation();ruch=0}},true);
  t.addEventListener('dragstart',function(e){e.preventDefault()});
 });

 /* powiekszenie zdjec */
 var lb,li,lp,grupa=[],nr=0;
 function zbuduj(){
  lb=d.createElement('div');lb.className='lb';lb.hidden=true;lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Powiększone zdjęcie');
  lb.innerHTML='<img alt=""><div class="lb-pod"></div><button type="button" class="lb-x" aria-label="Zamknij"><svg viewBox="0 0 16 16"><path d="M2 2l12 12M14 2L2 14"/></svg></button><button type="button" class="lb-p" aria-label="Poprzednie zdjęcie"><svg viewBox="0 0 22 14"><path d="M21 7H2M7 1.5L1.5 7 7 12.5"/></svg></button><button type="button" class="lb-n" aria-label="Następne zdjęcie"><svg viewBox="0 0 22 14"><path d="M1 7h19M15 1.5l5.5 5.5-5.5 5.5"/></svg></button>';
  d.body.appendChild(lb);li=lb.querySelector('img');lp=lb.querySelector('.lb-pod');
  lb.querySelector('.lb-x').onclick=zamknij;
  lb.querySelector('.lb-p').onclick=function(){pokaz(nr-1)};
  lb.querySelector('.lb-n').onclick=function(){pokaz(nr+1)};
  lb.addEventListener('click',function(e){if(e.target===lb)zamknij()});
  var tx=0;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)pokaz(nr+(dx<0?1:-1))});
  d.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')zamknij();if(e.key==='ArrowRight')pokaz(nr+1);if(e.key==='ArrowLeft')pokaz(nr-1)});
 }
 function pokaz(i){
  nr=(i+grupa.length)%grupa.length;var a=grupa[nr],mini=a.querySelector('img');
  li.src=mini.currentSrc||mini.src;li.alt=mini.alt;
  var duzy=new Image();duzy.onload=function(){if(grupa[nr]===a)li.src=a.href};
  setTimeout(function(){duzy.src=a.href},180);
  lp.textContent=(a.dataset.cap||mini.alt)+'  '+(nr+1)+' / '+grupa.length;
  var nast=grupa[(nr+1)%grupa.length];if(nast&&'requestIdleCallback' in window)requestIdleCallback(function(){new Image().src=nast.href});
 }
 var ost=null;
 function zamknij(){lb.hidden=true;d.documentElement.style.overflow='';if(ost)ost.focus()}
 d.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[data-lb]');if(!a)return;
  e.preventDefault();if(!lb)zbuduj();
  var g=a.closest('[data-lb-grupa]')||d;grupa=[].slice.call(g.querySelectorAll('a[data-lb]'));
  ost=a;lb.hidden=false;d.documentElement.style.overflow='hidden';pokaz(grupa.indexOf(a));lb.querySelector('.lb-x').focus();
 });

 /* formularz: temat z adresu, w wersji testowej bez wysylki */
 var f=d.querySelector('form.zap');
 if(f){
  var tm=(location.search.match(/[?&]temat=([^&]+)/)||[])[1],sel=f.querySelector('select[name=temat]');
  if(tm&&sel){[].forEach.call(sel.options,function(o){if(o.value===decodeURIComponent(tm))sel.value=o.value})}
  f.addEventListener('submit',function(e){
   var info=f.querySelector('.info');
   if(f.hasAttribute('data-podglad')){e.preventDefault();info.className='info ok';info.textContent='Dziękujemy. To wersja testowa strony: formularz zacznie wysyłać wiadomości po uruchomieniu pod adresem basenyskimmer.pl.';}
  });
 }
})();
