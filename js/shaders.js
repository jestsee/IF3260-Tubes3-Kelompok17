/**
 * Shaders
 */
 var vertexShader = gl.createShader(gl.VERTEX_SHADER)
 gl.shaderSource(vertexShader, [
   'attribute vec4 a_position;',
   'attribute vec4 a_color;',
   'attribute vec2 a_texcoord;',
   'attribute vec3 a_normal;',
   
   'uniform mat4 u_matrix;',
   'uniform mat4 u_worldViewProjection;',
  //  'uniform mat4 u_world;',
   'uniform mat4 u_worldInverseTranspose;',
 
   'varying vec4 v_color;',
   'varying vec2 v_texcoord;',
   'varying vec3 v_normal;',
   
   'void main()',
   '{',
    '  gl_Position = u_matrix * a_position;',
  //  '  gl_Position = u_worldViewProjection * a_position;',
   '  v_color = a_color;',
   '  v_texcoord = a_texcoord;',

   '  v_normal = mat3(u_worldInverseTranspose) * a_normal;',
   '}'
   ].join('\n'))
 gl.compileShader(vertexShader)
 
 var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
 gl.shaderSource(fragmentShader, [
   'precision mediump float;',
   '',
   'varying vec4 v_color;',
   'varying vec2 v_texcoord;',
   'varying vec3 v_normal;',
   
   'uniform sampler2D u_texture;',
   'uniform bool u_texture_bool;',
   'uniform bool u_shading_bool;',
   'uniform vec3 u_reverseLightDirection;',

   'void main()',
   '{',
   '  vec4 temp = vec4(0.0, 0.0, 0.0, 0.0);', // inisialisasi
   '  if (u_texture_bool) {',
   '    temp = texture2D(u_texture, v_texcoord);',
   '  } else {',
   '    temp = v_color;',
   '  }',

   '  gl_FragColor = vec4(temp);',

   '  if (u_shading_bool) {',
   '    vec3 normal = normalize(v_normal);',
   '    float light = dot(normal, u_reverseLightDirection);',
   '    gl_FragColor.rgb *= light;',
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