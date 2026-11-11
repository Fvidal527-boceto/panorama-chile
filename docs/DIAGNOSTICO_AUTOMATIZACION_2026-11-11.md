# PANORAMA — incidente de tareas automáticas · diagnóstico y plan acotado
**Registro inicial:** 11 de noviembre de 2026, America/Santiago.  
**Estado:** causa de desactivaciones no determinada; seguimiento abierto.  
**Alcance autorizado:** acciones 1 (investigar/documentar) y 2 (simplificar ejecución técnica sin perder periodismo). Acciones 3 (trazabilidad/recuperación) y 4 (prueba de continuidad y plan editorial) **quedan sujetas a decisión posterior**, no se implementan por este documento.

## Diferencias demostrables: ejecuciones exitosas vs. fallidas

| Fecha / turno | Evidencia | Resultado |
|---|---|---|
| 7 nov. matinal y vespertina | Commits `8a44452fd` y `7f84521be` | Nuevas ediciones registradas en GitHub |
| 8 nov. matinal | Commit `e59b54f17` | Nueva edición registrada |
| 8 nov. vespertina | Histórico ausente al revisarse el 9 | Edición faltante, reconstruida el 9 |
| 9 nov. vespertina | Commit `7decceeb3` a las 15:06 de Santiago | Producción automática con archivo, alias e índice |
| 10 nov. matinal | Ejecución de tarea iniciada aprox. 06:56, cerró aprox. 07:06; histórico ausente | Se recuperó manualmente después |
| 10 nov. vespertina | Ejecución iniciada aprox. 14:55, cerró aprox. 15:08; histórico ausente | Se recuperó manualmente después |
| 11 nov. matinal | Ejecución programada 07:00, inició aprox. 06:58 y cerró 07:17; histórico ausente; tarea luego aparecía desactivada | Se recuperó manualmente después |

Los resultados de las tareas faltantes muestran `recorded_status=completed` **sin archivo de edición** y sin informe final recuperable en la consulta actual. En fechas fallidas se observó `is_enabled=false` después de las ejecuciones. El valor `updated_at` muestra una modificación del registro de tarea, **no identifica quién, qué componente o por qué lo cambió**.

## Comparación de instrucciones y configuración

- Prompts conservados íntegros, con las mismas 32 líneas comunes y una última línea distinta por turno, en `docs/respaldos/PANORAMA_N2_MATINAL_PROMPT_2026-11-11.txt` y `docs/respaldos/PANORAMA_N2_VESPERTINA_PROMPT_2026-11-11.txt`.
- Longitud matinal: 13.208 caracteres; vespertina: 13.292. Casi idénticas; el tamaño/complexidad **es una hipótesis de riesgo**, no causa demostrada.
- Tareas `exact_schedule` con zona `America/Santiago`: matinal 07:00 y vespertina 15:00 (comienzo de producción). Los horarios editoriales objetivo publicados 07:30 y 15:30 son distintos; no alterar cadencia sin nueva decisión.
- Entornos `environment_selection=inherited`, `environments=null`: no hay desglose histórico de herramientas/permisos disponibles en cada ejecución programada, ni evidencia de auditoría de cambios de estado.
- GitHub Actions `panorama-control.yml` tiene `permissions: contents: read` y comprueba ediciones; no genera ni publica contenido. Un run de `push` puede pasar con ediciones anteriores. Desde el 10 de noviembre, los runs programados comparan la fecha y turno esperados.
- `pages build and deployment` puede fallar de manera independiente tras existir los archivos (caso del 6 noviembre), lo que exige diferenciar **falta de creación**, **falta de despliegue** y **falta de verificación externa**.

## Límites y diagnóstico

No existe evidencia accesible mediante estos conectores que revele los mensajes de error internos, el motivo de desactivación o una comparación histórica de entornos por ejecución. **No afirmar que GitHub, un permiso, el tamaño del prompt o la plataforma causaron definitivamente el incidente.** El dato probado es que una tarea puede cerrarse sin el archivo requerido y, en varias ocasiones, quedar desactivada.

Para que soporte de OpenAI pueda diagnosticar (si es necesario), aportar IDs de las tareas, horas de ejecución y pantallas de los estados sin incluir credenciales:
- Matinal: `6ae1d8a5ee048191af8cda699120fc6d`.
- Vespertina: `6ae1d8a9a8948191b262fc96878eb613`.
- Control de publicación (solo lectura): `6add48ad66c88191a26f72233c175bab`.
- Runs relevantes de tareas: matinal 11 nov. `dca7c6d5-ac54-832c-9b46-a0a1457c5cf7`; vespertina 10 nov. `20c7494d-422c-8320-a318-952b038ea954`; vespertina 9 nov. exitosa con commit `7decceeb3`.
- Ejemplos GitHub Actions: controles programados identifican ediciones ausentes; no explican la desactivación de ChatGPT.

## Acción 2: simplificación de la ejecución, no de las exigencias

Mantener intacto el modelo editorial N.º 2 y `docs/OPERACION.md`. Reducir redundancias operativas del prompt activo; usar instrucciones compactas, autónomas, que preserven: tres etapas secuenciales; manuscrito plural y profundo; clima tres ciudades con fallback verificado; indicadores con fechas; suplementos lunes; zoom temáticos cuando procedan; diseño 2.3, fotos con licencia, lector de voz; histórico, alias, servicio JSON e índice; verificación de SHA y acceso público; reporte de errores sin aparentar publicación. Las instrucciones previas completas quedan archivadas y vinculadas para consulta. **La simplificación es una prueba de hipótesis**, no garantía de eliminar desactivaciones.

No cambiar programación horaria, modelo 1 de respaldo, Netlify, workflows ni GitHub Actions como parte de estas acciones.

## Punto de decisión formal tras observación (acciones 3 y 4)

**Fecha de evaluación propuesta: martes 17 de noviembre de 2026** después de observar los turnos del 12 al 16.
1. Contabilizar cada matinal y vespertina que fue producida y publicada **sin intervención humana**, y compararla con control GitHub y edición pública; consignar fallos y estados de tareas.
2. Evaluar calidad de pronóstico de Santiago, Concepción y Casablanca, novedad y compaginación del suplemento del lunes 16, y cobertura/zoom en agenda internacional.
3. Emitir una decisión explícita **IMPLEMENTAR / AJUSTAR / NO IMPLEMENTAR** por separado sobre **acción 3 (trazabilidad y recuperación)** y **acción 4 (prueba de continuidad/retorno editorial)**, detallando evidencias, beneficios, límites y costos. La evaluación no concede aprobación automática ni modifica tareas.
4. Conservar esta decisión en el repositorio y comunicarla al propietario. Las invitaciones a lectores siguen condicionadas a continuidad real y calidad; no enviarlas sin autorización.

Este registro debe complementarse con resultados nuevos; no sustituye el documento `docs/CONTINUIDAD_EDITORIAL_Y_OPERATIVA_2026-11-11.md`.
