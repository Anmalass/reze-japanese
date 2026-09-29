const K='reze_v1',D={xp:0,streak:0,last:'',hearts:5,ht:0,done:[],mist:{},mode:'id',rate:1};
let S=D,LS=[],SN=[],tab='home',Q=null,chat=[];
try{S=Object.assign({},D,JSON.parse(localStorage.getItem(K)||'{}'))}catch(e){S={...D}}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}};
const $=s=>document.querySelector(s),td=()=>new Date().toLocaleDateString('sv');
const sh=a=>[...a].sort(()=>Math.random()-.5),pk=(a,n)=>sh(a).slice(0,n);
function regen(){if(S.hearts<5&&S.ht){const n=Math.floor((Date.now()-S.ht)/6e5);if(n>0){S.hearts=Math.min(5,S.hearts+n);S.ht=S.hearts<5?Date.now():0;save()}}}
function touch(){const t=td();if(S.last===t)return;const y=new Date(Date.now()-864e5).toLocaleDateString('sv');S.streak=S.last===y?S.streak+1:1;S.last=t;save()}
function streak(){const y=new Date(Date.now()-864e5).toLocaleDateString('sv');return(S.last===td()||S.last===y)?S.streak:0}
function speak(t,slow){try{const u=new SpeechSynthesisUtterance(t);u.lang='ja-JP';u.rate=S.rate*(slow?.7:1);const v=speechSynthesis.getVoices().find(v=>v.lang&&v.lang.replace('_','-').startsWith('ja'));if(v)u.voice=v;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
function unlocked(i){return i===0||S.done.includes(LS[i-1].id)}
function cur(){const i=LS.findIndex(l=>!S.done.includes(l.id));return i<0?LS.length-1:i}
function show(){regen();document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));$('#main').innerHTML=({home,quest,sensei,profile})[tab]()}
function home(){const c=LS[cur()]||{title:'-'},p=Math.round(S.done.length/Math.max(1,LS.length)*100);
return`<h1>REZE Japanese</h1><small>日本語を学ぼう</small><h2>おかえり！</h2><p class=g>Mari lanjut belajar 🇯🇵</p>
<div class="card row"><span>🔥 ${streak()}</span><span>⭐ ${S.xp}</span><span>❤️ ${S.hearts}</span></div>
<div class=card><b>N5 Beginner</b> ${p}%<div class=bar><i style="width:${p}%"></i></div><p class=g>Lesson: ${c.title}</p><button class=btn onclick="start(${cur()})">Lanjut belajar</button></div>
<div class=card><b>Daily Goal</b><p>Review kesalahan: ${Object.keys(S.mist).length} item</p><button class=btn onclick="reviewStart()">Review</button><button class=btn onclick="tab='sensei';show()">Tanya Sensei</button></div>`}
function quest(){return'<h2>Quest</h2>'+LS.map((l,i)=>{const d=S.done.includes(l.id),u=unlocked(i);return`<div class=node><button class="${d?'dn':u?'cur':''}" style="width:64px;height:64px;border-radius:50%;border:0;color:#fff;font-size:24px;background:${d?'#059669':u?'#8b5cf6':'#22284d'}" ${u?`onclick="start(${i})"`:'disabled'}>${d?'✓':u?'★':'🔒'}</button><small>${l.title}</small></div>`}).join('')+'<div class=node><small>🔒 N5 CHECKPOINT</small></div>'}
function build(items){const qs=[];items.forEach(x=>{const o=items.filter(y=>y!==x);
qs.push({t:'mc',p:x[0],r:x[1],a:x[2],o:sh([x[2],...pk(o,3).map(y=>y[2])]),k:x[0]});
if(x[0].includes(' '))qs.push({t:'ord',a:x[0],w:sh(x[0].split(' ')),m:x[2],k:x[0]});
else qs.push({t:'ls',a:x[0],o:sh([x[0],...pk(o,3).map(y=>y[0])]),k:x[0]})});return pk(qs,10)}
function start(i){const l=LS[i];if(!l)return;if(S.hearts<=0){alert('Hati habis ❤️ — tunggu ±10 menit atau lakukan Review.');return}Q={l,qs:build(l.items),i:0,ok:0,sel:[]};ask()}
function reviewStart(){const k=Object.keys(S.mist),all=LS.flatMap(l=>l.items),it=all.filter(x=>k.includes(x[0]));if(it.length<2){alert('Belum ada kesalahan untuk diulang 👍');return}Q={l:{id:'_r',title:'Review',cando:''},qs:build(it.length<4?all:it),i:0,ok:0,sel:[]};ask()}
function ask(){const q=Q.qs[Q.i];if(!q)return end();let b=`<small>${Q.l.title} · ${Q.i+1}/${Q.qs.length} · ❤️ ${S.hearts}</small><div class=bar><i style="width:${Q.i/Q.qs.length*100}%"></i></div><div class=card>`;
if(q.t==='mc')b+=`<h2 style="font-size:34px">${q.p}</h2><button class=w onclick="speak('${q.p}')">🔊</button><button class=w onclick="speak('${q.p}',1)">🐢</button><p class=g>${q.r}</p>`+q.o.map(o=>`<button class=opt onclick="ans(this,'${o.replace(/'/g,"\\'")}')">${o}</button>`).join('');
if(q.t==='ls'){setTimeout(()=>speak(q.a),300);b+=`<h2>Dengarkan 🎧</h2><button class=w onclick="speak('${q.a}')">🔊 Play</button><button class=w onclick="speak('${q.a}',1)">🐢 Slow</button>`+q.o.map(o=>`<button class=opt onclick="ans(this,'${o}')">${o}</button>`).join('')}
if(q.t==='ord'){b+=`<h2>Susun kalimat</h2><p>${q.m}</p><div id=sl style="min-height:50px"></div><hr>`+q.w.map((w,j)=>`<button class=w id=w${j} onclick="pick(${j})">${w}</button>`).join('')+`<button class=btn onclick="chk()">Periksa</button>`}
$('#main').innerHTML=b+'<div id=fb></div></div>'}
function pick(j){const q=Q.qs[Q.i];Q.sel.push(q.w[j]);$('#w'+j).style.display='none';$('#sl').innerHTML=Q.sel.map(w=>`<span class=w>${w}</span>`).join('')}
function chk(){const q=Q.qs[Q.i],r=Q.sel.join(' ')===q.a;Q.sel=[];fin(r,q)}
function ans(el,o){const q=Q.qs[Q.i];document.querySelectorAll('.opt').forEach(b=>b.disabled=true);el.classList.add(o===q.a?'ok':'no');fin(o===q.a,q)}
function fin(r,q){if(r){S.xp+=3;Q.ok++;speak(q.k||q.a)}else{S.mist[q.k]=(S.mist[q.k]||0)+1;S.hearts=Math.max(0,S.hearts-1);if(!S.ht)S.ht=Date.now()}save();
$('#fb').innerHTML=`<p>${r?'✓ Bagus! よくできました！ +3 XP':'✗ Jawaban: <b>'+q.a+'</b>'}</p><button class=btn onclick="nxt()">Lanjut</button>`}
function nxt(){if(S.hearts<=0){Q=null;alert('Hati habis ❤️ Coba lagi nanti.');return show()}Q.i++;ask()}
function end(){touch();let m='';if(Q.l.id!=='_r'&&!S.done.includes(Q.l.id)){S.done.push(Q.l.id);S.xp+=20;m=' +20 XP'}else if(Q.l.id==='_r'){S.hearts=Math.min(5,S.hearts+1);m=' +1 ❤️'}save();
$('#main').innerHTML=`<div class=card><h2>🎉 Selesai!</h2><p>Benar ${Q.ok}/${Q.qs.length}${m}</p><p class=g>Can-do: ${Q.l.cando}</p><button class=btn onclick="Q=null;tab='quest';show()">Kembali ke Quest</button></div>`}
function sensei(){return`<h2>REZE Sensei</h2><div class=row><label><input type=checkbox ${S.mode==='jp'?'checked':''} onchange="S.mode=this.checked?'jp':'id';save()" style="width:auto;min-height:0"> Japanese only</label></div><div id=ch>${chat.length?chat.map(m=>`<div class="msg ${m.me?'me':'sn'}">${m.t}</div>`).join(''):'<div class="msg sn">こんにちは！今日は何を話しましょうか？</div>'}</div><div class=row style="margin-top:8px"><input id=in placeholder="Type message" onkeydown="if(event.key==='Enter')send()" style="flex:1"><button class=w onclick="mic()">🎙️</button><button class=w onclick="send()">➤</button></div><p class=g id=mi></p>`}
function send(v){const t=(v||$('#in').value).trim();if(!t)return;chat.push({me:1,t});const l=t.toLowerCase();let r=SN.find(x=>x.k.some(k=>l.includes(k)))?.r||['もう一度 言ってください。ゆっくり 話しましょう。','Coba ulangi ya, pelan-pelan.'];
chat.push({t:r[0]+(S.mode==='jp'?'':'<br><small>'+r[1]+'</small>')});speak(r[0]);show()}
function mic(){const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R){$('#mi').textContent='Speech recognition tidak tersedia di perangkat ini — ketik saja.';return}try{const r=new R();r.lang='ja-JP';r.onresult=e=>send(e.results[0][0].transcript);r.onerror=()=>{$('#mi').textContent='Mic gagal — ketik saja.'};r.start()}catch(e){$('#mi').textContent='Mic tidak tersedia.'}}
function profile(){return`<h2>👤 REZE Learner</h2><div class="card row"><span>⭐ ${S.xp}</span><span>🔥 ${streak()}</span><span>✓ ${S.done.length} quest</span></div><div class=card><b>Kesalahan (${Object.keys(S.mist).length})</b><p>${Object.keys(S.mist).slice(0,20).join(' ')||'—'}</p></div><div class=card><b>Kecepatan suara</b><input type=range min=.5 max=1.2 step=.05 value=${S.rate} onchange="S.rate=+this.value;save()"><button class=btn onclick="speak('こんにちは')">🔊 Tes suara</button></div><button class=btn onclick="if(confirm('Reset semua progres?')){localStorage.removeItem('${K}');location.reload()}">Reset progress</button>`}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{tab=b.dataset.t;Q=null;show()});
Promise.all([fetch('data/lessons.json').then(r=>r.json()),fetch('data/sensei.json').then(r=>r.json())]).then(([a,b])=>{LS=a;SN=b;show()}).catch(()=>{$('#main').innerHTML='<div class=card>Data gagal dimuat.</div>'});
