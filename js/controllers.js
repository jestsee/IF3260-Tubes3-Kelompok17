function shadingSwitch() {
    var comp = document.getElementById("shading");
    if (comp.checked == true) {
        shading = true; // akses shading global variable
    } else {
        shading = false;
    }
    model_1.wholeBody.draw();
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