let projectionMatrix;
let modelViewMatrix;

let instanceMatrix;

let modelViewMatrixLoc;
let normalViewMatrixLoc;

let pointsArray = [];
let normalsArray = [];

function scale4(a, b, c) {
  let result = mat4();
  result[0][0] = a;
  result[1][1] = b;
  result[2][2] = c;
  return result;
}

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

function cube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

function quad(a, b, c, d) {
  let t1 = subtract(vertices[b], vertices[a]);
  let t2 = subtract(vertices[c], vertices[a]);
  let normal = cross(t1, t2);
  normal[3] = 0.0;

  pointsArray.push(vertices[a]);
  normalsArray.push(normal);

  pointsArray.push(vertices[b]);
  normalsArray.push(normal);

  pointsArray.push(vertices[c]);
  normalsArray.push(normal);

  pointsArray.push(vertices[a]);
  normalsArray.push(normal);

  pointsArray.push(vertices[c]);
  normalsArray.push(normal);

  pointsArray.push(vertices[d]);
  normalsArray.push(normal);
}

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

function initObject() {
  head = new Cube({scale:[2,2,1],translation:[0,0,0],type:3});
  rightUpperArm = new Cube({scale:[0.4, 1, 0.2], translation:[1.5,-0.5,0],type:1})
  rightUpperArm.xRotate(-90);
  leftUpperArm = new Cube({scale:[0.4, 1, 0.2], translation:[-1.5,-0.5,0], type:1})
  leftUpperArm.xRotate(-90);
  rightLowerArm = new Cube({scale:[0.5, 0.5, 0.2], translation:[1.5,-1.3,0], type:1})
  rightLowerArm.xRotate(-90);
  leftLowerArm = new Cube({scale:[0.5, 0.5, 0.2], translation:[-1.5,-1.3,0], type:1})
  leftLowerArm.xRotate(-90);
  rightUpperLeg = new Cube({scale:[0.4, 1, 0.2], translation:[0.5,-1.6,0], type:1})
  leftUpperLeg = new Cube({scale:[0.4, 1, 0.2], translation:[-0.5,-1.6,0], type:1})
  rightLowerLeg = new Cube({scale:[0.4, 0.5, 0.2], translation:[0.5,-2.5,0], type:1})
  leftLowerLeg = new Cube({scale:[0.4, 0.5, 0.2], translation:[-0.5,-2.5,0], type:1})

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

function drawEnv() {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST);

  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  instanceMatrix = mat4();

  cube();

  var zoomValue = 1;

  projectionMatrix = ortho(-10.0 * zoomValue, 10.0 * zoomValue, -10.0 * zoomValue, 10.0 * zoomValue, -30.0, 100.0);
  modelViewMatrix = mat4();

  gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));
  gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
  normalViewMatrixLoc = gl.getUniformLocation(program, "normalMatrix");

  let nBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

  let vNormal = gl.getAttribLocation(program, "vNormal");
  gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNormal);

  let vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  let vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  head.draw();
  requestAnimFrame(drawEnv);
}

window.onload = function() {
  initObject()
  drawEnv()
}