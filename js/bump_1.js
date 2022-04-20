"use strict";


let projectionMatrix;
let modelViewMatrix;
var texSize = 256;

// Bump Data

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

let instanceMatrix;

let modelViewMatrixLoc;

let vertices = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
];

var texCoordsArray = [];

var texCoord = [
    vec2(0, 0),
    vec2(1, 0),
    vec2(1, 1),
    vec2(0, 1)
];

var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialDiffuse = vec4( 0.7, 0.7, 0.7, 1.0 );

function configureTexture( image ) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, texSize, texSize, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

let vBuffer;
let pointsArray = [];

function scale4(a, b, c) {
    let result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

function init_objects() {
    head = new Cube({scale:[2,2,1],translation:[0,0,0],type:3});
    rightUpperArm = new Cube({scale:[0.4, 1, 0.1], translation:[1.3,0,0], type:3})
    leftUpperArm = new Cube({scale:[0.4, 1, 0.1], translation:[-1.3,0,0], type:3})
    rightLowerArm = new Cube({scale:[0.5, 1, 0.1], translation:[1.3,-1,0], type:3})
    leftLowerArm = new Cube({scale:[0.5, 1, 0.1], translation:[-1.3,-1,0], type:3})
    rightUpperLeg = new Cube({scale:[0.4, 1, 0.1], translation:[0.5,-1.9,0], type:3})
    leftUpperLeg = new Cube({scale:[0.4, 1, 0.1], translation:[-0.5,-1.9,0], type:3})
    rightLowerLeg = new Cube({scale:[0.4, 0.7, 0.1], translation:[0.5,-2.9,0], type:3})
    leftLowerLeg = new Cube({scale:[0.4, 0.7, 0.1], translation:[-0.5,-2.9,0], type:3})

    rightUpperArm.setParent(head)
    leftUpperArm.setParent(head)
    rightLowerArm.setParent(rightUpperArm)
    leftLowerArm.setParent(leftUpperArm)
    rightUpperLeg.setParent(head)
    leftUpperLeg.setParent(head)
    rightLowerLeg.setParent(rightUpperLeg)
    leftLowerLeg.setParent(leftUpperLeg)
}

function quad(a, b, c, d) {
    pointsArray.push(vertices[a]);
    texCoordsArray.push(texCoord[0]);
    pointsArray.push(vertices[b]);
    texCoordsArray.push(texCoord[1]);
    pointsArray.push(vertices[c]);
    texCoordsArray.push(texCoord[3]);
    pointsArray.push(vertices[d]);
    texCoordsArray.push(texCoord[2]);
}


function cube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

var normal = vec4(0.0, 1.0, 0.0, 0.0);
var tangent = vec3(1.0, 0.0, 0.0);
var lightPosition = vec4(0.0, 2.0, 0.0, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialDiffuse = vec4( 0.7, 0.7, 0.7, 1.0 );

var head;
var leftUpperArm;
var leftLowerArm;
var rightUpperArm;
var rightLowerArm;
var leftUpperLeg;
var leftLowerLeg;
var rightUpperLeg;
var rightLowerLeg;
var wholeBody;
var headJoint;
var leftUpperArmJoint;
var leftLowerArmJoint;
var rightUpperArmJoint;
var rightLowerArmJoint;

window.onload = function init() {
    init_objects();
    draw_bump_init();
}


let draw_bump_init = function() {

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    //program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-3.0, 2.0, -3.0, 2.0, -3.0, 100.0);
    modelViewMatrix = mat4();

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")
    var normalMatrix = mat4ToInverseMat3(modelViewMatrix);

    cube();

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    let vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    setTexcoords(gl);

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    configureTexture(normals);

    var diffuseProduct = mult(lightDiffuse, materialDiffuse);

    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct));
    gl.uniform4fv( gl.getUniformLocation(program, "normal"),flatten(normal));
    gl.uniform3fv( gl.getUniformLocation(program, "objTangent"),flatten(tangent));
    gl.uniformMatrix3fv( gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMatrix));

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    lightPosition[0] = 5.5*Math.sin(0.01);
    lightPosition[2] = 5.5*Math.cos(0.01);
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition));

    var eye = vec3(2.0, 2.0, 2.0);
    var at = vec3(0.5, 0.0, 0.5);
    var up = vec3(0.0, 1.0, 0.0);

    modelViewMatrix  = lookAt(eye, at, up);

    var normalMatrix = [
       vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
       vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
       vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

    head.draw();
}
