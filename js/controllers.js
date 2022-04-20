function shadingSwitch() {
    var comp = document.getElementById("shading");
    if (comp.checked == true) {
        shading = true; // akses shading global variable
    } else {
        shading = false;
    }
    model_1.wholeBody.draw();
}

function save() {
    model_1.save();
}

function load() {
    var file = document.getElementById('myfile').files[0];
    if(file == null) {
        window.confirm("File untuk diunggah belum dipilih!")
        return
    }

    //var model_1 = new Model_1();

    var reader = new FileReader()
    reader.onload = function() {
        var model_1 = new Model_1();
        console.log(model_1);
        var fileContent = JSON.parse(reader.result);
        objects = [
            "torso", "head", "neck",
            "headJoint", "wholeBody", "neckJoint",
        
            "leftUpperArm", "leftUpperArmJoint",
            "leftLowerArm", "leftLowerArmJoint",
            "rightUpperArm", "rightUpperArmJoint",
            "rightLowerArm", "rightLowerArmJoint",

            "leftUpperLeg", "leftUpperLegJoint",
            "leftLowerLeg", "leftLowerLegJoint",
            "rightUpperLeg", "rightUpperLegJoint",
            "rightLowerLeg", "rightLowerLegJoint",
        ];
        for(let i=0; i<fileContent.length; i++) {
            console.log(model_1[objects[i]]);
            model = fileContent[i];
            //model_1.objects[i].rotate = model.rotate;
            model_1[objects[i]].rotate = model.rotate;
            model_1[objects[i]].translation = model.translation;
            model_1[objects[i]].scale = model.scale;
        }
        model_1.setup();
        model_1.draw();
    };
    reader.readAsText(file);
    
    window.onload = function() {
      model_1.displaySliders();
    }
}

function startAnimation() {
    var btn = document.getElementById('startBtn');

    if(!isAnimating) {
        isAnimating = true;
        drawSceneWithAnim();
        btn.innerText = "Stop Animation";
    } else if (isAnimating) {
        isAnimating = false;
        btn.innerText = "Start Animation";
    }
}

function clearSliderContainer() {
    var container = document.getElementById("sliders");
    container.textContent = '';
}

function createSlider(div, label, max, callback, min = 0) {
    // const container = document.getElementById("sliders");
    const sliderLabel = document.createElement('label');
    const sliderSlider = document.createElement('input');
    sliderLabel.innerHTML = label;
    sliderSlider.type = 'range';
    sliderSlider.value = 0;
    sliderSlider.min = min;
    sliderSlider.max = max;
    sliderSlider.step = 0.5;
    
    sliderSlider.oninput = callback;
  
    div.appendChild(sliderLabel);
    div.appendChild(sliderSlider);
  }
  
  function createDiv(id) {
    const container = document.getElementById("sliders");
    const div = document.createElement('div');
    div.id = id
    
    container.appendChild(div);
    return div;
  }