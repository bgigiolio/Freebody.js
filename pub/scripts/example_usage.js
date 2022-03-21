const FBD = new inclinedPlane
async function demo() {
    const text = document.getElementById("demo");
    text.innerHTML = "Running .generate()"
    await new Promise(r => setTimeout(r, 2000));
    FBD.generate()
    text.innerHTML = "Running .allowSlopeInput()"
    await new Promise(r => setTimeout(r, 2000));
    FBD.allowSlopeInput();
    text.innerHTML = "Running .allowHeightInput()"
    await new Promise(r => setTimeout(r, 2000));
    FBD.allowHeightInput();
    text.innerHTML = "Running .addForceObject(\"box\")"
    await new Promise(r => setTimeout(r, 2000));
    FBD.addForceObject("box")
    text.innerHTML = "Try editing some of the inputs!"
}

demo();
