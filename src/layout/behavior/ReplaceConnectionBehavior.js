import inherits from 'inherits-browser';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

export default function ReplaceConnectionBehavior(injector, modeling, rules) {
  injector.invoke(CommandInterceptor, this);

  this.preExecute('connection.reconnect', (context) => {
    const { connection } = context;
    const source = context.newSource || connection.source;
    const target = context.newTarget || connection.target;
    const waypoints = connection.waypoints.slice();

    const allowed = rules.allowed('connection.reconnect', {
      connection,
      source,
      target,
    });

    if (!allowed || allowed.type === connection.type) {
      return;
    }

    context.connection = modeling.connect(source, target, {
      type: allowed.type,
      waypoints,
    });

    modeling.removeConnection(connection);
  }, true);
}

inherits(ReplaceConnectionBehavior, CommandInterceptor);

ReplaceConnectionBehavior.$inject = [
  'injector',
  'modeling',
  'rules',
];