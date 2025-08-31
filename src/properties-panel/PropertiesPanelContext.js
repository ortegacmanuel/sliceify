import {
  createContext,
} from '@bpmn-io/properties-panel/preact';

const PropertiesPanelContext = createContext({
  selectedElement: null,
  injector: null,
  getService: () => null,
});

export default PropertiesPanelContext;