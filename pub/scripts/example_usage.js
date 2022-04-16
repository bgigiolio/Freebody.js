const FBD = new inclinedPlane("p1")
const FBD2 = new plane("p2")
async function demo() {
    const text = document.getElementById("demo");
    text.innerHTML = "Running .generate()"
    // await new Promise(r => setTimeout(r, 2000));
    FBD.generate()
    text.innerHTML = "Running .allowSlopeInput()"
    // await new Promise(r => setTimeout(r, 2000));
    FBD.allowSlopeInput();
    text.innerHTML = "Running .allowHeightInput()"
    // await new Promise(r => setTimeout(r, 2000));
    FBD.allowHeightInput();
    text.innerHTML = "Running .addForceObject(\"box\")"
    // await new Promise(r => setTimeout(r, 2000));
    // FBD.setHeight(30, "in")
    FBD.setHeight("x")
    FBD.setMass(40, "kg")
    FBD.setForces({"Normal": "5N", "Right" : "3N"})
    FBD.addForceObject("box")
    text.innerHTML = "Try editing some of the inputs!"
    const br = document.createElement("br")
    const body = document.getElementsByTagName("body")[0];
    body.appendChild(br)
    FBD2.generate()
    FBD2.generateBox()
    FBD2.allowWidthInput()
    FBD2.setForces({"Normal": "5N", "Right" : "3N"})
}

demo();
