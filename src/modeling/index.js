import DiagramCommand from 'diagram-js/lib/command';
import DiagramChangeSupport from 'diagram-js/lib/features/change-support';
import DiagramRulesModule from 'diagram-js/lib/features/rules';
import DiagramSelection from 'diagram-js/lib/features/selection';

import ElementFactory from './ElementFactory';
import Modeling from './Modeling';
import EMFactory from './EMFactory';
import EMRules from './EMRules';
import DiagramModelingModule from 'diagram-js/lib/features/modeling';
import AutoResizeFields from './AutoResizeFields';
import EMImporter from './EMImporter';

export default {
  __init__: ['modeling', 'EMFactory', 'EMRules', 'autoResizeFields'],
  __depends__: [
    DiagramCommand,
    DiagramChangeSupport,
    DiagramRulesModule,
    DiagramSelection,
    DiagramModelingModule,
  ],
  elementFactory: ['type', ElementFactory],
  EMImporter: ['type', EMImporter],
  modeling: ['type', Modeling],
  EMFactory: ['type', EMFactory],
  EMRules: ['type', EMRules],
  autoResizeFields: ['type', AutoResizeFields],
};
