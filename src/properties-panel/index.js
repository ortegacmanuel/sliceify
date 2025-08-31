import { DebounceInputModule, FeelPopupModule } from '@bpmn-io/properties-panel';
import PropertiesPanelRenderer from './PropertiesPanelRenderer';

export default {
  __depends__: [
    DebounceInputModule,
    FeelPopupModule,
  ],
  __init__: ['propertiesPanel'],
  propertiesPanel: ['type', PropertiesPanelRenderer],
};
