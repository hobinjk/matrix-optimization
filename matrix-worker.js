var n = 1024;
var LOG_N = 10;
var tileN = n / 2;
var LOG_TILE_N = LOG_N - 1;

var c = new Float32Array(tileN * tileN);

onmessage = function(message) {
  var data = message.data;
  var a = data.a;
  var b = data.b;
  var startI = data.startI;
  var startJ = data.startJ;

  for (var i = startI; i < startI + tileN; i++) {
    var tileI = i - startI;
    for (var jh = startJ; jh < startJ + tileN; jh += 4) {
      var tileJH = jh - startJ;
      for (var k = 0; k < n; k += 4) {
        for (var jl = 0; jl < 4; jl++) {
          var simdC = SIMD.Float32x4.load(c, (tileI << LOG_TILE_N) | tileJH);
          var simdA = SIMD.Float32x4.load(a, (i << LOG_N) | k);
          var simdB = SIMD.Float32x4.load(b, ((jh + jl) << LOG_N) | k);
          var simdMul = SIMD.Float32x4.mul(simdA, simdB);
          var simdCPlusAB = SIMD.Float32x4.add(simdC, simdMul);
          SIMD.Float32x4.store(c, (tileI << LOG_TILE_N) | tileJH, simdCPlusAB);
        }
      }
    }
  }

  postMessage({c: c, startI: startI, startJ: startJ});
};
