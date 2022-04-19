function shadingSwitch() {
    var comp = document.getElementById("shading");
    if (comp.checked == true) {
        shading = true; // akses shading global variable
    } else {
        shading = false;
    }
    wholeBody.draw();
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