# pdf-reader

Demo de extracción de estados financieros (Balance General, Estado de
Resultados) desde PDFs con texto. Ruta: `/pdf-reader`, API: `POST /api/pdf-reader`
(campo `file` en `multipart/form-data`).

## Estructura

```
pdf-reader/
├─ data/                 # ← lo que se cambia sin tocar la lógica
│  ├─ statements.ts      # estados reconocidos: títulos, cuentas, verificaciones
│  ├─ settings.ts        # formato numérico, límites, metadatos, filas ignoradas
│  └─ content.ts         # todos los textos visibles y mensajes de error
├─ types.ts              # tipos de la configuración y del resultado
├─ extract.ts            # entrada: valida el archivo y reconstruye filas (unpdf)
├─ parse.ts              # filas → estados, metadatos y montos (función pura)
├─ verify.ts             # ejecuta las verificaciones de data/statements.ts
└─ ui/                   # PdfReaderDashboard y StatementCard
```

Flujo: `extract.ts` → `parse.ts` → `verify.ts`. Cada paso solo conoce al
siguiente y lee su configuración de `data/`.

## Cómo extenderlo (solo editando `data/`)

| Necesidad                                   | Archivo                                 |
| ------------------------------------------- | --------------------------------------- |
| Nuevo estado (p. ej. Flujo de Efectivo)     | agregar un objeto en `statements.ts`    |
| Una cuenta aparece con otro nombre          | `aliases` del campo en `statements.ts`  |
| Nueva verificación                          | `checks` del estado en `statements.ts`  |
| Montos con otro formato (1,234.56)          | `numberFormat` en `settings.ts`         |
| Nuevo dato del encabezado (NIT, empresa…)   | `documentMetadata` en `settings.ts`     |
| Cambiar textos o mensajes                   | `content.ts`                            |

Las cuentas que no están en `statements.ts` se extraen igual como filas; solo
hace falta declarar las que dan formato (subtotales/totales) o que usan las
verificaciones.

## Limitaciones conocidas

- Los montos se guardan en valor absoluto; el signo de cada cuenta lo definen
  las verificaciones (`"-costoVenta"`). Una pérdida mostrada como negativa
  necesitaría manejar el signo en `parse.ts`.
- PDFs escaneados (imagen) no tienen texto: haría falta OCR.

## Cuándo evolucionar

Agregar capas solo ante una necesidad concreta:

- otro tipo de fuente (OCR, Excel) → una interfaz común de "lector de filas"
  que `extract.ts` elija según el archivo;
- guardar resultados → un repositorio separado de la extracción;
- muchas reglas contables → mover `verify.ts` a una carpeta de dominio.
