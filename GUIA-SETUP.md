# Guía de puesta en marcha

Este proyecto tiene dos partes independientes:

1. **`/site`** → tu landing page (HTML/CSS/JS). Esto es lo que se sube a Render.
2. **`/sanity`** → los esquemas del panel admin (Sanity). Esto se sube a Sanity, no a Render.

El sitio funciona perfecto **sin Sanity** (usa el contenido que ya está escrito en el HTML). Sanity es opcional y lo activas cuando quieras empezar a editar desde un panel en vez de tocar código.

---

## Paso 0 — Antes de nada: edita `site/config.js`

Abre `site/config.js` y cambia:

```js
whatsappNumber: "5215500000000", // tu número real, con lada de país, sin "+" ni espacios
```

Ejemplo real para México: si tu número es 55 1234 5678, el valor sería `"5215512345678"`
(52 = México, 1 = requerido para móviles en el formato de wa.me, 5512345678 = tu número).

También puedes editar directamente los textos de servicios/materiales/hero en `site/index.html` mientras no uses Sanity.

---

## Paso 1 — Publicar el sitio en Render (sin Sanity, para empezar)

1. Crea un repositorio en GitHub y sube la carpeta `site/` completa (puede ser la raíz del repo).
2. Entra a [render.com](https://render.com) → **New** → **Static Site**.
3. Conecta tu repositorio de GitHub.
4. Configura:
   - **Build Command:** (déjalo vacío, no hay build)
   - **Publish Directory:** `.` (si `site/` es la raíz del repo) o `site` (si subiste todo el proyecto completo)
5. Deploy. En unos segundos tienes tu URL pública tipo `tu-lab.onrender.com`.

Con esto ya tienes la landing funcionando y cotizando por WhatsApp. Los pasos siguientes son solo para cuando quieras el panel admin.

---

## Paso 2 — Crear tu proyecto en Sanity (panel admin)

1. Ve a [sanity.io](https://www.sanity.io) y crea una cuenta gratuita.
2. Instala el CLI (necesitas Node.js instalado):
   ```bash
   npm install -g @sanity/cli
   ```
3. Dentro de la carpeta `sanity/` de este proyecto, inicializa:
   ```bash
   cd sanity
   sanity init
   ```
   - Elige **Create new project**
   - Ponle un nombre (ej. "Laboratorio Dental")
   - Dataset: `production`
   - Cuando pregunte por el template, elige **Clean project** (ya tenemos los esquemas listos en `schemas/`)
4. Verifica que `sanity.config.js` (se genera automático) importe tus esquemas:
   ```js
   import { schemaTypes } from './schemas'
   // ...
   schema: { types: schemaTypes }
   ```
5. Levanta el panel en local para probarlo:
   ```bash
   sanity dev
   ```
   Esto abre un panel en `http://localhost:3333` donde ya puedes crear "Servicio" y "Material" con los campos que definimos (nombre, descripción, orden, visible).

6. Cuando quede bien, publícalo como panel accesible desde internet:
   ```bash
   sanity deploy
   ```
   Te da una URL tipo `tu-lab.sanity.studio` — **ese es tu panel admin**, entras ahí a agregar/editar servicios y materiales desde cualquier navegador, sin tocar código.

7. Anota tu **Project ID** (te lo muestra el CLI, o lo ves en [sanity.io/manage](https://www.sanity.io/manage)).

---

## Paso 3 — Conectar el sitio con Sanity

1. Abre `site/config.js` y cambia:
   ```js
   sanity: {
     useSanity: true,              // <- actívalo
     projectId: "abc12345",        // <- tu Project ID real
     dataset: "production",
     apiVersion: "2024-01-01"
   }
   ```
2. Por defecto, el contenido en Sanity es privado. Para que tu landing (que no tiene login) pueda leerlo, ve a tu panel en [sanity.io/manage](https://www.sanity.io/manage) → tu proyecto → **API** → **CORS origins**, y agrega la URL de tu sitio en Render (ej. `https://tu-lab.onrender.com`).
3. También en **API**, confirma que el dataset `production` tenga visibilidad **Public** (lectura) — así el sitio estático puede leer los datos sin necesitar un token.
4. Sube el cambio de `config.js` a GitHub → Render vuelve a desplegar automático → listo, tu landing ahora jala servicios y materiales desde Sanity.

---

## Cómo se edita el contenido después de esto

- Entras a tu panel (`tu-lab.sanity.studio`), inicias sesión.
- Creas o editas documentos tipo **Servicio** o **Material**.
- Guardas → el cambio queda disponible de inmediato para el sitio (no hay que rehacer deploy).
- El campo **"Visible en el sitio"** te sirve para ocultar temporalmente algo sin borrarlo.
- El campo **"Orden"** controla en qué posición aparece cada tarjeta.

---

## Resumen de lo que se despliega dónde

| Carpeta | Dónde vive | Qué hace |
|---|---|---|
| `site/` | Render (Static Site) | Tu landing pública |
| `sanity/` | Sanity Cloud (`sanity deploy`) | Tu panel admin privado |

No necesitas backend propio, base de datos, ni servidor que mantener — ambos servicios (Render Static Site y Sanity) tienen plan gratuito suficiente para este caso de uso.
