function selectObject() {
    var i = document.getElementById('object-list').value
    states.selectedObj = states.objects[i]
    states.selectedObj.setInitialSliderValue()
    console.log(states.selectedObj.name);
}

function xRotation() {
    var slider = document.getElementById("xrotation");
    var val = document.getElementById("x-val-rot");
    val.innerHTML = slider.value;
    states.selectedObj.xRotate(slider.value);
    states.drawAll()
}

function yRotation() {
    var slider = document.getElementById("yrotation");
    var val = document.getElementById("y-val-rot");
    val.innerHTML = slider.value;
    states.selectedObj.yRotate(slider.value);
    states.drawAll()
}

function zRotation() {
    var slider = document.getElementById("zrotation");
    var val = document.getElementById("z-val-rot");
    val.innerHTML = slider.value;
    states.selectedObj.zRotate(slider.value);
    states.drawAll()
}

function xTranslation() {
    var slider = document.getElementById("xtranslation");
    var val = document.getElementById("x-val-trans");
    val.innerHTML = slider.value;
    states.selectedObj.xTranslation(slider.value);
    states.drawAll()
}

function yTranslation() {
    var slider = document.getElementById("ytranslation");
    var val = document.getElementById("y-val-trans");
    val.innerHTML = slider.value;
    states.selectedObj.yTranslation(slider.value);
    states.drawAll()
}

function zTranslation() {
    var slider = document.getElementById("ztranslation");
    var val = document.getElementById("z-val-trans");
    val.innerHTML = slider.value;
    states.selectedObj.zTranslation(slider.value);
    states.drawAll()
}

function xScale() {
    var slider = document.getElementById("xscale");
    var val = document.getElementById("x-val-scale");
    val.innerHTML = slider.value/100;
    states.selectedObj.xScale(slider.value/100);
    states.drawAll()
}

function yScale() {
    var slider = document.getElementById("yscale");
    var val = document.getElementById("y-val-scale");
    val.innerHTML = slider.value/100;
    states.selectedObj.yScale(slider.value/100);
    states.drawAll()
}

function zScale() {
    var slider = document.getElementById("zscale");
    var val = document.getElementById("z-val-scale");
    val.innerHTML = slider.value/100;
    states.selectedObj.zScale(slider.value/100);
    states.drawAll()
}