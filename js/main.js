"use strict";

// node structure
var Node = function(source) { // source diisi sama transform matrix
    this.children = [];
    this.position = [];
    this.localMatrix = m4.identity();
    this.worldMatrix = m4.identity();
    this.source = source;
    this.name = "";
};

Node.prototype.setParent = function(parent) {
    // remove us from our parent
    if (this.parent) {
      var ndx = this.parent.children.indexOf(this);
      if (ndx >= 0) {
        this.parent.children.splice(ndx, 1);
      }
    }

    // Add us to our new parent
    if (parent) {
      parent.children.push(this);
    }
    this.parent = parent;
};

Node.prototype.updateWorldMatrix = function(parentWorldMatrix) {

    // var source = this.source;
    // if (source) {
    //   source.getMatrix(this.localMatrix);
    // }

    if (parentWorldMatrix) {
      // a matrix was passed in so do the math
      this.worldMatrix = m4.multiply(parentWorldMatrix, this.localMatrix);
    } else {
      // no matrix was passed in so just copy local to world
      m4.copy(this.localMatrix, this.worldMatrix);
    }

    // now process all the children
    var worldMatrix = this.worldMatrix;
    this.children.forEach(function(child) {
      child.updateWorldMatrix(worldMatrix);
    });
};

// ------------------------------------------------

// create object
var cube = new Cube();
//console.log(cube.position);

var head = new Cube({translation:[0,-200,0]});
var neck = new Cube({translation:[0,-120,0], scale:[0.5,0.5,1]});
var torso = new Cube({translation:[0,10,0], scale:[1.5,2,1]});

var leftUpperArm = new Cube({translation:[-100,-20,0], scale:[0.4, 1.2, 0]})
var leftLowerArm = new Cube({translation:[-100,105,0], scale:[0.4, 1.2, 0]})
var rightUpperArm = new Cube({translation:[100,-20,0], scale:[0.4, 1.2, 0]})
var rightLowerArm = new Cube({translation:[100,105,0], scale:[0.4, 1.2, 0]})

var leftUpperLeg = new Cube({translation:[-35,195,0], scale:[0.6, 1.6, 0]})
var leftLowerLeg = new Cube({translation:[-35,370,0], scale:[0.5, 1.8, 0]})
var rightUpperLeg = new Cube({translation:[35,195,0], scale:[0.6, 1.6, 0]})
var rightLowerLeg = new Cube({translation:[35,370,0], scale:[0.5, 1.8, 0]})

// ------------------------------------------------

// create hierarchy model
// var objectsToDraw = [];
// var objects = [];
// var nodeInfosByName = {};

var headNode = new Node();
headNode.localMatrix = head.matrix;
headNode.position = head.position;
headNode.name = "HEAD";

var neckNode = new Node();
neckNode.localMatrix = neck.matrix;
neckNode.position = neck.position;
neckNode.name = "NECK";

var torsoNode = new Node(); // jadi center ntar
torsoNode.localMatrix = torso.matrix;
torsoNode.position = torso.position;
torsoNode.name = "TORSO"

// coba connect head neck torso dulu
headNode.setParent(neckNode);
neckNode.setParent(torsoNode);

var objectsNode = [headNode, neckNode, torsoNode];
var objects = [head, neck, torso];

// ------------------------------------------------

requestAnimationFrame(drawScene);

function drawScene(time) {
  // console.log("draw scene called");
  time *= 0.0005;

  // update the local matrices for each object.
  headNode.localMatrix = m4.multiply(m4.xRotation(0.01), headNode.localMatrix);
  neckNode.localMatrix = m4.multiply(m4.xRotation(0.01), neckNode.localMatrix);
  torsoNode.localMatrix = m4.multiply(m4.xRotation(0.01), torsoNode.localMatrix);
  // torsoNode.localMatrix = m4.multiply(m4.zRotation(0.01), torsoNode.localMatrix);

  // Update all world matrices in the scene graph
  torsoNode.updateWorldMatrix();

  // iterasi mulai dari torso
  iterateDraw(torsoNode);

  requestAnimationFrame(drawScene);
}

function iterateDraw(object) {
  console.log(object.children);

  var iterate = true
  if (object.children.length == 0) {
    iterate = false
  }

  draw(object.position, object.localMatrix)

  if(iterate) {
    object.children.forEach(child => {
      iterateDraw(child);
    });
  }
}

// ------------------------------------------------

// // create new states
// var states = new States();

// // add pyramid object to states
// states.addObject(head);
// states.addObject(neck);
// states.addObject(torso);
// states.addObject(leftUpperArm);
// states.addObject(leftLowerArm);
// states.addObject(rightUpperArm);
// states.addObject(rightLowerArm);
// states.addObject(leftUpperLeg);
// states.addObject(leftLowerLeg);
// states.addObject(rightUpperLeg);
// states.addObject(rightLowerLeg);

// // select first object as default selected object
// states.selectedObj = states.objects[0]

// // draw all object
// states.drawAll();

// window.onload = function() {
//     states.showSelectableObjects();
//     var currentObj = states.selectedObj;
//     currentObj.setInitialSliderValue();
// }

// ------------------------------------------------