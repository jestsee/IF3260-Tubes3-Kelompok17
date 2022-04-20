/**
 * State class
 * menyimpan semua objek yang ada dalam array of object
 * menyimpan objek yang sedang dipilih
 */
 class States {

    constructor() {
        this.objects = []; // simpan array of object vertices
        this.selectedObj = null;
    }

    /**
     * menggambar semua objek yang tersimpan
     * objek yang tersimpan memiliki method
     * drawObj untuk dipanggil
     */
    drawAll() {
        for (let i=0; i < this.objects.length; i++) {
            this.objects[i].draw()
        }
    }

    /**
     * 
     * @param {object} object - menyimpan objek baru
     * menambahkan objek baru ke array of object 
     */
    addObject(object) {
        this.objects.push(object);
    }

    showSelectableObjects() {
        var select = document.getElementById('object-list')
        for (let i=0; i<this.objects.length; i++) {
            var opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = i;
            select.appendChild(opt);
        }
    }

    // saveState() {
    //     var toSave = [];
    //     for (let i=0; i < this.objects.length; i++) {
    //         let object = {
    //             "name" : this.objects[i].name,
    //             "center" : this.objects[i].center,
    //             "position" : this.objects[i].position,
    //             "rotate" : this.objects[i].rotate,
    //             "translation" : this.objects[i].translation,
    //             "scale" : this.objects[i].scale,
    //             "fov": this.objects[i].fieldOfView,
    //         }
    //         toSave.push(object)
    //     }
    //     console.log(JSON.stringify(toSave, null, 4));
    //     this.download(JSON.stringify(toSave, null, 4), 'data.json', 'text/plain');
    // }

    // download(content, fileName, contentType) {
    //     var a = document.createElement("a");
    //     var file = new Blob([content], {type: contentType});
    //     a.href = URL.createObjectURL(file);
    //     a.download = fileName;
    //     a.click();

    // }
}