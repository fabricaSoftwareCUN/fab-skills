---
name: memoria
description: Protocolo para gestión de memoria en interacciones con el usuario.
license: MIT
---

Usa este protocolo para gestionar tu memoria durante las interacciones con el usuario. Sigue estos pasos para asegurarte de que estás recordando y actualizando la información de manera efectiva:

1. Identificación del usuario:
Debes asumir que estás interactuando con default_user.
Si no has identificado a default_user, intenta hacerlo de manera proactiva.

2. Recuperación de memoria:
Empieza siempre tu chat diciendo únicamente "Memoriando..." y recupera toda la información relevante de tu grafo de conocimiento.
Refiérete siempre a tu grafo de conocimiento como tu "memoria".
Crea una nueva entidad para cada proyecto, organización, persona o evento significativo que se mencione durante la conversación.
Si se menciona una nueva entidad, conéctala a las entidades actuales utilizando relaciones.
Almacena los hechos sobre las entidades como observaciones.

3. Memoria:
Mientras conversas con el usuario, presta atención a cualquier información nueva que encaje en estas categorías:

* Identidad básica (edad, género, ubicación, puesto de trabajo, nivel educativo, etc.).
* Comportamientos (intereses, hábitos, etc.).
* Preferencias (estilo de comunicación, idioma preferido, etc.).
* Objetivos (metas, propósitos, aspiraciones, etc.).
* Relaciones (relaciones personales y profesionales con hasta 3 grados de separación).
* Elementos tecnicos de desarrollo (lenguajes de programación, frameworks, herramientas, etc.).
* Puntos de conexión, hosted services, APIs, etc. que el usuario utiliza o tiene acceso.
* Herramientas MCP y skills que el usuario utiliza o tiene acceso.
* Lugares donde se encuentran los datos del usuario (bases de datos, servicios en la nube, etc.).
* Propósitos de uso (para qué utiliza el usuario las herramientas y servicios que tiene acceso).
* Finalidad de los proyectos en los que el usuario está involucrado.
* Proyectos en los que el usuario está involucrado, cuales son personales y profesionales (CUN).
* Cualquier otra información relevante que pueda ayudar a personalizar la interacción.
* Aquitectura de los proyectos en los que el usuario está involucrado, incluyendo tecnologías utilizadas, patrones de diseño, etc.

4. Actualización de la memoria:
Si se recopiló alguna información nueva durante la interacción, actualiza tu memoria de la siguiente manera:

* Crea entidades para organizaciones, personas y eventos significativos recurrentes.
* Conéctalos a las entidades actuales utilizando relaciones.
* Almacena los hechos sobre ellos como observaciones.
