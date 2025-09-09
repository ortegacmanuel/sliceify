export default function AutoResizeFields(eventBus, modeling) {
  function desiredHeightFor(element) {
    const bo = element.businessObject || {};
    const fields = Array.isArray(bo.fields) ? bo.fields : [];
    if (!fields.length) return null;

    // Match renderer layout
    let topOffset = 44; // start y for fields under name
    let lineHeight = 16;
    let minHeight = element.height || 80;

    switch (element.type) {
      case 'Command':
      case 'ReadModel':
        topOffset = 44;
        lineHeight = 16;
        minHeight = 80;
        break;
      case 'Screen': {
        // If later rendering fields inside Screen body, adjust here
        const headerHeight = Math.max(20, Math.min(28, Math.round(element.height * 0.18)));
        topOffset = headerHeight + 24;
        lineHeight = 16;
        minHeight = 80;
        break;
      }
      default:
        topOffset = 44;
        lineHeight = 16;
        minHeight = 80;
    }

    const needed = topOffset + fields.length * lineHeight + 10; // bottom padding
    return Math.max(minHeight, needed);
  }

  function maybeResize(element) {
    if (!element || !element.businessObject) return;
    const h = desiredHeightFor(element);
    if (!h) return;
    if (element.height !== h) {
      modeling.resizeShape(element, { x: element.x, y: element.y, width: element.width, height: h });
    }
  }

  eventBus.on('commandStack.element.updateProperties.postExecute', 1500, (e) => {
    const ctx = e && e.context;
    const element = ctx && ctx.element;
    const props = ctx && ctx.properties;
    if (!element || !props) return;
    if ('fields' in props) {
      maybeResize(element);
    }
  });

  // Also handle create/import with pre-defined fields
  [
    'commandStack.shape.create.postExecute',
    'import.done',
  ].forEach((evt) => eventBus.on(evt, 1500, (e) => {
    const el = (e && (e.shape || e.element)) || null;
    if (el) maybeResize(el);
  }));
}

AutoResizeFields.$inject = ['eventBus', 'modeling'];


