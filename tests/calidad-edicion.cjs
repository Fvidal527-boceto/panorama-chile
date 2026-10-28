'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const index=JSON.parse(fs.readFileSync(path.join(root,'ediciones/indice.json'),'utf8'));
let fails=0;
function check(condition,message){if(!condition){console.error('ERROR: '+message);fails++;}else{console.log('OK: '+message);}}
for(const type of ['matinal','vespertina']){
  const item=index.latest[type];
  if(!item){check(false,type+': sin entrada en indice');continue;}
  const filename=path.join(root,item.url);
  const alias=path.join(root,'ediciones/actual/'+type+'.html');
  check(fs.existsSync(filename),type+': historico existe');
  check(fs.existsSync(alias),type+': alias existe');
  if(!fs.existsSync(filename)||!fs.existsSync(alias))continue;
  const body=fs.readFileSync(filename,'utf8');
  const same=fs.readFileSync(alias,'utf8')===body;
  check(same,type+': historico y alias identicos');
  check(item.url==='ediciones/'+item.fecha+'/'+type+'.html',type+': ruta de fecha correcta');
  const count=(body.match(/<article\b/gi)||[]).length;
  const paragraphs=(body.match(/<p\b/gi)||[]).length;
  const citations=(body.match(/class="sources"/g)||[]).length;
  const target=type==='matinal'?10:8;
  const minPara=type==='matinal'?60:30;
  check(count>=target,type+': cobertura suficiente ('+count+' articulos, umbral '+target+')');
  check(paragraphs>=minPara,type+': profundidad de texto ('+paragraphs+' parrafos, umbral '+minPara+')');
  check(citations>=Math.floor(count*.8),type+': notas con bloque de fuentes ('+citations+'/'+count+')');
  check(body.includes('lang="es"')&&body.includes('</html>'),type+': HTML en espanol completo');
  check(body.includes('panorama-lectura-voz'),type+': lector de voz incorporado');
  const statement='Edición elaborada con asistencia de inteligencia artificial. PANORAMA cuenta con la supervisión general de Felipe Vidal Rojas. Las fuentes originales están enlazadas en cada nota.';
  check(body.includes(statement),type+': transparencia editorial');
  const targets=[...body.matchAll(/href="#([^"]+)"/g)].map(x=>x[1]);
  const broken=targets.filter(id=>!body.includes('id="'+id+'"'));
  check(broken.length===0,type+': enlaces internos validos'+(broken.length?' '+broken.join(','):''));
  for(const city of ['Santiago','Concepción','Casablanca']){
    check(body.includes(city),type+': franja meteorologica '+city);
  }
  if(type==='matinal'){
    check(body.includes('UF')&&body.includes('UTM'),type+': indicadores economicos esenciales');
    const missingWeather=(body.match(/<strong class="nodata">Sin dato verificado<\/strong>/g)||[]).length;
    check(missingWeather<3,type+': las tres ciudades no pueden quedar simultaneamente sin pronostico');
  }
  console.log('RESUMEN '+type+': '+count+' articulos, '+paragraphs+' parrafos, '+citations+' referencias de fuentes.');
}
if(fails){console.error('CONTROL EDITORIAL FALLIDO: '+fails+' incumplimientos.');process.exitCode=1;}
else console.log('CONTROL EDITORIAL APROBADO.');
