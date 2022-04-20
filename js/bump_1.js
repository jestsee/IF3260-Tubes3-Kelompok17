"use strict";


let projectionMatrix;
let modelViewMatrix;
var texSize = 256;
var isAnimating = false;
var shading = false;

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
    rightUpperArm = new Cube({scale:[0.4, 1, 0.2], translation:[1.5,-0.5,0],type:3})
    rightUpperArm.xRotate(-90);
    leftUpperArm = new Cube({scale:[0.4, 1, 0.2], translation:[-1.5,-0.5,0], type:3})
    leftUpperArm.xRotate(-90);
    rightLowerArm = new Cube({scale:[0.5, 0.5, 0.2], translation:[1.5,-1.3,0], type:3})
    rightLowerArm.xRotate(-90);
    leftLowerArm = new Cube({scale:[0.5, 0.5, 0.2], translation:[-1.5,-1.3,0], type:3})
    leftLowerArm.xRotate(-90);
    rightUpperLeg = new Cube({scale:[0.4, 1, 0.2], translation:[0.5,-1.6,0], type:3})
    leftUpperLeg = new Cube({scale:[0.4, 1, 0.2], translation:[-0.5,-1.6,0], type:3})
    rightLowerLeg = new Cube({scale:[0.4, 0.5, 0.2], translation:[0.5,-2.5,0], type:3})
    leftLowerLeg = new Cube({scale:[0.4, 0.5, 0.2], translation:[-0.5,-2.5,0], type:3})

    rightUpperArm.setParent(head)
    leftUpperArm.setParent(head)
    rightLowerArm.setParent(rightUpperArm)
    leftLowerArm.setParent(leftUpperArm)
    rightUpperLeg.setParent(head)
    leftUpperLeg.setParent(head)
    rightLowerLeg.setParent(rightUpperLeg)
    leftLowerLeg.setParent(leftUpperLeg)
    
    leftUpperArm.moveCenterToUpmost();
    leftLowerArm.moveCenterToUpmost();
    rightUpperArm.moveCenterToUpmost();
    rightLowerArm.moveCenterToUpmost();

    leftUpperLeg.moveCenterToUpmost();
    rightUpperLeg.moveCenterToUpmost();
    rightLowerLeg.moveCenterToUpmost();
    leftLowerLeg.moveCenterToUpmost();

    head.localMatrix = head.generateMatrix();
    leftUpperArm.localMatrix = leftUpperArm.generateMatrix();
    rightUpperArm.localMatrix = rightUpperArm.generateMatrix();
    rightUpperLeg.localMatrix = rightUpperLeg.generateMatrix();
    leftUpperLeg.localMatrix = leftUpperLeg.generateMatrix();
    leftLowerLeg.localMatrix = leftLowerLeg.generateMatrix();
    rightLowerLeg.localMatrix = rightLowerLeg.generateMatrix();
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

window.onload = function init() {
    init_objects();
    displaySliders();
    draw_and_render();
}


let draw_bump_init = function() {

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

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
    //normals = new Uint8Array(3*texSize*texSize);
    configureTexture(normals);

    var diffuseProduct = mult(lightDiffuse, materialDiffuse);

    gl.uniform4fv( gl.getUniformLocation(program, "normal"),flatten(normal));
    gl.uniform3fv( gl.getUniformLocation(program, "objTangent"),flatten(tangent));
    gl.uniformMatrix3fv( gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMatrix));
    
    document.getElementById("shading").onclick = function(event) {
        shading = !(shading);
        draw_bump_init();
    };

    var btn = document.getElementById("startBtn");
    btn.onclick = function(event) {
        isAnimating = !isAnimating
        if(isAnimating) {
            btn.innerText = "Stop Animation";
        }
        else {
            btn.innerText = "Start Animation";
        }
    }

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    if(shading==false) {
        //diffuseProduct = vec4( 0.0, 0.0, 0.0, 0.0 );
        gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct));
        lightPosition[0] = 0;
        lightPosition[1] = 10;
        lightPosition[2] = 0;
    }
    else {
        gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct));
        lightPosition[0] = 5.5*Math.sin(0.01);
        lightPosition[1] = 2;
        lightPosition[2] = 5.5*Math.cos(0.01);
    }
    //
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
}

let draw_and_render = function() {
    draw_bump_init();
    requestAnimationFrame(drawSceneWithAnim);
    head.draw();
}

var n = 1;
var n1 = n;
function drawSceneWithAnim(time) {
    // console.log("draw scene called");
    time *= 0.0005;
  
    // update the local matrices for each object.
    if(!isAnimating) {
        n1=0;
    }
    
    rightUpperArm.xRotate(-n1);
    rightLowerArm.xRotate(-n1);
    leftUpperArm.xRotate(n1);
    leftLowerArm.xRotate(n1);
    rightUpperLeg.xRotate(-n1);
    rightLowerLeg.xRotate(-n1);
    leftUpperLeg.xRotate(n1);
    leftLowerLeg.xRotate(n1);
    head.draw();
  
    requestAnimationFrame(drawSceneWithAnim);
    if(n>=30) {
        if(n1>-30) {
            n1=n1-1;
        }
        else {
            n=-30;
        }
    }
    else {
        n1=n1+1;
    }
    n=n+1;
}

function saveBump() {
    var toSave = [];
    //console.log(objects[i]);
    var objects = [
        head,
        leftUpperArm,
        leftLowerArm,
        rightUpperArm,
        rightLowerArm,
        leftUpperLeg,
        leftLowerLeg,
        rightUpperLeg,
        rightLowerLeg,   
    ];    
    console.log(objects[0]);
    objects.forEach(obj => {
        let object = {
            "rotate": obj.rotate,
            "translation" : obj.translation,
            "scale" : obj.scale,
            //"children" : obj.children,
        }
        //console.log(object);
        toSave.push(object);
    });
    download(JSON.stringify(toSave, null, 4), 'data.json', 'text/plain');  
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function loadBump() {
    var file = document.getElementById('myfile').files[0];
    if(file == null) {
        window.confirm("File untuk diunggah belum dipilih!")
        return
    }

    //var model_1 = new Model_1();

    var reader = new FileReader()
    reader.onload = function() {
        var fileContent = JSON.parse(reader.result);
        var objects = [
            head,
            leftUpperArm,
            leftLowerArm,
            rightUpperArm,
            rightLowerArm,
            leftUpperLeg,
            leftLowerLeg,
            rightUpperLeg,
            rightLowerLeg,   
        ]; 
        for(let i=0; i<fileContent.length; i++) {
            //console.log(model_1[objects[i]]);
            var model = fileContent[i];
            console.log(model);
            objects[i].rotate = model.rotate;
            objects[i].translation = model.translation;
            objects[i].scale = model.scale;
        }
        draw_and_render();
    };
    reader.readAsText(file);
}

function displaySliders() {
    const headX = createDiv("head-x-rotation");

    createSlider(headX, "Head X Rotation ", 360, function () {
        head.xRotate(this.value);
    })

    const headY = createDiv("head-y-rotation");

    createSlider(headX, "Head Y Rotation ", 360, function () {
        head.yRotate(this.value);
    })

    const headZ = createDiv("head-z-rotation");

    createSlider(headZ, "Head Z Rotation ", 360, function () {
        head.zRotate(this.value);
    })

    const rightUpperLowerArmY = createDiv("right-upper-lower-Arm-y-rotation");

    createSlider(rightUpperLowerArmY, "Right Upper and Lower Arm Y Rotation ", 360, function () {
        rightUpperArm.yRotate(this.value);
        rightLowerArm.yRotate(this.value);
    })

    const leftUpperLowerArmY = createDiv("left-upper-lower-Arm-y-rotation");

    createSlider(leftUpperLowerArmY, "Left Lower and Arm Y Rotation ", 360, function () {
        leftUpperArm.yRotate(this.value);
        leftLowerArm.yRotate(this.value);
    })

    const rightUpperLowerLegY = createDiv("right-upper-lower-Leg-y-rotation");

    createSlider(rightUpperLowerLegY, "Right Upper and Lower Leg Y Rotation ", 360, function () {
        rightUpperLeg.yRotate(this.value);
        rightLowerLeg.yRotate(this.value);
    })

    const leftUpperLowerLegY = createDiv("left-upper-lower-Leg-y-rotation");

    createSlider(leftUpperLowerLegY, "Left Lower and Leg Y Rotation ", 360, function () {
        leftUpperLeg.yRotate(this.value);
        leftLowerLeg.yRotate(this.value);
    })

    const rightUpperLowerArmZ = createDiv("right-upper-lower-Arm-z-rotation");

    createSlider(rightUpperLowerArmZ, "Right Upper and Lower Arm Z Rotation ", 360, function () {
        rightUpperArm.zRotate(this.value);
        rightLowerArm.zRotate(this.value);
    })

    const leftUpperLowerArmZ = createDiv("left-upper-lower-Arm-z-rotation");

    createSlider(leftUpperLowerArmZ, "Left Lower and Arm Z Rotation ", 360, function () {
        leftUpperArm.zRotate(this.value);
        leftLowerArm.zRotate(this.value);
    })

    const rightUpperLowerLegZ = createDiv("right-upper-lower-Leg-z-rotation");

    createSlider(rightUpperLowerLegZ, "Right Upper and Lower Leg Z Rotation ", 360, function () {
        rightUpperLeg.zRotate(this.value);
        rightLowerLeg.zRotate(this.value);
    })

    const leftUpperLowerLegZ = createDiv("left-upper-lower-Leg-z-rotation");

    createSlider(leftUpperLowerLegZ, "Left Lower and Leg Z Rotation ", 360, function () {
        leftUpperLeg.zRotate(this.value);
        leftLowerLeg.zRotate(this.value);
    })
    
}
