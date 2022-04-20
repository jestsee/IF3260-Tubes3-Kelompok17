class Model_1 {
    constructor() {
        // head, neck, torso
        this.head = new Cube({scale:[1,1,0.7], type:2});
        this.neck = new Cube({scale:[0.5,0.5,0.5], type:2});
        this.torso = new Cube({scale:[1.5,2,1], type:2});

        this.wholeBody = new Cube({translation:[0,0,0], type:1});
        this.neckJoint = new Cube({translation:[0,-130,0], type:1});
        this.headJoint = new Cube({translation:[0,-80,0], type:1});

        // arms
        this.leftUpperArm = new Cube({scale:[0.4, 1.2, 0.4], type:2})
        this.leftLowerArm = new Cube({scale:[0.4, 1.2, 0.4], type:2})
        this.rightUpperArm = new Cube({scale:[0.4, 1.2, 0.4], type:2})
        this.rightLowerArm = new Cube({scale:[0.4, 1.2, 0.4], type:2})

        this.leftUpperArmJoint = new Cube({translation:[-100,-20,0], type:1});
        this.leftLowerArmJoint = new Cube({translation:[0,125,0], type:1});
        this.rightUpperArmJoint = new Cube({translation:[100,-20,0], type:1});
        this.rightLowerArmJoint = new Cube({translation:[0,125,0], type:1});

        // legs
        this.leftUpperLeg = new Cube({scale:[0.6, 1.6, 0.6], type:2}) // pake celana ceritanya
        this.leftLowerLeg = new Cube({scale:[0.5, 1.8, 0.5], type:2})
        this.rightUpperLeg = new Cube({scale:[0.6, 1.6, 0.6], type:2})
        this.rightLowerLeg = new Cube({scale:[0.5, 1.8, 0.5], type:2})

        this.leftUpperLegJoint = new Cube({translation:[-35,185,0], type:1});
        this.leftLowerLegJoint = new Cube({translation:[0,175,0], type:1});
        this.rightUpperLegJoint = new Cube({translation:[35,185,0], type:1});
        this.rightLowerLegJoint = new Cube({translation:[0,175,0], type:1});

        this.objects = [];
    }

    setup() {
        this.leftUpperArmJoint.moveCenterToUpmost();
        this.leftLowerArmJoint.moveCenterToUpmost();
        this.rightUpperArmJoint.moveCenterToUpmost();
        this.rightLowerArmJoint.moveCenterToUpmost();

        this.leftUpperLegJoint.moveCenterToUpmost();
        this.leftLowerLegJoint.moveCenterToUpmost();
        this.rightUpperLegJoint.moveCenterToUpmost();
        this.rightLowerLegJoint.moveCenterToUpmost();

        // set parent
        this.torso.setParent(this.wholeBody);
        this.neckJoint.setParent(this.wholeBody);
        this.neck.setParent(this.neckJoint);
        this.headJoint.setParent(this.neckJoint);
        this.head.setParent(this.headJoint);

        this.leftUpperArmJoint.setParent(this.wholeBody);
        this.leftUpperArm.setParent(this.leftUpperArmJoint);
        this.leftLowerArmJoint.setParent(this.leftUpperArmJoint);
        this.leftLowerArm.setParent(this.leftLowerArmJoint);

        this.rightUpperArmJoint.setParent(this.wholeBody);
        this.rightUpperArm.setParent(this.rightUpperArmJoint);
        this.rightLowerArmJoint.setParent(this.rightUpperArmJoint);
        this.rightLowerArm.setParent(this.rightLowerArmJoint);

        this.leftUpperLegJoint.setParent(this.wholeBody);
        this.leftUpperLeg.setParent(this.leftUpperLegJoint);
        this.leftLowerLegJoint.setParent(this.leftUpperLegJoint);
        this.leftLowerLeg.setParent(this.leftLowerLegJoint);

        this.rightUpperLegJoint.setParent(this.wholeBody);
        this.rightUpperLeg.setParent(this.rightUpperLegJoint);
        this.rightLowerLegJoint.setParent(this.rightUpperLegJoint);
        this.rightLowerLeg.setParent(this.rightLowerLegJoint);

        this.objects = [
            this.torso, this.head, this.neck, 
            this.headJoint, this.wholeBody, this.neckJoint,
        
            this.leftUpperArm, this.leftUpperArmJoint,
            this.leftLowerArm, this.leftLowerArmJoint,
            this.rightUpperArm, this.rightUpperArmJoint,
            this.rightLowerArm, this.rightLowerArmJoint,
        
            this.leftUpperLeg, this.leftUpperLegJoint,
            this.leftLowerLeg, this.leftLowerLegJoint,
            this.rightUpperLeg, this.rightUpperLegJoint,
            this.rightLowerLeg, this.rightLowerLegJoint,
        ];
    }

    draw() {
        this.objects.forEach(obj => {
            obj.localMatrix = obj.generateMatrix();
        });
        this.wholeBody.draw();
    }

    displaySliders() {
        // ----------------------- neck -----------------------
        const neckY = createDiv("neck-y-rotation");

        createSlider(neckY, "Neck Rotation ", 360, function () {
            model_1.neckJoint.yRotate(this.value);
            model_1.draw();
        })

        // ----------------------- arms -----------------------
        const upperArmZ = createDiv("upper-arm-z-rotation");

        createSlider(upperArmZ, "Left Upper Arm Z Rotation ", 180, function () {
            model_1.leftUpperArmJoint.zRotate(this.value);
            model_1.draw();
        })

        createSlider(upperArmZ, "Right Upper Arm Z Rotation ", 180, function () {
            model_1.rightUpperArmJoint.zRotate(-this.value);
            model_1.draw();
        })

        const upperArmX = createDiv("upper-arm-x-rotation");

        createSlider(upperArmX, "Left Upper Arm X Rotation ", 360, function () {
            model_1.leftUpperArmJoint.xRotate(-this.value);
            model_1.draw();
        })

        createSlider(upperArmX, "Right Upper Arm X Rotation ", 360, function () {
            model_1.rightUpperArmJoint.xRotate(-this.value);
            model_1.draw();
        })

        const lowerArmZ = createDiv("lower-arm-z-rotation");

        createSlider(lowerArmZ, "Left Lower Arm Z Rotation ", 90, function () {
            model_1.leftLowerArmJoint.zRotate(this.value);
            model_1.draw();
        })

        createSlider(lowerArmZ, "Right Lower Arm Z Rotation ", 90, function () {
            model_1.rightLowerArmJoint.zRotate(-this.value);
            model_1.draw();
        })

        const lowerArmX = createDiv("lower-arm-x-rotation");

        createSlider(lowerArmX, "Left Lower Arm X Rotation ", 90, function () {
            model_1.leftLowerArmJoint.xRotate(-this.value);
            model_1.draw();
        }, -90)

        createSlider(lowerArmX, "Right Lower Arm X Rotation ", 90, function () {
            model_1.rightLowerArmJoint.xRotate(-this.value);
            model_1.draw();
        }, -90)

        // ----------------------- legs -----------------------
        const upperLegZ = createDiv("upper-Leg-z-rotation");

        createSlider(upperLegZ, "Left Upper Leg Z Rotation ", 90, function () {
            model_1.leftUpperLegJoint.zRotate(this.value);
            model_1.draw();
        })

        createSlider(upperLegZ, "Right Upper Leg Z Rotation ", 90, function () {
            model_1.rightUpperLegJoint.zRotate(-this.value);
            model_1.draw();
        })

        const upperLegX = createDiv("upper-Leg-x-rotation");

        createSlider(upperLegX, "Left Upper Leg X Rotation ", 90, function () {
            model_1.leftUpperLegJoint.xRotate(-this.value);
            model_1.draw();
        }, -90)

        createSlider(upperLegX, "Right Upper Leg X Rotation ", 90, function () {
            model_1.rightUpperLegJoint.xRotate(-this.value);
            model_1.draw();
        }, -90)

        const lowerLegZ = createDiv("lower-Leg-z-rotation");

        createSlider(lowerLegZ, "Left Lower Leg Z Rotation ", 90, function () {
            model_1.leftLowerLegJoint.zRotate(this.value);
            model_1.draw();
        })

        createSlider(lowerLegZ, "Right Lower Leg Z Rotation ", 90, function () {
            model_1.rightLowerLegJoint.zRotate(-this.value);
            model_1.draw();
        })

        const lowerLegX = createDiv("lower-Leg-x-rotation");

        createSlider(lowerLegX, "Left Lower Leg X Rotation ", 90, function () {
            model_1.leftLowerLegJoint.xRotate(-this.value);
            model_1.draw();
        }, -90)

        createSlider(lowerLegX, "Right Lower Leg X Rotation ", 90, function () {
            model_1.rightLowerLegJoint.xRotate(-this.value);
            model_1.draw();
        }, -90)
    }
}