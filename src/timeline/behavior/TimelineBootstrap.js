// Auto-add default lanes and a slice panel when a Timeline is created.

export default function TimelineBootstrap(eventBus, modeling, elementFactory, selection) {

  function ensureDefaults(timeline) {
    const bo = timeline.businessObject || (timeline.businessObject = {});
    if (!bo.name) bo.name = 'Timeline';
    if (!bo.headerHeight) bo.headerHeight = 120;
    if (!bo.scale) bo.scale = { pxPerUnit: 240, origin: 0 };
  }

  function createLane(parent, timeline, kind, name, y) {
    const lane = elementFactory.createShape({
      type: 'Lane',
      x: timeline.x,
      y,
      width: timeline.width,
      height: 120,
      businessObject: {
        name,
        kind, // 'actor' | 'system'
        order: 0,
        height: 120,
        timelineId: timeline.businessObject && timeline.businessObject.id
      }
    });
    modeling.createShape(lane, { x: lane.x, y: lane.y, width: lane.width, height: lane.height }, parent);
    return lane;
  }

  function createSlicePanel(parent, timeline, y) {
    const panel = elementFactory.createShape({
      type: 'SlicePanel',
      x: timeline.x + 240,
      y,
      width: 240,
      height: 120,
      businessObject: {
        name: 'Slice Panel 1',
        label: 'Slice 1',
        tStart: 0,
        tEnd: 1,
        timelineId: timeline.businessObject && timeline.businessObject.id
      }
    });
    modeling.createShape(panel, { x: panel.x, y: panel.y, width: panel.width, height: panel.height }, parent);
    return panel;
  }

  eventBus.on('commandStack.shape.create.postExecute', 1000, (e) => {
    const shape = e.context && e.context.shape;
    const parent = e.context && (e.context.parent || (shape && shape.parent));
    if (!shape || shape.type !== 'Timeline' || !parent) return;

    ensureDefaults(shape);

    const headerH = shape.businessObject.headerHeight;
    const actorY = shape.y - 120;
    const systemY = shape.y + headerH;

    const actor = createLane(parent, shape, 'actor', 'Actor 1', actorY);
    const system = createLane(parent, shape, 'system', 'System 1', systemY);
    const panel = createSlicePanel(parent, shape, systemY);

    selection.select([ shape, actor, system, panel ]);
  });
}

TimelineBootstrap.$inject = [ 'eventBus', 'modeling', 'elementFactory', 'selection' ];


