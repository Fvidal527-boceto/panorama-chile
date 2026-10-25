/* PANORAMA 2.3 — lectura gratuita con las voces del navegador. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else api.init(root);
})(typeof window==='undefined'?null:window,function(){
'use strict';
function chunks(text,max=220){
  const words=text.replace(/\s+/g,' ').trim().split(' '),out=[];let part='';
  for(const word of words){if(!word)continue;if(part&&part.length+word.length+1>max){out.push(part);part='';}part+=(part?' ':'')+word;}
  if(part)out.push(part);return out;
}
function minutes(article){
  const explicit=Number(article.dataset.readingMinutes);
  if(Number.isFinite(explicit)&&explicit>0)return explicit;
  const meta=article.querySelector('.reading,.readtime,.reading-time,.story-meta,.top');
  const match=meta?.textContent.match(/(\d+)\s*min(?:utos?)?\b/i);
  return match?Number(match[1]):Math.ceil(textOf(article).split(/\s+/).length/200);
}
function textOf(article){
  const title=article.querySelector('h3,h2,h1')?.textContent.trim()||'';
  const paragraphs=Array.from(article.querySelectorAll('p,li')).filter(p=>!p.closest('.sources,.sourcebar,.pn-voice,figcaption,.method,.note')).map(p=>p.textContent.trim()).filter(Boolean);
  return [title,...paragraphs].filter(Boolean).join('\n\n');
}
function spanishVoice(voices){
  const es=voices.filter(v=>/^es(?:[-_]|$)/i.test(v.lang));
  return es.find(v=>v.localService&&/^es[-_]CL$/i.test(v.lang))||es.find(v=>v.localService)||es.find(v=>/^es[-_]CL$/i.test(v.lang))||es[0]||null;
}
function createPlayer(engine,Utterance,onState){
  let active=null,parts=[],at=0,current=null,paused=false,version=0;
  function cancel(){const old=active;++version;active=null;current=null;parts=[];at=0;paused=false;engine.cancel();if(old)onState(old,'idle');}
  function next(token){
    if(token!==version||!active||paused)return;
    if(at>=parts.length){const old=active;active=null;current=null;onState(old,'finished');return;}
    const item=active,u=new Utterance(parts[at++]);current=u;
    u.lang='es-CL';u.rate=1;u.pitch=1;
    const voice=spanishVoice(engine.getVoices());if(voice)u.voice=voice;
    u.onstart=()=>{if(token===version&&active===item)onState(item,paused?'paused':'speaking');};
    u.onend=()=>{if(token!==version||active!==item)return;current=null;next(token);};
    u.onerror=e=>{if(token!==version||active!==item)return;const old=active;cancel();onState(old,'error',e.error||'synthesis-failed');};
    try{engine.speak(u);}catch{cancel();onState(item,'error','synthesis-failed');}
  }
  return {
    play(item,text){cancel();parts=chunks(text);if(!parts.length)return;active=item;const token=version;onState(item,'loading');engine.resume();next(token);},
    pause(item){if(active!==item||paused)return;paused=true;engine.pause();onState(item,'paused');},
    resume(item){if(active!==item||!paused)return;paused=false;engine.resume();if(!current)next(version);else onState(item,'speaking');},
    stop:cancel
  };
}
function init(win){
  const doc=win.document;
  if(doc.documentElement.dataset.panoramaVoice)return;
  doc.documentElement.dataset.panoramaVoice='1';
  const eligible=Array.from(doc.querySelectorAll('article.story')).filter(a=>minutes(a)>=3);
  if(!eligible.length)return;
  const style=doc.createElement('style');
  style.textContent='.pn-voice{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:12px 0 16px;padding:10px 12px;border:1px solid #c9bcb0;background:#f5efe4;font:12px/1.5 Arial,Helvetica,sans-serif;break-inside:avoid;column-span:all}.pn-voice button{font:600 12px Arial,Helvetica,sans-serif;letter-spacing:0;padding:8px 12px;border:1px solid #48665b;border-radius:3px;background:#fcf8ef;color:#294437;cursor:pointer}.pn-voice button:first-child{background:#294437;color:#fff}.pn-voice button:disabled{opacity:.5;cursor:default}.pn-voice button:focus-visible{outline:3px solid #a4634c;outline-offset:2px}.pn-voice-status{flex:1 1 180px;color:#526359}.pn-voice a{color:#83543f}@media print{.pn-voice{display:none!important}}';
  doc.head.appendChild(style);
  const supported='speechSynthesis'in win&&'SpeechSynthesisUtterance'in win;
  const controls=new Map();
  const player=supported?createPlayer(win.speechSynthesis,win.SpeechSynthesisUtterance,(article,state,error)=>{
    const c=controls.get(article);if(!c)return;
    c.pause.disabled=!['speaking','paused'].includes(state);
    c.stop.disabled=!['loading','speaking','paused'].includes(state);
    c.pause.textContent=state==='paused'?'Continuar':'Pausar';
    c.pause.dataset.paused=String(state==='paused');
    c.play.disabled=['loading','speaking','paused'].includes(state);
    c.status.textContent={idle:'Voz del navegador · español',loading:'Preparando lectura…',speaking:'Leyendo noticia',paused:'Lectura pausada',finished:'Lectura finalizada',error:'No se pudo iniciar la voz. Revisa las voces en español de tu dispositivo.'}[state];
    c.open.hidden=!(state==='error'&&error==='not-allowed');
    if(!c.open.hidden)c.status.textContent='El navegador bloqueó la voz en esta vista.';
  }):null;
  eligible.forEach((article,i)=>{
    const bar=doc.createElement('div');bar.className='pn-voice';bar.setAttribute('role','group');bar.setAttribute('aria-label','Lectura por voz de la noticia');
    const status=doc.createElement('span');status.className='pn-voice-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    if(!supported){status.textContent='Lectura por voz no disponible en este navegador.';bar.appendChild(status);}
    else{
      const title=article.querySelector('h3,h2,h1')?.textContent.trim()||'Noticia '+(i+1);
      function button(label,disabled){const b=doc.createElement('button');b.type='button';b.textContent=label;b.disabled=disabled;bar.appendChild(b);return b;}
      const play=button('Escuchar',false),pause=button('Pausar',true),stop=button('Detener',true);
      play.setAttribute('aria-label','Escuchar: '+title);
      const open=doc.createElement('a');open.textContent='Abrir noticia en pestaña completa';open.href=win.location.pathname+(article.id?'#'+encodeURIComponent(article.id):'');open.target='_blank';open.rel='noopener noreferrer';open.hidden=true;
      status.textContent='Voz del navegador · español';bar.appendChild(status);bar.appendChild(open);
      controls.set(article,{play,pause,stop,status,open});
      play.addEventListener('click',()=>player.play(article,textOf(article)));
      pause.addEventListener('click',()=>pause.dataset.paused==='true'?player.resume(article):player.pause(article));
      stop.addEventListener('click',()=>player.stop());
    }
    const title=article.querySelector('h3,h2,h1');if(title)title.after(bar);else article.prepend(bar);
  });
  if(player){win.addEventListener('pagehide',()=>player.stop());win.addEventListener('beforeunload',()=>player.stop());}
}
return {chunks,minutes,textOf,spanishVoice,createPlayer,init};
});
