import { h } from '@bpmn-io/properties-panel/preact';

export default {

  getElementLabel: (element) => {
    return element.name;
  },

  getElementIcon: (element) => {
    return () => <span className={element?.businessObject?.THUMBNAIL_CLASS} />;
  },

  getTypeLabel: (element) => {
    return element?.type?.replace(/(\B[A-Z])/g, ' $1').replace(/(\bNon Interrupting)/g, '($1)');
  },
};


