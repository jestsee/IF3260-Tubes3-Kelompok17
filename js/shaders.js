/**
 * Shaders
 */
 var vertexShader = gl.createShader(gl.VERTEX_SHADER)
 gl.shaderSource(vertexShader, [
   'attribute vec4 a_position;',
   'attribute vec4 a_color;',
   'attribute vec2 a_texcoord;',
   
   'uniform mat4 u_matrix;',
 
   'varying vec4 v_color;',
   'varying vec2 v_texcoord;',
   
   'void main()',
   '{',
   '  gl_Position = u_matrix * a_position;',
   '  v_color = a_color;',
   '  v_texcoord = a_texcoord;',
   '}'
   ].join('\n'))
 gl.compileShader(vertexShader)
 
 var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
 gl.shaderSource(fragmentShader, [
   'precision mediump float;',
   '',
   'varying vec4 v_color;',
   'varying vec2 v_texcoord;',
   
   'uniform sampler2D u_texture;',
   'uniform bool u_texture_bool;',

   'void main()',
   '{',
   '  if (u_texture_bool) {',
  //  '    gl_FragColor = textureCube(u_texture, normalize(v_normal));',
   '    gl_FragColor = texture2D(u_texture, v_texcoord);',
   '  } else {',
   '    gl_FragColor = v_color;',
   '  }',
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
