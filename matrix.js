var n = 1024;
var a = generateMatrix(n);
var b = generateMatrix(n);
var c = generateC(n);

var tileSize = 128;

function matMul() {
  var start = window.performance.now();
  for (var ih = 0; ih < n; ih += tileSize) {
    for (var jh = 0; jh < n; jh += tileSize) {
      for (var kh = 0; kh < n; kh += tileSize) {
        for (var il = 0; il < tileSize; il++) {
          for (var jl = 0; jl < tileSize; jl++) {
            for (var kl = 0; kl < tileSize; kl++) {
              c[((ih | il) << 10) | (jh | jl)] += a[((ih | il) << 10) | (kh | kl)] *
                                                  b[((jh | jl) << 10) | (kh | kl)];
            }
          }
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
