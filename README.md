## Sliceify

A web-based diagramming tool for Event Modeling built on top of `diagram-js`.

### How to run locally

- Prerequisites
  - Node.js 18+ (recommended: 20 LTS)
  - npm 9+

- Install
  - `npm install`

- Start dev server
  - `npm run dev`
  - Open the URL shown in your terminal (default: `http://localhost:5173/`)

- Build for production
  - `npm run build`
  - Output in `dist/`

- Optional tooling
  - Format: `npm run format`
  - Lint: `npm run lint`

- Directory layout
  - `src/Editor.js`: Editor bootstrap and module composition
  - `src/main.js`: App entry (creates the editor)
  - `src/modeling/*`: Domain element factory, modeling commands
  - `src/providers/*`: Palette provider(s)
  - `src/render/*`: Custom renderer, text rendering, path map
  - `src/spec/*`: Domain specs (business objects)
  - `src/utils/*`: Utility helpers
  - `public/`: Static assets
  - `index.html`: App shell

References:
- diagram-js: https://github.com/bpmn-io/diagram-js

---

## Internals

### Overview

- Sliceify composes custom modules (providers, modeling, renderer) with diagram-js’ core features (palette, selection, move, connect, etc.).
- It separates domain data (businessObject) from presentation (geometry, color, label styles) on the diagram element.
- Modules are wired through diagram-js’ dependency injection (DI) container.

### Diagram initialization

- `src/Editor.js` extends `Diagram` (from diagram-js) and composes:
  - Custom modules: `providers`, `render`, `modeling`
  - Built-in modules: palette, selection, move, connect, snapping, grid, etc.
- `src/main.js` instantiates `Editor`, passing the canvas container and optional `additionalModules` (to inject config or overrides).

### Dependency injection (DI)

- Each module exports a plain object with:
  - `__depends__`: other modules it requires
  - `__init__`: services to instantiate eagerly
  - service providers: `name: ['type'|'value'|'factory', Provider]`
- Services declare dependencies via `Service.$inject = [...]`.
- You can pass config via “value services” in `additionalModules`, e.g.:
  - `{ 'config.Renderer': ['value', { defaultFillColor: 'white' }] }`

### Modules

- Modeling (`src/modeling/index.js`)
  - Registers:
    - `elementFactory`: custom factory for diagram elements
    - `modeling`: extends diagram-js modeling to add commands
    - `EMFactory`: creates domain business objects (Specs) + defaults
  - Depends on core diagram-js modeling, rules, selection, command stack.

- Providers (`src/providers/index.js`)
  - Registers the palette provider (`paletteProvider`) which populates the left-hand palette.

- Rendering (`src/render/index.js`)
  - Registers:
    - `renderer`: custom `BaseRenderer` override for shapes
    - `textRenderer`: wraps diagram-js `Text` util with defaults
    - `pathMap`: optional vector path utilities for icons/markers

### Domain specs (business objects)

- Located in `src/spec/*`.
- Examples: `Event`, `Element`, `Field`.
- Each spec uses normalized, lower-cased domain fields like: `type`, `name`, `description`, `metadata`.
- Defaults useful to the UI are attached to the prototype for palette/renderer usage:
  - `Event.prototype.THUMBNAIL_CLASS`
  - `Event.prototype.DEFAULT_SIZE`
  - `Event.prototype.DEFAULT_COLOR`
  - `Event.prototype.type = 'Event'`

### EMFactory (business object factory)

- `src/modeling/EMFactory.js`
- Maps a `type` to a Spec class and instantiates it: `create(type) => new Spec()`.
- Provides default accessors:
  - `getDefaultSize(semantic)` and `getDefaultColor(semantic)`

### ElementFactory (diagram element factory)

- `src/modeling/ElementFactory.js`
- Overrides `create(elementType, attrs)` to:
  - Ensure `attrs.businessObject` (creates via `EMFactory` if missing)
  - Apply defaults:
    - width/height from `EMFactory.getDefaultSize()`
    - color on the element (presentation), not on the business object
  - Delegate to base factory to produce the actual shape

Example (from the palette):

```js
const shape = elementFactory.createShape({ type: 'Event' });
```

### Modeling (commands)

- `src/modeling/Modeling.js` extends diagram-js `BaseModeling`.
- Adds custom command `element.updateProperties` that mutates the business object via a handler (undo/redo through the command stack).
- Provides a `connect` helper that consults `rules` when connecting elements.

### Rendering

- `src/render/Renderer.js` extends diagram-js `BaseRenderer`:
  - Declares handlers per element type (e.g., `Event`) to draw shapes.
  - Uses `renderEmbeddedLabel` to create styled SVG text via `textRenderer`.
  - Reads color from the element first (`element.color || bo.color`).
  - Label styling can be customized per call via an options object (`align`, `fontSize`, `fontWeight`, `style`).

- `src/render/TextRenderer.js` wraps diagram-js `Text` util with default font settings (configurable via `config.textRenderer`).

- `src/render/PathMap.js` provides optional vector path utilities (for icons/markers). It is not required for simple rectangles/labels; use it if you add richer pictograms.

### Palette provider

- `src/providers/PaletteProvider.js`
  - Registers palette entries (tools + create actions).
  - On click/drag, calls `elementFactory.createShape({ type })` and starts the `create` interaction.
  - Uses each Spec’s prototype constants for the entry (e.g., `THUMBNAIL_CLASS`).

### Separation of concerns

- Domain (businessObject): holds domain fields only (`type`, `name`, `source`, etc.).
- Presentation (element): holds visual attributes (`x`, `y`, `width`, `height`, `color`, label styles).
- Renderer reads presentation attributes from the element.

### Adding a new node type (recipe)

1) Create a Spec in `src/spec/`:

```js
export default class Command extends Element {}
Command.prototype.type = 'Command';
Command.prototype.DEFAULT_SIZE = { width: 120, height: 60 };
Command.prototype.DEFAULT_COLOR = '#4f46e5';
Command.prototype.THUMBNAIL_CLASS = 'palette-icon-create-command';
```

2) Register in `EMFactory`:

```js
typeToSpec.set('Command', Command);
```

3) Add a palette entry:

```js
entries['create-Command'] = createAction(
  'Command',
  'state',
  Command.prototype.THUMBNAIL_CLASS,
  'Create Command'
);
```

4) Render it in `Renderer`:

```js
handlers.Command = (parentGfx, element) => {
  const rect = drawRect(parentGfx, element.width, element.height, 0, {
    fill: getFillColor(element, defaultFillColor),
    stroke: getStrokeColor(element, defaultStrokeColor)
  });
  renderEmbeddedLabel(parentGfx, element, { align: 'left-top', fontWeight: 'bold' });
  return rect;
};
```

5) (Optional) Define rules if creation or connections must be restricted.

### Rules (recommended)

- Create a custom `RuleProvider` module to control creation, connection, and move behavior. This keeps the editor predictable as types and features grow.

### Serialization (roadmap)

- Export/import a JSON schema with:
  - Elements: `id`, `type`, `x`, `y`, `width`, `height`, and presentation attrs
  - Business objects: domain fields needed for your model
- Keep domain and presentation separated in your schema.

### Configuration via DI (theming)

- Provide defaults at startup using `additionalModules`:

```js
new Editor({
  container: document.querySelector('#canvas'),
  additionalModules: [
    { 'config.Renderer': ['value', { defaultFillColor: 'white', defaultStrokeColor: '#111' }] },
    { 'config.textRenderer': ['value', { defaultStyle: { fontSize: 14 } }] }
  ]
});
```

### References

- diagram-js: https://github.com/bpmn-io/diagram-js


