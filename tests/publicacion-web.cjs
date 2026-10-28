'use strict';
const fs=require('node:fs');
const path=require('node:path');
const index=JSON.parse(fs.readFileSync(path.join(__dirname,'../ediciones/indice.json'),'utf8'));
const base='https://fvidal527-boceto.github.io/panorama-chile/';
const netlify='https://panoramachile.netlify.app/';
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const SpanishMonths=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const dated=iso=>{const [year,month,day]=iso.split('-').map(Number);return day+' de '+SpanishMonths[month-1]+' de '+year;};
async function tryGet(url,required){
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),16000);
 try{
  const res=await fetch(url,{signal:controller.signal,redirect:'follow',headers:{'User-Agent':'PANORAMA-publication-check/1.0'}});
  if(!res.ok)return {ok:false,why:'HTTP '+res.status};
  const html=await res.text();
  return {ok:!required||required.every(w=>html.includes(w)),why:'HTTP '+res.status+', '+html.length+' caracteres'};
 }catch(e){return {ok:false,why:String(e.message||e)}}finally{clearTimeout(timer)}
}
(async()=>{
 const targets=[{name:'GitHub Pages portada',url:base,required:['PANORAMA']},
 {name:'GitHub Pages matinal',url:base+index.latest.matinal.url+'?ver='+encodeURIComponent(index.updated_at),required:['PANORAMA',dated(index.latest.matinal.fecha)]},
 {name:'GitHub Pages vespertina',url:base+index.latest.vespertina.url+'?ver='+encodeURIComponent(index.updated_at),required:['PANORAMA',dated(index.latest.vespertina.fecha)]},
 {name:'Netlify puente',url:netlify,required:['PANORAMA']}];
 let pending=[...targets];
 for(let attempt=1;attempt<=9;attempt++){
  const next=[];
  for(const t of pending){
   const got=await tryGet(t.url,t.required);
   console.log('Intento '+attempt+' '+t.name+' '+got.why);
   if(!got.ok)next.push(t);
  }
  pending=next;
  if(!pending.length)break;
  if(attempt<9)await pause(18000);
 }
 if(pending.length)throw Error('No se pudo comprobar disponibilidad publica de: '+pending.map(x=>x.name).join(', '));
 console.log('PUBLICACION PUBLICA COMPROBADA: portada, dos ediciones y puente Netlify.');
})().catch(e=>{console.error(e);process.exitCode=1;});
