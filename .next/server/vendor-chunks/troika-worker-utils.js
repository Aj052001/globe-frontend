"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/troika-worker-utils";
exports.ids = ["vendor-chunks/troika-worker-utils"];
exports.modules = {

/***/ "(ssr)/./node_modules/troika-worker-utils/dist/troika-worker-utils.esm.js":
/*!**************************************************************************!*\
  !*** ./node_modules/troika-worker-utils/dist/troika-worker-utils.esm.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   defineWorkerModule: () => (/* binding */ defineWorkerModule),\n/* harmony export */   stringifyFunction: () => (/* binding */ stringifyFunction),\n/* harmony export */   terminateWorker: () => (/* binding */ terminateWorker)\n/* harmony export */ });\n/**\n * Main content for the worker that handles the loading and execution of\n * modules within it.\n */\nfunction workerBootstrap() {\n  var modules = Object.create(null);\n\n  // Handle messages for registering a module\n  function registerModule(ref, callback) {\n    var id = ref.id;\n    var name = ref.name;\n    var dependencies = ref.dependencies; if ( dependencies === void 0 ) dependencies = [];\n    var init = ref.init; if ( init === void 0 ) init = function(){};\n    var getTransferables = ref.getTransferables; if ( getTransferables === void 0 ) getTransferables = null;\n\n    // Only register once\n    if (modules[id]) { return }\n\n    try {\n      // If any dependencies are modules, ensure they're registered and grab their value\n      dependencies = dependencies.map(function (dep) {\n        if (dep && dep.isWorkerModule) {\n          registerModule(dep, function (depResult) {\n            if (depResult instanceof Error) { throw depResult }\n          });\n          dep = modules[dep.id].value;\n        }\n        return dep\n      });\n\n      // Rehydrate functions\n      init = rehydrate((\"<\" + name + \">.init\"), init);\n      if (getTransferables) {\n        getTransferables = rehydrate((\"<\" + name + \">.getTransferables\"), getTransferables);\n      }\n\n      // Initialize the module and store its value\n      var value = null;\n      if (typeof init === 'function') {\n        value = init.apply(void 0, dependencies);\n      } else {\n        console.error('worker module init function failed to rehydrate');\n      }\n      modules[id] = {\n        id: id,\n        value: value,\n        getTransferables: getTransferables\n      };\n      callback(value);\n    } catch(err) {\n      if (!(err && err.noLog)) {\n        console.error(err);\n      }\n      callback(err);\n    }\n  }\n\n  // Handle messages for calling a registered module's result function\n  function callModule(ref, callback) {\n    var ref$1;\n\n    var id = ref.id;\n    var args = ref.args;\n    if (!modules[id] || typeof modules[id].value !== 'function') {\n      callback(new Error((\"Worker module \" + id + \": not found or its 'init' did not return a function\")));\n    }\n    try {\n      var result = (ref$1 = modules[id]).value.apply(ref$1, args);\n      if (result && typeof result.then === 'function') {\n        result.then(handleResult, function (rej) { return callback(rej instanceof Error ? rej : new Error('' + rej)); });\n      } else {\n        handleResult(result);\n      }\n    } catch(err) {\n      callback(err);\n    }\n    function handleResult(result) {\n      try {\n        var tx = modules[id].getTransferables && modules[id].getTransferables(result);\n        if (!tx || !Array.isArray(tx) || !tx.length) {\n          tx = undefined; //postMessage is very picky about not passing null or empty transferables\n        }\n        callback(result, tx);\n      } catch(err) {\n        console.error(err);\n        callback(err);\n      }\n    }\n  }\n\n  function rehydrate(name, str) {\n    var result = void 0;\n    self.troikaDefine = function (r) { return result = r; };\n    var url = URL.createObjectURL(\n      new Blob(\n        [(\"/** \" + (name.replace(/\\*/g, '')) + \" **/\\n\\ntroikaDefine(\\n\" + str + \"\\n)\")],\n        {type: 'application/javascript'}\n      )\n    );\n    try {\n      importScripts(url);\n    } catch(err) {\n      console.error(err);\n    }\n    URL.revokeObjectURL(url);\n    delete self.troikaDefine;\n    return result\n  }\n\n  // Handler for all messages within the worker\n  self.addEventListener('message', function (e) {\n    var ref = e.data;\n    var messageId = ref.messageId;\n    var action = ref.action;\n    var data = ref.data;\n    try {\n      // Module registration\n      if (action === 'registerModule') {\n        registerModule(data, function (result) {\n          if (result instanceof Error) {\n            postMessage({\n              messageId: messageId,\n              success: false,\n              error: result.message\n            });\n          } else {\n            postMessage({\n              messageId: messageId,\n              success: true,\n              result: {isCallable: typeof result === 'function'}\n            });\n          }\n        });\n      }\n      // Invocation\n      if (action === 'callModule') {\n        callModule(data, function (result, transferables) {\n          if (result instanceof Error) {\n            postMessage({\n              messageId: messageId,\n              success: false,\n              error: result.message\n            });\n          } else {\n            postMessage({\n              messageId: messageId,\n              success: true,\n              result: result\n            }, transferables || undefined);\n          }\n        });\n      }\n    } catch(err) {\n      postMessage({\n        messageId: messageId,\n        success: false,\n        error: err.stack\n      });\n    }\n  });\n}\n\n/**\n * Fallback for `defineWorkerModule` that behaves identically but runs in the main\n * thread, for when the execution environment doesn't support web workers or they\n * are disallowed due to e.g. CSP security restrictions.\n */\nfunction defineMainThreadModule(options) {\n  var moduleFunc = function() {\n    var args = [], len = arguments.length;\n    while ( len-- ) args[ len ] = arguments[ len ];\n\n    return moduleFunc._getInitResult().then(function (initResult) {\n      if (typeof initResult === 'function') {\n        return initResult.apply(void 0, args)\n      } else {\n        throw new Error('Worker module function was called but `init` did not return a callable function')\n      }\n    })\n  };\n  moduleFunc._getInitResult = function() {\n    // We can ignore getTransferables in main thread. TODO workerId?\n    var dependencies = options.dependencies;\n    var init = options.init;\n\n    // Resolve dependencies\n    dependencies = Array.isArray(dependencies) ? dependencies.map(function (dep) {\n      if (dep) {\n        // If it's a worker module, use its main thread impl\n        dep = dep.onMainThread || dep;\n        // If it's a main thread worker module, use its init return value\n        if (dep._getInitResult) {\n          dep = dep._getInitResult();\n        }\n      }\n      return dep\n    }) : [];\n\n    // Invoke init with the resolved dependencies\n    var initPromise = Promise.all(dependencies).then(function (deps) {\n      return init.apply(null, deps)\n    });\n\n    // Cache the resolved promise for subsequent calls\n    moduleFunc._getInitResult = function () { return initPromise; };\n\n    return initPromise\n  };\n  return moduleFunc\n}\n\nvar supportsWorkers = function () {\n  var supported = false;\n\n  // Only attempt worker initialization in browsers; elsewhere it would just be\n  // noise e.g. loading into a Node environment for SSR.\n  if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {\n    try {\n      // TODO additional checks for things like importScripts within the worker?\n      //  Would need to be an async check.\n      var worker = new Worker(\n        URL.createObjectURL(new Blob([''], { type: 'application/javascript' }))\n      );\n      worker.terminate();\n      supported = true;\n    } catch (err) {\n      if (typeof process !== 'undefined' && \"development\" === 'test') {} else {\n        console.log(\n          (\"Troika createWorkerModule: web workers not allowed; falling back to main thread execution. Cause: [\" + (err.message) + \"]\")\n        );\n      }\n    }\n  }\n\n  // Cached result\n  supportsWorkers = function () { return supported; };\n  return supported\n};\n\nvar _workerModuleId = 0;\nvar _messageId = 0;\nvar _allowInitAsString = false;\nvar workers = Object.create(null);\nvar registeredModules = Object.create(null); //workerId -> Set<unregisterFn>\nvar openRequests = Object.create(null);\n\n\n/**\n * Define a module of code that will be executed with a web worker. This provides a simple\n * interface for moving chunks of logic off the main thread, and managing their dependencies\n * among one another.\n *\n * @param {object} options\n * @param {function} options.init\n * @param {array} [options.dependencies]\n * @param {function} [options.getTransferables]\n * @param {string} [options.name]\n * @param {string} [options.workerId]\n * @return {function(...[*]): {then}}\n */\nfunction defineWorkerModule(options) {\n  if ((!options || typeof options.init !== 'function') && !_allowInitAsString) {\n    throw new Error('requires `options.init` function')\n  }\n  var dependencies = options.dependencies;\n  var init = options.init;\n  var getTransferables = options.getTransferables;\n  var workerId = options.workerId;\n\n  var onMainThread = defineMainThreadModule(options);\n\n  if (workerId == null) {\n    workerId = '#default';\n  }\n  var id = \"workerModule\" + (++_workerModuleId);\n  var name = options.name || id;\n  var registrationPromise = null;\n\n  dependencies = dependencies && dependencies.map(function (dep) {\n    // Wrap raw functions as worker modules with no dependencies\n    if (typeof dep === 'function' && !dep.workerModuleData) {\n      _allowInitAsString = true;\n      dep = defineWorkerModule({\n        workerId: workerId,\n        name: (\"<\" + name + \"> function dependency: \" + (dep.name)),\n        init: (\"function(){return (\\n\" + (stringifyFunction(dep)) + \"\\n)}\")\n      });\n      _allowInitAsString = false;\n    }\n    // Grab postable data for worker modules\n    if (dep && dep.workerModuleData) {\n      dep = dep.workerModuleData;\n    }\n    return dep\n  });\n\n  function moduleFunc() {\n    var args = [], len = arguments.length;\n    while ( len-- ) args[ len ] = arguments[ len ];\n\n    if (!supportsWorkers()) {\n      return onMainThread.apply(void 0, args)\n    }\n\n    // Register this module if needed\n    if (!registrationPromise) {\n      registrationPromise = callWorker(workerId,'registerModule', moduleFunc.workerModuleData);\n      var unregister = function () {\n        registrationPromise = null;\n        registeredModules[workerId].delete(unregister);\n      }\n      ;(registeredModules[workerId] || (registeredModules[workerId] = new Set())).add(unregister);\n    }\n\n    // Invoke the module, returning a promise\n    return registrationPromise.then(function (ref) {\n      var isCallable = ref.isCallable;\n\n      if (isCallable) {\n        return callWorker(workerId,'callModule', {id: id, args: args})\n      } else {\n        throw new Error('Worker module function was called but `init` did not return a callable function')\n      }\n    })\n  }\n  moduleFunc.workerModuleData = {\n    isWorkerModule: true,\n    id: id,\n    name: name,\n    dependencies: dependencies,\n    init: stringifyFunction(init),\n    getTransferables: getTransferables && stringifyFunction(getTransferables)\n  };\n\n  moduleFunc.onMainThread = onMainThread;\n\n  return moduleFunc\n}\n\n/**\n * Terminate an active Worker by a workerId that was passed to defineWorkerModule.\n * This only terminates the Worker itself; the worker module will remain available\n * and if you call it again its Worker will be respawned.\n * @param {string} workerId\n */\nfunction terminateWorker(workerId) {\n  // Unregister all modules that were registered in that worker\n  if (registeredModules[workerId]) {\n    registeredModules[workerId].forEach(function (unregister) {\n      unregister();\n    });\n  }\n  // Terminate the Worker object\n  if (workers[workerId]) {\n    workers[workerId].terminate();\n    delete workers[workerId];\n  }\n}\n\n/**\n * Stringifies a function into a form that can be deserialized in the worker\n * @param fn\n */\nfunction stringifyFunction(fn) {\n  var str = fn.toString();\n  // If it was defined in object method/property format, it needs to be modified\n  if (!/^function/.test(str) && /^\\w+\\s*\\(/.test(str)) {\n    str = 'function ' + str;\n  }\n  return str\n}\n\n\nfunction getWorker(workerId) {\n  var worker = workers[workerId];\n  if (!worker) {\n    // Bootstrap the worker's content\n    var bootstrap = stringifyFunction(workerBootstrap);\n\n    // Create the worker from the bootstrap function content\n    worker = workers[workerId] = new Worker(\n      URL.createObjectURL(\n        new Blob(\n          [(\"/** Worker Module Bootstrap: \" + (workerId.replace(/\\*/g, '')) + \" **/\\n\\n;(\" + bootstrap + \")()\")],\n          {type: 'application/javascript'}\n        )\n      )\n    );\n\n    // Single handler for response messages from the worker\n    worker.onmessage = function (e) {\n      var response = e.data;\n      var msgId = response.messageId;\n      var callback = openRequests[msgId];\n      if (!callback) {\n        throw new Error('WorkerModule response with empty or unknown messageId')\n      }\n      delete openRequests[msgId];\n      callback(response);\n    };\n  }\n  return worker\n}\n\n// Issue a call to the worker with a callback to handle the response\nfunction callWorker(workerId, action, data) {\n  return new Promise(function (resolve, reject) {\n    var messageId = ++_messageId;\n    openRequests[messageId] = function (response) {\n      if (response.success) {\n        resolve(response.result);\n      } else {\n        reject(new Error((\"Error in worker \" + action + \" call: \" + (response.error))));\n      }\n    };\n    getWorker(workerId).postMessage({\n      messageId: messageId,\n      action: action,\n      data: data\n    });\n  })\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdHJvaWthLXdvcmtlci11dGlscy9kaXN0L3Ryb2lrYS13b3JrZXItdXRpbHMuZXNtLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6Qyx5QkFBeUI7QUFDekIsaURBQWlEOztBQUVqRDtBQUNBLHVCQUF1Qjs7QUFFdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QztBQUM5QyxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbURBQW1ELG9FQUFvRTtBQUN2SCxRQUFRO0FBQ1I7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QixhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsOENBQThDOztBQUU5QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsZ0NBQWdDO0FBQzdFO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTiw0Q0FBNEMsYUFBb0IsYUFBYSxFQUFDLENBQUM7QUFDL0U7QUFDQSxnRUFBZ0U7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QztBQUM3Qzs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFVBQVU7QUFDckIsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsVUFBVTtBQUNyQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFlBQVksbUJBQW1CO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsOENBQThDO0FBQ3pFLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrREFBa0QsbUJBQW1CO0FBQ3JFLFFBQVE7QUFDUjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdGQUF3RjtBQUN4RixXQUFXO0FBQ1g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIOztBQUVrRSIsInNvdXJjZXMiOlsiL2hvbWUvYWpheS1zaW5naC9EZXNrdG9wL2dsb2JlLWFqYXkvR2xvYmFsLUhvdXNlLUFjdGl2aXR5L2dsb2JlL25vZGVfbW9kdWxlcy90cm9pa2Etd29ya2VyLXV0aWxzL2Rpc3QvdHJvaWthLXdvcmtlci11dGlscy5lc20uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNYWluIGNvbnRlbnQgZm9yIHRoZSB3b3JrZXIgdGhhdCBoYW5kbGVzIHRoZSBsb2FkaW5nIGFuZCBleGVjdXRpb24gb2ZcbiAqIG1vZHVsZXMgd2l0aGluIGl0LlxuICovXG5mdW5jdGlvbiB3b3JrZXJCb290c3RyYXAoKSB7XG4gIHZhciBtb2R1bGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAvLyBIYW5kbGUgbWVzc2FnZXMgZm9yIHJlZ2lzdGVyaW5nIGEgbW9kdWxlXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyTW9kdWxlKHJlZiwgY2FsbGJhY2spIHtcbiAgICB2YXIgaWQgPSByZWYuaWQ7XG4gICAgdmFyIG5hbWUgPSByZWYubmFtZTtcbiAgICB2YXIgZGVwZW5kZW5jaWVzID0gcmVmLmRlcGVuZGVuY2llczsgaWYgKCBkZXBlbmRlbmNpZXMgPT09IHZvaWQgMCApIGRlcGVuZGVuY2llcyA9IFtdO1xuICAgIHZhciBpbml0ID0gcmVmLmluaXQ7IGlmICggaW5pdCA9PT0gdm9pZCAwICkgaW5pdCA9IGZ1bmN0aW9uKCl7fTtcbiAgICB2YXIgZ2V0VHJhbnNmZXJhYmxlcyA9IHJlZi5nZXRUcmFuc2ZlcmFibGVzOyBpZiAoIGdldFRyYW5zZmVyYWJsZXMgPT09IHZvaWQgMCApIGdldFRyYW5zZmVyYWJsZXMgPSBudWxsO1xuXG4gICAgLy8gT25seSByZWdpc3RlciBvbmNlXG4gICAgaWYgKG1vZHVsZXNbaWRdKSB7IHJldHVybiB9XG5cbiAgICB0cnkge1xuICAgICAgLy8gSWYgYW55IGRlcGVuZGVuY2llcyBhcmUgbW9kdWxlcywgZW5zdXJlIHRoZXkncmUgcmVnaXN0ZXJlZCBhbmQgZ3JhYiB0aGVpciB2YWx1ZVxuICAgICAgZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzLm1hcChmdW5jdGlvbiAoZGVwKSB7XG4gICAgICAgIGlmIChkZXAgJiYgZGVwLmlzV29ya2VyTW9kdWxlKSB7XG4gICAgICAgICAgcmVnaXN0ZXJNb2R1bGUoZGVwLCBmdW5jdGlvbiAoZGVwUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZGVwUmVzdWx0IGluc3RhbmNlb2YgRXJyb3IpIHsgdGhyb3cgZGVwUmVzdWx0IH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBkZXAgPSBtb2R1bGVzW2RlcC5pZF0udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlcFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFJlaHlkcmF0ZSBmdW5jdGlvbnNcbiAgICAgIGluaXQgPSByZWh5ZHJhdGUoKFwiPFwiICsgbmFtZSArIFwiPi5pbml0XCIpLCBpbml0KTtcbiAgICAgIGlmIChnZXRUcmFuc2ZlcmFibGVzKSB7XG4gICAgICAgIGdldFRyYW5zZmVyYWJsZXMgPSByZWh5ZHJhdGUoKFwiPFwiICsgbmFtZSArIFwiPi5nZXRUcmFuc2ZlcmFibGVzXCIpLCBnZXRUcmFuc2ZlcmFibGVzKTtcbiAgICAgIH1cblxuICAgICAgLy8gSW5pdGlhbGl6ZSB0aGUgbW9kdWxlIGFuZCBzdG9yZSBpdHMgdmFsdWVcbiAgICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgICBpZiAodHlwZW9mIGluaXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFsdWUgPSBpbml0LmFwcGx5KHZvaWQgMCwgZGVwZW5kZW5jaWVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ3dvcmtlciBtb2R1bGUgaW5pdCBmdW5jdGlvbiBmYWlsZWQgdG8gcmVoeWRyYXRlJyk7XG4gICAgICB9XG4gICAgICBtb2R1bGVzW2lkXSA9IHtcbiAgICAgICAgaWQ6IGlkLFxuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGdldFRyYW5zZmVyYWJsZXM6IGdldFRyYW5zZmVyYWJsZXNcbiAgICAgIH07XG4gICAgICBjYWxsYmFjayh2YWx1ZSk7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgIGlmICghKGVyciAmJiBlcnIubm9Mb2cpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgfVxuICB9XG5cbiAgLy8gSGFuZGxlIG1lc3NhZ2VzIGZvciBjYWxsaW5nIGEgcmVnaXN0ZXJlZCBtb2R1bGUncyByZXN1bHQgZnVuY3Rpb25cbiAgZnVuY3Rpb24gY2FsbE1vZHVsZShyZWYsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHJlZiQxO1xuXG4gICAgdmFyIGlkID0gcmVmLmlkO1xuICAgIHZhciBhcmdzID0gcmVmLmFyZ3M7XG4gICAgaWYgKCFtb2R1bGVzW2lkXSB8fCB0eXBlb2YgbW9kdWxlc1tpZF0udmFsdWUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcigoXCJXb3JrZXIgbW9kdWxlIFwiICsgaWQgKyBcIjogbm90IGZvdW5kIG9yIGl0cyAnaW5pdCcgZGlkIG5vdCByZXR1cm4gYSBmdW5jdGlvblwiKSkpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdmFyIHJlc3VsdCA9IChyZWYkMSA9IG1vZHVsZXNbaWRdKS52YWx1ZS5hcHBseShyZWYkMSwgYXJncyk7XG4gICAgICBpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHQudGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXN1bHQudGhlbihoYW5kbGVSZXN1bHQsIGZ1bmN0aW9uIChyZWopIHsgcmV0dXJuIGNhbGxiYWNrKHJlaiBpbnN0YW5jZW9mIEVycm9yID8gcmVqIDogbmV3IEVycm9yKCcnICsgcmVqKSk7IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaGFuZGxlUmVzdWx0KHJlc3VsdCk7XG4gICAgICB9XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGhhbmRsZVJlc3VsdChyZXN1bHQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciB0eCA9IG1vZHVsZXNbaWRdLmdldFRyYW5zZmVyYWJsZXMgJiYgbW9kdWxlc1tpZF0uZ2V0VHJhbnNmZXJhYmxlcyhyZXN1bHQpO1xuICAgICAgICBpZiAoIXR4IHx8ICFBcnJheS5pc0FycmF5KHR4KSB8fCAhdHgubGVuZ3RoKSB7XG4gICAgICAgICAgdHggPSB1bmRlZmluZWQ7IC8vcG9zdE1lc3NhZ2UgaXMgdmVyeSBwaWNreSBhYm91dCBub3QgcGFzc2luZyBudWxsIG9yIGVtcHR5IHRyYW5zZmVyYWJsZXNcbiAgICAgICAgfVxuICAgICAgICBjYWxsYmFjayhyZXN1bHQsIHR4KTtcbiAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWh5ZHJhdGUobmFtZSwgc3RyKSB7XG4gICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcbiAgICBzZWxmLnRyb2lrYURlZmluZSA9IGZ1bmN0aW9uIChyKSB7IHJldHVybiByZXN1bHQgPSByOyB9O1xuICAgIHZhciB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKFxuICAgICAgbmV3IEJsb2IoXG4gICAgICAgIFsoXCIvKiogXCIgKyAobmFtZS5yZXBsYWNlKC9cXCovZywgJycpKSArIFwiICoqL1xcblxcbnRyb2lrYURlZmluZShcXG5cIiArIHN0ciArIFwiXFxuKVwiKV0sXG4gICAgICAgIHt0eXBlOiAnYXBwbGljYXRpb24vamF2YXNjcmlwdCd9XG4gICAgICApXG4gICAgKTtcbiAgICB0cnkge1xuICAgICAgaW1wb3J0U2NyaXB0cyh1cmwpO1xuICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgfVxuICAgIFVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcbiAgICBkZWxldGUgc2VsZi50cm9pa2FEZWZpbmU7XG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgLy8gSGFuZGxlciBmb3IgYWxsIG1lc3NhZ2VzIHdpdGhpbiB0aGUgd29ya2VyXG4gIHNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHJlZiA9IGUuZGF0YTtcbiAgICB2YXIgbWVzc2FnZUlkID0gcmVmLm1lc3NhZ2VJZDtcbiAgICB2YXIgYWN0aW9uID0gcmVmLmFjdGlvbjtcbiAgICB2YXIgZGF0YSA9IHJlZi5kYXRhO1xuICAgIHRyeSB7XG4gICAgICAvLyBNb2R1bGUgcmVnaXN0cmF0aW9uXG4gICAgICBpZiAoYWN0aW9uID09PSAncmVnaXN0ZXJNb2R1bGUnKSB7XG4gICAgICAgIHJlZ2lzdGVyTW9kdWxlKGRhdGEsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgbWVzc2FnZUlkOiBtZXNzYWdlSWQsXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICBlcnJvcjogcmVzdWx0Lm1lc3NhZ2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgIG1lc3NhZ2VJZDogbWVzc2FnZUlkLFxuICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICByZXN1bHQ6IHtpc0NhbGxhYmxlOiB0eXBlb2YgcmVzdWx0ID09PSAnZnVuY3Rpb24nfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8vIEludm9jYXRpb25cbiAgICAgIGlmIChhY3Rpb24gPT09ICdjYWxsTW9kdWxlJykge1xuICAgICAgICBjYWxsTW9kdWxlKGRhdGEsIGZ1bmN0aW9uIChyZXN1bHQsIHRyYW5zZmVyYWJsZXMpIHtcbiAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgbWVzc2FnZUlkOiBtZXNzYWdlSWQsXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICBlcnJvcjogcmVzdWx0Lm1lc3NhZ2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgIG1lc3NhZ2VJZDogbWVzc2FnZUlkLFxuICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICByZXN1bHQ6IHJlc3VsdFxuICAgICAgICAgICAgfSwgdHJhbnNmZXJhYmxlcyB8fCB1bmRlZmluZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgbWVzc2FnZUlkOiBtZXNzYWdlSWQsXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICBlcnJvcjogZXJyLnN0YWNrXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIEZhbGxiYWNrIGZvciBgZGVmaW5lV29ya2VyTW9kdWxlYCB0aGF0IGJlaGF2ZXMgaWRlbnRpY2FsbHkgYnV0IHJ1bnMgaW4gdGhlIG1haW5cbiAqIHRocmVhZCwgZm9yIHdoZW4gdGhlIGV4ZWN1dGlvbiBlbnZpcm9ubWVudCBkb2Vzbid0IHN1cHBvcnQgd2ViIHdvcmtlcnMgb3IgdGhleVxuICogYXJlIGRpc2FsbG93ZWQgZHVlIHRvIGUuZy4gQ1NQIHNlY3VyaXR5IHJlc3RyaWN0aW9ucy5cbiAqL1xuZnVuY3Rpb24gZGVmaW5lTWFpblRocmVhZE1vZHVsZShvcHRpb25zKSB7XG4gIHZhciBtb2R1bGVGdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB3aGlsZSAoIGxlbi0tICkgYXJnc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiBdO1xuXG4gICAgcmV0dXJuIG1vZHVsZUZ1bmMuX2dldEluaXRSZXN1bHQoKS50aGVuKGZ1bmN0aW9uIChpbml0UmVzdWx0KSB7XG4gICAgICBpZiAodHlwZW9mIGluaXRSZXN1bHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGluaXRSZXN1bHQuYXBwbHkodm9pZCAwLCBhcmdzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdXb3JrZXIgbW9kdWxlIGZ1bmN0aW9uIHdhcyBjYWxsZWQgYnV0IGBpbml0YCBkaWQgbm90IHJldHVybiBhIGNhbGxhYmxlIGZ1bmN0aW9uJylcbiAgICAgIH1cbiAgICB9KVxuICB9O1xuICBtb2R1bGVGdW5jLl9nZXRJbml0UmVzdWx0ID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gV2UgY2FuIGlnbm9yZSBnZXRUcmFuc2ZlcmFibGVzIGluIG1haW4gdGhyZWFkLiBUT0RPIHdvcmtlcklkP1xuICAgIHZhciBkZXBlbmRlbmNpZXMgPSBvcHRpb25zLmRlcGVuZGVuY2llcztcbiAgICB2YXIgaW5pdCA9IG9wdGlvbnMuaW5pdDtcblxuICAgIC8vIFJlc29sdmUgZGVwZW5kZW5jaWVzXG4gICAgZGVwZW5kZW5jaWVzID0gQXJyYXkuaXNBcnJheShkZXBlbmRlbmNpZXMpID8gZGVwZW5kZW5jaWVzLm1hcChmdW5jdGlvbiAoZGVwKSB7XG4gICAgICBpZiAoZGVwKSB7XG4gICAgICAgIC8vIElmIGl0J3MgYSB3b3JrZXIgbW9kdWxlLCB1c2UgaXRzIG1haW4gdGhyZWFkIGltcGxcbiAgICAgICAgZGVwID0gZGVwLm9uTWFpblRocmVhZCB8fCBkZXA7XG4gICAgICAgIC8vIElmIGl0J3MgYSBtYWluIHRocmVhZCB3b3JrZXIgbW9kdWxlLCB1c2UgaXRzIGluaXQgcmV0dXJuIHZhbHVlXG4gICAgICAgIGlmIChkZXAuX2dldEluaXRSZXN1bHQpIHtcbiAgICAgICAgICBkZXAgPSBkZXAuX2dldEluaXRSZXN1bHQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGRlcFxuICAgIH0pIDogW107XG5cbiAgICAvLyBJbnZva2UgaW5pdCB3aXRoIHRoZSByZXNvbHZlZCBkZXBlbmRlbmNpZXNcbiAgICB2YXIgaW5pdFByb21pc2UgPSBQcm9taXNlLmFsbChkZXBlbmRlbmNpZXMpLnRoZW4oZnVuY3Rpb24gKGRlcHMpIHtcbiAgICAgIHJldHVybiBpbml0LmFwcGx5KG51bGwsIGRlcHMpXG4gICAgfSk7XG5cbiAgICAvLyBDYWNoZSB0aGUgcmVzb2x2ZWQgcHJvbWlzZSBmb3Igc3Vic2VxdWVudCBjYWxsc1xuICAgIG1vZHVsZUZ1bmMuX2dldEluaXRSZXN1bHQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBpbml0UHJvbWlzZTsgfTtcblxuICAgIHJldHVybiBpbml0UHJvbWlzZVxuICB9O1xuICByZXR1cm4gbW9kdWxlRnVuY1xufVxuXG52YXIgc3VwcG9ydHNXb3JrZXJzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc3VwcG9ydGVkID0gZmFsc2U7XG5cbiAgLy8gT25seSBhdHRlbXB0IHdvcmtlciBpbml0aWFsaXphdGlvbiBpbiBicm93c2VyczsgZWxzZXdoZXJlIGl0IHdvdWxkIGp1c3QgYmVcbiAgLy8gbm9pc2UgZS5nLiBsb2FkaW5nIGludG8gYSBOb2RlIGVudmlyb25tZW50IGZvciBTU1IuXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93LmRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHRyeSB7XG4gICAgICAvLyBUT0RPIGFkZGl0aW9uYWwgY2hlY2tzIGZvciB0aGluZ3MgbGlrZSBpbXBvcnRTY3JpcHRzIHdpdGhpbiB0aGUgd29ya2VyP1xuICAgICAgLy8gIFdvdWxkIG5lZWQgdG8gYmUgYW4gYXN5bmMgY2hlY2suXG4gICAgICB2YXIgd29ya2VyID0gbmV3IFdvcmtlcihcbiAgICAgICAgVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbJyddLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyB9KSlcbiAgICAgICk7XG4gICAgICB3b3JrZXIudGVybWluYXRlKCk7XG4gICAgICBzdXBwb3J0ZWQgPSB0cnVlO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Rlc3QnKSA7IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAoXCJUcm9pa2EgY3JlYXRlV29ya2VyTW9kdWxlOiB3ZWIgd29ya2VycyBub3QgYWxsb3dlZDsgZmFsbGluZyBiYWNrIHRvIG1haW4gdGhyZWFkIGV4ZWN1dGlvbi4gQ2F1c2U6IFtcIiArIChlcnIubWVzc2FnZSkgKyBcIl1cIilcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDYWNoZWQgcmVzdWx0XG4gIHN1cHBvcnRzV29ya2VycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHN1cHBvcnRlZDsgfTtcbiAgcmV0dXJuIHN1cHBvcnRlZFxufTtcblxudmFyIF93b3JrZXJNb2R1bGVJZCA9IDA7XG52YXIgX21lc3NhZ2VJZCA9IDA7XG52YXIgX2FsbG93SW5pdEFzU3RyaW5nID0gZmFsc2U7XG52YXIgd29ya2VycyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG52YXIgcmVnaXN0ZXJlZE1vZHVsZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpOyAvL3dvcmtlcklkIC0+IFNldDx1bnJlZ2lzdGVyRm4+XG52YXIgb3BlblJlcXVlc3RzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXG4vKipcbiAqIERlZmluZSBhIG1vZHVsZSBvZiBjb2RlIHRoYXQgd2lsbCBiZSBleGVjdXRlZCB3aXRoIGEgd2ViIHdvcmtlci4gVGhpcyBwcm92aWRlcyBhIHNpbXBsZVxuICogaW50ZXJmYWNlIGZvciBtb3ZpbmcgY2h1bmtzIG9mIGxvZ2ljIG9mZiB0aGUgbWFpbiB0aHJlYWQsIGFuZCBtYW5hZ2luZyB0aGVpciBkZXBlbmRlbmNpZXNcbiAqIGFtb25nIG9uZSBhbm90aGVyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLmluaXRcbiAqIEBwYXJhbSB7YXJyYXl9IFtvcHRpb25zLmRlcGVuZGVuY2llc11cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvcHRpb25zLmdldFRyYW5zZmVyYWJsZXNdXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubmFtZV1cbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy53b3JrZXJJZF1cbiAqIEByZXR1cm4ge2Z1bmN0aW9uKC4uLlsqXSk6IHt0aGVufX1cbiAqL1xuZnVuY3Rpb24gZGVmaW5lV29ya2VyTW9kdWxlKG9wdGlvbnMpIHtcbiAgaWYgKCghb3B0aW9ucyB8fCB0eXBlb2Ygb3B0aW9ucy5pbml0ICE9PSAnZnVuY3Rpb24nKSAmJiAhX2FsbG93SW5pdEFzU3RyaW5nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdyZXF1aXJlcyBgb3B0aW9ucy5pbml0YCBmdW5jdGlvbicpXG4gIH1cbiAgdmFyIGRlcGVuZGVuY2llcyA9IG9wdGlvbnMuZGVwZW5kZW5jaWVzO1xuICB2YXIgaW5pdCA9IG9wdGlvbnMuaW5pdDtcbiAgdmFyIGdldFRyYW5zZmVyYWJsZXMgPSBvcHRpb25zLmdldFRyYW5zZmVyYWJsZXM7XG4gIHZhciB3b3JrZXJJZCA9IG9wdGlvbnMud29ya2VySWQ7XG5cbiAgdmFyIG9uTWFpblRocmVhZCA9IGRlZmluZU1haW5UaHJlYWRNb2R1bGUob3B0aW9ucyk7XG5cbiAgaWYgKHdvcmtlcklkID09IG51bGwpIHtcbiAgICB3b3JrZXJJZCA9ICcjZGVmYXVsdCc7XG4gIH1cbiAgdmFyIGlkID0gXCJ3b3JrZXJNb2R1bGVcIiArICgrK193b3JrZXJNb2R1bGVJZCk7XG4gIHZhciBuYW1lID0gb3B0aW9ucy5uYW1lIHx8IGlkO1xuICB2YXIgcmVnaXN0cmF0aW9uUHJvbWlzZSA9IG51bGw7XG5cbiAgZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzICYmIGRlcGVuZGVuY2llcy5tYXAoZnVuY3Rpb24gKGRlcCkge1xuICAgIC8vIFdyYXAgcmF3IGZ1bmN0aW9ucyBhcyB3b3JrZXIgbW9kdWxlcyB3aXRoIG5vIGRlcGVuZGVuY2llc1xuICAgIGlmICh0eXBlb2YgZGVwID09PSAnZnVuY3Rpb24nICYmICFkZXAud29ya2VyTW9kdWxlRGF0YSkge1xuICAgICAgX2FsbG93SW5pdEFzU3RyaW5nID0gdHJ1ZTtcbiAgICAgIGRlcCA9IGRlZmluZVdvcmtlck1vZHVsZSh7XG4gICAgICAgIHdvcmtlcklkOiB3b3JrZXJJZCxcbiAgICAgICAgbmFtZTogKFwiPFwiICsgbmFtZSArIFwiPiBmdW5jdGlvbiBkZXBlbmRlbmN5OiBcIiArIChkZXAubmFtZSkpLFxuICAgICAgICBpbml0OiAoXCJmdW5jdGlvbigpe3JldHVybiAoXFxuXCIgKyAoc3RyaW5naWZ5RnVuY3Rpb24oZGVwKSkgKyBcIlxcbil9XCIpXG4gICAgICB9KTtcbiAgICAgIF9hbGxvd0luaXRBc1N0cmluZyA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBHcmFiIHBvc3RhYmxlIGRhdGEgZm9yIHdvcmtlciBtb2R1bGVzXG4gICAgaWYgKGRlcCAmJiBkZXAud29ya2VyTW9kdWxlRGF0YSkge1xuICAgICAgZGVwID0gZGVwLndvcmtlck1vZHVsZURhdGE7XG4gICAgfVxuICAgIHJldHVybiBkZXBcbiAgfSk7XG5cbiAgZnVuY3Rpb24gbW9kdWxlRnVuYygpIHtcbiAgICB2YXIgYXJncyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHdoaWxlICggbGVuLS0gKSBhcmdzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuIF07XG5cbiAgICBpZiAoIXN1cHBvcnRzV29ya2VycygpKSB7XG4gICAgICByZXR1cm4gb25NYWluVGhyZWFkLmFwcGx5KHZvaWQgMCwgYXJncylcbiAgICB9XG5cbiAgICAvLyBSZWdpc3RlciB0aGlzIG1vZHVsZSBpZiBuZWVkZWRcbiAgICBpZiAoIXJlZ2lzdHJhdGlvblByb21pc2UpIHtcbiAgICAgIHJlZ2lzdHJhdGlvblByb21pc2UgPSBjYWxsV29ya2VyKHdvcmtlcklkLCdyZWdpc3Rlck1vZHVsZScsIG1vZHVsZUZ1bmMud29ya2VyTW9kdWxlRGF0YSk7XG4gICAgICB2YXIgdW5yZWdpc3RlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVnaXN0cmF0aW9uUHJvbWlzZSA9IG51bGw7XG4gICAgICAgIHJlZ2lzdGVyZWRNb2R1bGVzW3dvcmtlcklkXS5kZWxldGUodW5yZWdpc3Rlcik7XG4gICAgICB9XG4gICAgICA7KHJlZ2lzdGVyZWRNb2R1bGVzW3dvcmtlcklkXSB8fCAocmVnaXN0ZXJlZE1vZHVsZXNbd29ya2VySWRdID0gbmV3IFNldCgpKSkuYWRkKHVucmVnaXN0ZXIpO1xuICAgIH1cblxuICAgIC8vIEludm9rZSB0aGUgbW9kdWxlLCByZXR1cm5pbmcgYSBwcm9taXNlXG4gICAgcmV0dXJuIHJlZ2lzdHJhdGlvblByb21pc2UudGhlbihmdW5jdGlvbiAocmVmKSB7XG4gICAgICB2YXIgaXNDYWxsYWJsZSA9IHJlZi5pc0NhbGxhYmxlO1xuXG4gICAgICBpZiAoaXNDYWxsYWJsZSkge1xuICAgICAgICByZXR1cm4gY2FsbFdvcmtlcih3b3JrZXJJZCwnY2FsbE1vZHVsZScsIHtpZDogaWQsIGFyZ3M6IGFyZ3N9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdXb3JrZXIgbW9kdWxlIGZ1bmN0aW9uIHdhcyBjYWxsZWQgYnV0IGBpbml0YCBkaWQgbm90IHJldHVybiBhIGNhbGxhYmxlIGZ1bmN0aW9uJylcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIG1vZHVsZUZ1bmMud29ya2VyTW9kdWxlRGF0YSA9IHtcbiAgICBpc1dvcmtlck1vZHVsZTogdHJ1ZSxcbiAgICBpZDogaWQsXG4gICAgbmFtZTogbmFtZSxcbiAgICBkZXBlbmRlbmNpZXM6IGRlcGVuZGVuY2llcyxcbiAgICBpbml0OiBzdHJpbmdpZnlGdW5jdGlvbihpbml0KSxcbiAgICBnZXRUcmFuc2ZlcmFibGVzOiBnZXRUcmFuc2ZlcmFibGVzICYmIHN0cmluZ2lmeUZ1bmN0aW9uKGdldFRyYW5zZmVyYWJsZXMpXG4gIH07XG5cbiAgbW9kdWxlRnVuYy5vbk1haW5UaHJlYWQgPSBvbk1haW5UaHJlYWQ7XG5cbiAgcmV0dXJuIG1vZHVsZUZ1bmNcbn1cblxuLyoqXG4gKiBUZXJtaW5hdGUgYW4gYWN0aXZlIFdvcmtlciBieSBhIHdvcmtlcklkIHRoYXQgd2FzIHBhc3NlZCB0byBkZWZpbmVXb3JrZXJNb2R1bGUuXG4gKiBUaGlzIG9ubHkgdGVybWluYXRlcyB0aGUgV29ya2VyIGl0c2VsZjsgdGhlIHdvcmtlciBtb2R1bGUgd2lsbCByZW1haW4gYXZhaWxhYmxlXG4gKiBhbmQgaWYgeW91IGNhbGwgaXQgYWdhaW4gaXRzIFdvcmtlciB3aWxsIGJlIHJlc3Bhd25lZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB3b3JrZXJJZFxuICovXG5mdW5jdGlvbiB0ZXJtaW5hdGVXb3JrZXIod29ya2VySWQpIHtcbiAgLy8gVW5yZWdpc3RlciBhbGwgbW9kdWxlcyB0aGF0IHdlcmUgcmVnaXN0ZXJlZCBpbiB0aGF0IHdvcmtlclxuICBpZiAocmVnaXN0ZXJlZE1vZHVsZXNbd29ya2VySWRdKSB7XG4gICAgcmVnaXN0ZXJlZE1vZHVsZXNbd29ya2VySWRdLmZvckVhY2goZnVuY3Rpb24gKHVucmVnaXN0ZXIpIHtcbiAgICAgIHVucmVnaXN0ZXIoKTtcbiAgICB9KTtcbiAgfVxuICAvLyBUZXJtaW5hdGUgdGhlIFdvcmtlciBvYmplY3RcbiAgaWYgKHdvcmtlcnNbd29ya2VySWRdKSB7XG4gICAgd29ya2Vyc1t3b3JrZXJJZF0udGVybWluYXRlKCk7XG4gICAgZGVsZXRlIHdvcmtlcnNbd29ya2VySWRdO1xuICB9XG59XG5cbi8qKlxuICogU3RyaW5naWZpZXMgYSBmdW5jdGlvbiBpbnRvIGEgZm9ybSB0aGF0IGNhbiBiZSBkZXNlcmlhbGl6ZWQgaW4gdGhlIHdvcmtlclxuICogQHBhcmFtIGZuXG4gKi9cbmZ1bmN0aW9uIHN0cmluZ2lmeUZ1bmN0aW9uKGZuKSB7XG4gIHZhciBzdHIgPSBmbi50b1N0cmluZygpO1xuICAvLyBJZiBpdCB3YXMgZGVmaW5lZCBpbiBvYmplY3QgbWV0aG9kL3Byb3BlcnR5IGZvcm1hdCwgaXQgbmVlZHMgdG8gYmUgbW9kaWZpZWRcbiAgaWYgKCEvXmZ1bmN0aW9uLy50ZXN0KHN0cikgJiYgL15cXHcrXFxzKlxcKC8udGVzdChzdHIpKSB7XG4gICAgc3RyID0gJ2Z1bmN0aW9uICcgKyBzdHI7XG4gIH1cbiAgcmV0dXJuIHN0clxufVxuXG5cbmZ1bmN0aW9uIGdldFdvcmtlcih3b3JrZXJJZCkge1xuICB2YXIgd29ya2VyID0gd29ya2Vyc1t3b3JrZXJJZF07XG4gIGlmICghd29ya2VyKSB7XG4gICAgLy8gQm9vdHN0cmFwIHRoZSB3b3JrZXIncyBjb250ZW50XG4gICAgdmFyIGJvb3RzdHJhcCA9IHN0cmluZ2lmeUZ1bmN0aW9uKHdvcmtlckJvb3RzdHJhcCk7XG5cbiAgICAvLyBDcmVhdGUgdGhlIHdvcmtlciBmcm9tIHRoZSBib290c3RyYXAgZnVuY3Rpb24gY29udGVudFxuICAgIHdvcmtlciA9IHdvcmtlcnNbd29ya2VySWRdID0gbmV3IFdvcmtlcihcbiAgICAgIFVSTC5jcmVhdGVPYmplY3RVUkwoXG4gICAgICAgIG5ldyBCbG9iKFxuICAgICAgICAgIFsoXCIvKiogV29ya2VyIE1vZHVsZSBCb290c3RyYXA6IFwiICsgKHdvcmtlcklkLnJlcGxhY2UoL1xcKi9nLCAnJykpICsgXCIgKiovXFxuXFxuOyhcIiArIGJvb3RzdHJhcCArIFwiKSgpXCIpXSxcbiAgICAgICAgICB7dHlwZTogJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnfVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcblxuICAgIC8vIFNpbmdsZSBoYW5kbGVyIGZvciByZXNwb25zZSBtZXNzYWdlcyBmcm9tIHRoZSB3b3JrZXJcbiAgICB3b3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciByZXNwb25zZSA9IGUuZGF0YTtcbiAgICAgIHZhciBtc2dJZCA9IHJlc3BvbnNlLm1lc3NhZ2VJZDtcbiAgICAgIHZhciBjYWxsYmFjayA9IG9wZW5SZXF1ZXN0c1ttc2dJZF07XG4gICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignV29ya2VyTW9kdWxlIHJlc3BvbnNlIHdpdGggZW1wdHkgb3IgdW5rbm93biBtZXNzYWdlSWQnKVxuICAgICAgfVxuICAgICAgZGVsZXRlIG9wZW5SZXF1ZXN0c1ttc2dJZF07XG4gICAgICBjYWxsYmFjayhyZXNwb25zZSk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gd29ya2VyXG59XG5cbi8vIElzc3VlIGEgY2FsbCB0byB0aGUgd29ya2VyIHdpdGggYSBjYWxsYmFjayB0byBoYW5kbGUgdGhlIHJlc3BvbnNlXG5mdW5jdGlvbiBjYWxsV29ya2VyKHdvcmtlcklkLCBhY3Rpb24sIGRhdGEpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgbWVzc2FnZUlkID0gKytfbWVzc2FnZUlkO1xuICAgIG9wZW5SZXF1ZXN0c1ttZXNzYWdlSWRdID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlLnJlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWplY3QobmV3IEVycm9yKChcIkVycm9yIGluIHdvcmtlciBcIiArIGFjdGlvbiArIFwiIGNhbGw6IFwiICsgKHJlc3BvbnNlLmVycm9yKSkpKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGdldFdvcmtlcih3b3JrZXJJZCkucG9zdE1lc3NhZ2Uoe1xuICAgICAgbWVzc2FnZUlkOiBtZXNzYWdlSWQsXG4gICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSlcbn1cblxuZXhwb3J0IHsgZGVmaW5lV29ya2VyTW9kdWxlLCBzdHJpbmdpZnlGdW5jdGlvbiwgdGVybWluYXRlV29ya2VyIH07XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/troika-worker-utils/dist/troika-worker-utils.esm.js\n");

/***/ })

};
;