# Monge Budget 💰

App familiar de presupuesto (PWA) para Ángel y Luisa.

## Cómo funciona tu sistema (arquitectura real)

```
Correos Payoneer (Gmail label "Angel Pay")
        │  extractEmailData()  → escribe en hoja "Angel" (Fecha, USD, COP, MsgID)
        ▼
Hoja "Angel"  +  Hoja "Luisa"   (ingresos)
        │  updateBudget()  → suma totales mensuales
        ▼
Hoja "Budget"  ←── también recibe los GASTOS que registras en la app (vía SCRIPT_URL)
        │
        ▼
  App (index.html)  → lee todo y muestra Stats / Eker / Metas
```

- **El salario entra solo** (automático desde los correos de Payoneer). **No lo registres a
  mano en la app** o se duplicaría — por eso la app tiene el registro de ingresos bloqueado.
- Los **gastos** sí los registras tú desde la app.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La app completa (frontend). |
| `manifest.json` | Permite instalarla como app en el celular. |
| `sw.js` | Service worker: hace que abra **sin internet**. |
| `icon.png` | Ícono. |

## Qué cambió en esta versión

- ✅ **Moneda en pesos colombianos (COP)** (antes salía como dólares).
- ✅ **Tab "Metas"**: progreso de **deudas** y del **viaje a España** (€).
- ✅ **Eker corregido**: colegio/desarrollo de los hijos → Educación (antes "Ocio").
- ✅ Categoría **"Ajuste"** para cuadrar la app con el banco (ver abajo).
- ✅ **Offline** + mejor manejo de errores.

## El "Ahorro Anual" y cómo cuadrarlo 🎯

El ingreso se captura completo (automático), pero los gastos se anotan a mano y **se
escapan algunos**. Por eso la app puede mostrar un "ahorro" mayor al real. Para cuadrar:

1. **Anota lo grande que falte** (ej. el viaje → categoría `Vacaciones`).
2. **Una vez al mes**, mira tu saldo real de Bancolombia. La diferencia entre lo que cambió
   en el banco y lo que dice la app = gastos olvidados → regístralos como **`Ajuste`**.

Así la app refleja la realidad y no acumula un ahorro fantasma.

## Pendiente (si quieres editar/borrar desde la app)

Los botones de editar/borrar y el registro de ingresos requieren tocar **el script de la
app web** (el del `SCRIPT_URL`), que es distinto de `extractEmailData` y `updateBudget`.
Si lo quieres, **comparte ese script con Claude** y lo adaptamos sin romper nada.
