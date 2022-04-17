/*** SETUP CANVAS  ***/
var canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 800;
document.body.appendChild(canvas);

var gl = canvas.getContext("webgl");
if (!gl) {
    alert("Unable to setup WebGL. Your browser or computer may not support it");
}

// canvas color
canvas.style.background = "#faf3e1";
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);