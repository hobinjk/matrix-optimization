function matMul(a, b, c) {
  var n = a.length;
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
    c[i] = [];
    for (var j = 0; j < n; j++) {
      c[i][j] = 0;
    }
  }
  return c;
}

function generateMatrix(n) {
  var a = [];
  for (var i = 0; i < n; i++) {
    a[i] = [];
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
  var average = runs.reduce(function(avg, run) {
    return avg + run / runs.length;
  }, 0);

  console.log(name + ': ' + average + ' ms');
}

function testTriply() {
  var n = 512;
  var a = generateMatrix(n);
  var b = generateMatrix(n);
  var c = generateC(n);
  perfTest('Triply-nested', function() {
    matMul(a, b, c);
  });
}
