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
    // La ausencia de datos meteorologicos verificables no debe provocar un fallo:
    // OPERACION.md exige conservar "Sin dato verificado", no inventar pronosticos.
    const missingWeather=(body.match(/<strong class="nodata">Sin dato verificado<\/strong>/g)||[]).length;
    check(missingWeather<=3,type+': campos meteorologicos sin datos verificados permitidos ('+missingWeather+'/3)');
  }
  // Advertencias editoriales no bloqueantes: no transformar ausencia de fotos o
  // fallas de proveedores meteorologicos en errores de despliegue.
  const photoCount=(body.match(/<img\b/gi)||[]).length;
  const svgCount=(body.match(/<svg\b/gi)||[]).length;
  if(photoCount===0){
    console.log('::warning title=PANORAMA fotografias::'+type+': edicion sin etiquetas img ('+svgCount+' SVG). Revisar fotografia documental con creditos y permisos.');
  }else{
    console.log('OK: '+type+': '+photoCount+' elementos img referenciados; permisos, carga real y fotografia documental requieren comprobacion editorial.');
  }
  const evidencePath=path.join(root,'ediciones',item.fecha,'servicio-'+type+'.json');
  if(!fs.existsSync(evidencePath)){
    console.log('::warning title=PANORAMA servicio::'+type+': falta respaldo servicio-'+type+'.json.');
  }else{
    try{
      const evidence=JSON.parse(fs.readFileSync(evidencePath,'utf8'));
      const weather=Array.isArray(evidence.weather)?evidence.weather:[];
      const unavailable=weather.filter(row=>/sin dato verificado/i.test(String(row.value||'')));
      if(weather.length===3&&unavailable.length===3){
        console.log('::warning title=PANORAMA pronostico::'+type+': tres ciudades sin datos verificados. Registrar fuentes alternativas y sus resultados; conservar datos ausentes sin inventar.');
      }
      if(weather.length!==3){
        console.log('::warning title=PANORAMA servicio::'+type+': respaldo meteorologico sin tres ciudades normalizadas.');
      }
    }catch(error){
      console.log('::warning title=PANORAMA servicio::'+type+': respaldo JSON no analizable ('+error.message+').');
    }
  }
  console.log('RESUMEN '+type+': '+count+' articulos, '+paragraphs+' parrafos, '+citations+' referencias de fuentes.');
}
// En verificaciones PROGRAMADAS, una edicion anterior no basta para dar por
// realizada la publicacion del turno actual. En push no exigimos frescura:
// los commits intermedios de la secuencia de publicacion son validos.
if(process.env.GITHUB_EVENT_NAME==='schedule'){
  const parts=new Intl.DateTimeFormat('en-CA',{
    timeZone:'America/Santiago',year:'numeric',month:'2-digit',day:'2-digit',
    hour:'2-digit',hourCycle:'h23'
  }).formatToParts(new Date());
  const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));
  const today=p.year+'-'+p.month+'-'+p.day;
  const hour=Number(p.hour);
  const turn=hour>=16?'vespertina':hour>=8?'matinal':null;
  if(turn){
    const expected='ediciones/'+today+'/'+turn+'.html';
    const entry=index.latest[turn];
    check(Boolean(entry&&entry.fecha===today&&entry.url===expected&&
      fs.existsSync(path.join(root,expected))),
      'PUBLICACION DEL TURNO: '+turn+' '+today+
      ' debe existir y figurar como ultima edicion (actual: '+
      (entry?.fecha||'sin fecha')+')');
    if(!entry||entry.fecha!==today){
      console.error('::error title=PANORAMA sin nueva edicion::'+
        'El control programado detecto la ausencia de '+turn+' '+today+
        '. Revisar automatizacion de produccion de ChatGPT; '+ 
        'GitHub Actions solo verifica, no genera contenido editorial.');
    }
  }
}

if(fails){console.error('CONTROL EDITORIAL FALLIDO: '+fails+' incumplimientos.');process.exitCode=1;}
else console.log('CONTROL EDITORIAL APROBADO.');
