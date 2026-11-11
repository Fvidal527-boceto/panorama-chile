# PANORAMA — Acuerdos de continuidad y evidencia operativa · 11 noviembre 2026

## Propósito y jerarquía de prioridades

PANORAMA es un proyecto periodístico personal en desarrollo. Su propósito central es ofrecer una experiencia de lectura informada, plural, atractiva, profunda y útil. **La automatización no es el objetivo principal**: es una condición operativa que permite dedicar esfuerzo a mejorar el periodismo. La relevancia coyuntural de la automatización deriva de sus fallos reiterados, no de que tenga prioridad editorial sobre el contenido, el servicio o la experiencia de lectura.

No interpretar los mensajes sobre fallas de publicación como si la continuidad fuese el único aspecto que interesa al propietario. Evitar inferencias sobre sus prioridades que no estén expresamente respaldadas por sus palabras.

## Tres frentes de trabajo, relacionados pero diferentes

1. **Estabilidad operativa.** Publicar las ediciones matinal y vespertina correspondientes a la fecha real, sin intervención diaria, sin costos adicionales, con enlace público comprobado. No confundir tarea «completada», archivo subido, índice actualizado y despliegue efectivamente visible. Si una automatización falla o se desactiva, investigar evidencia de las ejecuciones y comparar días exitosos con fallidos; no limitarse a reactivar tareas y no afirmar una causa sin pruebas.
2. **Calidad periodística y servicios cotidianos.** El recuadro meteorológico para Santiago, Concepción y Casablanca sigue sin resolverse satisfactoriamente; los avisos «SIN DATO VERIFICADO» son una salvaguarda de integridad, **no una solución editorial satisfactoria**. Investigar fuentes y mecanismos de respaldo hasta publicar pronósticos vigentes y verificables de manera regular. Mejorar actualidad, profundidad, tratamiento visual y consistencia gráfica.
3. **Desarrollo editorial.** Recuperar y ampliar los espacios de profundización o «zoom», con actualización y contraste de fuentes. Ejemplos de la agenda editorial señalados el 11-11-2026: COP en Turquía; negociaciones para formar gobierno en Israel; elecciones a fin de mes en España; controversias en el gobierno de Paraguay; visita de León XIV a Latinoamérica. Son **temas a investigar y verificar**, no afirmaciones anticipadas sobre hechos o calendarios. La cobertura especial anterior de elecciones en Brasil y Estados Unidos sirve como referencia del enfoque que se busca.

## Suplemento de educación superior del lunes

Es un producto editorial propio, reconocible, con portada y compaginación destacadas y coherentes con lunes anteriores. No debe repetirse durante semanas una noticia conocida (el propietario señaló repetición de la misma noticia durante aproximadamente tres semanas). Debe aportar novedades, seguimiento, contexto y análisis útiles sobre educación superior, calidad/acreditación, educación digital, IA e innovación. El lunes 9 de noviembre se perdió parte del tratamiento editorial y visual diferenciado del suplemento; verificar y corregir esa desviación antes de considerar el resultado satisfactorio.

## Evidencia capturada por el propietario · mañana del 11-11-2026

El propietario compartió tres capturas:
- Un correo automático de GitHub, de aproximadamente las 08:44, con asunto relacionado con **PANORAMA - control editorial y publicacion**, que indica: «All jobs have failed».
- La página de GitHub Actions del workflow **PANORAMA - control editorial y publicacion**, ejecución **#123**, activada por `schedule`, estado **Failure**, con un trabajo `verificar` fallido en aproximadamente 8 segundos.
- Las anotaciones visibles: **2 errors, 3 warnings and 1 notice**. Entre los errores: `Process completed with exit code 1` y `PANORAMA sin nueva edicion: El control programado detecto la ausencia de matinal 2026-11-11. Revisar automatizacion de produccion de ChatGPT; GitHub Actions solo verifica, no genera contenido editorial.` Advertencias: tres ciudades sin pronósticos verificados en la matinal **y** en la vespertina; aviso de compatibilidad Node.js 20 de GitHub Actions. El aviso sobre Ubuntu 26 se refiere a una migración próxima de runner, no acredita por sí solo la causa de la ausencia editorial.

**Lectura de esa evidencia:** los controles identificaron correctamente una edición ausente y datos meteorológicos faltantes. El correo notifica el fallo del control, no demuestra que GitHub Pages esté caído. La acción `verificar` no genera contenido. Los avisos de Node.js y Ubuntu no deben confundirse con la causa raíz, que permanece sin determinar.

## Comportamiento observado en ejecuciones recientes

- Lunes 9 de noviembre: vespertina producida y registrada automáticamente.
- Martes 10 de noviembre: matinal y vespertina no se produjeron en su horario normal; se recuperaron después mediante intervención en la conversación.
- Miércoles 11 de noviembre: matinal ausente en el repositorio después de la ejecución matinal; tarea matinal detectada en estado desactivado tras completarse; verificación de control de las 08:20 confirmó ausencia.
- Debe revisarse el historial de las tareas de ChatGPT, sus resultados y cambios de estado, para establecer la diferencia técnica entre las ejecuciones exitosas y las fallidas. **No hay evidencia suficiente para afirmar por qué se desactivan las tareas.**

## Criterios para declarar avances

- No declarar «PANORAMA resuelto» solo por una recuperación manual o un despliegue puntual.
- La operatividad se prueba mediante varias ediciones consecutivas de ambos turnos, generadas y publicadas sin intervención.
- La calidad editorial se prueba separadamente: pronóstico con tres ciudades, suplemento del lunes distinguible y actualizado, cobertura profunda, hechos y enlaces verificados, compaginación y voz.
- Posponer invitaciones a nuevos lectores hasta que la experiencia sea suficientemente confiable. Mantener la condición de **costo adicional cero**.
- Conservar el Modelo Edición N.º 1 como respaldo intacto y continuar utilizando el Modelo Edición N.º 2, con sus tres etapas: investigación y edición, diseño y multimedia, publicación.

Este documento registra acuerdos expresados por el propietario y evidencia suministrada; no constituye autorización para cambiar modelos, servicios, horarios o infraestructura, ni para anunciar publicaciones no comprobadas.
