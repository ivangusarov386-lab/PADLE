;(function(){
  var root=document.getElementById('bk');if(!root)return;
  var DN=['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],MN=['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
  var COURTS=['Сингл 1','Сингл 2','Панорамик'];
  var TRN=[{n:'Тамара Черкасова',i:'ТЧ',bio:'Бывшая профессиональная теннисистка, игравшая в туре WTA. Прошла курсы повышения квалификации по падел.'},{n:'Виталий Полежаев',i:'ВП',bio:'Сертифицированный специалист Федерации падел России, кандидат в мастера спорта по теннису.'}];
  var TR=TRN.map(function(t){return t.n});
  var mode='group',who='adult',day=(new Date().getHours()>=19?1:0),opt=0,sel=null;
  var $=function(i){return document.getElementById(i)};
  function rnd(s){s=s>>>0;return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296}}
  function dt(i){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+i);return d}
  function sd(d,k){return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate()+k*7919}
  function price(h){return h<10?2000:h<17?2500:h<22?3200:2000}
  function fmt(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' ₽'}
  function pad(h){return (h<10?'0':'')+h+':00'}
  function groups(d,kid){var r=rnd(sd(d,kid?98:99)),L=kid?['Дети 7–12 лет','Подростки 13–16 лет']:['Новички','Новички','Средний уровень'],H=kid?[9,10,17,18]:[11,18,19,20,21],o=[],u={},n=kid?2:3+Math.floor(r()*2);
    for(var i=0;i<n;i++){var h=H[Math.floor(r()*H.length)];if(u[h])continue;u[h]=1;o.push({h:h,lv:L[Math.floor(r()*L.length)],tr:TR[Math.floor(r()*TR.length)],ct:Math.floor(r()*2),taken:Math.floor(r()*5)})}
    o.sort(function(a,b){return a.h-b.h});return o}
  function allG(d){return groups(d,false).concat(groups(d,true))}
  function busyMap(d,kind,idx){var r=rnd(sd(d,kind*10+idx+1)),a={};for(var h=8;h<=22;h++){a[h]=r()<((h>=17&&h<=21)?.5:.2)?'b':''}
    allG(d).forEach(function(g){if(kind===1&&g.ct===idx)a[g.h]='g';if(kind===2&&TR[idx]===g.tr)a[g.h]='g'});return a}
  function past(h){return day===0&&h<=new Date().getHours()}
  function pressed(w,v){[].slice.call(w.querySelectorAll('button')).forEach(function(x){x.setAttribute('aria-pressed',x.getAttribute('data-v')===v?'true':'false')})}
  function days(){var w=$('bkDays');w.innerHTML='';for(var i=0;i<10;i++){var d=dt(i),b=document.createElement('button');b.type='button';b.setAttribute('aria-pressed',i===day?'true':'false');b.innerHTML='<small>'+DN[d.getDay()]+'</small><b>'+d.getDate()+'</b><small>'+MN[d.getMonth()]+'</small>';(function(i){b.onclick=function(){day=i;sel=null;draw()}})(i);w.appendChild(b)}}
  function opts(){var w=$('bkOpt');w.innerHTML='';if(mode==='group')return;var L=mode==='ind'?TR:COURTS;L.forEach(function(n,i){var b=document.createElement('button');b.type='button';b.textContent=n;b.setAttribute('aria-pressed',i===opt?'true':'false');b.onclick=function(){opt=i;sel=null;draw();if(mode==='ind')trainer(i)};w.appendChild(b)});
    if(mode==='ind'){var s=document.createElement('span');s.className='bk-hint';s.textContent='Нажмите на тренера, чтобы узнать о нём';s.style.cssText='flex:1 1 100%;font-size:.78rem;color:var(--soft)';w.appendChild(s)}}
  function who_(){return who==='kid'?'Ребёнок · ':''}
  function body(){var w=$('bkBody'),d=dt(day);w.innerHTML='';
    if(mode==='group'){var box=document.createElement('div');box.className='bk-g';var L=groups(d,who==='kid');
      if(!L.length){w.innerHTML='<p class="bk-empty">В этот день групп нет. Выберите другую дату.</p>';return}
      L.forEach(function(g){var left=4-g.taken,full=left<=0||past(g.h),b=document.createElement('button');b.type='button';b.className='bk-gc'+(sel&&sel.h===g.h?' sel':'');if(full)b.disabled=true;
        var dots='';for(var k=0;k<4;k++)dots+='<i class="'+(k<g.taken?'x':'')+'"></i>';
        b.innerHTML='<span class="t">'+pad(g.h)+'</span><span class="m"><b>'+g.lv+'</b><small>'+g.tr+' · '+COURTS[g.ct]+' · 1 час</small></span><span class="pl"><span class="dots" aria-hidden="true">'+dots+'</span>'+(past(g.h)?'прошло':left<=0?'группа полная':'свободно мест: '+left)+'</span>';
        b.onclick=function(){sel={h:g.h,txt:who_()+'Группа «'+g.lv+'», '+g.tr+', '+COURTS[g.ct],price:who==='kid'?'1 000 ₽ первое занятие, 2 500 ₽ разово':'1 500 ₽ первая, 3 500 ₽ разово'};draw();$('bkForm').scrollIntoView({behavior:'smooth',block:'center'})};box.appendChild(b)});w.appendChild(box);return}
    var m=busyMap(d,mode==='ind'?2:1,opt),box2=document.createElement('div');box2.className='bk-slots';
    for(var h=8;h<=22;h++)(function(h){var b=document.createElement('button');b.type='button';var st=m[h],off=!!st||past(h);b.className='bk-slot'+(sel&&sel.h===h?' sel':'');if(off)b.disabled=true;
      b.innerHTML='<b>'+pad(h)+'</b><small>'+(past(h)?'прошло':st==='g'?'группа':st==='b'?'занято':mode==='rent'?fmt(price(h)):'свободно')+'</small>';
      b.onclick=function(){sel={h:h,txt:mode==='ind'?who_()+'Индивидуально, '+TR[opt]:COURTS[opt]+', аренда',price:mode==='ind'?'3 850 ₽ + аренда корта':fmt(price(h))+' за час'};draw();$('bkForm').scrollIntoView({behavior:'smooth',block:'center'})};box2.appendChild(b)})(h);
    w.appendChild(box2)}
  function sum(){var f=$('bkForm');$('bkOk').hidden=true;if(!sel){f.hidden=true;return}var d=dt(day);f.hidden=false;
    $('bkPick').textContent=DN[d.getDay()]+', '+d.getDate()+' '+MN[d.getMonth()]+', '+pad(sel.h)+' · '+sel.txt;$('bkPrice').textContent=sel.price;$('bkName').placeholder=who==='kid'?'Имя ребёнка':'Имя'}
  function draw(){pressed($('bkWho'),who);pressed($('bkMode'),mode);$('bkRentB').hidden=(who==='kid');days();opts();body();sum()}
  $('bkWho').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;who=b.getAttribute('data-v');if(who==='kid'&&mode==='rent')mode='group';opt=0;sel=null;draw()});
  $('bkMode').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;mode=b.getAttribute('data-v');opt=0;sel=null;draw()});
  $('bkForm').addEventListener('submit',function(e){e.preventDefault();var d=dt(day);$('bkForm').hidden=true;var o=$('bkOk');o.hidden=false;o.textContent='Демо: вы выбрали '+d.getDate()+' '+MN[d.getMonth()]+' в '+pad(sel.h)+'. Заявка не отправлена; расписание вымышленное.';sel=null;body()});
  // окно тренера
  var tmEl=$('tm'),tmI=0;document.body.appendChild(tmEl);
  function trainer(i){tmI=i;var t=TRN[i];$('tmI').textContent=t.i;$('tmN').textContent=t.n;$('tmB').textContent=t.bio;tmEl.hidden=false;$('tmGo').focus()}
  function tmClose(){tmEl.hidden=true}
  function toBook(){var t=$('book');if(t)window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-72,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
  tmEl.addEventListener('click',function(e){if(e.target.closest('[data-tmx]'))tmClose()});
  $('tmGo').addEventListener('click',function(){tmClose();mode='ind';opt=tmI;sel=null;draw();toBook()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!tmEl.hidden)tmClose();if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('.coach[data-tr]')){e.preventDefault();trainer(+e.target.getAttribute('data-tr'))}});
  document.addEventListener('click',function(e){var c=e.target.closest('.coach[data-tr]');if(c){trainer(+c.getAttribute('data-tr'))}});
  window.selectBookingMode=function(value){who='adult';mode=value==='individual'?'ind':value==='rent'?'rent':'group';opt=0;sel=null;draw()};
  draw();
})();
