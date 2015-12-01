var n = 1024;
var LOG_N = 10;
var tileN = n / 2;
var LOG_TILE_N = LOG_N - 1;

var workerTL = new Worker('matrix-worker.js');
var workerTR = new Worker('matrix-worker.js');
var workerBL = new Worker('matrix-worker.js');
var workerBR = new Worker('matrix-worker.js');

var a = generateMatrix(n);
var b = generateMatrix(n);
var c = generateC(n);

function matMul(finish) {
  var start = window.performance.now();

  var workingWorkers = 4;
  function onMessage(message) {
    var startI = message.startI;
    var startJ = message.startJ;
    var workerC = message.c;

    for (var i = startI; i < startI + tileN; i++) {
      for (var j = startJ; j < startJ + tileN; j++) {
        var tileI = i - startI;
        var tileJ = j - startJ;

        c[(i << LOG_N) | j] = workerC[(tileI << LOG_TILE_N) | tileJ];
      }
    }

    workingWorkers -= 1;
    if (workingWorkers === 0) {
      var end = window.performance.now();
      finish(end - start);
    }
  }
  workerTL.onmessage = onMessage;
  workerTR.onmessage = onMessage;
  workerBL.onmessage = onMessage;
  workerBR.onmessage = onMessage;

  workerTL.postMessage({a: a, b: b, startI: 0, startJ: 0});
  workerTR.postMessage({a: a, b: b, startI: 0, startJ: tileN});
  workerBL.postMessage({a: a, b: b, startI: tileN, startJ: 0});
  workerBR.postMessage({a: a, b: b, startI: tileN, startJ: tileN});
}

function generateC(n) {
  var c = new Float32Array(n * n);
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      c[i * n + j] = 0;
    }
  }
  return c;
}

function generateMatrix(n) {
  var a = new Float32Array(n * n);
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      a[i * n + j] = Math.random();
    }
  }
  return a;
}

function perfTest(name) {
  var runs = [];
  var total = 20;
  function runOneTest() {
    if (runs.length > total) {
      var min = runs.reduce(function(a, b) {
        return Math.min(a, b);
      });
      console.log(name + ': ' + min + ' ms');
      return;
    }
    matMul(function(time) {
      runs.push(time);
      runOneTest();
    });
  }
  runOneTest();
}

function testTriply() {
  perfTest('Triply-nested global typed transposed aggregated arrays with SIMD and WebWorkers', matMul);
}
