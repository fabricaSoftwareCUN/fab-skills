# Desarrollo Guiado por Especificaciones (SDD)

> Fuente original: https://github.com/github/spec-kit/blob/main/spec-driven.md
> Licencia: MIT (GitHub Spec Kit)
> Fecha de captura: 2026-05-22

## La inversión de poder

Durante décadas, el código ha sido el rey. Las especificaciones servían al código: eran el andamiaje que construíamos y luego descartábamos una vez que comenzaba el "trabajo real" de programar. Escribíamos PRDs para guiar el desarrollo, creábamos documentos de diseño para informar la implementación, dibujábamos diagramas para visualizar la arquitectura. Pero estos siempre estaban subordinados al código en sí. El código era la verdad. Todo lo demás era, en el mejor de los casos, buenas intenciones. El código era la fuente de verdad, y a medida que avanzaba, las especificaciones rara vez seguían el ritmo. Como el activo (código) y la implementación son lo mismo, no es fácil tener una implementación paralela sin intentar construir desde el código.

El Desarrollo Guiado por Especificaciones (SDD) invierte esta estructura de poder. Las especificaciones no sirven al código: el código sirve a las especificaciones. El Documento de Requisitos de Producto (PRD) no es una guía para la implementación; es la fuente que genera la implementación. Los planes técnicos no son documentos que informan la codificación; son definiciones precisas que producen código. Esto no es una mejora incremental en cómo construimos software. Es un replanteamiento fundamental de qué impulsa el desarrollo.

La brecha entre especificación e implementación ha afectado al desarrollo de software desde sus inicios. Hemos intentado cerrarla con mejor documentación, requisitos más detallados, procesos más estrictos. Estos enfoques fallan porque aceptan la brecha como inevitable. Intentan reducirla pero nunca eliminarla. SDD elimina la brecha haciendo que las especificaciones y sus planes de implementación concretos, nacidos de la especificación, sean ejecutables. Cuando las especificaciones y los planes de implementación generan código, no hay brecha, solo transformación.

Esta transformación es posible ahora porque la IA puede comprender e implementar especificaciones complejas, y crear planes de implementación detallados. Pero la generación cruda de IA sin estructura produce caos. SDD proporciona esa estructura a través de especificaciones y planes de implementación subsiguientes que son lo suficientemente precisos, completos e inequívocos como para generar sistemas funcionales. La especificación se convierte en el artefacto principal. El código se convierte en su expresión (como una implementación del plan de implementación) en un lenguaje y framework particular.

En este nuevo mundo, mantener software significa evolucionar especificaciones. La intención del equipo de desarrollo se expresa en lenguaje natural ("**desarrollo guiado por intención**"), activos de diseño, principios fundamentales y otras directrices. La **lingua franca** del desarrollo se eleva a un nivel superior, y el código es el enfoque de última milla.

Depurar significa corregir especificaciones y sus planes de implementación que generan código incorrecto. Refactorizar significa reestructurar para lograr claridad. El flujo de desarrollo completo se reorganiza alrededor de las especificaciones como fuente central de verdad, con planes de implementación y código como la salida regenerada continuamente. Actualizar aplicaciones con nuevas funcionalidades o crear una nueva implementación paralela, porque somos seres creativos, significa revisar la especificación y crear nuevos planes de implementación. Este proceso es por tanto un 0 -> 1, (1', ..), 2, 3, N.

El equipo de desarrollo se enfoca en su creatividad, experimentación y pensamiento crítico.

## El flujo SDD en la práctica

El flujo comienza con una idea, a menudo vaga e incompleta. A través de un diálogo iterativo con la IA, esta idea se convierte en un PRD integral. La IA hace preguntas aclaratorias, identifica casos extremos y ayuda a definir criterios de aceptación precisos. Lo que podría tomar días de reuniones y documentación en el desarrollo tradicional ocurre en horas de trabajo de especificación enfocado. Esto transforma el SDLC tradicional: los requisitos y el diseño se convierten en actividades continuas en lugar de fases discretas. Esto apoya un **proceso de equipo**, donde las especificaciones revisadas por el equipo se expresan y versionan, se crean en ramas y se fusionan.

Cuando un product manager actualiza los criterios de aceptación, los planes de implementación señalan automáticamente las decisiones técnicas afectadas. Cuando un arquitecto descubre un mejor patrón, el PRD se actualiza para reflejar las nuevas posibilidades.

A lo largo de este proceso de especificación, agentes de investigación recopilan contexto crítico. Investigan la compatibilidad de bibliotecas, benchmarks de rendimiento e implicaciones de seguridad. Las restricciones organizacionales se descubren y aplican automáticamente: los estándares de base de datos de tu empresa, los requisitos de autenticación y las políticas de despliegue se integran sin problemas en cada especificación.

A partir del PRD, la IA genera planes de implementación que mapean requisitos a decisiones técnicas. Cada elección tecnológica tiene una justificación documentada. Cada decisión arquitectónica se traza hasta requisitos específicos. A lo largo de este proceso, la validación de consistencia mejora continuamente la calidad. La IA analiza las especificaciones en busca de ambigüedades, contradicciones y vacíos, no como una compuerta única, sino como un refinamiento continuo.

La generación de código comienza tan pronto como las especificaciones y sus planes de implementación son lo suficientemente estables, pero no tienen que estar "completos". Las primeras generaciones pueden ser exploratorias: probar si la especificación tiene sentido en la práctica. Los conceptos de dominio se convierten en modelos de datos. Las historias de usuario se convierten en endpoints de API. Los escenarios de aceptación se convierten en pruebas. Esto fusiona desarrollo y testing a través de la especificación: los escenarios de prueba no se escriben después del código, son parte de la especificación que genera tanto la implementación como las pruebas.

El ciclo de retroalimentación se extiende más allá del desarrollo inicial. Las métricas de producción y los incidentes no solo disparan hotfixes, sino que actualizan las especificaciones para la próxima regeneración. Los cuellos de botella de rendimiento se convierten en nuevos requisitos no funcionales. Las vulnerabilidades de seguridad se convierten en restricciones que afectan a todas las generaciones futuras. Esta danza iterativa entre especificación, implementación y realidad operativa es donde emerge la verdadera comprensión y donde el SDLC tradicional se transforma en una evolución continua.

## Por qué SDD importa ahora

Tres tendencias hacen que SDD no solo sea posible sino necesario:

Primero, las capacidades de la IA han alcanzado un umbral donde las especificaciones en lenguaje natural pueden generar código funcional de manera confiable. No se trata de reemplazar a los desarrolladores, sino de amplificar su efectividad automatizando la traducción mecánica de especificación a implementación. Puede amplificar la exploración y la creatividad, facilitar "empezar de cero", y apoyar la adición, sustracción y pensamiento crítico.

Segundo, la complejidad del software continúa creciendo exponencialmente. Los sistemas modernos integran decenas de servicios, frameworks y dependencias. Mantener todas estas piezas alineadas con la intención original mediante procesos manuales se vuelve cada vez más difícil. SDD proporciona alineación sistemática a través de la generación guiada por especificaciones. Los frameworks pueden evolucionar para ofrecer soporte AI-first en lugar de human-first, o diseñar su arquitectura alrededor de componentes reutilizables.

Tercero, el ritmo de cambio se acelera. Los requisitos cambian mucho más rápido hoy que nunca. Pivotar ya no es excepcional, es lo esperado. El desarrollo moderno de productos exige iteración rápida basada en retroalimentación de usuarios, condiciones de mercado y presiones competitivas. El desarrollo tradicional trata estos cambios como disrupciones. Cada pivote requiere propagar manualmente los cambios a través de documentación, diseño y código. El resultado es o bien actualizaciones lentas y cuidadosas que limitan la velocidad, o cambios rápidos e imprudentes que acumulan deuda técnica.

SDD puede soportar experimentos de tipo what-if/simulación: "Si necesitamos reimplementar o cambiar la aplicación para promover una necesidad de negocio de vender más camisetas, ¿cómo lo implementaríamos y experimentaríamos?"

SDD transforma los cambios de requisitos de obstáculos en flujo de trabajo normal. Cuando las especificaciones guían la implementación, los pivotes se convierten en regeneraciones sistemáticas en lugar de reescrituras manuales. Cambia un requisito fundamental en el PRD y los planes de implementación afectados se actualizan automáticamente. Modifica una historia de usuario y los endpoints de API correspondientes se regeneran. Esto no se trata solo del desarrollo inicial, sino de mantener la velocidad de ingeniería a través de los cambios inevitables.

## Principios fundamentales

**Especificaciones como lingua franca**: La especificación se convierte en el artefacto principal. El código se convierte en su expresión en un lenguaje y framework particular. Mantener software significa evolucionar especificaciones.

**Especificaciones ejecutables**: Las especificaciones deben ser lo suficientemente precisas, completas e inequívocas como para generar sistemas funcionales. Esto elimina la brecha entre intención e implementación.

**Refinamiento continuo**: La validación de consistencia ocurre de forma continua, no como una compuerta única. La IA analiza las especificaciones en busca de ambigüedades, contradicciones y vacíos como un proceso permanente.

**Contexto guiado por investigación**: Los agentes de investigación recopilan contexto crítico a lo largo del proceso de especificación, investigando opciones técnicas, implicaciones de rendimiento y restricciones organizacionales.

**Retroalimentación bidireccional**: La realidad de producción informa la evolución de las especificaciones. Las métricas, incidentes y aprendizajes operativos se convierten en insumos para el refinamiento de especificaciones.

**Ramas para exploración**: Comparar enfoques sin romper la base. Usar ramas para explorar implementaciones alternativas de forma segura.
