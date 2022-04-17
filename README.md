# Landing page: https://freebody.herokuapp.com/

### Getting started:

### To initialize a new diagram, we must run the following commands first:

 //Make a new inclined plane with name "p1"  
const FBD = new inclinedPlane("p1")  
FBD.generate()  
  
//Make a new flat plane with name "p2"  
const FBD2 = new plane("p2")  
FBD2.generate()  
  

### This generates the diagram with no force object on it, meaning we just have a plane/inclined plane with the default values for slope, height, and width.

  

### To add force objects, use the following command:

FBD.addForceObject("box")  
FBD.generateBox()
# For further documentation, please visit: 
## https://freebody.herokuapp.com/documentation
