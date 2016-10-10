/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _pathfinding = __webpack_require__(2);

	var _pathfinding2 = _interopRequireDefault(_pathfinding);

	var _store = __webpack_require__(4);

	var _store2 = _interopRequireDefault(_store);

	var _log = __webpack_require__(8);

	var _log2 = _interopRequireDefault(_log);

	var _constants = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var inputs = readline().split(' ');
	_store2.default.dispatch((0, _store.addParam)({ key: 'width', value: parseInt(inputs[0], 10) }));
	_store2.default.dispatch((0, _store.addParam)({ key: 'height', value: parseInt(inputs[1], 10) }));
	_store2.default.dispatch((0, _store.addParam)({ key: 'myId', value: parseInt(inputs[2], 10) }));

	var visitedBoxes = [];
	var map = void 0;
	var boxes = void 0;
	var me = void 0;
	var round = 0;
	var safeCells = void 0;

	var closeEnough = function closeEnough(boxe) {
	  var sameLine = boxe.y === me.y && (boxe.x - 1 === me.x || boxe.x + 1 === me.x);

	  var sameColumn = boxe.x === me.x && (boxe.y - 1 === me.y || boxe.y + 1 === me.y);

	  return sameLine || sameColumn;
	};

	var getCell = function getCell(coords) {
	  var cells = map.filter(function (cell) {
	    return cell.x === coords.x && cell.y === coords.y;
	  });

	  if (cells && cells.length > 0) return cells[0];
	  return undefined;
	};
	var addBox = function addBox(box) {
	  return boxes.push(box);
	};
	var createCell = function createCell(cell) {
	  return Object.assign({}, cell, {
	    isBox: !Number.isNaN(parseInt(cell.value, 10))
	  });
	};

	var getBestBox = function getBestBox() {
	  var closestBoxes = boxes
	  // Visited boxes are not eligibles
	  .filter(function (boxe) {
	    return visitedBoxes.filter(function (vb) {
	      return vb.x === boxe.x && vb.y === boxe.y;
	    }).length === 0;
	  })
	  // Closer boxes are best
	  .sort(function (c1, c2) {
	    var d1 = Math.abs(c1.x - me.x) + Math.abs(c1.y - me.y);
	    var d2 = Math.abs(c2.x - me.x) + Math.abs(c2.y - me.y);

	    return d1 - d2;
	  })
	  // First 5
	  .slice(0, 5);

	  printErr('closestBoxes: ' + JSON.stringify(closestBoxes.slice(0, 5)));

	  return (0, _pathfinding2.default)(closestBoxes, me, function (coords) {
	    var cell = getCell(coords);

	    // Don't even try to go to the cell if
	    // - It's not in the map
	    if (!cell) return false;
	    // - It's not empty
	    if (cell.value !== '.') return false;
	    // - It's a danger zone
	    if (cell.danger) return false;

	    return true;
	  }, function (cells) {
	    var sorted = cells.sort(function (c1, c2) {
	      var d1 = Math.abs(c1.x - me.x) + Math.abs(c1.y - me.y);
	      var d2 = Math.abs(c2.x - me.x) + Math.abs(c2.y - me.y);

	      return d1 - d2;
	    });

	    printErr('closestBoxes/nextCells: ' + JSON.stringify(sorted));

	    return sorted;
	  });
	};

	var getClosestSafeCell = function getClosestSafeCell() {
	  var closestSafeCells = safeCells.sort(function (c1, c2) {
	    var d1 = Math.abs(c1.x - me.x) + Math.abs(c1.y - me.y);
	    var d2 = Math.abs(c2.x - me.x) + Math.abs(c2.y - me.y);

	    return d1 - d2;
	  });

	  printErr('closestSafeCells: ' + JSON.stringify(closestSafeCells.slice(0, 5)));

	  return (0, _pathfinding2.default)(closestSafeCells, me, function (coords) {
	    var cell = getCell(coords);

	    // Don't even try to go to the cell if
	    // - It's not in the map
	    if (!cell) return false;
	    // - It's not empty
	    if (cell.value !== '.') return false;

	    return true;
	  }, function (cells) {
	    var sorted = cells.sort(function (c1, c2) {
	      var d1 = Math.abs(c1.x - me.x) + Math.abs(c1.y - me.y);
	      var d2 = Math.abs(c2.x - me.x) + Math.abs(c2.y - me.y);

	      return d1 - d2;
	    });

	    printErr('closestSafeCells/nextCells: ' + JSON.stringify(sorted));

	    return sorted;
	  });
	};

	// game loop
	while (true) {
	  boxes = [];
	  map = [];

	  var _loop = function _loop(y) {
	    var row = readline();

	    map = map.concat(row.split('').map(function (value, x) {
	      var cell = createCell({ value: value, x: x, y: y });

	      _store2.default.dispatch((0, _store.addCell)(cell));

	      return cell;
	    }));
	    map.filter(function (cell) {
	      return cell.isBox;
	    }).forEach(addBox);
	  };

	  for (var y = 0; y < _store2.default.getState().params.height; y++) {
	    _loop(y);
	  }

	  var entities = parseInt(readline(), 10);

	  var _loop2 = function _loop2(i) {
	    var entity = readline().split(' ');
	    var entityType = parseInt(entity[0], 10);
	    var owner = parseInt(entity[1], 10);
	    var x = parseInt(entity[2], 10);
	    var y = parseInt(entity[3], 10);
	    var param1 = parseInt(entity[4], 10);
	    var param2 = parseInt(entity[5], 10);

	    if (entityType === 0 && owner === _store2.default.getState().params.myId) {
	      me = { id: _store2.default.getState().params.myId, x: x, y: y, nbBombs: param1 };
	    } else if (entityType === 1) {
	      // Place bomb
	      map.filter(function (cell) {
	        return cell.x === x && cell.y === y;
	      }).forEach(function (cell) {
	        cell.value = param1 === 1 ? 'B' : 'b';
	        cell.tick = param1;
	        cell.range = param2;
	      });

	      // Dangers zones
	      map.filter(function (cell) {
	        return cell.y === y && Math.abs(cell.x - x) <= param2 || cell.x === x && Math.abs(cell.y - y) <= param2;
	      }).forEach(function (cell) {
	        cell.danger = true;
	      });
	    }
	  };

	  for (var i = 0; i < entities; i++) {
	    _loop2(i);
	  }

	  safeCells = map.filter(function (cell) {
	    return cell.danger !== true && cell.value === '.';
	  });
	  _log2.default.map(map);

	  round += 1;
	  if (round < _constants.ROUND_WAIT) {
	    print('MOVE ' + me.x + ' ' + me.y);
	  } else {
	    var bestBox = getBestBox();
	    var safeCell = getClosestSafeCell();
	    if (safeCell && bestBox && me.x === safeCell.x && me.y === safeCell.y) {
	      if (closeEnough(bestBox)) {
	        print('BOMB ' + me.x + ' ' + me.y);
	      } else {
	        print('MOVE ' + bestBox.x + ' ' + bestBox.y);
	      }
	    } else if (safeCell) {
	      printErr('safeCell ' + JSON.stringify(safeCell));
	      print('MOVE ' + safeCell.x + ' ' + safeCell.y);
	    } else {
	      print('MOVE ' + me.x + ' ' + me.y + ' snif');
	    }
	  }
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _constants = __webpack_require__(3);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var hasArrived = function hasArrived(target, current) {
	  return target.x === current.x && target.y === current.y;
	};

	exports.default = function (cellsToGo, me, hasToTry, sortOpenCells) {
	  var nbLoop = 0;

	  return cellsToGo.find(function (cell) {
	    var current = { x: me.x, y: me.y };
	    var openCells = [current];
	    var closedCells = {};

	    while (!hasArrived(cell, current) && openCells.length > 0) {
	      if (nbLoop++ > _constants.MAX_LOOP_DIJSKTRA) return false;

	      current = openCells.shift();

	      // Potentials cells to tests
	      var potentials = [_extends({}, current, { x: current.x + 1 }), // right
	      _extends({}, current, { x: current.x - 1 }), // left
	      _extends({}, current, { x: current.y + 1 }), // top
	      _extends({}, current, { x: current.y - 1 })];

	      // Don't test already testes ones, and no elligibles ones
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = potentials[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var pot = _step.value;

	          // FIXME : pot.x !== cell.x && pot.y !== cell.y
	          if (!closedCells[pot.x + '_' + pot.y] && hasToTry(pot)) {
	            openCells.push(pot);
	          }
	        }

	        // Sort cells, the first is the next to try
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      openCells = sortOpenCells([].concat(_toConsumableArray(openCells)));

	      // Add current cell in the viewed ones
	      closedCells[current.x + '_' + current.y] = true;
	    }

	    return hasArrived(cell, current);
	  });
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var MAX_LOOP_DIJSKTRA = exports.MAX_LOOP_DIJSKTRA = 10;
	var ROUND_WAIT = exports.ROUND_WAIT = 5;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _actions = __webpack_require__(5);

	Object.keys(_actions).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _actions[key];
	    }
	  });
	});

	var _reducers = __webpack_require__(6);

	var _reducers2 = _interopRequireDefault(_reducers);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var store = void 0;

	var dispatch = function dispatch(action) {
	  store = _extends({}, (0, _reducers2.default)(store, action));
	};

	dispatch({ type: 'INIT' });

	exports.default = {
	  getState: function getState() {
	    return store;
	  },
	  dispatch: dispatch
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var addParam = exports.addParam = function addParam(param) {
	  return {
	    type: 'ADD_PARAM',
	    payload: param
	  };
	};

	var addCell = exports.addCell = function addCell(cell) {
	  return {
	    type: 'ADD_CELL',
	    payload: cell
	  };
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.mutate = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _utils = __webpack_require__(7);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var initState = {
	  map: {},
	  params: {}
	};

	var mutate = exports.mutate = function mutate() {
	  var state = arguments.length <= 0 || arguments[0] === undefined ? initState : arguments[0];
	  var action = arguments[1];

	  switch (action.type) {
	    case 'ADD_CELL':
	      return _extends({}, state, {
	        map: _extends({}, state.map, _defineProperty({}, (0, _utils.getCellKey)(action.payload), _extends({}, state.map[(0, _utils.getCellKey)(action.payload)], action.payload)))
	      });
	    case 'ADD_PARAM':
	      return _extends({}, state, {
	        params: _extends({}, state.params, _defineProperty({}, action.payload.key, action.payload.value))
	      });
	    default:
	      return state;
	  }
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var getCellKey = exports.getCellKey = function getCellKey(cell) {
	  return cell.x + "_" + cell.y;
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.map = undefined;

	var _store = __webpack_require__(4);

	var _store2 = _interopRequireDefault(_store);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var map = exports.map = function map(m) {
	  var _loop = function _loop(y) {
	    printErr(m.filter(function (c) {
	      return c.y === y;
	    }).sort(function (c1, c2) {
	      return c1.x - c2.x;
	    }).map(function (cell) {
	      return cell.danger ? '!' : cell.value;
	    }).join(' '));
	  };

	  for (var y = 0; y < _store2.default.getState().params.height; ++y) {
	    _loop(y);
	  }
	};

	exports.default = {
	  map: map
	};

/***/ }
/******/ ]);