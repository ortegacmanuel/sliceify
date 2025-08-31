import {
  assign, forEach,
  map,
} from 'min-dash';

// helper /////
function elementData(semantic, attrs) {
  return assign({
    type: semantic.Type,
    businessObject: semantic,
  }, attrs);
}

function collectWaypoints(edge) {
  const { waypoints } = edge;

  if (waypoints) {
    return map(waypoints, (waypoint) => {
      const position = { x: waypoint.x, y: waypoint.y };

      return assign({ original: position }, position);
    });
  }
  return null;
}

function addArrayList(definitions) {
  const adjList = new Map();
  forEach(definitions.States, (semantic) => {
    // Initialize an array to store values for the key
    adjList.set(semantic, []);

    if (semantic.Next || semantic.CompensateState || semantic.Choices) {
      const options = [];

      if (semantic.Next) {
        options.push(semantic.Next);
      }

      if (semantic.CompensateState) {
        options.push(semantic.CompensateState);
      }

      if (semantic.Choices) {
        semantic.Choices.forEach((option) => options.push(option.Next));
      }

      const existingValues = adjList.get(semantic);
      options.forEach((next) => {
        existingValues.push(definitions.States[next]);
      });
      adjList.set(semantic, existingValues);
    }
  });
  return adjList;
}

function addCatchList(definitions, nodes) {
  const adjList = new Map();
  adjList.set(nodes, []);
  nodes.Catch.forEach((option) => {
    const { Next } = option;
    const existingValues = adjList.get(nodes);
    existingValues.push(definitions.States[Next]);
    adjList.set(nodes, existingValues);
  });
  return adjList;
}

export default function EMImporter(
  EMFactory,
  eventBus,
  canvas,
  elementFactory,
  elementRegistry,
  modeling,
) {
  this.EMFactory = EMFactory;
  this.eventBus = eventBus;
  this.canvas = canvas;
  this.elementRegistry = elementRegistry;
  this.elementFactory = elementFactory;
  this.modeling = modeling;
}

EMImporter.$inject = [
  'EMFactory',
  'eventBus',
  'canvas',
  'elementFactory',
  'elementRegistry',
  'modeling',
];

EMImporter.prototype.import = function (definitions) {
  let error = [];
  const warnings = [];

  this.eventBus.fire('import.start', { definitions });

  try {
    const root = this.EMFactory.create('EventModel');
    root.importJson(definitions);
    this.root(root);
    
  } catch (e) {
    error = e;
    console.error(error);
  }

  this.eventBus.fire('import.done', {
    error,
    warnings,
  });
};

EMImporter.prototype.root = function (semantic) {
  const element = this.elementFactory.createRoot(elementData(semantic));

  this.canvas.setRootElement(element);

  return element;
};

/**
 * Add drd element (semantic) to the canvas.
 */
EMImporter.prototype.add = function (semantic, attrs = {}) {
  const { elementFactory } = this;
  const { canvas } = this;
  const { style } = semantic;

  let element; let waypoints; let source; let target; let elementDefinition; let
    bounds;

  if (style.Type === 'Node') {
    bounds = style.bounds;

    elementDefinition = elementData(semantic, {
      x: Math.round(bounds.x),
      y: Math.round(bounds.y),
      width: Math.round(bounds.width),
      height: Math.round(bounds.height),
    });
    element = elementFactory.createShape(elementDefinition);

    canvas.addShape(element);
  } else if (style.Type === 'Edge') {
    waypoints = collectWaypoints(style);

    source = attrs.source || this.getSource(semantic);
    target = this.getTarget(semantic);
    semantic.style.source = source;
    semantic.style.target = target;

    if (source && target) {
      elementDefinition = elementData(semantic, {
        source,
        target,
        waypoints,
      });

      element = elementFactory.createConnection(elementDefinition);

      canvas.addConnection(element);
    }
  } else {
    throw new Error(`unknown di for element ${semantic.id}`);
  }

  return element;
};

EMImporter.prototype.getSource = function (semantic) {
  return this.getShape(semantic.style.source);
};

EMImporter.prototype.getTarget = function (semantic) {
  return this.getShape(semantic.style.target);
};

EMImporter.prototype.getShape = function (name) {
  return this.elementRegistry.find((element) => element.businessObject.Name === name);
};
  