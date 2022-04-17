class Cube {
    constructor (
        {
            center = [canvas.width/2, canvas.height/2, 0],
            length = 100,
            width = length,
            height = length,
            rotate = [0, 0, 0],
            translation = [0, 0, 0],
            scale = [1, 1, 1],
            withColor = true
        } = {}
    ) {
        this.center = center;
        this.length = length;
        this.width = width;
        this.height = height;
        this.withColor = withColor;
        
        this.position = this.generatePosition();
        this.rotate = rotate;
        this.translation = translation;
        this.scale = scale;
        
        // node properties
        this.localMatrix = this.generateMatrix();
        this.worldMatrix = m4.identity();
        this.children = [];
    }

    generatePosition() {
        return generateCube(
            this.center[0], this.center[1], this.center[2],
            this.length, this.width, this.height
        )
    }

    generateMatrix(matrix) {
        // var matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 800);
        matrix = matrix || m4.identity();
        // var matrix = new Array(16);
        
        // untuk rotasi di titik pusat
        matrix = m4.translate(matrix, this.translation[0], this.translation[1], this.translation[2]);
        matrix = m4.translate(matrix, this.center[0], this.center[1], this.center[2]);
        matrix = m4.scale(matrix, this.scale[0], this.scale[1], this.scale[2]); // harusnya diakhir
        matrix = m4.xRotate(matrix, degToRad(this.rotate[0]));
        matrix = m4.yRotate(matrix, degToRad(this.rotate[1]));
        matrix = m4.zRotate(matrix, degToRad(this.rotate[2]));
        matrix = m4.translate(matrix, -this.center[0], -this.center[1], -this.center[2]);

        // ----------------------------------------------------------------------------

        // rotasi bukan di titik pusat (translate - rotate- scale)
        // var translation = this.translation;
        // var rotation = [degToRad(this.rotate[0]), degToRad(this.rotate[1]), degToRad(this.rotate[2])];
        // var scale = this.scale;

        // matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
        // matrix = m4.xRotate(matrix, rotation[0]);
        // matrix = m4.yRotate(matrix, rotation[1]);
        // matrix = m4.zRotate(matrix, rotation[2]);
        // matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

        return matrix
    }

    setParent(parent) {
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
    }

    updateWorldMatrix(parentWorldMatrix) {
        if (parentWorldMatrix) {
            // a matrix was passed in so do the math
            this.worldMatrix = m4.multiply(parentWorldMatrix, this.localMatrix);
        } else {
            // no matrix was passed in so just copy local to world
            console.log("masuk else " + this.name);
            m4.copy(this.localMatrix, this.worldMatrix);
        }
      
        // now process all the children
        var worldMatrix = this.worldMatrix;
        this.children.forEach(function(child) {
            child.updateWorldMatrix(worldMatrix);
        });
    }

    iterateDraw() {
        // console.log(this.worldMatrix);
        // console.log(this.localMatrix);

        var projMatrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 800);
        var matrix = m4.multiply(projMatrix, this.worldMatrix)
        draw(this.position, matrix, this.withColor);

        if (this.children.length != 0) {
            this.children.forEach(function(child) {
                child.iterateDraw();
            });
        }
    }

    draw() {
        // this.localMatrix = this.generateMatrix()
        // draw(this.position, this.localMatrix) // TODO pake worldMatrix harusnya

        this.updateWorldMatrix();
        this.iterateDraw();
    }

    xRotate(n) {
        this.rotate[0] = n
    }

    yRotate(n) {
        this.rotate[1] = n
    }

    zRotate(n) {
        this.rotate[2] = n
    }

    xTranslation(n) {
        this.translation[0] = n
    }

    yTranslation(n) {
        this.translation[1] = n
    }

    zTranslation(n) {
        this.translation[2] = n
    }

    xScale(n) {
        this.scale[0] = n
    }

    yScale(n) {
        this.scale[1] = n
    }

    zScale(n) {
        this.scale[2] = n
    }

    setInitialSliderValue() {
        var rx = document.getElementById('xrotation')
        rx.value = this.rotate[0]

        var ry = document.getElementById('yrotation')
        ry.value = this.rotate[1]

        var rz = document.getElementById('zrotation')
        rz.value = this.rotate[2]

        var tx = document.getElementById('xtranslation')
        tx.value = this.translation[0]

        var ty = document.getElementById('ytranslation')
        ty.value = this.translation[1]

        var tz = document.getElementById('ztranslation')
        tz.value = this.translation[2]

        var sx = document.getElementById('xscale')
        sx.value = this.scale[0]

        var sy = document.getElementById('yscale')
        sy.value = this.scale[1]

        var sz = document.getElementById('zscale')
        sz.value = this.scale[2]
    }
}