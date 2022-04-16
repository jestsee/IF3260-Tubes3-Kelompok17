/**
 * Shaders
 */
 var vertexShader = gl.createShader(gl.VERTEX_SHADER)
 gl.shaderSource(vertexShader, [
   'attribute vec4 a_position;',
   'attribute vec4 a_color;',
   'uniform mat4 u_matrix;',
 
   'varying vec4 v_color;',
   
   'void main()',
   '{',
   '  gl_Position = u_matrix * a_position;',
   '  v_color = a_color;',
   '}'
   ].join('\n'))
 gl.compileShader(vertexShader)
 
 var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
 gl.shaderSource(fragmentShader, [
   'precision mediump float;',
   '',
   'varying vec4 v_color;',
   'void main()',
   '{',
   '  gl_FragColor = v_color;',
   '}'
   ].join('\n'))
 gl.compileShader(fragmentShader)
 
 var program = gl.createProgram()
 gl.attachShader(program, vertexShader)
 gl.attachShader(program, fragmentShader)
 gl.linkProgram(program)
 gl.useProgram(program)
 

// BUAT ON/OFF SHADING
// 'uniform bool u_shading;',
//  'void main()',
//  '{',
//  '  if (u_shading) {',
//  '    gl_FragColor = vec4(v_lighting * v_color.rgb, v_color.a);',
//  '  } else {',
//  '    gl_FragColor = v_color;',
//  '  }',
//  '}'