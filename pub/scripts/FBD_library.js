"use strict";
const log = console.log
function inclinedPlane(){
    this.planes = []

}

inclinedPlane.prototype = {
    canvas: null,
    base_x: 0,
    base_y: 0,
    width: 0,
    height: 200,
    slopeAngle: 30,
    div: null,
    inputContainer : {    
        inputArea: null,
        slopeInput: null,
        slopeButton: null,
        heightInput: null,
        heightButton: null},

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
        let updateCanvas = false
        this.slopeAngle = slopeAngle
        if(!this.canvas){
            updateCanvas = true;
            this.canvas = document.createElement("CANVAS");
        }
        let context = this.canvas.getContext('2d');
        
        this.height = y_height
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
        if(updateCanvas){
            this.div.appendChild(this.canvas)
        }

    },
    setLeftOffset: function(offset){
        this.base_x = offset
        this.generate()
    },
    setUpOffset: function(offset){
        this.base_y = offset
        this.generate()
    },
    setHeight: function(height, self=this){
        self.height = height
        self.generate()
    },
    setSlopeAngle: function(slopeAngle, self=this){
        self.slopeAngle = slopeAngle
        self.generate()
    },
    generateInputArea: function(){//helper
        this.inputContainer.inputArea = document.createElement("div");
        this.inputContainer.inputArea.id = "input"
        this.div.appendChild(this.inputContainer.inputArea)
    },
    updateSlopeInput: function(self){
        let val = parseInt(self.inputContainer.slopeInput.value)
        if(isNaN(val)){
            log("invalid input")
        }
        else if(val >= 90 || val <= 0){
            log("invalid input")
        }else{
            self.setSlopeAngle(val, self)
        }
    },
    updateHeightInput: function(self){
        let val = parseInt(self.inputContainer.heightInput.value)
        if(isNaN(val)){
            log("invalid input")
        }
        else if( val <= 0){
            log("invalid input")
        }else{
            self.setHeight(val, self)
        }
    },
    allowSlopeInput: function(){
        if(!this.inputContainer.inputArea){
            this.generateInputArea()
        }
        if(!this.inputContainer.slopeInput){
            let slopeText = document.createTextNode("Angle of Slope")
            this.inputContainer.inputArea.appendChild(slopeText)
            let br = document.createElement("br");
            this.inputContainer.inputArea.appendChild(br);
            this.inputContainer.slopeInput = document.createElement("input");
            this.inputContainer.slopeInput.setAttribute("type", "text");
            this.inputContainer.slopeInput.id = "SlopeInput"
            this.inputContainer.slopeInput.placeholder = "Angle in degrees"
            this.inputContainer.inputArea.appendChild(this.inputContainer.slopeInput)
            this.inputContainer.slopeButton = document.createElement("button")
            this.inputContainer.slopeButton.innerHTML = "update";
            this.inputContainer.slopeButton.id = "slopeButton"
            this.inputContainer.inputArea.appendChild(this.inputContainer.slopeButton)
            let self = this
            this.inputContainer.slopeButton.addEventListener("click", function() {self.updateSlopeInput(self);})
            let br2 = document.createElement("br");
            this.inputContainer.inputArea.appendChild(br2);
        }
    },
    allowHeightInput: function(){
        if(!this.inputContainer.inputArea){
            this.generateInputArea()
        }
        if(!this.inputContainer.heightInput){
            let heightText = document.createTextNode("Height of diagram")
            this.inputContainer.inputArea.appendChild(heightText)
            let br = document.createElement("br");
            this.inputContainer.inputArea.appendChild(br);
            this.inputContainer.heightInput = document.createElement("input");
            this.inputContainer.heightInput.setAttribute("type", "text");
            this.inputContainer.heightInput.id = "HeightInput"
            this.inputContainer.heightInput.placeholder = "height in pixels"
            this.inputContainer.inputArea.appendChild(this.inputContainer.heightInput)
            this.inputContainer.heightButton = document.createElement("button")
            this.inputContainer.heightButton.innerHTML = "update";
            this.inputContainer.heightButton.id = "heightButton"
            this.inputContainer.inputArea.appendChild(this.inputContainer.heightButton)
            let self = this
            this.inputContainer.heightButton.addEventListener("click", function() {self.updateHeightInput(self);})
            let br2 = document.createElement("br");
            this.inputContainer.inputArea.appendChild(br2);
        }
    }

}