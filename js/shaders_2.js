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
   'varying vec3 L;',
   'varying vec3 V;', 
   
   'attribute vec2 vTexCoord;', 
   'attribute vec4 vPosition;', 
   
   'uniform vec4 normal;', 
   'uniform vec4 lightPosition;', 
   'uniform mat4 modelViewMatrix;', 
   'uniform mat4 projectionMatrix;', 
   'uniform mat3 normalMatrix;', 
   'uniform vec3 objTangent;', 

   'uniform bool u_bump_bool;',
   
   'varying vec2 fTexCoord;',
   
   'void main()',
   '{',
   '  if (u_bump_bool) {',
      'gl_Position = projectionMatrix*modelViewMatrix*vPosition;',

      'fTexCoord = vTexCoord;',

      'vec3 eyePosition = (modelViewMatrix*vPosition).xyz;',
      'vec3 eyeLightPos = (modelViewMatrix*lightPosition).xyz;',

      'vec3 N = normalize(normalMatrix*normal.xyz);',
      'vec3 T  = normalize(normalMatrix*objTangent);',
      'vec3 B = cross(N, T);',

      'L.x = dot(T, eyeLightPos-eyePosition);',
      'L.y = dot(B, eyeLightPos-eyePosition);',
      'L.z = dot(N, eyeLightPos-eyePosition);',

      'L = normalize(L);',

      'V.x = dot(T, -eyePosition);',
      'V.y = dot(B, -eyePosition);',
      'V.z = dot(N, -eyePosition);',

      'V = normalize(V);',
   ' } ',
   ' else {',
   '  gl_Position = u_matrix * a_position;',
   '  v_color = a_color;',
   '  v_texcoord = a_texcoord;',
   '}',
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
   'uniform bool u_bump_bool;',
   'varying vec3 L;',
   'varying vec3 V;',
   'varying vec2 fTexCoord;',
   
   'uniform sampler2D texMap;',
   'uniform vec4 diffuseProduct;',

   'void main()',
   '{',
   '  if (u_texture_bool) {',
  //  '    gl_FragColor = textureCube(u_texture, normalize(v_normal));',
  '    if(u_bump_bool) {',
      '   vec4 N = texture2D(texMap, fTexCoord);',
      '   vec3 NN =  normalize(2.0*N.xyz-1.0);',
      '   vec3 LL = normalize(L);',
      '   float Kd = max(dot(NN, LL), 0.0);',
      '   gl_FragColor = vec4(Kd*diffuseProduct.xyz, 1.0);',
  '    }',
   '    else {',
   '      gl_FragColor = texture2D(u_texture, v_texcoord);',
   '    }',
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