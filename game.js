function url(k,p){return (window.IMAGE_DATA&&IMAGE_DATA[k])||p}
const IMG={
beginnerIdle:url('beginnerIdle','assets/beginner_idle.jpg'),
beginnerGood:url('beginnerGood','assets/beginner_good.jpg'),
beginnerBad:url('beginnerBad','assets/beginner_bad.jpg'),
proIdle:url('proIdle','assets/pro_idle.jpg'),
proIdlePlus:url('proIdlePlus','assets/pro_idle_plus.jpg'),
proGood:url('proGood','assets/pro_good.jpg'),
proBad:url('proBad','assets/pro_bad.jpg'),
m10:url('milestone10','assets/milestone_10.jpg'),
m20:url('milestone20','assets/milestone_20.jpg'),
m30:url('milestone30','assets/milestone_30.jpg'),
perfect:url('endingPerfect','assets/ending_perfect.jpg'),
title:url('title','assets/title.jpg')
};
const baked=new Set([IMG.m10,IMG.m20,IMG.m30,IMG.perfect]);
document.getElementById('title').style.backgroundImage='linear-gradient(180deg,rgba(255,255,255,.15) 20%,rgba(255,255,255,.92) 62%,#fff 100%),url("'+IMG.title+'")';
Object.values(IMG).forEach(s=>{const i=new Image();i.src=s});

let audioCtx,muted=false,bgmTimer,qIndex=0,score=0,quiz=[],failed=false,mode='beginner',qTimer,typeTimer;
const HSB='wanwanQuizHighScoreBeginner',HSP='wanwanQuizHighScorePro';
let hiB=+localStorage.getItem(HSB)||0,hiP=+localStorage.getItem(HSP)||0;
document.getElementById('hsB').innerText=hiB;
document.getElementById('hsP').innerText=hiP;
const title=document.getElementById('title'),char=document.getElementById('char'),opts=document.getElementById('options');
const fill=document.getElementById('fill'),pct=document.getElementById('pct'),prog=document.getElementById('progress'),bubble=document.getElementById('voice');

function initAudio(){if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume()}
function beep(f,d,t,v){if(!audioCtx)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=t;o.frequency.value=f;o.connect(g);g.connect(audioCtx.destination);const n=audioCtx.currentTime;o.start(n);o.stop(n+d);g.gain.setValueAtTime(v,n);g.gain.linearRampToValueAtTime(0,n+d)}
function toggleMute(){muted=!muted;document.getElementById('mute').innerText=muted?'\ud83d\udd07':'\ud83d\udd0a';if(muted)stopBGM();else if(title.style.display==='none')startBGM()}
function stopBGM(){if(bgmTimer){clearTimeout(bgmTimer);bgmTimer=null}}
function startBGM(){if(muted)return;stopBGM();initAudio();const notes=mode==='beginner'?[523,659,784,659]:[440,523,659,784];let i=0;function tick(){if(muted)return;beep(notes[i%notes.length],.12,'triangle',.03);i++;bgmTimer=setTimeout(tick,220)}tick()}
function goodS(){if(!muted){initAudio();beep(660,.1,'sine',.1);setTimeout(()=>beep(880,.3,'sine',.1),100)}}
function badS(){if(!muted){initAudio();beep(150,.2,'sawtooth',.1)}}
function fanfare(){if(muted)return;stopBGM();initAudio();[0,150,300,450].forEach((t,i)=>setTimeout(()=>beep([523,659,784,1047][i],i===3?.6:.15,'square',.1),t));setTimeout(()=>{if(!muted&&title.style.display==='none')startBGM()},1500)}

function startGame(m){title.style.display='none';prog.style.display='flex';mode=m;try{initAudio();beep(1047,.1,'square',.1);startBGM()}catch(e){}initGame()}
function backToTitle(){if(qTimer)clearTimeout(qTimer);stopBGM();title.style.display='flex';prog.style.display='none';opts.innerHTML='';bubble.textContent='';bubble.classList.remove('hide');char.src=IMG.beginnerIdle;score=0;updateGauge();document.getElementById('hsB').innerText=hiB;document.getElementById('hsP').innerText=hiP}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function idle(){return mode==='pro'?(score>=10?IMG.proIdlePlus:IMG.proIdle):IMG.beginnerIdle}
function setChar(src,hideB){char.src=src;char.classList.remove('jump','shake');bubble.classList.toggle('hide',!!hideB||baked.has(src))}
function updateGauge(){const max=quiz.length||1,p=Math.round(score/max*100);fill.style.height=p+'%';pct.innerText=p+'%';fill.style.background=p<30?'linear-gradient(0deg,#4facfe,#00f2fe)':p<70?'linear-gradient(0deg,#43e97b,#38f9d7)':'linear-gradient(0deg,#fa709a,#fee140)';prog.innerText=Math.min(qIndex+1,max)+' / '+max}
function say(t){bubble.classList.remove('hide');bubble.textContent='';if(typeTimer)clearTimeout(typeTimer);let i=0;function step(){if(i<t.length){bubble.textContent+=t.charAt(i++);if(!muted){initAudio();beep(900,.04,'square',.015)}typeTimer=setTimeout(step,32)}}step()}
function initGame(){if(typeof beginnerQuestions==='undefined'||typeof proQuestions==='undefined'){say('\u554f\u984c\u30d5\u30a1\u30a4\u30eb\u304c\u8aad\u307f\u8fbc\u3081\u307e\u305b\u3093');return}quiz=shuffle([...(mode==='beginner'?beginnerQuestions:proQuestions)]).slice(0,mode==='beginner'?10:30);qIndex=0;score=0;failed=false;setChar(idle(),false);updateGauge();showQ()}
const pres=['\u884c\u304f\u3088\uff01','\u6b21\u8a00\u3046\u3088\uff01','\u6e96\u5099\u306f\u3044\u3044\uff1f','\u3055\u3042\u3001\u6b21\uff01','\u3088\u304f\u805e\u3044\u3066\uff01','\u6c17\u5408\u5165\u308c\u3066\uff01'];
const ok=['\u305d\u306e\u8abf\u5b50\uff01','\u6b63\u89e3\uff01\u3044\u3044\u305e\uff01','\u3084\u308b\u306d\uff01','\u7d20\u6674\u3089\u3057\u3044\uff01'];
const ng=['\u30c9\u30f3\u30de\u30a4\uff01','\u6b21\u306f\u5f53\u3066\u3088\u3046\uff01','\u60dc\u3057\u304b\u3063\u305f\u304b\u3082\uff1f'];
function showQ(){if(qIndex>=quiz.length){finish();return}failed=false;updateGauge();say(qIndex===0?'\u5148\u751f\u3068\u4e00\u7dd2\u306b\u9811\u5f35\u308d\uff01':pres[Math.floor(Math.random()*pres.length)]);opts.innerHTML='';setChar(idle(),false);qTimer=setTimeout(()=>{const q=quiz[qIndex];say('Q'+(qIndex+1)+'.\n'+q.q);opts.innerHTML='';const ans=q.options[q.ans];shuffle([...q.options]).forEach(opt=>{const b=document.createElement('button');b.className='choice';b.innerText=opt;b.onclick=e=>check(opt,ans,e.target);opts.appendChild(b)});setChar(idle(),false)},900)}
function check(sel,ans,btn){if(sel===ans){opts.querySelectorAll('button').forEach(b=>b.disabled=true);btn.style.background='#ff99cc';if(!failed)score++;updateGauge();let spec=null,img=null;if(!failed){if(score===30){spec='30\u554f\u6b63\u89e3\uff01\u5148\u751f\u3082\u5b09\u3057\u3044\u3088\uff01';img=IMG.m30}else if(score===20){spec='20\u554f\u6b63\u89e3\uff01\u30a8\u30e9\u30a4\u30a8\u30e9\u30a4\uff01';img=IMG.m20}else if(score===10){spec='10\u554f\u6b63\u89e3\uff01\u3044\u3044\u30da\u30fc\u30b9\u3060\u3088\uff01';img=IMG.m10}}if(img){fanfare();setChar(img,true);say(spec);qIndex++;qTimer=setTimeout(showQ,3800);return}goodS();say(ok[Math.floor(Math.random()*ok.length)]);setChar(mode==='pro'?IMG.proGood:IMG.beginnerGood,false);char.classList.add('jump');qIndex++;qTimer=setTimeout(showQ,1800)}else{failed=true;badS();say(ng[Math.floor(Math.random()*ng.length)]);setChar(mode==='pro'?IMG.proBad:IMG.beginnerBad,false);char.classList.add('shake');btn.style.background='#999';btn.disabled=true}}
function finish(){stopBGM();const max=quiz.length||1,p=Math.round(score/max*100);let msg='\u5168\u554f\u7d42\u4e86\uff01\u6700\u7d42\u30dd\u30a4\u30f3\u30c8: '+p+'%\n';const perfect=(mode==='beginner'&&score===10)||(mode==='pro'&&score===30);if(mode==='beginner'&&p>hiB){hiB=p;localStorage.setItem(HSB,hiB);msg+='\ud83c\udf89\u57fa\u790e\u30e2\u30fc\u30c9 \u30cf\u30a4\u30b9\u30b3\u30a2\u66f4\u65b0\uff01\ud83c\udf89\n'}if(mode==='pro'&&p>hiP){hiP=p;localStorage.setItem(HSP,hiP);msg+='\ud83c\udf89\u30d7\u30ed\u30e2\u30fc\u30c9 \u30cf\u30a4\u30b9\u30b3\u30a2\u66f4\u65b0\uff01\ud83c\udf89\n'}opts.innerHTML='<button onclick="backToTitle()">\u30bf\u30a4\u30c8\u30eb\u306b\u623b\u308b</button>';prog.innerText=max+' / '+max;if(perfect){msg+='\u3068\u3063\u3066\u3082\u9811\u5f35\u3063\u305f\u306d\uff01\n\u4eca\u5ea6\u3082\u3088\u308d\u3057\u304f\u306d\uff01';setChar(IMG.perfect,true);fanfare();fill.style.height='100%'}else{msg+='\u304a\u75b2\u308c\u69d8\uff01\n\u307e\u305f\u6311\u6226\u3057\u3066\u306d\uff01';setChar(idle(),false)}say(msg)}
