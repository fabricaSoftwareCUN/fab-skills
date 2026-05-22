# Leyes de UX - Catalogo completo

Referencia basada en [Laws of UX](https://lawsofux.com) de Jon Yablonski.

Organizadas por categoria con descripcion, implicacion practica y ejemplo de aplicacion.

---

## Toma de decisiones

### Ley de Hick

> El tiempo para tomar una decision aumenta con el numero y complejidad de las opciones.

- **Implicacion**: Simplificar opciones visibles. Dividir procesos largos en pasos (wizard/stepper).
- **Ejemplo**: Menu de navegacion con 15 enlaces -> agrupar en 4-5 categorias con submenu desplegable.
- **CSS**: Ocultar opciones secundarias con `details/summary` o menu colapsable.

### Ley de Fitts

> El tiempo para alcanzar un objetivo depende de la distancia y el tamano del mismo.

- **Implicacion**: CTAs grandes y cercanos al foco de atencion. Zona de pulgar en movil.
- **Ejemplo**: Boton "Enviar" pequeno en esquina -> moverlo al centro, min `44x44px`, alto contraste.
- **CSS**: `min-width: 44px; min-height: 44px; padding: 12px 24px;`

### Ley de Miller

> Las personas mantienen entre 5 y 9 elementos en memoria de trabajo simultaneamente.

- **Implicacion**: Agrupar informacion (chunking). No mostrar mas de 7 items sin agrupacion.
- **Ejemplo**: Formulario de 20 campos -> dividir en 4 secciones tematicas de 5 campos.
- **CSS**: Agrupar visualmente con `fieldset`, `gap`, bordes o fondos diferenciados.

### Carga cognitiva

> Cantidad total de esfuerzo mental para usar una interfaz.

- **Tipos**: Intrinseca (complejidad inherente), extrinseca (complejidad del diseno), germana (aprendizaje).
- **Implicacion**: Minimizar carga extrinseca. Eliminar elementos decorativos sin funcion.
- **Ejemplo**: Dashboard con 30 metricas -> mostrar 5 KPIs principales, el resto en tabs secundarios.

### Sobrecarga de opciones (Choice Overload)

> Demasiadas opciones paralizan al usuario.

- **Implicacion**: Ofrecer defaults inteligentes. Destacar opcion recomendada.
- **Ejemplo**: Plan de precios con 8 opciones -> reducir a 3, destacar el mas popular.

---

## Percepcion (Gestalt)

### Ley de Proximidad

> Objetos cercanos se perciben como grupo.

- **Implicacion**: Usar espacio para crear relaciones visuales. Elementos relacionados = menos gap.
- **CSS**: `gap: 8px` entre elementos del mismo grupo, `gap: 32px` entre grupos distintos.

### Ley de Similitud

> Elementos similares (color, forma, tamano) se perciben como parte del mismo grupo.

- **Implicacion**: Componentes con la misma funcion deben verse iguales.
- **Ejemplo**: Todos los botones de accion primaria con el mismo color y tamano.

### Ley de Region Comun

> Elementos dentro de un mismo borde o fondo se perciben como grupo.

- **Implicacion**: Usar cards, fondos, bordes para agrupar informacion relacionada.
- **CSS**: `border: 1px solid var(--color-border); border-radius: 8px; padding: 16px;`

### Ley de Pragnanz (Simplicidad)

> Las personas perciben formas complejas como la forma mas simple posible.

- **Implicacion**: Disenar con formas simples y geometricas. Evitar complejidad visual innecesaria.
- **Ejemplo**: Iconos con formas basicas (circulo, cuadrado) son mas reconocibles que ilustraciones detalladas.

### Ley de Conexion Uniforme

> Elementos conectados visualmente (lineas, flechas, colores) se perciben como relacionados.

- **Implicacion**: Usar lineas de conexion en flujos, breadcrumbs, steppers.
- **Ejemplo**: Stepper de checkout con linea conectando los pasos completados.

### Ley de Continuidad

> El ojo sigue caminos suaves y continuos, prefiriendo lineas fluidas sobre cambios abruptos.

- **Implicacion**: Alinear elementos en lineas visuales claras. Evitar rupturas de grid.

---

## Memoria

### Efecto de Posicion Serial

> Se recuerdan mejor el primer (efecto primacia) y ultimo (efecto recencia) elemento de una serie.

- **Implicacion**: Colocar acciones mas importantes al inicio y al final de listas/menus.
- **Ejemplo**: Navegacion movil (bottom bar): Inicio al principio, Perfil al final.

### Efecto Von Restorff (Aislamiento)

> Cuando hay multiples elementos similares, el que difiere se recuerda mas.

- **Implicacion**: Hacer visualmente distinto el elemento mas importante (CTA, alerta critica).
- **CSS**: CTA con color, tamano o peso diferente al resto de botones.

### Efecto Zeigarnik

> Las tareas incompletas se recuerdan mejor que las completadas.

- **Implicacion**: Usar barras de progreso, indicadores de completitud.
- **Ejemplo**: Perfil "75% completo" motiva al usuario a terminar. Checklist con items pendientes.

### Regla Peak-End

> Las experiencias se juzgan por el momento mas intenso (pico) y el final, no por el promedio.

- **Implicacion**: Invertir en momentos clave: onboarding, confirmaciones de exito, animaciones de logro.
- **Ejemplo**: Animacion de celebracion al completar una compra. Mensaje personalizado de bienvenida.

---

## Comportamiento

### Ley de Jakob

> Los usuarios pasan la mayor parte de su tiempo en otros sitios. Esperan que el tuyo funcione igual.

- **Implicacion**: Usar patrones de diseno estandar. Logo arriba a la izquierda enlazando a inicio. Carrito arriba a la derecha. Formularios con labels arriba del input.
- **Anti-patron**: Reinventar la navegacion, crear controles personalizados innecesarios.

### Efecto Goal-Gradient

> La motivacion aumenta a medida que se acerca la meta.

- **Implicacion**: Mostrar progreso. Iniciar barras de progreso con algo ya completado.
- **Ejemplo**: "Paso 2 de 4" es mas motivador que no mostrar nada. Programa de lealtad que empieza con puntos de cortesia.

### Principio de Pareto (80/20)

> El 80% de los efectos provienen del 20% de las causas.

- **Implicacion**: Identificar el 20% de funciones que usan el 80% de los usuarios y optimizarlas primero.
- **Ejemplo**: Dashboard donde el 80% de usuarios solo usa busqueda y lista -> optimizar esos flujos.

### Umbral de Doherty

> La productividad se dispara cuando el sistema responde en menos de 400ms.

- **Implicacion**: Si la respuesta tarda mas de 400ms, mostrar feedback inmediato.
- **Tecnicas**: Skeleton screens, optimistic UI, loaders con progreso, animaciones de transicion.
- **CSS**: `transition: all 200ms ease-out;` para feedback visual inmediato.

### Ley de Postel (Robustez)

> Se liberal en lo que aceptas, conservador en lo que envias.

- **Implicacion**: Aceptar variaciones en input del usuario (formatos de fecha, telefono, etc.). Mostrar output consistente y predecible.
- **Ejemplo**: Campo de telefono que acepta `+57 300 123 4567`, `3001234567`, `300-123-4567`.

### Ley de Tesler (Conservacion de la complejidad)

> Todo sistema tiene una cantidad irreducible de complejidad que no se puede eliminar.

- **Implicacion**: La complejidad debe absorberla el sistema, no el usuario. Automatizar lo que se pueda.
- **Ejemplo**: Autocompletar direcciones en vez de pedir 5 campos separados (calle, ciudad, departamento, etc.).

### Navaja de Occam

> Entre hipotesis competidoras, elegir la que hace menos suposiciones.

- **Implicacion**: La solucion mas simple que cumpla los requisitos es la correcta.
- **Anti-patron**: Agregar pasos, pantallas o configuraciones "por si acaso".

---

## Estetica

### Efecto Estetica-Usabilidad

> Los usuarios perciben que los disenos esteticamente agradables son mas faciles de usar.

- **Implicacion**: Invertir en diseno visual. La buena UI mejora la tolerancia a errores menores de UX.
- **Impacto**: Usuarios perdonan tiempos de carga ligeramente mayores, flujos levemente mas largos o errores menores si la interfaz se ve bien.

### Flujo (Flow)

> Estado de inmersion donde el usuario esta completamente concentrado y comprometido.

- **Implicacion**: Minimizar interrupciones. Evitar modales innecesarios, notificaciones intrusivas.
- **Equilibrio**: La tarea debe ser lo suficientemente desafiante para mantener interes, pero no tanto como para frustrar.

---

## Sesgos cognitivos relevantes

### Efecto de Anclaje

> Las personas confian excesivamente en la primera informacion recibida.

- **Ejemplo**: Mostrar precio original tachado junto al precio con descuento.

### Sesgo de Confirmacion

> Las personas buscan informacion que confirme sus creencias previas.

- **Ejemplo**: Mostrar testimonios y resenas positivas cerca de CTAs de conversion.

### Paradoja del Usuario Activo

> Los usuarios prefieren empezar a usar el sistema inmediatamente sin leer instrucciones.

- **Implicacion**: Disenar interfaces autodescriptivas. Labels claros, placeholders informativos, tooltips contextuales.
