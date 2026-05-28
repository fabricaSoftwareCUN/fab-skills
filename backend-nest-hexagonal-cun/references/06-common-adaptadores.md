# Common, adaptadores y recursos compartidos

## Responsabilidad

Centralizar recursos técnicos compartidos de infraestructura para evitar duplicación y mantener consistencia.

## Ubicación obligatoria

```text
infrastructure/common/
```

## Estructura recomendada

```text
common/
├── adapters/
├── decorators/
├── guards/
├── interceptors/
├── middleware/
├── template/
├── utils/
└── infra-common.module.ts
```

## Adaptadores comunes

Ubicación:

```text
infrastructure/common/adapters/
```

Responsabilidad:

- Implementar puertos de Application.
- Encapsular integraciones técnicas reutilizables.
- Exponer servicios técnicos sin filtrar detalles hacia Application.

Ejemplos conceptuales:

- JWT.
- Cifrado.
- Correo.
- Almacenamiento de archivos.
- Clientes HTTP.
- Servicios cloud.

## Decoradores

Responsabilidad:

- Centralizar decoradores personalizados de infraestructura.
- Evitar repetir metadatos técnicos en controladores.
- Mantener separados los decoradores del dominio.

## Guards

Responsabilidad:

- Controlar autorización y autenticación.
- Proteger rutas.
- Validar permisos técnicos desde infraestructura.

## Interceptors

Responsabilidad:

- Manejar logging transversal.
- Transformar respuestas.
- Estandarizar errores.
- Medir tiempos o enriquecer contexto técnico.

## Middleware

Responsabilidad:

- Ejecutar lógica previa o transversal en solicitudes HTTP.
- Manejar trazabilidad, headers, contexto o procesamiento técnico.

## Templates

Responsabilidad:

- Centralizar plantillas técnicas reutilizables.
- Usar principalmente para correos, reportes o respuestas externas.

## Utils

Responsabilidad:

- Alojar utilidades técnicas compartidas.
- Evitar que utilidades de infraestructura se mezclen con lógica de dominio.

## Módulo común

Reglas:

- Debe existir un módulo común de infraestructura.
- Debe registrar providers compartidos cuando aplique.
- Debe exportar componentes reutilizables que otros módulos necesiten.
