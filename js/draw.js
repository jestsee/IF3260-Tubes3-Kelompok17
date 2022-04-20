// global variable
var img = new Image();

function draw (arrPosition, matrix, withColor, shading) {
    // console.log("draw called");

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var colorLocation = gl.getAttribLocation(program, "a_color");
    var normalLocation = gl.getAttribLocation(program, "a_normal");

    // lookup uniforms
    // var colorLocation = gl.getUniformLocation(program, "u_color");
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
    var textureBool = gl.getUniformLocation(program, "u_texture_bool");
    var shadingBool = gl.getUniformLocation(program, "u_shading_bool");
    var worldViewProjectionLocation = gl.getUniformLocation(program, "u_worldViewProjection");
    var worldInverseTransposeLocation = gl.getUniformLocation(program, "u_worldInverseTranspose");
    var reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection");

    // default color
    var arrColor = [];
    if (withColor) {
        arrColor = generateColor(arrPosition.length/6);
    }

    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Put geometry data into buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrPosition), gl.STATIC_DRAW);

    // ---------------------------------------------------------------

    // Create a buffer to put normals in
    var normalBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = normalBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    // Put normals data into buffer
    setNormals(gl);

    // ---------------------------------------------------------------

    resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Turn on culling. By default backfacing triangles
    // will be culled.
    gl.enable(gl.CULL_FACE);

    // Enable the depth buffer
    gl.enable(gl.DEPTH_TEST);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

    // ---------------------------------------------------------------

    // Turn on the normal attribute
    gl.enableVertexAttribArray(normalLocation);

    // Bind the normal buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    // Tell the attribute how to get data out of normalBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floating point values
    var normalize = false; // normalize the data (convert from 0-255 to 0-1)
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(normalLocation, size, type, normalize, stride, offset);

    // ---------------------------------------------------------------

    // Create a buffer for colors.
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // Put the colors in the buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(arrColor), gl.STATIC_DRAW);

    // Turn on the color attribute
    gl.enableVertexAttribArray(colorLocation);

    // Bind the color buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    var size = 3;                 // 3 components per iteration
    var type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
    var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
    var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;               // start at the beginning of the buffer
    gl.vertexAttribPointer(
        colorLocation, size, type, normalize, stride, offset);

    // ---------------------------------------------------------------

    // Make a view matrix from the camera matrix.
    // var viewMatrix = m4.inverse(cameraMatrix);

    // Compute a view projection matrix
    // var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    // Draw cube at the origin
    // var worldMatrix = m4.yRotation(arrRotate[1]);
    
    // Multiply the matrices.
    // var worldViewProjectionMatrix = m4.multiply(viewProjectionMatrix, worldMatrix);
    var worldInverseMatrix = m4.inverse(matrix);
    var worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);
    // gl.uniformMatrix4fv(worldViewProjectionLocation, false, worldViewProjectionMatrix);
    gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);

    // Tell the shader to use texture unit 0 for u_texture
    // gl.uniform1i(textureLocation, 0);
    gl.uniform1i(textureBool, false);
    gl.uniform1i(shadingBool, shading);

    // set the light direction.
    gl.uniform3fv(reverseLightDirectionLocation, m4.normalize([0.5, 0.7, 1]));

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = arrPosition.length;
    gl.drawArrays(primitiveType, offset, count);
}

async function drawTexImage (arrPosition, matrix, withColor) {
    // console.log("drawTexImage called");
    // const url = "https://webglfundamentals.org/webgl/resources/f-texture.png";
    const url = "../img/pattern.jpg";
    if(img.naturalHeight == 0) {
        console.log("masuk if");
        img = await loadImage(url);
    }
    _drawTexImage(arrPosition, matrix, withColor, img);
}


function draw_bump(rotation, translation, scale) {
    var bumpBool = gl.getUniformLocation(program, "u_bump_bool");
    var textureBool = gl.getUniformLocation(program, "u_texture_bool");
    gl.uniform1i(bumpBool, true);
    gl.uniform1i(textureBool, true);
    instanceMatrix = mult(modelViewMatrix, rotate(rotation[0],1,0,0));
    instanceMatrix = mult(instanceMatrix, rotate(rotation[1],0,1,0));
    instanceMatrix = mult(instanceMatrix, rotate(rotation[2],0,0,1));
    instanceMatrix = mult(instanceMatrix, translate(translation[0], translation[1], translation[2]));
    instanceMatrix = mult(instanceMatrix, scale4(scale[0], scale[1], scale[2]));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (let i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function _drawTexImage (arrPosition, matrix, withColor, img) {
    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var colorLocation = gl.getAttribLocation(program, "a_color");
    var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

    // lookup uniforms
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
    var textureLocation = gl.getUniformLocation(program, "u_texture");
    var textureBool = gl.getUniformLocation(program, "u_texture_bool");

    // default color
    var arrColor = [];
    if (withColor) {
        arrColor = generateColor(arrPosition.length/6);
    }

    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Put geometry data into buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrPosition), gl.STATIC_DRAW);

    // ----------------------------------------------------------

    // provide texture coordinates for the rectangle.
    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    // Set Texcoords.
    setTexcoords(gl);

    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
    
    // image.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    // });

    // ----------------------------------------------------------

    resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Turn on culling. By default backfacing triangles
    // will be culled.
    gl.enable(gl.CULL_FACE);

    // Enable the depth buffer
    gl.enable(gl.DEPTH_TEST);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

    // Turn on the texcoord attribute
    gl.enableVertexAttribArray(texcoordLocation);

    // bind the texcoord buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        texcoordLocation, size, type, normalize, stride, offset);

    // Create a buffer for colors.
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // Put the colors in the buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(arrColor), gl.STATIC_DRAW);

    // Turn on the color attribute
    gl.enableVertexAttribArray(colorLocation);

    // Bind the color buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    var size = 3;                 // 3 components per iteration
    var type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
    var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
    var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;               // start at the beginning of the buffer
    gl.vertexAttribPointer(
        colorLocation, size, type, normalize, stride, offset);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Tell the shader to use texture unit 0 for u_texture
    gl.uniform1i(textureLocation, 0);
    gl.uniform1i(textureBool, true);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = arrPosition.length;
    gl.drawArrays(primitiveType, offset, count);
}

function setTexcoords(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // Front
            0, 0,
            0, 1,
            1, 0,
            0, 1,
            1, 1,
            1, 0,
            
            // Back
            0, 0,
            1, 0,
            0, 1,
            0, 1,
            1, 0,
            1, 1,
            
            // Right
            0, 0,
            1, 0,
            1, 1,
            0, 0,
            1, 1,
            0, 1,

            // Left
            0, 0,
            1, 1,
            1, 0,
            0, 0,
            0, 1,
            1, 1,

            // Top
            0, 0,
            0, 1,
            1, 0,
            0, 1,
            1, 1,
            1, 0,

            0, 0,
            1, 0,
            0, 1, 
            0, 1,
            1, 0,
            1, 1,
        ]),
        gl.STATIC_DRAW);
}


function setNormals(gl) {
    var normals = new Float32Array([
            // left column front
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
  
            // top rung front
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
  
            // middle rung front
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
  
            // left column back
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
  
            // top rung back
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
  
            // middle rung back
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
  
            // top
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
  
            // top rung right
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
  
            // under top rung
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
  
            // between top rung and middle
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
  
            // top of middle rung
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
  
            // right of middle rung
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
  
            // bottom of middle rung.
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
  
            // right of bottom
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
  
            // bottom
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
  
            // left side
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0]);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}