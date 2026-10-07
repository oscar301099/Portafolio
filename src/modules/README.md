# Módulos (demos técnicas)

Cada demo del portafolio vive en su propia carpeta `src/modules/<nombre>` y es
autocontenida: su lógica, su UI y su composición de dependencias están dentro
del módulo.

## Reglas

- `src/app/` solo contiene rutas delgadas que importan desde el módulo
  (`@/modules/<nombre>/...`). La lógica no vive en `app/`.
- El portafolio (`src/portfolio`) no importa código de los módulos; solo los
  enlaza por URL (ver `src/portfolio/data/projects.ts`).
- Un módulo no importa código de otro módulo.
- La arquitectura de cada módulo es proporcional a su complejidad. No se
  introducen capas (dominio, casos de uso, puertos) hasta que hagan falta.

## Módulos actuales

| Módulo       | Ruta          | Arquitectura                                     |
| ------------ | ------------- | ------------------------------------------------ |
| `circulares` | `/circulares` | Clean/Hexagonal (domain, application, infra, ui) |
| `pdf-reader` | `/pdf-reader` | Modular sencilla, configurada desde `data/`      |

Para eliminar o extraer una demo basta con mover su carpeta de `modules/` y
sus rutas en `app/`.
