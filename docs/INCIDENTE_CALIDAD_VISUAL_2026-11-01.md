# PANORAMA — Incidente de calidad visual · 2026-11-01

**Estado:** incidencia editorial documentada; corrección preventiva incorporada al protocolo.  
**Alcance:** ediciones matinal y vespertina del 1 de noviembre de 2026.  
**Límite de intervención:** documentación solamente. No se alteraron ediciones publicadas, índice, programación, workflows, scripts ni infraestructura.

## Antecedente y evidencia

Felipe informó que ambas ediciones se mostraron con una estética insatisfactoria y sin fotografías visibles. La inspección del HTML fuente en la rama `main` confirma:

- **Matinal:** `ediciones/2026-11-01/matinal.html` contiene cinco elementos `<img>` y una ilustración SVG. En particular hay referencias externas a Wikimedia Commons mediante `Special:FilePath`. Que el HTML incluya imágenes **no demuestra** que se hayan descargado o mostrado correctamente en el navegador. Su fallo visual queda informado por el lector, pero no se atribuye a una causa técnica determinada sin prueba de carga y renderizado.
- **Vespertina:** `ediciones/2026-11-01/vespertina.html` contiene **cero elementos `<img>`** y nueve SVG. La ausencia de fotografías en el HTML es comprobable. Los SVG no deben presentarse como fotografías.

## Efecto

La continuidad y automatización editorial no garantizan por sí mismas el nivel de calidad gráfica esperado. No se debe confundir la existencia de una imagen o una revisión estática del HTML con su visibilidad real para el lector.

## Hipótesis por verificar (no causas demostradas)

Carga fallida de imágenes remotas, disponibilidad o permisos de origen, restricciones de red, composición de la plantilla o sustitución editorial de fotos por ilustraciones. Solo pruebas de navegador y de URL permitirán atribuir la causa.

## Resolución preventiva

Se incorpora a `docs/OPERACION.md` una puerta de control visual para **ambos turnos** que verifica por separado presencia, accesibilidad y renderizado de imágenes, diversidad compositiva y correspondencia entre fotografías e ilustraciones. Una edición visualmente deficiente genera alerta de calidad, **no modifica ni detiene la programación existente**. Si el entorno no admite verificación visual, se informa explícitamente la limitación en lugar de declarar conformidad.

## Restricciones

No reescribir los HTML históricos ni sus alias mediante este registro. No modificar `ediciones/indice.json`, tareas, workflows, GitHub Pages o Netlify. No activar facturación, recursos pagados ni servicios adicionales. Todo cambio futuro de diseño de portada requiere aprobación previa de Felipe; este incidente no la reemplaza.
