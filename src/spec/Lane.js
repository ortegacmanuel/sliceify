import Element from './Element';

export default class Lane extends Element {}

Lane.prototype.type = 'Lane';

// REQUIRED
Lane.prototype.name = 'Lane';

// Domain
Lane.prototype.kind = 'system'; // 'actor' (top) | 'system' (bottom)
Lane.prototype.order = 0;

// Presentation helpers
Lane.prototype.DEFAULT_SIZE = { width: 1600, height: 120 };
Lane.prototype.DEFAULT_COLOR = '#9ca3af';
Lane.prototype.THUMBNAIL_CLASS = 'palette-icon-lane';