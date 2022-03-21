"use strict";
const log = console.log
function inclinedPlane(){
    this.planes = []

}

inclinedPlane.prototype = {
    canvas: null,
    forceObject: null,
    base_x: 0,
    base_y: 0,
    width: 0,
    height: 70,
    slopeAngle: 30,
    div: null,
    inputContainer : {    
        inputArea: null,
        slopeInput: null,
        slopeButton: null,
        heightInput: null,
        heightButton: null,
        errorText: null},

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
        let slopeAngleRads = this.convertToRadians(this.slopeAngle)
        let height = y_height + this.base_y
        this.width = this.height / Math.tan(slopeAngleRads)
        let width = this.width + this.base_x
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
    addForceObject: function(type, self=this){
        if(type.toLowerCase() === "box" || type.toLowerCase() === "square" ){
            self.generateBox(self)
        }else if(type.toLowerCase() === "circle" || type.toLowerCase() === "sphere" || type.toLowerCase() === "wheel" ){
            self.generateCircle(self)
        }else{
            self.inputContainer.errorText.innerHTML = "Object type must be either box or circle"
        }

    },
    generateBox: function(self=this){//internal helper
        let hypotenuseLength = Math.sqrt(self.height ** 2 + self.width ** 2)
        let boxSize = hypotenuseLength / 5
        let radSlope = self.convertToRadians(self.slopeAngle)
        let box_br = { //Bottom right
            x: (hypotenuseLength * 2 / 5) * Math.cos(radSlope),
            y: (hypotenuseLength * 2 / 5) * Math.sin(radSlope)
        }
        let box_bl = { //Bottom left
            x: (hypotenuseLength * 3 / 5) * Math.cos(radSlope),
            y: (hypotenuseLength * 3 / 5) * Math.sin(radSlope)
        }
        let box_tr = { //Top right
            x: box_br.x + boxSize * Math.sin(radSlope),
            y: box_br.y - (boxSize * Math.cos(radSlope))
        }
        let box_tl = { //Top left
            x: box_bl.x + boxSize * Math.sin(radSlope),
            y: box_bl.y - (boxSize * Math.cos(radSlope))
        }
        
        let context = self.canvas.getContext('2d')
        log(this.height + Math.abs(box_tr.y) + 1)
        if(this.base_y < (Math.abs(box_tr.y) + 1)){
            this.base_y += (Math.abs(box_tr.y) + 1)
        }
        // this.base_x += (Math.abs(box_tl.x) + 1)
        this.generate()
        context.beginPath();
        context.moveTo(box_br.x + this.base_x, box_br.y + this.base_y)
        context.lineTo(box_tr.x + this.base_x, box_tr.y + this.base_y)
        context.lineTo(box_tl.x + this.base_x, box_tl.y + this.base_y)
        context.lineTo(box_bl.x + this.base_x, box_bl.y + this.base_y)
        context.closePath()
        context.stroke()
        this.forceObject = "box"
 
    },
    generateCircle: function(self=this){//internal helper

    },
    setLeftOffset: function(offset){
        this.base_x += offset
        this.generate()
        if(this.forceObject === "box"){
            this.generateBox()
        }
    },
    setUpOffset: function(offset){
        this.base_y += offset
        this.generate()
        if(this.forceObject === "box"){
            this.generateBox()
        }
    },
    setHeight: function(height, self=this){
        self.height = height
        self.generate()
        if(self.forceObject === "box"){
            self.generateBox()
        }
    },
    setSlopeAngle: function(slopeAngle, self=this){
        self.slopeAngle = slopeAngle
        self.generate()
        if(self.forceObject === "box"){
            self.generateBox()
        }
    },
    generateInputArea: function(){//internal helper
        this.inputContainer.inputArea = document.createElement("div");
        this.inputContainer.inputArea.id = "input"
        this.inputContainer.errorText = document.createElement("span")
        this.inputContainer.errorText.appendChild(document.createTextNode(""))
        this.inputContainer.errorText.style.color = "red";
        this.inputContainer.inputArea.appendChild(this.inputContainer.errorText)
        let br = document.createElement("br");
        this.inputContainer.inputArea.appendChild(br);
        this.div.appendChild(this.inputContainer.inputArea)
    },
    updateSlopeInput: function(self){//internal helper
        let val = parseInt(self.inputContainer.slopeInput.value)
        if(isNaN(val)){
            self.inputContainer.errorText.innerHTML="Slope must be a number"
        }
        else if(val >= 90 || val <= 0){
            self.inputContainer.errorText.innerHTML="Slope must be between 1 and 89 degrees"
        }else{
            self.inputContainer.errorText.innerHTML=""
            self.setSlopeAngle(val, self)
        }
    },
    updateHeightInput: function(self){//internal helper
        let val = parseInt(self.inputContainer.heightInput.value)
        if(isNaN(val)){
            self.inputContainer.errorText.innerHTML="Height must be a number"
        }
        else if( val <= 0){
            self.inputContainer.errorText.innerHTML="Height must be positive"
        }else{
            self.setHeight(val, self)
            self.inputContainer.errorText.innerHTML=""
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
    },
    convertToRadians: function(val){//internal helper
        return val * (Math.PI / 180)
    }

}