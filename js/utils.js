// functions
function resizeCanvasToDisplaySize(canvas, multiplier) {
    multiplier = multiplier || 1;
    const width  = canvas.clientWidth  * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width ||  canvas.height !== height) {
      canvas.width  = width;
      canvas.height = height;
      return true;
    }
    return false;
}

/**
 * Konversi rad -> deg
 * @param {number} r 
 * @returns {number}
 */
function radToDeg(r) {
    return r * 180 / Math.PI;
}

/**
 * Konversi deg -> rad
 * @param {number} d 
 * @returns {number}
 */
function degToRad(d) {
    return d * Math.PI / 180;
}

/**
 * Membuat sebuah garis 3D/ balok dari 2 buah titik input
 * @param {number} xa - x dari titik pertama
 * @param {number} ya - y dari titik pertama
 * @param {number} za - z dari titik pertama
 * @param {number} xb - x dari titik kedua
 * @param {number} yb - y dari titik kedua
 * @param {number} zb - z dari titik kedua
 * @param {number} rd - radius dari balok yang ingin dibangun
 * @returns {array} koordinat balok/model
 */
function generateBlock(xa, ya, za, xb, yb, zb, rd) {
    arr = []

    if (ya != yb) {
        if (ya < yb) {
        x1 = xa; y1 = ya; z1 = za;
        x2 = xb; y2 = yb; z2 = zb;
        } else if (ya > yb) {
        x2 = xa; y2 = ya; z2 = za;
        x1 = xb; y1 = yb; z1 = zb;
        }
        
        // kalo y nya sama ga bakal muncul
        arr = [
        // X, Y, Z
        // front
        x1-rd,  y1, z1-rd, //
        x2-rd,  y2, z2-rd, //
        x1+rd,  y1, z1-rd, //

        x2-rd,  y2, z2-rd, //
        x2+rd,  y2, z2-rd, //
        x1+rd,  y1, z1-rd, //

        // back
        x1-rd,  y1, z1+rd, //
        x1+rd,  y1, z1+rd, //
        x2-rd,  y2, z2+rd, //

        x2-rd,  y2, z2+rd, //
        x1+rd,  y1, z1+rd, //
        x2+rd,  y2, z2+rd, //

        // left
        x1-rd,  y1, z1-rd, // 
        x1-rd,  y1, z1+rd, // 
        x2-rd,  y2, z2+rd, // 

        x1-rd,  y1, z1-rd, // 
        x2-rd,  y2, z2+rd, // 
        x2-rd,  y2, z2-rd, // 

        // right
        x1+rd,  y1, z1-rd, // 
        x2+rd,  y2, z2+rd, // 
        x1+rd,  y1, z1+rd, // 

        x1+rd,  y1, z1-rd, // 
        x2+rd,  y2, z2-rd, // 
        x2+rd,  y2, z2+rd, // 

        // top
        x1-rd,  y1, z1+rd, //
        x1-rd,  y1, z1-rd, // 
        x1+rd,  y1, z1-rd, // 

        x1+rd,  y1, z1-rd, // 
        x1+rd,  y1, z1+rd, // 
        x1-rd,  y1, z1+rd, // 

        // bottom
        x2-rd,  y2, z2+rd, //
        x2+rd,  y2, z2-rd, // 
        x2-rd,  y2, z2-rd, // 

        x2+rd,  y2, z2-rd, // 
        x2-rd,  y2, z2+rd, // 
        x2+rd,  y2, z2+rd, // 
        ]
    } else if (xa != xb) {
        if (xa < xb) {
        x1 = xa; y1 = ya; z1 = za;
        x2 = xb; y2 = yb; z2 = zb;
        } else if (xa > xb) {
        x2 = xa; y2 = ya; z2 = za;
        x1 = xb; y1 = yb; z1 = zb;
        }
        
        // kalo x nya sama ga bakal muncul
        arr = [
        // X, Y, Z
        // front
        x1, y1+rd, z1-rd,
        x2, y2+rd, z2-rd,
        x2, y2-rd, z1-rd,

        x2, y2-rd, z1-rd,
        x1, y1-rd, z1-rd,
        x1, y1+rd, z1-rd,

        // back
        x1, y1+rd, z1+rd,
        x2, y2-rd, z1+rd,
        x2, y2+rd, z2+rd,

        x2, y2-rd, z1+rd,
        x1, y1+rd, z1+rd,
        x1, y1-rd, z1+rd,

        // left
        x1, y1+rd, z1+rd,
        x1, y1+rd, z1-rd,
        x1, y1-rd, z1-rd,

        x1, y1-rd, z1-rd,
        x1, y1-rd, z1+rd,
        x1, y1+rd, z1+rd,

        // right
        x2, y2+rd, z2+rd,
        x2, y2-rd, z2-rd,
        x2, y2+rd, z2-rd,

        x2, y2-rd, z2-rd,
        x2, y2+rd, z2+rd,
        x2, y2-rd, z2+rd,

        // top
        x1, y1+rd, z1-rd,
        x1, y1+rd, z1+rd,
        x2, y2+rd, z2+rd,

        x2, y2+rd, z2+rd,
        x2, y2+rd, z2-rd,
        x1, y1+rd, z1-rd,

        // bottom
        x1, y1-rd, z1-rd,
        x2, y2-rd, z2+rd,
        x1, y1-rd, z1+rd,

        x2, y2-rd, z2+rd,
        x1, y1-rd, z1-rd,
        x2, y2-rd, z2-rd,
        ]
    } else if (za != zb) {
        if (za < zb) {
        x1 = xa; y1 = ya; z1 = za;
        x2 = xb; y2 = yb; z2 = zb;
        } else if (za > zb) {
        x2 = xa; y2 = ya; z2 = za;
        x1 = xb; y1 = yb; z1 = zb;
        }
        
        // kalo z nya sama ga bakal muncul
        arr = [
        // X, Y, Z
        // front
        x1-rd, y1+rd, z1,
        x1+rd, y1+rd, z1,
        x1+rd, y1-rd, z1,

        x1+rd, y1-rd, z1,
        x1-rd, y1-rd, z1,
        x1-rd, y1+rd, z1,

        // back
        x2-rd, y2+rd, z2,
        x2+rd, y2-rd, z2,
        x2+rd, y2+rd, z2,

        x2+rd, y2-rd, z2,
        x2-rd, y2+rd, z2,
        x2-rd, y2-rd, z2,

        // left
        x1+rd, y1+rd, z1,
        x2+rd, y2-rd, z2,
        x1+rd, y1-rd, z1,

        x2+rd, y2-rd, z2,
        x1+rd, y1+rd, z1,
        x2+rd, y2+rd, z2,

        // right
        x1-rd, y1+rd, z1,
        x1-rd, y1-rd, z1,
        x2-rd, y2-rd, z2,

        x2-rd, y2-rd, z2,
        x2-rd, y2+rd, z2,
        x1-rd, y1+rd, z1,

        // top
        x1-rd, y1+rd, z1,
        x2+rd, y2+rd, z2,
        x1+rd, y1+rd, z1,

        x2+rd, y2+rd, z2,
        x1-rd, y1+rd, z1,
        x2-rd, y2+rd, z2,

        // bottom
        x1-rd, y1-rd, z1,
        x1+rd, y1-rd, z1,
        x2+rd, y2-rd, z2,

        x2+rd, y2-rd, z2,
        x2-rd, y2-rd, z2,
        x1-rd, y1-rd, z1,
        ]
    }

    return arr;
}

function generateCube(center_x, center_y, center_z,
    length, width=length, height=length) {
    // center: titik tengah balok
    // length: panjang sisi balok
    // width: lebar balok
    // height: tinggi balok

    var xNeg = center_x - length/2
    var yNeg = center_y - height/2
    var zNeg = center_z - width/2

    var xPos = center_x + length/2
    var yPos = center_y + height/2
    var zPos = center_z + width/2

    arr = [
        // X, Y, Z
        // front
        xNeg,  yNeg, zNeg, //
        xNeg,  yPos, zNeg, //
        xPos,  yNeg, zNeg, //

        xNeg,  yPos, zNeg, //
        xPos,  yPos, zNeg, //
        xPos,  yNeg, zNeg, //

        // back
        xNeg,  yNeg, zPos, //
        xPos,  yNeg, zPos, //
        xNeg,  yPos, zPos, //

        xNeg,  yPos, zPos, //
        xPos,  yNeg, zPos, //
        xPos,  yPos, zPos, //

        // left
        xNeg,  yNeg, zNeg, // 
        xNeg,  yNeg, zPos, // 
        xNeg,  yPos, zPos, // 

        xNeg,  yNeg, zNeg, // 
        xNeg,  yPos, zPos, // 
        xNeg,  yPos, zNeg, // 

        // right
        xPos,  yNeg, zNeg, // 
        xPos,  yPos, zPos, // 
        xPos,  yNeg, zPos, // 

        xPos,  yNeg, zNeg, // 
        xPos,  yPos, zNeg, // 
        xPos,  yPos, zPos, // 

        // top
        xNeg,  yNeg, zPos, //
        xNeg,  yNeg, zNeg, // 
        xPos,  yNeg, zNeg, // 

        xPos,  yNeg, zNeg, // 
        xPos,  yNeg, zPos, // 
        xNeg,  yNeg, zPos, // 

        // bottom
        xNeg,  yPos, zPos, //
        xPos,  yPos, zNeg, // 
        xNeg,  yPos, zNeg, // 

        xPos,  yPos, zNeg, // 
        xNeg,  yPos, zPos, // 
        xPos,  yPos, zPos, // 
    ]

    return arr
}

/**
 * Mengembalikan array yang merupakan
 * warna default untuk 6 sisi balok
 * @param {n} n - jumlah balok
 * @returns {array} array warna
 */
function generateColor(n) {
    arr = []

    for (let i=0; i<n; i++) {
        arr.push(...[    
        // 1
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        
        // 2
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

        // 3
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,

        // 4
        210, 200, 70,
        210, 200, 70,
        210, 200, 70,
        210, 200, 70,
        210, 200, 70,
        210, 200, 70,

        // 5
        100,  70, 150,
        100,  70, 150,
        100,  70, 150,
        100,  70, 150,
        100,  70, 150,
        100,  70, 150,

        // 6
        0,  70, 120,
        0,  70, 120,
        0,  70, 120,
        0,  70, 120,
        0,  70, 120,
        0,  70, 120,])
    }

    return arr;
}
  
  /*************************************************************/
  
  function centerRotation(matrix, center, sumbu, value) {
    // Start with identity matrix
    // Translate the matrix by -centre of the object
    var temp = m4.translate(matrix, 8, 8, 0)
  
    // // Rotate the matrix by the desired amount
    // switch (sumbu) {
    //   case "x":
    //     temp = m4.xRotate(temp, value)
    //     console.log("masuk x");
    //     break;
    //   case "y":
    //     temp = m4.yRotate(temp, value)
    //     break;
    //   case "z":
    //     temp = m4.zRotate(temp, value)
    //     break;
    // }
  
    // // Translate the matrix by centre of the object
    // temp = m4.translate(matrix, center[0], center[1], center[2])
  
    return temp;
  }
  
  /**
   * Memodelkan matriks 4 dimensi
   * beserta fungsi-fungsi yang dibutuhkan
   */
  var m4 = {

    identity: function() {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    },

    copy: function(src, dst) {
      dst = dst || new MatType(16);

      dst[ 0] = src[ 0];
      dst[ 1] = src[ 1];
      dst[ 2] = src[ 2];
      dst[ 3] = src[ 3];
      dst[ 4] = src[ 4];
      dst[ 5] = src[ 5];
      dst[ 6] = src[ 6];
      dst[ 7] = src[ 7];
      dst[ 8] = src[ 8];
      dst[ 9] = src[ 9];
      dst[10] = src[10];
      dst[11] = src[11];
      dst[12] = src[12];
      dst[13] = src[13];
      dst[14] = src[14];
      dst[15] = src[15];

      return dst;
    },
  
    projection: function(width, height, depth) {
      // Note: This matrix flips the Y axis so 0 is at the top.
      return [
         2 / width, 0, 0, 0,
         0, -2 / height, 0, 0,
         0, 0, 2 / depth, 0,
        -1, 1, 0, 1,
      ];
    },
  
    /**
     * Mengembalikan matriks
     * hasil perkalian 2 buah matriks
     * @param {matrix} a 
     * @param {matrix} b 
     * @returns {matrix}
     */
    multiply: function(a, b) {
      var a00 = a[0 * 4 + 0];
      var a01 = a[0 * 4 + 1];
      var a02 = a[0 * 4 + 2];
      var a03 = a[0 * 4 + 3];
      var a10 = a[1 * 4 + 0];
      var a11 = a[1 * 4 + 1];
      var a12 = a[1 * 4 + 2];
      var a13 = a[1 * 4 + 3];
      var a20 = a[2 * 4 + 0];
      var a21 = a[2 * 4 + 1];
      var a22 = a[2 * 4 + 2];
      var a23 = a[2 * 4 + 3];
      var a30 = a[3 * 4 + 0];
      var a31 = a[3 * 4 + 1];
      var a32 = a[3 * 4 + 2];
      var a33 = a[3 * 4 + 3];
      var b00 = b[0 * 4 + 0];
      var b01 = b[0 * 4 + 1];
      var b02 = b[0 * 4 + 2];
      var b03 = b[0 * 4 + 3];
      var b10 = b[1 * 4 + 0];
      var b11 = b[1 * 4 + 1];
      var b12 = b[1 * 4 + 2];
      var b13 = b[1 * 4 + 3];
      var b20 = b[2 * 4 + 0];
      var b21 = b[2 * 4 + 1];
      var b22 = b[2 * 4 + 2];
      var b23 = b[2 * 4 + 3];
      var b30 = b[3 * 4 + 0];
      var b31 = b[3 * 4 + 1];
      var b32 = b[3 * 4 + 2];
      var b33 = b[3 * 4 + 3];
      return [
        b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
        b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
        b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
        b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
        b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
        b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
        b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
        b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
        b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
        b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
        b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
        b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
        b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
        b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
        b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
        b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
      ];
    },
  
    /**
     * Mengembalikan matriks translasi
     * @param {number} tx 
     * @param {number} ty 
     * @param {number} tz 
     * @returns {matrix}
     */
    translation: function(tx, ty, tz) {
      return [
         1,  0,  0,  0,
         0,  1,  0,  0,
         0,  0,  1,  0,
         tx, ty, tz, 1,
      ];
    },
  
    /**
     * Mengembalikan matriks rotasi terhadap sumbu x
     * @param {number} angleInRadians 
     * @returns {matrix}
     */
    xRotation: function(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
  
      return [
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1,
      ];
    },
  
    /**
     * Mengembalikan matriks rotasi terhadap sumbu y
     * @param {number} angleInRadians 
     * @returns {matrix}
     */
    yRotation: function(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
  
      return [
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1,
      ];
    },
  
    /**
     * Mengembalikan matriks rotasi terhadap sumbu z
     * @param {number} angleInRadians 
     * @returns {matrix}
     */
    zRotation: function(angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
  
      return [
         c, s, 0, 0,
        -s, c, 0, 0,
         0, 0, 1, 0,
         0, 0, 0, 1,
      ];
    },
  
    /**
     * Mengembalikan matriks hasil scaling
     * @param {number} sx 
     * @param {number} sy 
     * @param {number} sz 
     * @returns {matrix}
     */
    scaling: function(sx, sy, sz) {
      return [
        sx, 0,  0,  0,
        0, sy,  0,  0,
        0,  0, sz,  0,
        0,  0,  0,  1,
      ];
    },

    normalize: function(v, dst) {
      dst = dst || new Float32Array(3);
      var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
      // make sure we don't divide by 0.
      if (length > 0.00001) {
        dst[0] = v[0] / length;
        dst[1] = v[1] / length;
        dst[2] = v[2] / length;
      }
      return dst;
    },

    inverse: function(m, dst) {
      dst = dst || new Float32Array(16);
      var m00 = m[0 * 4 + 0];
      var m01 = m[0 * 4 + 1];
      var m02 = m[0 * 4 + 2];
      var m03 = m[0 * 4 + 3];
      var m10 = m[1 * 4 + 0];
      var m11 = m[1 * 4 + 1];
      var m12 = m[1 * 4 + 2];
      var m13 = m[1 * 4 + 3];
      var m20 = m[2 * 4 + 0];
      var m21 = m[2 * 4 + 1];
      var m22 = m[2 * 4 + 2];
      var m23 = m[2 * 4 + 3];
      var m30 = m[3 * 4 + 0];
      var m31 = m[3 * 4 + 1];
      var m32 = m[3 * 4 + 2];
      var m33 = m[3 * 4 + 3];
      var tmp_0  = m22 * m33;
      var tmp_1  = m32 * m23;
      var tmp_2  = m12 * m33;
      var tmp_3  = m32 * m13;
      var tmp_4  = m12 * m23;
      var tmp_5  = m22 * m13;
      var tmp_6  = m02 * m33;
      var tmp_7  = m32 * m03;
      var tmp_8  = m02 * m23;
      var tmp_9  = m22 * m03;
      var tmp_10 = m02 * m13;
      var tmp_11 = m12 * m03;
      var tmp_12 = m20 * m31;
      var tmp_13 = m30 * m21;
      var tmp_14 = m10 * m31;
      var tmp_15 = m30 * m11;
      var tmp_16 = m10 * m21;
      var tmp_17 = m20 * m11;
      var tmp_18 = m00 * m31;
      var tmp_19 = m30 * m01;
      var tmp_20 = m00 * m21;
      var tmp_21 = m20 * m01;
      var tmp_22 = m00 * m11;
      var tmp_23 = m10 * m01;
  
      var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
          (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
      var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
          (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
      var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
          (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
      var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
          (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
  
      var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
  
      dst[0] = d * t0;
      dst[1] = d * t1;
      dst[2] = d * t2;
      dst[3] = d * t3;
      dst[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
      dst[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
      dst[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
      dst[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
      dst[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
      dst[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
      dst[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
      dst[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
      dst[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
      dst[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
      dst[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
      dst[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));
  
      return dst;
    },  

    transpose: function(m, dst) {
      dst = dst || new Float32Array(16);
  
      dst[ 0] = m[0];
      dst[ 1] = m[4];
      dst[ 2] = m[8];
      dst[ 3] = m[12];
      dst[ 4] = m[1];
      dst[ 5] = m[5];
      dst[ 6] = m[9];
      dst[ 7] = m[13];
      dst[ 8] = m[2];
      dst[ 9] = m[6];
      dst[10] = m[10];
      dst[11] = m[14];
      dst[12] = m[3];
      dst[13] = m[7];
      dst[14] = m[11];
      dst[15] = m[15];
  
      return dst;
    },

    perspective: function(fieldOfViewInRadians, aspect, near, far, dst) {
      dst = dst || new Float32Array(16);
      var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
      var rangeInv = 1.0 / (near - far);
  
      dst[ 0] = f / aspect;
      dst[ 1] = 0;
      dst[ 2] = 0;
      dst[ 3] = 0;
      dst[ 4] = 0;
      dst[ 5] = f;
      dst[ 6] = 0;
      dst[ 7] = 0;
      dst[ 8] = 0;
      dst[ 9] = 0;
      dst[10] = (near + far) * rangeInv;
      dst[11] = -1;
      dst[12] = 0;
      dst[13] = 0;
      dst[14] = near * far * rangeInv * 2;
      dst[15] = 0;
  
      return dst;
    },

    lookAt: function(cameraPosition, target, up, dst) {
      dst = dst || new Float32Array(16);
      var zAxis = m4.normalize(
          subtractVectors(cameraPosition, target));
      var xAxis = m4.normalize(cross(up, zAxis));
      var yAxis = m4.normalize(cross(zAxis, xAxis));
  
      dst[ 0] = xAxis[0];
      dst[ 1] = xAxis[1];
      dst[ 2] = xAxis[2];
      dst[ 3] = 0;
      dst[ 4] = yAxis[0];
      dst[ 5] = yAxis[1];
      dst[ 6] = yAxis[2];
      dst[ 7] = 0;
      dst[ 8] = zAxis[0];
      dst[ 9] = zAxis[1];
      dst[10] = zAxis[2];
      dst[11] = 0;
      dst[12] = cameraPosition[0];
      dst[13] = cameraPosition[1];
      dst[14] = cameraPosition[2];
      dst[15] = 1;
  
      return dst;
    },
  
    translate: function(m, tx, ty, tz) {
      return m4.multiply(m, m4.translation(tx, ty, tz));
    },
  
    xRotate: function(m, angleInRadians) {
      return m4.multiply(m, m4.xRotation(angleInRadians));
    },
  
    yRotate: function(m, angleInRadians) {
      return m4.multiply(m, m4.yRotation(angleInRadians));
    },
  
    zRotate: function(m, angleInRadians) {
      return m4.multiply(m, m4.zRotation(angleInRadians));
    },
  
    scale: function(m, sx, sy, sz) {
      return m4.multiply(m, m4.scaling(sx, sy, sz));
    },
  
  };

  /**
   * subtracts 2 vectors3s
   * @param {Vector3} a a
   * @param {Vector3} b b
   * @param {Vector3} dst optional vector3 to store result
   * @return {Vector3} dst or new Vector3 if not provided
   * @memberOf module:webgl-3d-math
   */
   function subtractVectors(a, b, dst) {
    dst = dst || new Float32Array(3);
    dst[0] = a[0] - b[0];
    dst[1] = a[1] - b[1];
    dst[2] = a[2] - b[2];
    return dst;
  }

  // /**
  //  * Computes the cross product of 2 vectors3s
  //  * @param {Vector3} a a
  //  * @param {Vector3} b b
  //  * @param {Vector3} dst optional vector3 to store result
  //  * @return {Vector3} dst or new Vector3 if not provided
  //  * @memberOf module:webgl-3d-math
  //  */
  //  function cross(a, b, dst) {
  //   dst = dst || new Float32Array(3);
  //   dst[0] = a[1] * b[2] - a[2] * b[1];
  //   dst[1] = a[2] * b[0] - a[0] * b[2];
  //   dst[2] = a[0] * b[1] - a[1] * b[0];
  //   return dst;
  // }