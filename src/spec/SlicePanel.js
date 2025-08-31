import Element from './Element';

export default class SlicePanel extends Element {}

SlicePanel.prototype.type = 'SlicePanel';

// REQUIRED
SlicePanel.prototype.name = 'Slice Panel';

// Domain
SlicePanel.prototype.label = 'Slice';

// Presentation helpers
SlicePanel.prototype.DEFAULT_SIZE = { width: 240, height: 120 };
SlicePanel.prototype.DEFAULT_COLOR = '#10b981';
SlicePanel.prototype.THUMBNAIL_CLASS = 'palette-icon-slice-panel';