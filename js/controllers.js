function shadingSwitch() {
    var comp = document.getElementById("shading");
    if (comp.checked == true) {
        shading = true; // akses shading global variable
    } else {
        shading = false;
    }
    wholeBody.draw();
}