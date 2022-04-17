const FBD = new inclinedPlane("p1")
const FBD2 = new plane("p2")
const FBD3 = new inclinedPlane("p3")
const FBD4 = new inclinedPlane("p4")
const FBD5 = new inclinedPlane("p5")
async function demo() {
    let lastKnownScrollPosition = 0;
    let ticking = false;
    
    function doSomething() {
      FBD.generateBox()
      FBD2.generateBox()
      FBD3.generateBox()
      FBD4.generateBox()
      FBD5.generateBox()
    }
    
    document.addEventListener('scroll', function(e) {    
      if (!ticking) {
        window.requestAnimationFrame(function() {
          doSomething();
          ticking = false;
        });
    
        ticking = true;
      }
    });




    let info = document.getElementById("info2")
    let d2 = document.getElementById("d2")
    FBD.generate()
    FBD.addForceObject("box")
    FBD.setHeightPx(200)
    let p1 = document.getElementById("p1")
    info.appendChild(p1)
    FBD2.generate()
    FBD2.addForceObject("box")
    FBD2.setWidthPx(500)
    let p2 = document.getElementById("p2")
    d2.appendChild(p2)
    
    FBD3.generate()
    FBD3.addForceObject("box")
    FBD3.setHeightPx(200)
    FBD3.allowHeightInput()
    FBD3.allowSlopeInput()
    FBD3.generateBox()
    let d3 = document.getElementById("d3")
    let p3 = document.getElementById("p3")
    d3.appendChild(p3)
    FBD.generateBox()
    FBD4.generate()
    FBD4.setHeightPx(200)
    FBD4.setSlopeAngle(30)
    FBD4.setHeight("6x")
    FBD4.addForceObject("box")
    FBD4.generateBox()
    freeDiv = document.getElementById("p1")
    // popupDiv = document.getElementById("p1Popup")
    let d4 = document.getElementById("d4")
    let p4 = document.getElementById("p4")
    d4.appendChild(p4)
    FBD5.generate()
    FBD5.allowPopup()
    FBD5.setHeight("x")
    FBD5.setHeightPx(200)
    FBD5.setMass(40, "kg")
    FBD5.setForces({"Normal": "5N", "Right" : "3N", "Left" : "1N", "Down": "2N", "Gravity": "mg"})
    FBD5.addForceObject("box")
    FBD5.setHoverColor("#49eb34")
    FBD5.generateBox()
    let d5 = document.getElementById("d5")
    // let popup = document.getElementById("p5Popup")
    let p5 = document.getElementById("p5")
    d5.appendChild(p5)
    FBD5.generateBox()
    // d5.appendChild(popup)

    
}

demo();
