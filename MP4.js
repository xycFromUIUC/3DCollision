
var gl;
var canvas;
var shaderProgram;
var vertexPositionBuffer;

var days=0;

var colorArray = [];
// Create a place to store sphere geometry
var sphereVertexPositionBuffer;

//Create a place to store normals for shading
var sphereVertexNormalBuffer;

// View parameters
var eyePt = vec3.fromValues(0.0,0.0,60.0);
var viewDir = vec3.fromValues(0.0,0.0,-1.0);
var up = vec3.fromValues(0.0,1.0,0.0);
var viewPt = vec3.fromValues(0.0,0.0,0.0);

// Create the normal
var nMatrix = mat3.create();

// Create ModelView matrix
var mvMatrix = mat4.create();

//Create Projection matrix
var pMatrix = mat4.create();

var mvMatrixStack = [];


var sphereNum = 10;
var sphereVelocity = [];//storing the velocity of the spheres, with vec3 types of elements
var spherePosition = [];//storing the position of the spheres, with vec3 types of elements
var drag = false;

/**
 *
 *  helper function connected to the "Enable/Disable Drag force" button.
 *  Modify the boolean drag and flush the Position and Velocity Array.
 *
*/
function changeDrag()
{
    drag = !drag;
        initialize();
}

/**
 *
 *  helper function connected to the "add sphere number/reset if too many" button.
 *  Modify the variable sphereNum and flush the Position and Velocity Array.
 *
*/

function incrementSphereNum()
{
    sphereNum++;
    if(sphereNum > 12)
        sphereNum = 6;
    initialize();
}

/**
 *
 *  Function to initialize the position and velocity array.
 *  Initial positions are separated for better effect.
 *
 */
function initialize()
{
    sphereVelocity = [];
    spherePosition = [];
    for(var i = 0; i < sphereNum; i++)
    {
        sphereVelocity.push(vec3.fromValues(-3 + 6 * Math.random(), -3 + 6 * Math.random(), -3 + 6 * Math.random()));
    }
    
    
    spherePosition.push(vec3.fromValues(-9.0 + 4*Math.random(), -9.0 + 4*Math.random(), 3.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(-9.0 + 4*Math.random(), -3.0 + 4*Math.random(), -9.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(-9.0 + 4*Math.random(), -3.0 + 4*Math.random(), -3.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(-9.0 + 4*Math.random(), -3.0 + 4*Math.random(), 3.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(-9.0 + 4*Math.random(), 3.0 + 4*Math.random(), -9.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(-9.0 + 4*Math.random(), 3.0 + 4*Math.random(), -3.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(-9.0 + 4*Math.random(), 3.0 + 4*Math.random(), 3.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(-3.0 + 4*Math.random(), -9.0 + 4*Math.random(), -9.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(-3.0 + 4*Math.random(), -9.0 + 4*Math.random(), -3.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(-3.0 + 4*Math.random(), -9.0 + 4*Math.random(), 3.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(-3.0 + 4*Math.random(), -3.0 + 4*Math.random(), -9.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(-3.0 + 4*Math.random(), -3.0 + 4*Math.random(), -3.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(-3.0 + 4*Math.random(), -3.0 + 4*Math.random(), 3.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(-3.0 + 4*Math.random(), 3.0 + 4*Math.random(), -9.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(-3.0 + 4*Math.random(), 3.0 + 4*Math.random(), -3.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(-3.0 + 4*Math.random(), 3.0 + 4*Math.random(), 3.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(3.0 + 4*Math.random(), -9.0 + 4*Math.random(), -9.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(3.0 + 4*Math.random(), -9.0 + 4*Math.random(), -3.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(3.0 + 4*Math.random(), -9.0 + 4*Math.random(), 3.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(3.0 + 4*Math.random(), -3.0 + 4*Math.random(), -9.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(3.0 + 4*Math.random(), -3.0 + 4*Math.random(), -3.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(3.0 + 4*Math.random(), -3.0 + 4*Math.random(), 3.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(3.0 + 4*Math.random(), 3.0 + 4*Math.random(), -9.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(3.0 + 4*Math.random(), 3.0 + 4*Math.random(), -3.0 + 4*Math.random()));
    spherePosition.push(vec3.fromValues(3.0 + 4*Math.random(), 3.0 + 4*Math.random(), 3.0 + 4*Math.random()));


    colorArray.push(vec3.fromValues(0.8, 0.0, 0.0));
    colorArray.push(vec3.fromValues(0.0, 0.8, 0.0));
    colorArray.push(vec3.fromValues(0.0, 0.0, 0.8));
    colorArray.push(vec3.fromValues(0.6, 0.6, 0.0));
    colorArray.push(vec3.fromValues(0.0, 0.6, 0.6));
    colorArray.push(vec3.fromValues(0.6, 0.0, 0.6));
    colorArray.push(vec3.fromValues(0.5, 0.5, 0.5));
    colorArray.push(vec3.fromValues(0.8, 0.0, 0.0));
    colorArray.push(vec3.fromValues(0.0, 0.8, 0.0));
    colorArray.push(vec3.fromValues(0.0, 0.0, 0.8));
    colorArray.push(vec3.fromValues(0.6, 0.6, 0.0));
    colorArray.push(vec3.fromValues(0.0, 0.6, 0.6));
    colorArray.push(vec3.fromValues(0.6, 0.0, 0.6));
    colorArray.push(vec3.fromValues(0.5, 0.5, 0.5));
    colorArray.push(vec3.fromValues(0.8, 0.0, 0.0));
    colorArray.push(vec3.fromValues(0.0, 0.8, 0.0));
    colorArray.push(vec3.fromValues(0.0, 0.0, 0.8));
    colorArray.push(vec3.fromValues(0.6, 0.6, 0.0));
    colorArray.push(vec3.fromValues(0.0, 0.6, 0.6));
    colorArray.push(vec3.fromValues(0.6, 0.0, 0.6));
}


//-------------------------------------------------------------------------
function setupSphereBuffers() {
    
    var sphereSoup=[];
    var sphereNormals=[];
    var numT=sphereFromSubdivision(6,sphereSoup,sphereNormals);
    console.log("Generated ", numT, " triangles"); 
    sphereVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);      
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereSoup), gl.STATIC_DRAW);
    sphereVertexPositionBuffer.itemSize = 3;
    sphereVertexPositionBuffer.numItems = numT*3;
    console.log(sphereSoup.length/9);
    
    // Specify normals to be able to do lighting calculations
    sphereVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereNormals),
                  gl.STATIC_DRAW);
    sphereVertexNormalBuffer.itemSize = 3;
    sphereVertexNormalBuffer.numItems = numT*3;
    
    console.log("Normals ", sphereNormals.length/3);     
}

//-------------------------------------------------------------------------
function drawSphere(){
 gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
 gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, 
                         gl.FLOAT, false, 0, 0);

 // Bind normal buffer
 gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
 gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 
                           sphereVertexNormalBuffer.itemSize,
                           gl.FLOAT, false, 0, 0);
 gl.drawArrays(gl.TRIANGLES, 0, sphereVertexPositionBuffer.numItems);      
}

//-------------------------------------------------------------------------
function uploadModelViewMatrixToShader() {
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

//-------------------------------------------------------------------------
function uploadProjectionMatrixToShader() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, 
                      false, pMatrix);
}

//-------------------------------------------------------------------------
function uploadNormalMatrixToShader() {
  mat3.fromMat4(nMatrix,mvMatrix);
  mat3.transpose(nMatrix,nMatrix);
  mat3.invert(nMatrix,nMatrix);
  gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, nMatrix);
}

//----------------------------------------------------------------------------------
function mvPushMatrix() {
    var copy = mat4.clone(mvMatrix);
    mvMatrixStack.push(copy);
}


//----------------------------------------------------------------------------------
function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
      throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

//----------------------------------------------------------------------------------
function setMatrixUniforms() {
    uploadModelViewMatrixToShader();
    uploadNormalMatrixToShader();
    uploadProjectionMatrixToShader();
}

//----------------------------------------------------------------------------------
function degToRad(degrees) {
        return degrees * Math.PI / 180;
}

//----------------------------------------------------------------------------------
function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i=0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

//----------------------------------------------------------------------------------
function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);
  
  // If we don't find an element with the specified id
  // we do an early exit 
  if (!shaderScript) {
    return null;
  }
  
  // Loop through the children for the found DOM element and
  // build up the shader source code as a string
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
 
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
 
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
 
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  } 
  return shader;
}

//----------------------------------------------------------------------------------
function setupShaders() {
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");
  
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    
  shaderProgram.uniformLightPositionLoc = gl.getUniformLocation(shaderProgram, "uLightPosition");    
  shaderProgram.uniformAmbientLightColorLoc = gl.getUniformLocation(shaderProgram, "uAmbientLightColor");  
  shaderProgram.uniformDiffuseLightColorLoc = gl.getUniformLocation(shaderProgram, "uDiffuseLightColor");
  shaderProgram.uniformSpecularLightColorLoc = gl.getUniformLocation(shaderProgram, "uSpecularLightColor");
    
  shaderProgram.uniformAmbientMatColorLoc = gl.getUniformLocation(shaderProgram, "uAmbientMatColor");  
  shaderProgram.uniformDiffuseMatColorLoc = gl.getUniformLocation(shaderProgram, "uDiffuseMatColor");
  shaderProgram.uniformSpecularMatColorLoc = gl.getUniformLocation(shaderProgram, "uSpecularMatColor");    
    
}


//-------------------------------------------------------------------------
function uploadLightsToShader(loc,a,d,s) {
  gl.uniform3fv(shaderProgram.uniformLightPositionLoc, loc);
  gl.uniform3fv(shaderProgram.uniformAmbientLightColorLoc, a);
  gl.uniform3fv(shaderProgram.uniformDiffuseLightColorLoc, d);
  gl.uniform3fv(shaderProgram.uniformSpecularLightColorLoc, s);
}

//-------------------------------------------------------------------------
function uploadMaterialToShader(a,d,s) {
  gl.uniform3fv(shaderProgram.uniformAmbientMatColorLoc, a);
  gl.uniform3fv(shaderProgram.uniformDiffuseMatColorLoc, d);
  gl.uniform3fv(shaderProgram.uniformSpecularMatColorLoc, s);
}


//----------------------------------------------------------------------------------
function setupBuffers() {
    setupSphereBuffers();     
}

/**
 *
 *  Modified draw() function from previous discussion demo.
 *  iteratively go through all of the spheres and draw them.
 *  Number of iteration depends on variable sphereNum.
 *
 */
function draw() { 
    var transformVec = vec3.create();
  
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // We'll use perspective 
    mat4.perspective(pMatrix,degToRad(45), gl.viewportWidth / gl.viewportHeight, 0.1, 200.0);

    // We want to look down -z, so create a lookat point in that direction    
    vec3.add(viewPt, eyePt, viewDir);
    // Then generate the lookat matrix and initialize the MV matrix to that view
    mat4.lookAt(mvMatrix,eyePt,viewPt,up);    
 
    // Set up light parameters
    var Ia = vec3.fromValues(1.0,1.0,1.0);
    var Id = vec3.fromValues(1.0,1.0,1.0);
    var Is = vec3.fromValues(1.0,1.0,1.0);
    
    var lightPosEye4 = vec4.fromValues(0.0,0.0,80.0,1.0);
    lightPosEye4 = vec4.transformMat4(lightPosEye4,lightPosEye4,mvMatrix);
    //console.log(vec4.str(lightPosEye4))
    var lightPosEye = vec3.fromValues(lightPosEye4[0],lightPosEye4[1],lightPosEye4[2]);
    
    //draw Sun
    // Set up material parameters    
    
    for(var i = 0; i < sphereNum; i++)
    {
        var ka = vec3.fromValues(0.0, 0.0, 0.0);
        var kd = vec3.fromValues(colorArray[i][0], colorArray[i][1], colorArray[i][2]);
        var ks = vec3.fromValues(0.5 * colorArray[i][0], 0.5 * colorArray[i][1], 0.5 * colorArray[i][2]);
        mvPushMatrix();
        vec3.set(transformVec, spherePosition[i][0], spherePosition[i][1], spherePosition[i][2]);
        mat4.translate(mvMatrix, mvMatrix,transformVec);
        vec3.set(transformVec, 1.0, 1.0, 1.0);
        mat4.scale(mvMatrix, mvMatrix,transformVec);
        uploadLightsToShader(lightPosEye,Ia,Id,Is);
        uploadMaterialToShader(ka,kd,ks);
        setMatrixUniforms();
        drawSphere();
        mvPopMatrix(); 
    }
    
/*    
    var ka = vec3.fromValues(0.0,0.0,0.0);
    var kd = vec3.fromValues(0.6,0.6,0.0);
    var ks = vec3.fromValues(0.4,0.4,0.0);
    mvPushMatrix();
    vec3.set(transformVec,0,0,80);
    mat4.translate(mvMatrix, mvMatrix,transformVec);
    uploadLightsToShader(lightPosEye,Ia,Id,Is);
    uploadMaterialToShader(ka,kd,ks);
    setMatrixUniforms();
    drawSphere();
    mvPopMatrix();
    
    //move to Earth position    
    mvPushMatrix();   
    mat4.rotateZ(mvMatrix, mvMatrix, degToRad(360*(days/365.0))); 
    vec3.set(transformVec,35.0,0.0,0.0);
    mat4.translate(mvMatrix, mvMatrix,transformVec);

    //draw moon 
    // Set up material parameters    
    ka = vec3.fromValues(0.0,0.0,0.0);
    kd = vec3.fromValues(0.4,0.4,0.4);
    ks = vec3.fromValues(0.1,0.1,0.1);
    
    mvPushMatrix();
    mat4.rotateZ(mvMatrix, mvMatrix, degToRad(360*(days/27.0)));  
    vec3.set(transformVec,10.0,0.0,0.0);
    mat4.translate(mvMatrix, mvMatrix,transformVec);
    vec3.set(transformVec,2.0,2.0,1.0);
    mat4.scale(mvMatrix, mvMatrix,transformVec);     
    uploadLightsToShader(lightPosEye,Ia,Id,Is);
    uploadMaterialToShader(ka,kd,ks);
    setMatrixUniforms();
    drawSphere();
    mvPopMatrix(); 
    
    //Draw Earth
    // Set up material parameters
    ka = vec3.fromValues(0.0,0.0,0.0);
    kd = vec3.fromValues(0.0,0.0,0.5);
    ks = vec3.fromValues(0.0,0.0,0.5);
    
    mvPushMatrix();
    vec3.set(transformVec,5.0,5.0,1.0);
    mat4.scale(mvMatrix, mvMatrix,transformVec);    
    uploadLightsToShader(lightPosEye,Ia,Id,Is);
    uploadMaterialToShader(ka,kd,ks);
    setMatrixUniforms();
    drawSphere();
    mvPopMatrix();
*/
}

/**
 *
 *  Wrapper function of the program. Containing all of the operations have to be done per timestamp.
 *
*/
function animate() {

    dealInterCollision();
    dealWallCollision();
    dealGravity();
    if(drag)
        dealDragForce();
    moveDeltaTime();
}

/**
 *
 *  Function to handle drag force. Here I claim that the resistance is proportional to the velocity (which obeys rocket formula in PHYS 325)
 *
 */
function dealDragForce()
{
    for(var i = 0; i < sphereNum; i++)
    {
        sphereVelocity[i][0] *= 0.99;
        sphereVelocity[i][1] *= 0.99;
        sphereVelocity[i][2] *= 0.99;
    }
}

/**
 *
 *  Detect existing collision between the spheres, if they exist, call the interCollision(i, j) function.
 *
 */
function dealInterCollision()
{
    for(var i = 0; i < sphereNum; i++)
    {
        for(var j = i + 1; j < sphereNum; j++)
        {
            if(vec3.distance(spherePosition[i], spherePosition[j]) <= 1.9)
            {
                interCollision(i, j);    
            }
        }
    }
}

/**
 *
 *  Detect existing collision to the walls, if they exist, modify the velocity so that an elastic collision occurs
 *
 */
function dealWallCollision()
{
    for(var i = 0; i < sphereNum; i++)
    {
        if(spherePosition[i][0] >= 9.0 && sphereVelocity[i][0] > 0.0)
        {
            sphereVelocity[i][0] = -sphereVelocity[i][0];
        }
        else if(spherePosition[i][1] >= 9.0 && sphereVelocity[i][1] > 0.0)
        {
            sphereVelocity[i][1] = -sphereVelocity[i][1];
        }
        else if(spherePosition[i][2] >= 9.0 && sphereVelocity[i][2] > 0.0)
        {
            sphereVelocity[i][2] = -sphereVelocity[i][2];
        }
        else if(spherePosition[i][0] <= -9.0 && sphereVelocity[i][0] < 0.0)
        {
            sphereVelocity[i][0] = -sphereVelocity[i][0];
        }
        else if(spherePosition[i][1] <= -9.0 && sphereVelocity[i][1] < 0.0)
        {
            sphereVelocity[i][1] = -sphereVelocity[i][1];
        }
        else if(spherePosition[i][2] <= -9.0 && sphereVelocity[i][2] < 0.0)
        {
            sphereVelocity[i][2] = -sphereVelocity[i][2];
        }
    }
}

/**
 *
 *  Key function to deal with collision between spheres, which covers all possible collision from all directions. Here I claim elastic collision.
 *  Thanks to PHYS 325 and PHYS 326!!!
 *
 */
function interCollision(i, j)
{
    var interCenter0 = spherePosition[i][0] - spherePosition[j][0];
    var interCenter1 = spherePosition[i][1] - spherePosition[j][1];
    var interCenter2 = spherePosition[i][2] - spherePosition[j][2];
    var diffVelocity0 = sphereVelocity[i][0] - sphereVelocity[j][0];
    var diffVelocity1 = sphereVelocity[i][1] - sphereVelocity[j][1];
    var diffVelocity2 = sphereVelocity[i][2] - sphereVelocity[j][2];
    var upNum = interCenter0 * diffVelocity0 + interCenter1 * diffVelocity1 + interCenter2 * diffVelocity2;
    var downNum = interCenter0 * interCenter0 + interCenter1 * interCenter1 + interCenter2 * interCenter2;
    var lambda = Math.abs(upNum / downNum);
    sphereVelocity[i][0] += lambda * interCenter0;
    sphereVelocity[i][1] += lambda * interCenter1;
    sphereVelocity[i][2] += lambda * interCenter2;
    sphereVelocity[j][0] -= lambda * interCenter0;
    sphereVelocity[j][1] -= lambda * interCenter1;
    sphereVelocity[j][2] -= lambda * interCenter2;
}
/**
 *
 *  Function to deal with gravity. Constantly decreasing the y-component velocity of all spheres.
 *
 */
function dealGravity()
{
    for(var i = 0; i < sphereNum; i++)
    {
        sphereVelocity[i][1] -= 0.5;
    }
}

/**
 *
 *  Function to move ahead. Mainly move a weighted constant times the velocity.
 *  But I hardcoded the position of the spheres in case of tunnelling across the walls.
 *
 */
function moveDeltaTime()
{
    for(var i = 0; i < sphereNum; i++)
    {
        spherePosition[i][0] += 0.01 * sphereVelocity[i][0];
        spherePosition[i][1] += 0.01 * sphereVelocity[i][1];
        spherePosition[i][2] += 0.01 * sphereVelocity[i][2];
        if(spherePosition[i][0] < -9.0)
            spherePosition[i][0] = -9.0;
        if(spherePosition[i][1] < -9.0)
            spherePosition[i][1] = -9.0;
        if(spherePosition[i][2] < -9.0)
            spherePosition[i][2] = -9.0;
        if(spherePosition[i][0] > 9.0)
            spherePosition[i][0] = 9.0;
        if(spherePosition[i][1] > 9.0)
            spherePosition[i][1] = 9.0;
        if(spherePosition[i][2] > 9.0)
            spherePosition[i][2] = 9.0;
    }
}
//----------------------------------------------------------------------------------
function startup() {
  canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas);
  initialize();
  setupShaders();
  setupBuffers();

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  tick();
}

//----------------------------------------------------------------------------------
function tick() {
    requestAnimFrame(tick);
    draw();
    console.log(spherePosition[0][0]);
    console.log(spherePosition[0][1]);
    console.log(spherePosition[0][2]);
    animate();
}

function restart()
{
    initialize();
}

