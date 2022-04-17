"use strict";
const log = console.log
let num = 0
let names = []
function inclinedPlane(name){
    if(names.includes(name)){
        log("name already in use!")
    }
    names.push(name)
    this.name = name
}
function plane(name){
    if(names.includes(name)){
        log("name already in use!")
    }
    names.push(name)
    this.name = name
}

inclinedPlane.prototype = {
    canvas: null,
    forceObject: null,
    base_x: 0,
    base_y: 0,
    width: 200,
    height: 70,
    canvasWidth: 200,
    fontSize: 10,
    slopeAngle: 30,
    hoverColor : "#8ED6FF",
    popupType : null,
    div: null,
    mapImage : null,
    map : null,
    sizeUnits : null,
    massUnits : null,
    popup: false,
    planeProperties: {Angle: "30" + "\u00b0"},
    objectProperties: {},
    popupDiv: null,
    inputContainer : {    
        inputArea: null,
        slopeInput: null,
        slopeButton: null,
        heightInput: null,
        heightButton: null,
        errorText: null},

    generate: function(slopeAngle = this.slopeAngle, y_height = this.height, fill = false, newRender = true){
        
        //Error texts
        window.onresize = function(){
            this.generate()
        }.bind(this)
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
        //Generates div
        if(!this.div){
            this[this.name + "planeProperties"] = {}
            this.div = document.createElement("div");
            this.div.id = this.name
            var body = document.getElementsByTagName("body")[0];
            body.appendChild(this.div);

        }
        //Canvas image generation
        let updateCanvas = false
        this.slopeAngle = slopeAngle
        if(!this.canvas){
            updateCanvas = true;
            this.canvas = document.createElement("CANVAS");
        }
        let context = this.canvas.getContext('2d');
        this.height = y_height
        let slopeAngleRads = this.convertToRadians(this.slopeAngle)
        this.base_y = this.height * .5
        // this.base_x = this.fontSize * 5 // CHange??
        let height = y_height + this.base_y
        this.width =this.height / Math.tan(slopeAngleRads)
        let width = this.width + this.base_x
        this.canvasWidth = Math.max(width, this.canvasWidth)
        context.canvas.width = this.canvasWidth
        context.canvas.height = height + this.fontSize * 2
        context.beginPath();
        context.moveTo(this.base_x, this.base_y);
        context.lineTo(this.base_x, height);
        context.lineTo(width, height);
        context.lineTo(this.base_x,this.base_y);
        context.strokeStyle = "black";
        context.lineWidth = 1;
        context.closePath();
        if(fill){
            context.fillStyle = this.hoverColor
            context.fill();
        }
        context.fillStyle = "black"
        context.arc(width, height, width / 4,  slopeAngleRads + Math.PI, 1 * Math.PI, true)
        this.fontSize = Math.min(width, height) * .09
        context.font = this.fontSize + "px Arial";
        //Angle label
        this[this.name + "planeProperties"].Angle =  "30" + "\u00b0";
        context.fillText(this[this.name + "planeProperties"].Angle, width * (3/4) + 2, height - 2);
        //Width label
        if(this[this.name + "planeProperties"].hasOwnProperty("Width")){
            context.fillText(this[this.name + "planeProperties"].Width, width * .3, height + this.fontSize + 2);
        }else
        if(this[this.name + "planeProperties"].hasOwnProperty("Height")){
            if(!isNaN(this[this.name + "planeProperties"].Height)){
                let calcWidth = parseInt(this[this.name + "planeProperties"].Height) / Math.tan(slopeAngleRads)
                context.fillText(calcWidth.toPrecision(4) + " " + this.sizeUnits, width * .3, height + this.fontSize + 2);
            }else{
                context.fillText(this[this.name + "planeProperties"].Height + " / Tan(" + this[this.name + "planeProperties"].Angle + ")", width * .3, height + this.fontSize + 2)
            }
        }
        //Height label
        if(this[this.name + "planeProperties"].hasOwnProperty("Height")){

            context.fillText(this[this.name + "planeProperties"].Height, this.base_x + 2, height * (3/4));
        }

        context.stroke();

        //Image map (hovering) for plane
        if(newRender){
            if(this.map){
                this.map.remove()
                this.mapImage.remove()
            }
            
            this.mapImage = document.createElement("img")
            this.mapImage.setAttribute("src", "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=")
            this.mapImage.setAttribute("alt", "")
            let imgWidth = this.canvas.getAttribute("width")
            let imgHeight = this.canvas.getAttribute("height")
            this.mapImage.setAttribute("width", imgWidth)
            this.mapImage.setAttribute("height", imgHeight)
            this.div.appendChild(this.mapImage)
            let rect = this.canvas.getBoundingClientRect()
            this.mapImage.style.position = "absolute"
            this.mapImage.style.left = rect.left + "px"
            this.mapImage.style.top = (rect.top + window.scrollY) + "px"
            this.mapImage.setAttribute("usemap", "#imgMap" + this.name)
            this.map = document.createElement("map")
            this.map.setAttribute("name", "imgMap" + this.name)
            let planeArea = document.createElement("area")
            planeArea.setAttribute("shape", "poly")
            planeArea.setAttribute("coords", this.base_x + "," + this.base_y + "," + this.base_x + "," + this.height + "," + width + "," + height)
            planeArea.setAttribute("alt", "plane")
            planeArea.setAttribute("href", "javascript:void(0)")
            planeArea.onmouseenter = this.hoverPlane.bind(this)
            planeArea.onmouseleave = this.unHoverPlane.bind(this)
            if(this.popup){
                planeArea.onclick = this.planeClick.bind(this)
            }
            this.map.appendChild(planeArea)
            this.div.appendChild(this.map)
        }


        // this.div.style.width = Math.max(this.canvas.width, 250) + "px"
        // this.div.style.display = "inline-block"

        //updates canvas if needed
        if(updateCanvas){
            this.div.appendChild(this.canvas)
        }

    },
    /**
     * Function for adding a force object to the model
     * @param {String} type A string describing the type of force object to add, either "box" or "circle"
     */
    addForceObject: function(type, self=this){
        if(type.toLowerCase() === "box" || type.toLowerCase() === "square" ){
            self.generateBox(self)
        }else if(type.toLowerCase() === "circle" || type.toLowerCase() === "sphere" || type.toLowerCase() === "wheel" ){
            self.generateCircle(self)
        }else{
            self.inputContainer.errorText.innerHTML = "Object type must be either box or circle"
        }

    },
    generateBox: function(self=this, fill={}){//internal helper
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
        context.strokeStyle = "black"
        if(this.base_y < (Math.abs(box_tr.y) + 1)){
            this.base_y += (Math.abs(box_tr.y) + 1)
        }
        // this.base_x += (Math.abs(box_tl.x) + 1)
        let halfRightX = ((box_tl.x + this.base_x) + (box_bl.x + this.base_x)) / 2
        let arrowLength = Math.min(this.height / 2, this.width / 2, ((box_tr.y + this.base_y) + (box_tl.y + this.base_y)) / 2)
        let halfTopX = ((box_tr.x + this.base_x) + (box_tl.x + this.base_x)) / 2
        this.canvasWidth = Math.max(halfTopX + arrowLength * Math.sin(radSlope), halfRightX + arrowLength * Math.cos(radSlope), this.width + this.base_x)
        this.base_y = Math.max(this.base_y, -1 * (((box_tr.y + this.base_y) + (box_tl.y + this.base_y)) / 2 - arrowLength * Math.cos(radSlope)))

        if(fill.hasOwnProperty("plane")){
            this.generate(undefined, undefined, true, false)
        }else if (fill.hasOwnProperty("box")){
            this.generate(undefined, undefined, false, false)
        }
        else{
            this.generate(undefined, undefined, undefined, true)
        }
        window.onresize = function(){
            this.generateBox(this)
        }.bind(this)
        context.beginPath();
        context.moveTo(box_br.x + this.base_x, box_br.y + this.base_y)
        context.lineTo(box_tr.x + this.base_x, box_tr.y + this.base_y)
        context.lineTo(box_tl.x + this.base_x, box_tl.y + this.base_y)
        context.lineTo(box_bl.x + this.base_x, box_bl.y + this.base_y)
        context.closePath()
        context.stroke();


        if(fill.hasOwnProperty("box")){
            context.fillStyle = this.hoverColor
            context.fill()
        }
        let head = Math.min(this.height / 5, this.width / 5, 10)

        //Right arrow
        let halfRightY = ((box_tl.y + this.base_y) + (box_bl.y + this.base_y)) / 2
        if(fill.hasOwnProperty("Right")){
            context.strokeStyle = "#FF0000";
        }
        context.beginPath();
        drawArrow(context, halfRightX, halfRightY, halfRightX + arrowLength * Math.cos(radSlope), halfRightY + arrowLength * Math.sin(radSlope), head)
        context.closePath();
        context.stroke();
        context.strokeStyle = "black"

        //Left arrow
        let halfLeftX = ((box_tr.x + this.base_x) + (box_br.x + this.base_x)) / 2
        let halfLeftY = ((box_tr.y + this.base_y) + (box_br.y + this.base_y)) / 2
        if(fill.hasOwnProperty("Left")){
            context.strokeStyle = "#FF0000";
        }
        context.beginPath();
        drawArrow(context, halfLeftX, halfLeftY, halfLeftX - arrowLength * Math.cos(radSlope), halfLeftY - arrowLength * Math.sin(radSlope), head)
        context.closePath();
        context.stroke();
        context.strokeStyle = "black"
        //Up arrow
        if(fill.hasOwnProperty("Normal")){
            context.strokeStyle = "#FF0000";
        }
        let halfTopY = ((box_tr.y + this.base_y) + (box_tl.y + this.base_y)) / 2
        context.beginPath();
        drawArrow(context, halfTopX, halfTopY, halfTopX + arrowLength * Math.sin(radSlope), halfTopY - arrowLength * Math.cos(radSlope), head)
        context.closePath();
        context.stroke();
        context.strokeStyle = "black"
        //down arrow
        let halfBottomX = ((box_br.x + this.base_x) + (box_bl.x + this.base_x)) / 2
        let halfBottomY = ((box_br.y + this.base_y) + (box_bl.y + this.base_y)) / 2
        if(fill.hasOwnProperty("Down")){
            context.strokeStyle = "#FF0000";
        }
        context.beginPath();
        drawArrow(context, halfBottomX, halfBottomY, halfBottomX - arrowLength * Math.sin(radSlope), halfBottomY + arrowLength * Math.cos(radSlope), head)
        context.closePath();
        context.stroke();
        context.strokeStyle = "black"

        //mg arrow
        if(fill.hasOwnProperty("Gravity")){
            context.strokeStyle = "#FF0000";
        }
        context.beginPath();
        drawArrow(context, halfBottomX, halfBottomY, halfBottomX, halfBottomY + arrowLength, head)
        context.closePath();
        context.stroke();
        context.strokeStyle = "black"
        // this.width = Math.max(halfTopX + arrowLength * Math.sin(radSlope), halfRightX + arrowLength * Math.cos(radSlope))

        if(!Object.keys(fill).length){
            
            let boxArea = document.createElement("area")
            boxArea.setAttribute("shape", "poly")
            boxArea.setAttribute("coords", (box_br.x + this.base_x) + "," + (box_br.y + this.base_y) + "," + (box_tr.x + this.base_x) + ',' + (box_tr.y + this.base_y) + "," + (box_tl.x + this.base_x) + "," + (box_tl.y + this.base_y) + "," + (box_bl.x + this.base_x) + "," + (box_bl.y + this.base_y))
            boxArea.setAttribute("alt", "box")
            boxArea.setAttribute("href", "javascript:void(0)")
            boxArea.style.display = "block"
            boxArea.onmouseenter = this.hoverObject.bind(this)
            boxArea.onmouseleave = this.unHoverObject.bind(this)
            if(this.popup){
                boxArea.onclick = this.boxClick.bind(this)
            }
            this.map.appendChild(boxArea)
        }
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
    /**
     * Set the height of the model in pixels
     * @param {Number} height Height of the model in pixels
     */
    setHeightPx: function(height, self=this){
        self.height = height
        if(this.popupDiv){
            this.popupDiv.remove()
            this.popupDiv = null
        }
        self.generate()
        if(self.forceObject === "box"){
            self.generateBox()
        }
    },

    /**
     * Sets the hight to be displayed to the user
     * @param {Number} height Value for height
     * @param {String} unit Unit for height
     */
    setHeight: function(height, unit="", self=this){
        if(self.popupDiv){
            self.popupDiv.remove()
            self.popupDiv = null
        }
        self.sizeUnits = unit
        log(self)
        self[this.name + "planeProperties"]["Height"] = height + " " + unit
    },

    /**
     * Sets the angle of the model and displays it to the user
     * @param {Number} slopeAngle Angle in degrees
     */
    setSlopeAngle: function(slopeAngle, self=this){
        if(this.popupDiv){
            this.popupDiv.remove()
            this.popupDiv = null
        }
        self.slopeAngle = slopeAngle
        self.generate()
        if(self.forceObject === "box"){
            self.generateBox()
        }
        this[this.name + "planeProperties"]["Angle"] = slopeAngle + "\u00b0"
    },

    /**
     * Create your own attribute to be displayed in the plane's popup window
     * @param {String} attribute The name of the attribute to be displayed
     * @param {Any} value The value of the attribute to be displayed
     */
    setPlaneAttribute: function(attribute, value){
        if(this.popupDiv){
            this.popupDiv.remove()
            this.popupDiv = null
        }
        this[this.name + "planeProperties"][attribute] = value
    },
    /**
     * Set the mass of the force object
     * @param {Any} mass 
     * @param {Optional} unit 
     */
    setMass: function(mass, unit=""){
        if(this.popupDiv){
            this.popupDiv.remove()
            this.popupDiv = null
        }
        this.objectProperties["Mass"] = mass + " " + unit
        this.massUnits = unit
    },
    /**
     * Set forces as described in given object. Possible forces include:
     * Normal
     * Gravity
     * Right
     * Left
     * Down
     * Example usage: FBD.setForces({Normal: 5N, Left: 6x})
     * @param {Object} forces 
     */
    setForces: function(forces={}){
        let check = ["Normal", "Gravity", "Right", "Left", "Down"]
        if(this.popupDiv){
            this.popupDiv.remove()
            this.popupDiv = null
        }
        for (const [key, value] of Object.entries(forces)) {
            if(check.includes(key)){
                this.objectProperties[key] = value
            }
      }
    },
    /**
     * Set a non numerical value for the width of the model
     * @param {String} width 
     */
    setWidth: function(width){
        if(this.popupDiv){
            this.popupDiv.remove()
            this.popupDiv = null
        }
        this[this.name + "planeProperties"]["Width"] = width
    },

    generateInputArea: function(){//internal helper
        this.inputContainer.inputArea = document.createElement("div");
        this.inputContainer.inputArea.id = this.name + "Input"
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
        else if(val >= 90 || val <= 12){
            self.inputContainer.errorText.innerHTML="Slope must be between 13 and 89 degrees"
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
        else if( val <= 49){
            self.inputContainer.errorText.innerHTML="Height must be greater than 50"
        }else{
            self.setHeightPx(val, self)
            self.inputContainer.errorText.innerHTML=""
        }
    },
    /**
     * Generates input field for changing the angle of the plane
     */
    allowSlopeInput: function(){
        if(!this.inputContainer.inputArea){
            this.generateInputArea()
        }
        if(!this.inputContainer.slopeInput){
            let br2 = document.createElement("br");
            this.inputContainer.inputArea.appendChild(br2);
            let slopeText = document.createTextNode("Angle of Slope")
            this.inputContainer.inputArea.appendChild(slopeText)
            let br = document.createElement("br");
            this.inputContainer.inputArea.appendChild(br);
            this.inputContainer.slopeInput = document.createElement("input");
            this.inputContainer.slopeInput.setAttribute("type", "text");
            this.inputContainer.slopeInput.id = this.name + "SlopeInput"
            this.inputContainer.slopeInput.placeholder = "Angle in degrees"
            this.inputContainer.inputArea.appendChild(this.inputContainer.slopeInput)
            this.inputContainer.slopeButton = document.createElement("button")
            this.inputContainer.slopeButton.innerHTML = "update";
            this.inputContainer.slopeButton.id = this.name + "SlopeButton"
            this.inputContainer.inputArea.appendChild(this.inputContainer.slopeButton)
            let self = this
            this.inputContainer.slopeButton.addEventListener("click", function() {self.updateSlopeInput(self);})

        }
    },
    /**
     * Generates input field for changing the height of the model (in pixels)
     */
    allowHeightInput: function(){
        if(!this.inputContainer.inputArea){
            this.generateInputArea()
        }
        if(!this.inputContainer.heightInput){
            let br2 = document.createElement("br");
            this.inputContainer.inputArea.appendChild(br2);
            let heightText = document.createTextNode("Height of diagram")
            this.inputContainer.inputArea.appendChild(heightText)
            let br = document.createElement("br");
            this.inputContainer.inputArea.appendChild(br);
            this.inputContainer.heightInput = document.createElement("input");
            this.inputContainer.heightInput.setAttribute("type", "text");
            this.inputContainer.heightInput.id = this.name + "HeightInput"
            this.inputContainer.heightInput.placeholder = "height in pixels"
            this.inputContainer.inputArea.appendChild(this.inputContainer.heightInput)
            this.inputContainer.heightButton = document.createElement("button")
            this.inputContainer.heightButton.innerHTML = "update";
            this.inputContainer.heightButton.id = this.name + "HeightButton"
            this.inputContainer.inputArea.appendChild(this.inputContainer.heightButton)
            let self = this
            this.inputContainer.heightButton.addEventListener("click", function() {self.updateHeightInput(self);})
        }
    },
    convertToRadians: function(val){//internal helper
        return val * (Math.PI / 180)
    },

    hoverPlane(){//internal helper
        this.generate(this.slopeAngle, this.height, true, false)
        if(this.forceObject == "box"){
            this.generateBox(this, {plane : true})
        }
    },
    planeClick(){//Internal helper
        if(this.popupDiv && this.popupType == "p"){
            this.popupDiv.remove()
            this.popupDiv = null
            this.popupType = null
        }else{
        if (this.popupDiv){
            this.popupDiv.remove()
            this.popupDiv = null
            this.popupType = null
        }
        this.popupType = "p"
        this.popupDiv = document.createElement("div")
        this.popupDiv.id = this.name + "Popup"
        this.popupDiv.style.minWidth = "100px"
        this.popupDiv.style.minHeight = "100px"
        this.popupDiv.style.backgroundColor="#fcf7dc";
        this.popupDiv.style.position = "absolute"
        this.popupDiv.style.cssFloat = "top";
        this.popupDiv.style.display = "inline-block"
        this.popupDiv.style.borderRadius = "8%"
        this.popupDiv.style.borderStyle = "solid"
        this.popupDiv.style.borderWidth = "1px"
        this.popupDiv.style.borderColor = "#a1a1a1"
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(this.popupDiv);
        let textSpan = document.createElement("span")

        for (const [key, value] of Object.entries(this[this.name + "planeProperties"])) {
                let text = document.createTextNode(key + ": " + value)
                let br2 = document.createElement("br");
                textSpan.appendChild(text)
                textSpan.appendChild(br2)
          }
        this.popupDiv.appendChild(textSpan)
        }
    },
    unHoverPlane(){//Internal helper
        this.generate(undefined, undefined, undefined, false)
        if(this.forceObject == "box"){
            this.generateBox()
        }
        // this.popupDiv.remove()
        // this.popupDiv = null
    },
    hoverObject(){//Internal helper
        this.generate(undefined, undefined, undefined, false)
        if(this.forceObject == "box"){
            this.generateBox(this, {box : true})
        }else{

        }
    },
    unHoverObject(){ //Why no work :(
        this.generate(undefined, undefined, undefined, false)
        if(this.forceObject == "box"){
            this.generateBox()
        }
    },
    boxClick(){//Internal helper
        if(this.popupDiv && this.popupType == "b"){
            this.popupDiv.remove()
            this.popupDiv = null
            this.popupType = null
        }else{
        if (this.popupDiv){
            this.popupDiv.remove()
            this.popupDiv = null
            this.popupType = null
        }
        this.popupType = "b"
        this.popupDiv = document.createElement("div")
        this.popupDiv.id = this.name + "Popup"
        this.popupDiv.style.minWidth = "100px"
        this.popupDiv.style.minHeight = "100px"
        this.popupDiv.style.backgroundColor="#fcf7dc";
        this.popupDiv.style.position = "absolute"
        // this.popupDiv.style.cssFloat = "top";
        // this.popupDiv.style.display = "inline-block"
        this.popupDiv.style.borderRadius = "8%"
        this.popupDiv.style.borderStyle = "solid"
        this.popupDiv.style.borderWidth = "1px"
        this.popupDiv.style.borderColor = "#a1a1a1"
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(this.popupDiv);
        let textSpan = document.createElement("span")

        for (const [key, value] of Object.entries(this.objectProperties)) {
            let text = document.createTextNode("")
            if(key == "Normal"){
                text = document.createElement("p")
                text.innerHTML = "F<sub>N</sub>:" + value
                text.onmouseenter = function(){
                    this.hoverForce("Normal")
                }.bind(this)
                text.onmouseleave = this.unHoverForce.bind(this)
                textSpan.appendChild(text)
            }else if(key == "Down"){
                text = document.createElement("p")
                text.innerHTML = "F<sub>-N</sub>: " + value
                text.onmouseenter = function(){
                    this.hoverForce("Down")
                }.bind(this)
                text.onmouseleave = this.unHoverForce.bind(this)
                textSpan.appendChild(text)
            }else if(key == "Left"){
                text = document.createElement("p")
                text.innerHTML = "F<sub>f</sub>: " + value
                text.onmouseenter = function(){
                    this.hoverForce("Left")
                }.bind(this)
                text.onmouseleave = this.unHoverForce.bind(this)
                textSpan.appendChild(text)
            }else if (key == "Right"){
                text = document.createElement("p")
                text.innerHTML = "F<sub>\u2225</sub>: " + value
                text.onmouseenter = function(){
                    this.hoverForce("Right")
                }.bind(this)
                text.onmouseleave = this.unHoverForce.bind(this)
                textSpan.appendChild(text)
            }else if (key == "Gravity"){
                text = document.createElement("p")
                text.innerHTML = "F<sub>g</sub>: " + value
                text.onmouseenter = function(){
                    this.hoverForce("Gravity")
                }.bind(this)
                text.onmouseleave = this.unHoverForce.bind(this)
                textSpan.appendChild(text)
            }else{
                text = document.createTextNode(key + ": " + value)
                textSpan.appendChild(text)
                let br2 = document.createElement("br");
                textSpan.appendChild(br2)
            }

          }
        this.popupDiv.appendChild(textSpan)
        }
    },
    hoverForce(type){
        let fill = {}
        fill[type] = true
        this.generateBox(undefined, fill)
    },
    unHoverForce(){
        this.generateBox()
    },
    allowPopup(){
        this.popup = true;
        this.generate(undefined, undefined, undefined, false)
        if(this.forceObject == "box"){
            this.generateBox()
        }
    },
    disablePopup(){
        this.popup = false;
        this.generate(undefined, undefined, undefined, false)
        if(this.forceObject == "box"){
            this.generateBox()
        }
    }
}


///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////



plane.prototype = {
    canvas: null,
    forceObject: null,
    base_x: 0,
    base_y: 0,
    height: 70,
    width: 200,
    fontSize: 10,
    hoverColor : "#8ED6FF",
    popupType : null,
    div: null,
    mapImage : null,
    popup: false,
    map : null,
    sizeUnits : null,
    massUnits : null,
    planeProperties: {},
    objectProperties: {},
    popupDiv: null,
    inputContainer : {    
        inputArea: null,
        widthInput: null,
        widthButton: null,
        errorText: null},

    generate: function(newRender = true){
        window.onresize = function(){
            this.generate()
        }.bind(this)
        //Error texts
        //Generates div
        if(!this.div){
            this.div = document.createElement("div");
            this.div.id = this.name
            var body = document.getElementsByTagName("body")[0];
            body.appendChild(this.div);

        }
        //Canvas image generation
        let updateCanvas = false
        if(!this.canvas){
            updateCanvas = true;
            this.canvas = document.createElement("CANVAS");
        }
        let context = this.canvas.getContext('2d');
        this.base_y = this.width * 2/5
        // this.base_x = this.fontSize * 5 // CHange??
        let height = this.width * 4/5
        let width = this.width + this.base_x
        context.canvas.width = width
        context.canvas.height = height//Change?

        context.beginPath();
        context.moveTo(this.base_x, this.height + this.base_y);
        context.lineTo(this.width, this.height + this.base_y)
        context.strokeStyle = "black";
        context.lineWidth = 1;
        context.stroke();
        context.closePath();
        this.fontSize = Math.min(width, height) * .09
        context.font = this.fontSize + "px Arial";
        //Image map (hovering) for plane
        if(newRender){
            if(this.map){
                this.map.remove()
                this.mapImage.remove()
            }
            
            this.mapImage = document.createElement("img")
            this.mapImage.setAttribute("src", "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=")
            this.mapImage.setAttribute("alt", "")
            let imgWidth = this.canvas.getAttribute("width")
            let imgHeight = this.canvas.getAttribute("height")
            this.mapImage.setAttribute("width", imgWidth)
            this.mapImage.setAttribute("height", imgHeight)
            this.div.appendChild(this.mapImage)
            let rect = this.canvas.getBoundingClientRect()
            this.mapImage.style.position = "absolute"
            this.mapImage.style.left = rect.left + "px"
            // this.mapImage.style.top = rect.top + "px"
            this.mapImage.setAttribute("usemap", "#imgMap" + this.name)
            this.map = document.createElement("map")
            this.map.setAttribute("name", "imgMap" + this.name)
            this.div.appendChild(this.map)
        }


        // this.div.style.width = Math.max(this.canvas.width, 250) + "px"
        // this.div.style.display = "inline-block"

        //updates canvas if needed
        if(updateCanvas){
            this.div.appendChild(this.canvas)
        }

    },
    /**
     * Function for adding a force object to the model
     * @param {String} type A string describing the type of force object to add, either "box" or "circle"
     */
    addForceObject: function(type, self=this){
        if(type.toLowerCase() === "box" || type.toLowerCase() === "square" ){
            self.generateBox(self)
        }else if(type.toLowerCase() === "circle" || type.toLowerCase() === "sphere" || type.toLowerCase() === "wheel" ){
            self.generateCircle(self)
        }else{
            self.inputContainer.errorText.innerHTML = "Object type must be either box or circle"
        }

    },
    generateBox: function(self=this, fill={}){//internal helper
        // let hypotenuseLength = Math.sqrt(self.height ** 2 + self.width ** 2)
        // let boxSize = hypotenuseLength / 5
        // let radSlope = self.convertToRadians(self.slopeAngle)
        let box_bl = { //Bottom right
            x: this.width * 3/5,
            y: this.height
        }
        let box_br = { //Bottom left
            x: this.width * 2/5,
            y: this.height
        }
        let box_tl = { //Top right
            x: this.width * 3/5,
            y: this.height - this.width * 1/5
        }
        let box_tr = { //Top left
            x: this.width * 2/5,
            y: this.height - this.width * 1/5
        }
        
        let context = self.canvas.getContext('2d')
        context.strokeStyle = "black"
        if(this.base_y < (Math.abs(box_tr.y) + 1)){
            this.base_y += (Math.abs(box_tr.y) + 1)
        }
        // this.base_x += (Math.abs(box_tl.x) + 1)
        if(fill.hasOwnProperty("plane")){
            this.generate(false)
        }else if (fill.hasOwnProperty("box")){
            this.generate(false)
        }
        else{
            this.generate(true)
        }
        window.onresize = function(){
            this.generateBox(this)
        }.bind(this)
        context.beginPath();
        context.moveTo(box_br.x + this.base_x, box_br.y + this.base_y)
        context.lineTo(box_tr.x + this.base_x, box_tr.y + this.base_y)
        context.lineTo(box_tl.x + this.base_x, box_tl.y + this.base_y)
        context.lineTo(box_bl.x + this.base_x, box_bl.y + this.base_y)
        context.closePath()
        context.stroke();


        if(fill.hasOwnProperty("box")){
            context.fillStyle = this.hoverColor
            context.fill()
        }
        // let arrowLength = Math.min(this.height / 2, this.width / 2, ((box_tr.y + this.base_y) + (box_tl.y + this.base_y)) / 2)
        let arrowLength = this.width * 1/5
        // let head = Math.min(this.height / 5, this.width / 5, 10)
        let head = this.width / 10

        //Right arrow
        let halfRightX = ((box_tl.x + this.base_x) + (box_bl.x + this.base_x)) / 2
        let halfRightY = ((box_tl.y + this.base_y) + (box_bl.y + this.base_y)) / 2
        if(fill.hasOwnProperty("Right")){
            context.strokeStyle = "#FF0000";
        }
        context.beginPath();
        drawArrow(context, halfRightX, halfRightY, halfRightX + arrowLength, halfRightY, head)
        context.closePath();
        context.stroke();
        context.strokeStyle = "black"

        //Left arrow
        let halfLeftX = ((box_tr.x + this.base_x) + (box_br.x + this.base_x)) / 2
        let halfLeftY = ((box_tr.y + this.base_y) + (box_br.y + this.base_y)) / 2
        if(fill.hasOwnProperty("Left")){
            context.strokeStyle = "#FF0000";
        }
        context.beginPath();
        drawArrow(context, halfLeftX, halfLeftY, halfLeftX - arrowLength, halfLeftY, head)
        context.closePath();
        context.stroke();
        context.strokeStyle = "black"
        //Up arrow
        let halfTopX = ((box_tr.x + this.base_x) + (box_tl.x + this.base_x)) / 2
        let halfTopY = ((box_tr.y + this.base_y) + (box_tl.y + this.base_y)) / 2
        if(fill.hasOwnProperty("Normal")){
            context.strokeStyle = "#FF0000";
        }
        context.beginPath();
        drawArrow(context, halfTopX, halfTopY, halfTopX, halfTopY - arrowLength, head)
        context.closePath();
        context.stroke();
        context.strokeStyle = "black"
        //down arrow
        let halfBottomX = ((box_br.x + this.base_x) + (box_bl.x + this.base_x)) / 2
        let halfBottomY = ((box_br.y + this.base_y) + (box_bl.y + this.base_y)) / 2
        if(fill.hasOwnProperty("Gravity")){
            context.strokeStyle = "#FF0000";
        }
        context.beginPath();
        drawArrow(context, halfBottomX, halfBottomY, halfBottomX, halfBottomY + arrowLength, head)
        context.closePath();
        context.stroke();
        context.strokeStyle = "black"

        if(!Object.keys(fill).length){
            
            let boxArea = document.createElement("area")
            boxArea.setAttribute("shape", "poly")
            boxArea.setAttribute("coords", (box_br.x + this.base_x) + "," + (box_br.y + this.base_y) + "," + (box_tr.x + this.base_x) + ',' + (box_tr.y + this.base_y) + "," + (box_tl.x + this.base_x) + "," + (box_tl.y + this.base_y) + "," + (box_bl.x + this.base_x) + "," + (box_bl.y + this.base_y))
            boxArea.setAttribute("alt", "box")
            boxArea.setAttribute("href", "javascript:void(0)")
            boxArea.style.display = "block"
            boxArea.onmouseenter = this.hoverObject.bind(this)
            boxArea.onmouseleave = this.unHoverObject.bind(this)
            if(this.popup){
                boxArea.onclick = this.boxClick.bind(this)
            }
            this.map.appendChild(boxArea)
        }
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
    /**
     * Set the mass of the force object
     * @param {Any} mass 
     * @param {Optional} unit 
     */
    setMass: function(mass, unit=""){
        if(this.popupDiv){
            this.popupDiv.remove()
            this.popupDiv = null
        }
        this.objectProperties["Mass"] = mass + " " + unit
        this.massUnits = unit
    },
    /**
     * Set forces as described in given object. Possible forces include:
     * Normal
     * Gravity
     * Right
     * Left
     * Down
     * Example usage: FBD.setForces({Normal: 5N, Left: 6x})
     * @param {Object} forces 
     */
    setForces: function(forces={}){
        let check = ["Normal", "Gravity", "Right", "Left"]
        if(this.popupDiv){
            this.popupDiv.remove()
            this.popupDiv = null
        }
        for (const [key, value] of Object.entries(forces)) {
            if(check.includes(key)){
                this.objectProperties[key] = value
            }
      }
    },
    /**
     * Set a non numerical value for the width of the model
     * @param {String} width 
     */
    setWidth: function(width){
        if(this.popupDiv){
            this.popupDiv.remove()
            this.popupDiv = null
        }
        this[this.name + "planeProperties"]["Width"] = width
    },
    setWidthPx: function(width, self=this){
        self.width = width
        if(this.popupDiv){
            this.popupDiv.remove()
            this.popupDiv = null
        }
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
        // let br = document.createElement("br");
        // this.inputContainer.inputArea.appendChild(br);
        this.div.appendChild(this.inputContainer.inputArea)
    },
    updateWidthInput: function(self){//internal helper
        let val = parseInt(self.inputContainer.widthInput.value)
        if(isNaN(val)){
            self.inputContainer.errorText.innerHTML="Width must be a number"
        }
        else if( val <= 49){
            self.inputContainer.errorText.innerHTML="Width must be greater than 50"
        }else{
            self.setWidthPx(val, self)
            self.inputContainer.errorText.innerHTML=""
        }
    },

    /**
     * Generates input field for changing the height of the model (in pixels)
     */
    allowWidthInput: function(){
        if(!this.inputContainer.inputArea){
            this.generateInputArea()
        }
        if(!this.inputContainer.widthInput){
            let br2 = document.createElement("br");
            this.inputContainer.inputArea.appendChild(br2);
            let widthText = document.createTextNode("Width of diagram")
            this.inputContainer.inputArea.appendChild(widthText)
            let br = document.createElement("br");
            this.inputContainer.inputArea.appendChild(br);
            this.inputContainer.widthInput = document.createElement("input");
            this.inputContainer.widthInput.setAttribute("type", "text");
            this.inputContainer.widthInput.id = "widthInput"
            this.inputContainer.widthInput.placeholder = "width in pixels"
            this.inputContainer.inputArea.appendChild(this.inputContainer.widthInput)
            this.inputContainer.widthButton = document.createElement("button")
            this.inputContainer.widthButton.innerHTML = "update";
            this.inputContainer.widthButton.id = "widthButton"
            this.inputContainer.inputArea.appendChild(this.inputContainer.widthButton)
            let self = this
            this.inputContainer.widthButton.addEventListener("click", function() {self.updateWidthInput(self);})
        }
    },
    convertToRadians: function(val){//internal helper
        return val * (Math.PI / 180)
    },
    hoverObject(){//Internal helper
        this.generate(false)
        if(this.forceObject == "box"){
            this.generateBox(this, {box : true})
        }else{

        }
    },
    unHoverObject(){ //Why no work :(
        this.generate(false)
        if(this.forceObject == "box"){
            this.generateBox()
        }
    },
    boxClick(){//Internal helper
        if(this.popupDiv && this.popupType == "b"){
            this.popupDiv.remove()
            this.popupDiv = null
            this.popupType = null
        }else{
        if (this.popupDiv){
            this.popupDiv.remove()
            this.popupDiv = null
            this.popupType = null
        }
        this.popupType = "b"
        this.popupDiv = document.createElement("div")
        this.popupDiv.id = this.name + "Popup"
        this.popupDiv.style.minWidth = "100px"
        this.popupDiv.style.minHeight = "100px"
        this.popupDiv.style.backgroundColor="#fcf7dc";
        this.popupDiv.style.position = "absolute"
        this.popupDiv.style.cssFloat = "top";
        this.popupDiv.style.display = "inline-block"
        this.popupDiv.style.borderRadius = "8%"
        this.popupDiv.style.borderStyle = "solid"
        this.popupDiv.style.borderWidth = "1px"
        this.popupDiv.style.borderColor = "#a1a1a1"
        var body = document.getElementsByTagName("body")[0];
        // body.appendChild(this.popupDiv);
        this.div.appendChild(this.popupDiv);
        let textSpan = document.createElement("span")

        for (const [key, value] of Object.entries(this.objectProperties)) {
            let text = document.createTextNode("")
            if(key == "Normal"){
                text = document.createElement("p")
                text.innerHTML = "F<sub>N</sub>:" + value
                text.onmouseenter = function(){
                    this.hoverForce("Normal")
                }.bind(this)
                text.onmouseleave = this.unHoverForce.bind(this)
                textSpan.appendChild(text)
            }else if(key == "Left"){
                text = document.createElement("p")
                text.innerHTML = "F<sub>f</sub>: " + value
                text.onmouseenter = function(){
                    this.hoverForce("Left")
                }.bind(this)
                text.onmouseleave = this.unHoverForce.bind(this)
                textSpan.appendChild(text)
            }else if (key == "Right"){
                text = document.createElement("p")
                text.innerHTML = "F<sub>app</sub>: " + value
                text.onmouseenter = function(){
                    this.hoverForce("Right")
                }.bind(this)
                text.onmouseleave = this.unHoverForce.bind(this)
                textSpan.appendChild(text)
            }else if (key == "Gravity"){
                text = document.createElement("p")
                text.innerHTML = "F<sub>g</sub>: " + value
                text.onmouseenter = function(){
                    this.hoverForce("Gravity")
                }.bind(this)
                text.onmouseleave = this.unHoverForce.bind(this)
                textSpan.appendChild(text)
            }else{
                text = document.createTextNode(key + ": " + value)
                textSpan.appendChild(text)
                let br2 = document.createElement("br");
                textSpan.appendChild(br2)
            }
          }
        this.popupDiv.appendChild(textSpan)
        }
    },
    hoverForce(type){
        let fill = {}
        fill[type] = true
        this.generateBox(undefined, fill)
    },
    unHoverForce(){
        this.generateBox()
    }
}

function drawArrow(context, fromx, fromy, tox, toy, headlen=10){ //Adapted from: https://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag 
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}
