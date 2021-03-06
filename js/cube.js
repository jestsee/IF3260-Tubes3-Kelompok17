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
            
            type = 0
        } = {}
    ) {
        this.center = center;
        this.length = length;
        this.width = width;
        this.height = height;
        // this.withColor = withColor;
        
        this.position = this.generatePosition();
        this.rotate = rotate;
        this.translation = translation;
        this.scale = scale;

        this.type = type;
        
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
            // console.log("masuk else " + this.name);
            m4.copy(this.localMatrix, this.worldMatrix);
        }
      
        // now process all the children
        var worldMatrix = this.worldMatrix;
        this.children.forEach(function(child) {
            child.updateWorldMatrix(worldMatrix);
        });
    }

    moveCenterToUpmost() {
        this.center = [canvas.width/2, canvas.height/2 - this.length/2, 0]
    }

    iterateDraw() {
        var projMatrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 800);
        var matrix = m4.multiply(projMatrix, this.worldMatrix)

        // console.log(shading);

        switch (this.type) {
            case 0: // model berwarna biasa
                draw(this.position, matrix, true, shading);
                break;
            case 1: // model tidak berwarna/transparan (buat joint)
                draw(this.position, matrix, false, shading);
                break;  
            case 2: // model dengan image mapping
                // console.log("masuk case 2");
                drawTexImage(this.position, matrix, true);
                break;
            case 3:
                draw_bump(this.rotate, this.translation, this.scale);
                break;
        }

        // draw(this.position, matrix, this.withColor);

        if (this.children.length != 0) {
            this.children.forEach(function(child) {
                child.iterateDraw();
            });
        }
    }

    draw() {
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
}