# PANORAMA — operación editorial 2.3

Repositorio: Fvidal527-boceto/panorama-chile. Rama: main.
Hora editorial: America/Santiago. Solo HTML. Servicios gratuitos.
Netlify sirve un puente fijo a GitHub Pages: no desplegar Netlify ni activar facturación.

## Publicación
1. Leer este protocolo, ediciones/indice.json y la edición anterior del mismo turno. Mantener el diseño editorial 2.3 existente, sus fuentes, estructura y profundidad; no sustituirlo por una página de resúmenes.
2. Investigar con fuentes actuales accesibles y registrar fecha y cierre editorial. No inventar titulares, cifras, fuentes, enlaces ni acceso a suscripciones. Separar noticia, interpretación y editorial. La vespertina compara contra la matinal realmente publicada; si no existe, declarar la limitación.
3. Usar la fecha local de la edición. Crear HTML completo, autónomo, con CSS incorporado y navegación por anclas. Revisar que todas las anclas existan. Enlaces externos: target="_blank" rel="noopener noreferrer". Imágenes acreditadas y autorizadas o ilustraciones identificadas.
4. Escribir primero ediciones/AAAA-MM-DD/TIPO.html y el alias ediciones/actual/TIPO.html. Verificar contenido completo, título, fecha, artículos y fuentes. El histórico conserva la fecha original: nunca sustituir una edición antigua por contenido de otro día. Una corrección de la misma edición conserva trazabilidad en git y debe identificarse editorialmente.
5. SOLO al verificar los HTML, actualizar el índice. latest.TIPO = {fecha, url:"ediciones/AAAA-MM-DD/TIPO.html", titulo}. Usar URL histórica para que una caché de metadatos nunca muestre otra fecha mediante un alias. Conservar el otro turno, todas las entradas anteriores y campos desconocidos. archivo contiene una entrada por fecha y tipo, con URL histórica; ordenar fecha descendente y vespertina antes que matinal en el mismo día. updated_at: ISO 8601 con zona de Santiago.
6. Preferir una publicación atómica: leer refs/heads/main y su commit/tree; create_tree basado en ese tree con HTML histórico, alias e índice; create_commit con ese padre; update_ref sin force y con expected_sha. Un conflicto obliga a releer y fusionar; no forzar. Los dos HTML pueden apuntar al mismo blob. Si se usan create_file/update_file, verificar ambos HTML antes de cambiar el índice; releer SHA del índice inmediatamente antes de escribir y preservar cambios concurrentes.
7. Confirmar el commit y luego comprobar las URLs de GitHub Pages, su índice y el HTML fechado. Los builds y cachés pueden demorar: un commit exitoso no prueba disponibilidad pública. Si falta una comprobación, comunicar exactamente lo confirmado y lo pendiente.
8. No modificar index.html, portada-prueba.html, pruebas/indice-validacion.json, el otro turno ni ediciones anteriores durante la publicación rutinaria. No crear archivos de prueba dentro del archivo editorial.

## Ejecuciones
- Matinal: inicio 07:00 Santiago; objetivo de disponibilidad 07:30.
- Vespertina: inicio 15:00 Santiago; objetivo de disponibilidad 15:30.
- Son objetivos editoriales: el inicio programado no garantiza el minuto de finalización.
- Control: 08:00 y 16:00 Santiago. Leer índice, comprobar fecha, histórico y alias, igualdad de blobs y disponibilidad pública. Si hay error o retraso, avisar con la evidencia; si está correcto, no avisar.

## Diseño
Matinal: marfil, verde y terracota; portada jerarquizada, cuatro entradas, editorial; interiores variados, textos completos y agenda «Para seguir esta tarde».
Vespertina: marfil, terracota y cobre; portada jerarquizada, cuatro entradas, editorial; novedades y cambios identificados; cierre «Para seguir mañana».
Usar las ediciones originales del 24-10-2026 como referencia verificable. No copiar sus noticias como información nueva.
Los lunes: suplemento de educación superior, IA e innovación para 3Educativo.
Exclusiones acordadas: PDF, audio, Cuerpo D de El Mercurio y servicios de pago.

## Comprobación técnica
node tests/portada.test.cjs
La portada usa URLs históricas, abre la edición más reciente y permite elegir ambos turnos y el archivo. Actualiza metadatos cada cinco minutos sin cambiar la lectura elegida.
portada-prueba.html usa exclusivamente pruebas/indice-validacion.json para validar la interfaz con las dos ediciones originales del 24. No es una edición nueva.
