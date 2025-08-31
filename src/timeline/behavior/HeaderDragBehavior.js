// Drag the entire timeline unit by grabbing the Timeline header.

export default function HeaderDragBehavior(eventBus, selection, move) {
  eventBus.on('element.mousedown', 1500, (e) => {
    const el = e.element;
    if (!el || el.type !== 'Timeline') return;

    const parent = el.parent;
    const tid = el.businessObject && el.businessObject.id;

    const siblings = (parent && parent.children) || [];
    const lanes = siblings.filter(c => c.type === 'Lane' && c.businessObject && c.businessObject.timelineId === tid);
    const panels = siblings.filter(c => c.type === 'SlicePanel' && c.businessObject && c.businessObject.timelineId === tid);

    const pack = [ el, ...lanes, ...panels ];
    if (!pack.length) return;

    selection.select(pack);
    move.start(e.originalEvent, el, true, {
      hints: { disableAutoLayout: true, bypassValidation: true }
    });
    e.cancelBubble = true;
  });

  // After the drag completes, re-select only the timeline so properties panel can edit its name
  eventBus.on('shape.move.end', 1500, (e) => {
    const el = e.shape || (e.context && e.context.shape);
    if (!el || el.type !== 'Timeline') return;
    selection.select(el);
  });
}

HeaderDragBehavior.$inject = [ 'eventBus', 'selection', 'move' ];


