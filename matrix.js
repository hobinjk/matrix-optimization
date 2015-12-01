var n = 1024;
var a = generateMatrix(n);
var b = generateMatrix(n);
var c = generateC(n);

function matMul() {
  var start = window.performance.now();
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      for (var k = 0; k < n; k++) {
        c[(i << 10) | j] += a[(i << 10) | k] * b[(k << 10) | j];
      }
    }
  }
  var end = window.performance.now();
  return end - start;
}

function generateC(n) {
  var c = new Float64Array(n * n);
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      c[i * n + j] = 0;
    }
  }
  return c;
}

function generateMatrix(n) {
  var a = new Float64Array(n * n);
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      a[i * n + j] = Math.random();
    }
  }
  return a;
}

function perfTest(name, fun) {
  var runs = [];
  var total = 16;
  var warmup = 4;
  for (var i = 0; i < total + warmup; i++) {
    console.log(i);
    var time = fun();
    runs.push(time);
  }

  // Only average, stddev would be pretty interesting too
  var min = runs.reduce(function(a, b) {
    return Math.min(a, b);
  });

  console.log(name + ': ' + min + ' ms');
}

function testTriply() {
  perfTest('Triply-nested global typed aggregated arrays', matMul);
}
