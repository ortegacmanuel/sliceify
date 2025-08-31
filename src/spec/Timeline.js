import Element from './Element';

export default class Timeline extends Element {}

Timeline.prototype.type = 'Timeline';

// REQUIRED business fields
Timeline.prototype.name = 'Timeline';

// Domain defaults
Timeline.prototype.headerHeight = 120;
// Optional snapping scale (presentation uses element geometry)
Timeline.prototype.scale = { pxPerUnit: 240, origin: 0 };

// Presentation helpers (used by palette/renderer if you want)
Timeline.prototype.DEFAULT_SIZE = { width: 1600, height: 120 };
Timeline.prototype.DEFAULT_COLOR = '#eef3f7';
Timeline.prototype.THUMBNAIL_CLASS = 'palette-icon-timeline';