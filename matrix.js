var n = 1024;
var a = generateMatrix(n);
var b = generateMatrix(n);
var c = generateC(n);

function matMul() {
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      for (var k = 0; k < n; k++) {
        c[i][j] += a[i][k] * b[k][j];
      }
    }
  }
}

function generateC(n) {
  var c = [];
  for (var i = 0; i < n; i++) {
    c[i] = new Float64Array(n);
    for (var j = 0; j < n; j++) {
      c[i][j] = 0;
    }
  }
  return c;
}

function generateMatrix(n) {
  var a = [];
  for (var i = 0; i < n; i++) {
    a[i] = new Float64Array(n);
    for (var j = 0; j < n; j++) {
      a[i][j] = Math.random();
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
    var start = window.performance.now();
    fun();
    var end = window.performance.now();
    runs.push(end - start);
  }

  // Only average, stddev would be pretty interesting too
  var min = runs.reduce(function(a, b) {
    return Math.min(a, b);
  });

  console.log(name + ': ' + min + ' ms');
}

function testTriply() {
  perfTest('Triply-nested global typed arrays', matMul);
}
