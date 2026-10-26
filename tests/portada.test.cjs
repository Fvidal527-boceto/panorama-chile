const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');
const script=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
const base='https://fvidal527-boceto.github.io/panorama-chile/';
function node(){return {children:[],disabled:false,textContent:'',setAttribute(k,v){this[k]=v},appendChild(c){this.children.push(c)},replaceChildren(){this.children=[]},scrollIntoView(){}}}
async function page(data,search=''){
 const nodes={};let interval;
 const ctx={URL,URLSearchParams,Intl,Date,Set,document:{baseURI:base,hidden:false,getElementById:id=>nodes[id]??=node(),createElement:()=>node()},location:{search},fetch:async()=>{if(data instanceof Error)throw data;return{ok:true,json:async()=>data}},setInterval:f=>{interval=f}};
 vm.runInNewContext(script,ctx);await new Promise(setImmediate);return {nodes,ctx,refresh:async()=>{interval();await new Promise(setImmediate)}};
}
const item=(fecha,tipo)=>({fecha,tipo,url:`ediciones/${fecha}/${tipo}.html`,titulo:`${tipo} ${fecha}`});
const m=item('2026-10-24','matinal'),v=item('2026-10-24','vespertina');
const data={latest:{matinal:{...m,url:'ediciones/actual/matinal.html'},vespertina:v},archivo:[m,v,v],updated_at:'2026-10-24T21:00:00-03:00'};
const versioned=item=>base+item.url+'?rev='+encodeURIComponent(data.updated_at);
(async()=>{
 let p=await page(data);assert.equal(p.nodes.reader.src,versioned(v));assert.equal(p.nodes.archive.children.length,2);assert.equal(p.nodes.archive.children[0].children[0].href,base+v.url);
 p.nodes.matbtn.onclick();assert.equal(p.nodes.reader.src,versioned(m));await p.refresh();assert.equal(p.nodes.reader.src,versioned(m));
 p.nodes.archive.children[0].children[0].onclick({preventDefault(){},button:0});assert.equal(p.nodes.reader.src,versioned(v));
 p=await page(data,'?edicion=matinal');assert.equal(p.nodes.reader.src,versioned(m));
 p=await page({...data,latest:{matinal:m,vespertina:null},archivo:[m]});assert.equal(p.nodes.reader.src,versioned(m));assert.equal(p.nodes.vesbtn.disabled,true);
 const tomorrow=item('2026-10-25','matinal');p=await page({...data,latest:{matinal:tomorrow,vespertina:v}});assert.equal(p.nodes.reader.src,versioned(tomorrow));
 p=await page({...data,archivo:[m,{fecha:'../../outside',tipo:'matinal'},{fecha:'2026-10-24',tipo:'javascript:alert(1)'}]});assert.equal(p.nodes.archive.children.length,1);
 p=await page(data,'?edicion=matinal');const loaded=p.nodes.reader.src;
 const initialRevision=data.updated_at;data.updated_at='2026-10-24T22:00:00-03:00';await p.refresh();
 assert.equal(p.nodes.reader.src,loaded);assert.match(p.nodes['publication-status'].textContent,/Hay una actualización/);
 p.nodes.matbtn.onclick();assert.equal(p.nodes.reader.src,versioned(m));assert.equal(p.nodes.direct.href,versioned(m));assert.equal(p.nodes['publication-status'].textContent,'');data.updated_at=initialRevision;
 p=await page(new Error('offline'));assert.match(p.nodes['publication-status'].textContent,/No pudimos/);p.nodes.matbtn.onclick();assert.equal(p.nodes.reader.src,base+m.url);
 console.log('PASS: 9 escenarios — última edición, archivo sin duplicados, selección persistente, consulta, edición pendiente, cambio de fecha, entradas inválidas, fallo de red y actualización con caché sin interrumpir la lectura.');
})();
