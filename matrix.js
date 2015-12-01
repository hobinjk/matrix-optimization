var n = 1024;
var a = generateMatrix(n);
var b = generateMatrix(n);
var c = generateC(n);
var LOG_N = 10;

function matMul() {
  var start = window.performance.now();
  for (var i = 0; i < n; i++) {
    for (var jh = 0; jh < n; jh += 2) {
      for (var k = 0; k < n; k += 2) {
        for (var jl = 0; jl < 2; jl++) {
          var simdC = SIMD.Float64x2.load(c, (i << LOG_N) | jh);
          var simdA = SIMD.Float64x2.load(a, (i << LOG_N) | k);
          var simdB = SIMD.Float64x2.load(b, ((jh + jl) << LOG_N) | k);
          var simdMul = SIMD.Float64x2.mul(simdA, simdB);
          var simdCPlusAB = SIMD.Float64x2.add(simdC, simdMul);
          SIMD.Float64x2.store(c, (i << LOG_N) | jh, simdCPlusAB);
        }
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
  perfTest('Triply-nested global typed transposed aggregated arrays', matMul);
}
