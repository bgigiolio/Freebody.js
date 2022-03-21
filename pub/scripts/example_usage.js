const FBD = new inclinedPlane
FBD.generate(20, 70)
FBD.allowSlopeInput();
FBD.allowHeightInput();
FBD.addForceObject("box")