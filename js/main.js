// global variable
shading = false;
isAnimating = false;

var model_1 = new Model_1();

model_1.setup();
model_1.draw();

window.onload = function() {
  model_1.displaySliders();
}

let n = 1;

function drawSceneWithAnim(time) {
    // console.log("draw scene called");
    time *= 0.0005;
  
    // update the local matrices for each object.
    model_1.wholeBody.zRotate(n);
    model_1.wholeBody.yRotate(n);

    model_1.leftUpperArmJoint.xRotate(n);
    // model_1.leftLowerArmJoint.zRotate(n);
    model_1.rightUpperArmJoint.xRotate(n);

    model_1.leftUpperLegJoint.xRotate(n);
    model_1.rightUpperLegJoint.xRotate(n);

    model_1.objects.forEach(obj => {
        obj.localMatrix = obj.generateMatrix();
    });

    // TODO 
    // properti dari model lain yang mau 
    // dianimasiin bisa taroh disini
  
    model_1.wholeBody.draw();
    
    if (isAnimating) {
        requestAnimationFrame(drawSceneWithAnim);
        n+=1;
    }
    // console.log(n);
}