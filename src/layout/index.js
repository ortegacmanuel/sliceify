import CroppingConnectionDocking from 'diagram-js/lib/layout/CroppingConnectionDocking';
import Layouter from './Layouter';
import Behavior from './behavior';

export default {
  __depends__: [Behavior],
  layouter: ['type', Layouter],
  connectionDocking: ['type', CroppingConnectionDocking],
};