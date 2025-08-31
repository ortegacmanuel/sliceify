import TimelineRenderer from './render/Renderer';
import TimelineBootstrap from './behavior/TimelineBootstrap';
import TimelineLayout from './behavior/TimelineLayout';
import HeaderDragBehavior from './behavior/HeaderDragBehavior';

export default {
  __depends__: [
    // renderer uses core styles; no extra deps required here
  ],
  __init__: [ 'timelineRenderer', 'timelineBootstrap', 'timelineLayout', 'headerDragBehavior' ],
  timelineRenderer: [ 'type', TimelineRenderer ],
  timelineBootstrap: [ 'type', TimelineBootstrap ],
  timelineLayout: [ 'type', TimelineLayout ],
  headerDragBehavior: [ 'type', HeaderDragBehavior ]
};