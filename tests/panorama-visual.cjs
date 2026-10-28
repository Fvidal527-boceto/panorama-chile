'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const files=JSON.parse(fs.readFileSync(path.join(root,'ediciones/indice.json'),'utf8'));
const where=process.env.RUNNER_TEMP||'/tmp';
const {chromium}=require(path.join(where,'panorama-visual','node_modules','playwright-core'));
const output=path.join(where,'panorama-capturas');
fs.mkdirSync(output,{recursive:true});
let chrome=process.env.CHROME_BIN||'';
if(!chrome){
  for(const bin of ['google-chrome','google-chrome-stable','chromium','chromium-browser']){
    try{chrome=execFileSync('which',[bin],{encoding:'utf8'}).trim();if(chrome)break;}catch{}
  }
}
if(!chrome)throw Error('No hay Chrome/Chromium en el ejecutor de GitHub.');
(async()=>{
  const browser=await chromium.launch({executablePath:chrome,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  let errors=0;
  try{
    for(const type of ['matinal','vespertina']){
      const item=files.latest[type];
      if(!item)continue;
      const file=path.join(root,item.url);
      const latest=fs.readFileSync(file,'utf8');
      for(const width of [1280,390]){
        const page=await browser.newPage({viewport:{width,height:850},deviceScaleFactor:1});
        await page.goto('file://'+file,{waitUntil:'domcontentloaded',timeout:25000});
        await page.waitForTimeout(1200);
        const result=await page.evaluate(()=>{
          const box=x=>x.getBoundingClientRect();
          const doc=document.documentElement;
          const title=document.querySelector('.mast h1,.masthead h1,.mast h1,h1');
          const meta=document.querySelector('.edition,.mast .meta');
          const captions=[...document.querySelectorAll('figure figcaption,.photo figcaption')].map(x=>({text:x.textContent.slice(0,60),font:parseFloat(getComputedStyle(x).fontSize),width:box(x).width}));
          const overflow=doc.scrollWidth-innerWidth;
          const titleOverlap=title&&meta?Math.max(0,Math.min(box(title).bottom,box(meta).bottom)-Math.max(box(title).top,box(meta).top)):0;
          const brokenImages=[...document.querySelectorAll('img')].filter(x=>x.complete&&x.naturalWidth===0).map(x=>x.getAttribute('src'));
          const sourceGap=[...document.querySelectorAll('.story-row,.spread,.extra-grid')].filter(x=>getComputedStyle(x).display.includes('grid')).map(x=>{const c=[...x.children];if(c.length<2)return 0;return Math.max(...c.map(y=>box(y).bottom))-Math.min(...c.map(y=>box(y).bottom));});
          return {overflow,titleOverlap,captionMax:Math.max(0,...captions.map(x=>x.font)),captions,brokenImages,gridHeightGaps:sourceGap,bodyWidth:doc.scrollWidth,viewport:innerWidth};
        });
        const fileName=type+'-'+width+'.png';
        await page.screenshot({path:path.join(output,fileName),fullPage:true,animations:'disabled',timeout:30000});
        console.log(type+' '+width+'px '+JSON.stringify(result));
        if(result.overflow>4){console.error('ERROR desborde horizontal '+type+' '+width+': '+result.overflow+'px');errors++;}
        if(result.titleOverlap>3){console.error('ERROR cabecera superpuesta '+type+' '+width);errors++;}
        if(result.captionMax>12){console.error('ERROR credito fotografico demasiado grande '+type+' '+width+': '+result.captionMax+'px');errors++;}
        if(result.gridHeightGaps.some(x=>x>850))console.warn('ADVERTENCIA: posible espacio grande bajo columnas desiguales '+type+' '+width);
        if(result.brokenImages.length)console.warn('ADVERTENCIA: fotografias que no cargaron en el navegador de pruebas: '+result.brokenImages.join(', '));
        await page.close();
      }
    }
  } finally {await browser.close();}
  if(errors)throw Error('Control visual: '+errors+' errores de compaginacion. Capturas disponibles como artefactos de GitHub Actions.');
  console.log('CONTROL VISUAL: geometria y tipografia verificadas con navegador Chrome. Las capturas no sustituyen una evaluacion editorial humana.');
})().catch(e=>{console.error(e);process.exitCode=1;});
