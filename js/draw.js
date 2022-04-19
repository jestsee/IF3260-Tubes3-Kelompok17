function draw (arrPosition, matrix, withColor) {
    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var colorLocation = gl.getAttribLocation(program, "a_color");

    // lookup uniforms
    // var colorLocation = gl.getUniformLocation(program, "u_color");
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
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
    // gl.uniform1i(textureLocation, 0);
    gl.uniform1i(textureBool, false);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = arrPosition.length;
    gl.drawArrays(primitiveType, offset, count);
}

async function drawTexImage (arrPosition, matrix, withColor) {
    const url = "../img/pattern.jpg"
    const img = await loadImage(url);
    _drawTexImage(arrPosition, matrix, withColor, img);
}


async function drawTexBump (arrPosition, matrix, withColor) {
    //const img = await loadImage(url);
    _drawTexBump(arrPosition, matrix, withColor);
}

function _drawTexBump(arrPosition, matrix, withColor) {
        texSize = 256;
        var data = new Array()
        for (var i = 0; i<= texSize; i++)  data[i] = new Array();
        for (var i = 0; i<= texSize; i++) for (var j=0; j<=texSize; j++)
            data[i][j] = 0.0;
        for (var i = texSize/4; i<3*texSize/4; i++) for (var j = texSize/4; j<3*texSize/4; j++)
            data[i][j] = 1.0;

// Bump Map Normals

    var normalst = new Array()
        for (var i=0; i<texSize; i++)  normalst[i] = new Array();
        for (var i=0; i<texSize; i++) for ( var j = 0; j < texSize; j++)
            normalst[i][j] = new Array();
        for (var i=0; i<texSize; i++) for ( var j = 0; j < texSize; j++) {
            normalst[i][j][0] = data[i][j]-data[i+1][j];
            normalst[i][j][1] = data[i][j]-data[i][j+1];
            normalst[i][j][2] = 1;
        }

// Scale to Texture Coordinates

        for (var i=0; i<texSize; i++) for (var j=0; j<texSize; j++) {
        var d = 0;
        for(k=0;k<3;k++) d+=normalst[i][j][k]*normalst[i][j][k];
        d = Math.sqrt(d);
        for(k=0;k<3;k++) normalst[i][j][k]= 0.5*normalst[i][j][k]/d + 0.5;
        }

// Normal Texture Array

    var normals = new Uint8Array(3*texSize*texSize);

        for ( var i = 0; i < texSize; i++ )
            for ( var j = 0; j < texSize; j++ )
            for(var k =0; k<3; k++)
                    normals[3*texSize*i+3*j+k] = 255*normalst[i][j][k];

        var textureBool = gl.getUniformLocation(program, "u_texture_bool");
        var bumpBool = gl.getUniformLocation(program, "u_bump_bool");
        var texCoordsArray = [];
                        
        var texCoord = [
            vec2(0, 0),
            vec2(0, 1),
            vec2(1, 1),
            vec2(1, 0)
        ];
                        
        var modelViewMatrix, projectionMatrix, normalMatrix;
                        
        var eye = vec3(2.0, 2.0, 2.0);
        var at = vec3(0.5, 0.0, 0.5);
        var up = vec3(0.0, 1.0, 0.0);
                        
        var normal = vec4(0.0, 1.0, 0.0, 0.0);
        var tangent = vec3(1.0, 0.0, 0.0);
                        
        var lightPosition = vec4(0.0, 2.0, 0.0, 1.0 );
        var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
                        
        var materialDiffuse = vec4( 0.7, 0.7, 0.7, 1.0 );

        var time = 0;
        
        // canvas = document.getElementById( "gl-canvas" );

        //gl = WebGLUtils.setupWebGL( canvas );
        //if ( !gl ) { alert( "WebGL isn't available" ); }
    
        gl.viewport( 0, 0, canvas.width, canvas.height );
        gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
        gl.enable(gl.DEPTH_TEST);

        modelViewMatrix  = lookAt(eye, at, up);
        projectionMatrix = ortho(-0.75,0.75,-0.75,0.75,-5.5,5.5);
    
        var normalMatrix = mat4ToInverseMat3(modelViewMatrix); 

        texCoordsArray.push(texCoord[0]);
        texCoordsArray.push(texCoord[1]);
        texCoordsArray.push(texCoord[2]);
        texCoordsArray.push(texCoord[2]);
        texCoordsArray.push(texCoord[3]);
        texCoordsArray.push(texCoord[0]);
        
        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        //gl.bufferData(gl.ARRAY_BUFFER, flatten(arrPosition), gl.STATIC_DRAW);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrPosition), gl.STATIC_DRAW);
    
        var vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
    
        var tBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
        //gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoordsArray), gl.STATIC_DRAW);
    
        var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
        gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vTexCoord);
        
        // configure texture

        var texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, texSize, texSize, 0, gl.RGB, gl.UNSIGNED_BYTE, normals);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                          gl.NEAREST_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
        var diffuseProduct = mult(lightDiffuse, materialDiffuse);

        gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct));
        gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition));
        gl.uniform4fv( gl.getUniformLocation(program, "normal"),flatten(normal));
        gl.uniform3fv( gl.getUniformLocation(program, "objTangent"),flatten(tangent));
    
        gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));
        gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));
        gl.uniformMatrix3fv( gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMatrix));
    
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        lightPosition[0] = 5.5*Math.sin(0.01*time);
        lightPosition[2] = 5.5*Math.cos(0.01*time);

        time += 1;

        gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
        gl.uniform1i(textureBool, true);
        //gl.uniform1i(bumpBool, true);

        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = arrPosition.length;
        gl.drawArrays(primitiveType, offset, count);
        /*
        var positionLocation = gl.getAttribLocation(program, "a_position");
        var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
        var matrixLocation = gl.getUniformLocation(program, "u_matrix");
        var textureLocation = gl.getUniformLocation(program, "u_texture");
        var textureBool = gl.getUniformLocation(program, "u_texture_bool");
        // var bumpBool = gl.getUniformLocation(program, "u_bump_bool");
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrPosition), gl.STATIC_DRAW);
    
        // ----------------------------------------------------------
        var texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        setTexcoords(gl);
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
        
        // Now that the image has loaded make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, texSize, texSize, 0, gl.RGB, gl.UNSIGNED_BYTE, normals);
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
    
        // // Create a buffer for colors.
        // // Put the colors in the buffer.
    
        // // Turn on the color attribute
    
        // // Bind the color buffer.
    
        // // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    
        // Set the matrix.
        gl.uniformMatrix4fv(matrixLocation, false, matrix);
    
        // Tell the shader to use texture unit 0 for u_texture
        gl.uniform1i(textureLocation, 0);
        gl.uniform1i(textureBool, true);
    
        // Draw the geometry.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = arrPosition.length;
        gl.drawArrays(primitiveType, offset, count);*/
}

function _drawTexImage (arrPosition, matrix, withColor, img) {
    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    // var colorLocation = gl.getAttribLocation(program, "a_color");
    var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

    // lookup uniforms
    // var colorLocation = gl.getUniformLocation(program, "u_color");
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
    var textureLocation = gl.getUniformLocation(program, "u_texture");
    var textureBool = gl.getUniformLocation(program, "u_texture_bool");

    // default color
    // var arrColor = [];
    // if (withColor) {
    //     arrColor = generateColor(arrPosition.length/6);
    // }

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

    // // Create a buffer for colors.
    // var colorBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // // Put the colors in the buffer.
    // gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(arrColor), gl.STATIC_DRAW);

    // // Turn on the color attribute
    // gl.enableVertexAttribArray(colorLocation);

    // // Bind the color buffer.
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    // // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    // var size = 3;                 // 3 components per iteration
    // var type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
    // var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
    // var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
    // var offset = 0;               // start at the beginning of the buffer
    // gl.vertexAttribPointer(
    //     colorLocation, size, type, normalize, stride, offset);

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

// Fill the buffer with texture coordinates the F.
function setTexcoords(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // Front
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Back
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Top
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Right
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Left
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
        ]),
        gl.STATIC_DRAW);
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}