"use strict";
const log = console.log
function inclinedPlane(){
    this.planes = []

}

inclinedPlane.prototype = {
    base_x: 0,
    base_y: 0,
    width: 0,
    height: 200,
    slopeAngle: 30,
    inputArea: null,
    div: null,
    slopeInput: null,
    generate: function(slopeAngle = this.slopeAngle, y_height = this.height){
        if(isNaN(slopeAngle) || isNaN(y_height)){
            throw "Slope Angle and Height must be a number"
        }
        if(slopeAngle > 90){
            throw "Slope Angle must be less than 90"
        } else if (slopeAngle < 0){
            throw "Slope Angle must be greater than 0"
        } else if (y_height < 0){
            throw "Height must be positive"
        }
        
        this.div = document.createElement("div");
        this.div.id = "Freebody div"
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(this.div);

        this.slopeAngle = slopeAngle

        let canvas = document.createElement("CANVAS");
        let context = canvas.getContext('2d');
        

        let slopeAngleRads = this.slopeAngle * (Math.PI / 180)
        let height = y_height + this.base_y
        this.width = height / Math.tan(slopeAngleRads)
        let width = this.width + this.base_x
        // let rads = slopeAngleRads * (Math.PI / 180) + Math.PI
        context.canvas.width = width
        context.canvas.height = height + 3
        log("height = " + (height - this.base_y))
        log("width = " + (width - this.base_x))

        context.beginPath();
        context.moveTo(this.base_x, this.base_y);
        context.lineTo(this.base_x, height);
        context.lineTo(width, height);
        context.lineTo(this.base_x,this.base_y);
        context.strokeStyle = "black";
        context.lineWidth = 1;
        context.closePath();
        context.arc(width, height, width / 4,  slopeAngleRads + Math.PI, 1 * Math.PI, true)
        context.stroke();
        this.div.appendChild(canvas)

    },
    setLeftOffset: function(offset){
        this.base_x = offset
        this.generate()
    },
    setUpOffset: function(offset){
        this.base_y = offset
        this.generate()
    },
    setHeight: function(height){
        this.height = height
        this.generate()
    },
    setSlopeAngle: function(slopeAngle){
        this.slopeAngle = slopeAngle
        this.generate()
    },
    generateInputArea: function(){
        this.inputArea = document.createElement("div");
        this.inputArea.id = "input"
        this.div.appendChild(this.inputArea)
    },
    allowSlopeInput: function(){
        if(!this.inputArea){
            this.generateInputArea()
        }
        let slopeText = document.createTextNode("Angle of Slope")
        this.inputArea.appendChild(slopeText)
        let br = document.createElement("br");
        this.inputArea.appendChild(br);
        this.slopeInput = document.createElement("INPUT");
        this.slopeInput.setAttribute("type", "text");
        this.slopeInput.id = "Slope Input"
        this.inputArea.appendChild(this.slopeInput)
    }
}