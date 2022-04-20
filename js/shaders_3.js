var vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, document.getElementById("vertex-shader").text)
gl.compileShader(vertexShader)

var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader, document.getElementById("fragment-shader").text)
gl.compileShader(fragmentShader)

var program = gl.createProgram()
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program)
gl.useProgram(program)
