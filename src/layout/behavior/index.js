import LayoutConnectionBehavior from './LayoutConnectionBehavior';
import ReplaceConnectionBehavior from './ReplaceConnectionBehavior';
import LayoutUpdateBehavior from './LayoutUpdateBehavior';

export default {
  __init__: [
    'layoutConnectionBehavior',
    'replaceConnectionBehavior',
    'layoutUpdateBehavior',
  ],
  layoutConnectionBehavior: ['type', LayoutConnectionBehavior],
  replaceConnectionBehavior: ['type', ReplaceConnectionBehavior],
  layoutUpdateBehavior: ['type', LayoutUpdateBehavior],
};