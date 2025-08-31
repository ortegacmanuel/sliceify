import Element from './Element';

export default class Slice extends Element {}

Slice.prototype.type = 'Slice';

// REQUIRED
Slice.prototype.name = 'Slice';

// Domain
Slice.prototype.index = 1;
Slice.prototype.laneIds = []; // filled later by behavior/rules

// Presentation helpers
Slice.prototype.DEFAULT_SIZE = { width: 240, height: 120 };
Slice.prototype.DEFAULT_COLOR = '#64748b';
Slice.prototype.THUMBNAIL_CLASS = 'palette-icon-slice';