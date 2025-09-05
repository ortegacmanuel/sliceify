import ContextPadProvider from './ContextPadProvider';
import PaletteProvider from './PaletteProvider';

export default {
  __init__: [
    'contextPadProvider',
    'paletteProvider',
  ],
  contextPadProvider: ['type', ContextPadProvider],
  paletteProvider: ['type', PaletteProvider],
};
