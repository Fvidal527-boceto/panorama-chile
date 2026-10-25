/* PANORAMA 2.3 — lectura gratuita con las voces del navegador. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else api.init(root);
})(typeof window==='undefined'?null:window,function(){
'use strict';
function chunks(text,max=220){
  const clean=text.replace(/\s+/g,' ').trim();if(!clean)return [];
  const sentences=typeof Intl.Segmenter==='function'?Array.from(new Intl.Segmenter('es',{granularity:'sentence'}).segment(clean),x=>x.segment.trim()):[clean];
  const out=[];let part='';
  function flush(){if(part){out.push(part);part='';}}
  for(let sentence of sentences){
    if(sentence.length>max){
      flush();
      while(sentence.length>max){
        const head=sentence.slice(0,max+1);let cut=-1;
        for(const m of head.matchAll(/[,;:!?…]\s+/g))if(m.index>=max*.35)cut=m.index+1;
        if(cut<0)cut=head.lastIndexOf(' ');
        if(cut<1){cut=sentence.indexOf(' ',max);if(cut<0)cut=sentence.length;}
        out.push(sentence.slice(0,cut).trim());sentence=sentence.slice(cut).trim();
      }
    }
    if(!sentence)continue;
    if(part&&part.length+sentence.length+1>max)flush();
    part+=(part?' ':'')+sentence;
  }
  flush();return out;
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
function finishSentence(text){
  const clean=text.replace(/\s+/g,' ').trim();
  return clean&&!/[.!?…][»”"')\]]*$/.test(clean)?clean+'.':clean;
}
function speechParts(article){
  const title=article.querySelector('h3,h2,h1')?.textContent||'';
  const deck=article.querySelector('.standfirst,.stand-first,.deck,.bajada');
  const paragraphs=Array.from(article.querySelectorAll('p,li')).filter(p=>p!==deck&&!p.closest('.sources,.sourcebar,.pn-voice,figcaption,.method,.note')&&!(p.tagName==='LI'&&p.querySelector('p'))).map(p=>p.textContent.trim()).filter(Boolean);
  const intro=[title,deck?.textContent||''].map(finishSentence).filter(Boolean).map(text=>({text,rate:0.9}));
  // El cuerpo conserva su ritmo; toda la cola se entrega al motor durante el clic.
  const body=chunks(paragraphs.join('\n\n'),3000).map(text=>({text,rate:1}));
  return [...intro,...body];
}
function createPlayer(engine,Utterance,onState){
  let active=null,queue=[],paused=false,version=0;
  function cancel(){const old=active;++version;active=null;queue=[];paused=false;engine.cancel();if(old)onState(old,'idle');}
  return {
    play(item,input){
      cancel();
      const parts=Array.isArray(input)?input:chunks(input,3000).map(text=>({text,rate:1}));
      if(!parts.length)return;
      active=item;const token=version;let completed=0;
      onState(item,'loading');engine.resume();const voice=spanishVoice(engine.getVoices());
      for(const part of parts){
        if(token!==version)break;
        const u=new Utterance(part.text);u.lang='es-CL';u.rate=part.rate||1;u.pitch=1;if(voice)u.voice=voice;queue.push(u);
        u.onstart=()=>{if(token===version&&active===item)onState(item,paused?'paused':'speaking');};
        u.onend=()=>{if(token!==version||active!==item)return;if(++completed===parts.length){active=null;queue=[];onState(item,'finished');}};
        u.onerror=e=>{if(token!==version||active!==item)return;cancel();onState(item,'error',e.error||'synthesis-failed');};
        try{engine.speak(u);}catch{cancel();onState(item,'error','synthesis-failed');break;}
      }
    },
    pause(item){if(active!==item||paused)return;paused=true;engine.pause();onState(item,'paused');},
    resume(item){if(active!==item||!paused)return;paused=false;engine.resume();onState(item,'speaking');},
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
      play.addEventListener('click',()=>player.play(article,speechParts(article)));
      pause.addEventListener('click',()=>pause.dataset.paused==='true'?player.resume(article):player.pause(article));
      stop.addEventListener('click',()=>player.stop());
    }
    const title=article.querySelector('h3,h2,h1');if(title)title.after(bar);else article.prepend(bar);
  });
  if(player){win.addEventListener('pagehide',()=>player.stop());win.addEventListener('beforeunload',()=>player.stop());}
}
return {chunks,minutes,textOf,finishSentence,speechParts,spanishVoice,createPlayer,init};
});
