// Keeps lanes/panels aligned with the Timeline and computes domain slices.

export default function TimelineLayout(eventBus, modeling) {

  function lanesOf(timeline) {
    const parent = timeline.parent;
    if (!parent) return [];
    const tid = timeline.businessObject && timeline.businessObject.id;
    return (parent.children || []).filter(c =>
      c.type === 'Lane' &&
      c.businessObject &&
      c.businessObject.timelineId === tid
    );
  }

  function panelsOf(timeline) {
    const parent = timeline.parent;
    if (!parent) return [];
    const tid = timeline.businessObject && timeline.businessObject.id;
    return (parent.children || []).filter(c =>
      c.type === 'SlicePanel' &&
      c.businessObject &&
      c.businessObject.timelineId === tid
    );
  }

  function updateDomainSlices(timeline) {
    const bo = timeline.businessObject || (timeline.businessObject = {});
    const unit = (bo.scale && bo.scale.pxPerUnit) || 240;
    const origin = (bo.scale && bo.scale.origin) || 0;
    const width = timeline.width || 0;

    const firstIndex = Math.max(1, Math.ceil((0 - origin) / unit));
    const lastIndex = Math.max(firstIndex, Math.floor((width - origin - 1) / unit));

    const slices = [];
    for (let i = firstIndex; i <= lastIndex; i++) {
      const offsetX = origin + i * unit;
      if (offsetX >= 0 && offsetX < width) {
        slices.push({
          id: `${bo.id || 'tl'}_sl_${i}`,
          index: i,
          offsetX,
          width: unit,
          laneIds: []
        });
      }
    }
    bo.slices = slices;
  }

  function autosizeAndAlign(timeline) {
    const bo = timeline.businessObject || {};
    const headerH = bo.headerHeight || 120;

    const lanes = lanesOf(timeline);
    const top = lanes.filter(l => l.businessObject.kind === 'actor')
                     .sort((a,b)=>a.businessObject.order - b.businessObject.order);
    const bottom = lanes.filter(l => l.businessObject.kind !== 'actor')
                        .sort((a,b)=>a.businessObject.order - b.businessObject.order);

    let yTop = timeline.y - top.reduce((a,l)=>a + l.height, 0);
    top.forEach(l => {
      if (l.x !== timeline.x || l.y !== yTop || l.width !== timeline.width) {
        modeling.resizeShape(l, { x: timeline.x, y: yTop, width: timeline.width, height: l.height });
      }
      yTop += l.height;
    });

    let yBot = timeline.y + headerH;
    bottom.forEach(l => {
      if (l.x !== timeline.x || l.y !== yBot || l.width !== timeline.width) {
        modeling.resizeShape(l, { x: timeline.x, y: yBot, width: timeline.width, height: l.height });
      }
      yBot += l.height;
    });

    panelsOf(timeline).forEach(p => {
      const desiredY = timeline.y + headerH;
      if (p.y !== desiredY) {
        modeling.moveShape(p, { x: 0, y: desiredY - p.y }, p.parent);
      }
    });

    updateDomainSlices(timeline);
  }

  function afterChange(e) {
    const el = e.shape || e.element || (e.context && (e.context.shape || e.context.element));
    if (!el) return;
    if (e.context && e.context.hints && e.context.hints.disableAutoLayout) return;

    if (el.type === 'Timeline') {
      autosizeAndAlign(el);
      return;
    }
    const tl = findTimelineFor(el);
    if (tl) autosizeAndAlign(tl);
  }

  function findTimelineFor(child) {
    const parent = child && child.parent;
    if (!parent) return null;
    const tid = child.businessObject && child.businessObject.timelineId;
    return (parent.children || []).find(c =>
      c.type === 'Timeline' &&
      c.businessObject &&
      c.businessObject.id === tid
    ) || null;
  }

  [
    'commandStack.shape.create.postExecute',
    'commandStack.shape.move.postExecute',
    'commandStack.shape.resize.postExecute',
    'commandStack.shape.delete.postExecute',
    'commandStack.elements.move.postExecute',
    'commandStack.elements.delete.postExecute',
    'import.done'
  ].forEach(evt => eventBus.on(evt, 1000, afterChange));
}

TimelineLayout.$inject = [ 'eventBus', 'modeling' ];


