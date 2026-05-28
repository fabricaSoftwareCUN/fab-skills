# Anti-patrones y buenas prácticas

## Anti-patrones prohibidos

### Domain dependiente de infraestructura

Está prohibido que Domain importe o use:

- TypeORM.
- Decoradores de entidad.
- Swagger.
- Validadores HTTP.
- Configuración de entorno.
- SDKs externos.

### Application dependiente de implementaciones

Está prohibido que Application:

- Inyecte repositorios concretos.
- Use entidades de persistencia.
- Llame SDKs externos directamente.
- Conozca detalles de base de datos.
- Conozca controladores o DTOs HTTP.

### Controladores con lógica de negocio

Está prohibido que los controladores:

- Cifren contraseñas.
- Calculen reglas de negocio.
- Decidan flujos complejos.
- Consulten repositorios directamente cuando existe caso de uso.
- Construyan entidades de dominio con reglas complejas.

### Persistencia expuesta

Está prohibido:

- Retornar entidades TypeORM directamente.
- Usar entidades de persistencia como entidades de dominio.
- Compartir modelos de base de datos con Application.

### Mappers omitidos

Está prohibido saltarse conversiones cuando cambian modelos entre capas.

## Buenas prácticas obligatorias

### Separación de responsabilidades

- Domain define el negocio.
- Application orquesta casos de uso.
- Infrastructure adapta tecnologías.

### Inversión de dependencias

- Las interfaces viven hacia el centro.
- Las implementaciones viven en infraestructura.
- Los servicios dependen de abstracciones.

### Validación en frontera

- Los DTOs de infraestructura validan entrada HTTP.
- El dominio valida reglas de negocio.
- No mezclar validación técnica con regla de negocio.

### Mapeo explícito

- Usar mappers entre HTTP y dominio.
- Usar mappers entre persistencia y dominio.
- Evitar paso directo de modelos externos hacia el núcleo.

### Documentación

- Documentar endpoints con Swagger.
- Documentar DTOs de infraestructura.
- Documentar respuestas esperadas.
- Documentar errores relevantes.

### Configuración centralizada

- Mantener settings en infraestructura.
- No distribuir variables de entorno por todo el proyecto.
- Tipar la configuración usada por los módulos.

## Criterios de calidad

Una solución es correcta si:

- El dominio puede probarse sin levantar NestJS.
- Los casos de uso pueden probarse con mocks de interfaces.
- La base de datos puede cambiar sin reescribir el dominio.
- Los controladores pueden modificarse sin alterar reglas de negocio.
- Los adaptadores externos pueden reemplazarse sin afectar Application.
