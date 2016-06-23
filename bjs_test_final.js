var createScene = function () {
	var scene = new BABYLON.Scene(engine);

  // enable oimo physics engine
	scene.enablePhysics(new BABYLON.Vector3(0, -0.8, 0), BABYLON.OimoJSPlugin());

  // this block of code contains some unnecessary elements with regard to the
  // scene but were useful for generic lighting, full camera view of the scene,
  // and for determining light positioning with spheres
	/* var camera = new BABYLON.ArcRotateCamera("ArcCamera", 1, 0.8, 10, new BABYLON.Vector3(0, 100, -400), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  // basic light pointed up for omnidirectional lighting
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  // a sphere used to determine the position of a directional light
  var lightSphere1 = BABYLON.Mesh.CreateSphere("lightSphere", 10, 10.0, scene, true);
  lightSphere.position = light1.position;
  lightSphere.material = new BABYLON.StandardMaterial("light", scene);
  lightSphere.material.emmissiveColor = new BABYLON.Color3(1, 1, 0);

  // a sphere used to determine the position of a directional light
  var lightSphere2 = BABYLON.Mesh.CreateSphere("lightSphere", 10, 10.0, scene, true);
  lightSphere.position = light2.position;
  lightSphere.material = new BABYLON.StandardMaterial("light", scene);
  lightSphere.material.emmissiveColor = new BABYLON.Color3(1, 1, 0); */

  	// Setup the camera
  var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(50, 100, 315), scene);
  camera.rotation = new BABYLON.Vector3(0.3, Math.PI, 0); // rotate the camera 180 degrees
  camera.rotation.y = Math.PI + 0.2; // rotate the camera y component 180 degrees
  camera.attachControl(canvas, true);

  // create a new directional light for shadow effects, this is the main lighting
	var light1 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
  light1.position = new BABYLON.Vector3(-100, 500, -100);
  light1.intensity = 0.7;

  // create another directional light to soften the shadow contrast, this one
  // is positioned in opposition to the main directional light
  var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
  light2.position = new BABYLON.Vector3(300, 500, -50);
  light2.intensity = 0.3; // lower intensity for secondary light

	// create the ground mesh
  var ground = BABYLON.Mesh.CreatePlane("ground", 150.0, scene);
  ground.material = new BABYLON.StandardMaterial("groundMat", scene);
  ground.material.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7); // color it gray

  // remove backface culling so that the mesh is visible from top and bottom,
  // useful for setting up the scene
  // ground.material.backFaceCulling = false;

  // rotate the ground 90 degrees so it lays flat with respect to the camera
  ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

  // setup the physics properties of the ground mesh, no mass and low bounce
  ground.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.1 });
  ground.updatePhysicsBody();
  ground.isPickable = true; // allow picking on the ground mesh

  // this is a mesh that is hidden from the camera's point of view that is used
  // to faciliate dragging the sphere defined below up and down
  var dragWall = BABYLON.Mesh.CreatePlane("drag", 150.0, scene);
  dragWall.material = new BABYLON.StandardMaterial("dragMat", scene);

  // set the color of the wall to grey, useful for setting up the scene
  // dragWall.material.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7);

  // position the wall at the edge of the ground mesh nearest to the camera
  dragWall.position = new BABYLON.Vector3(0, 75, 75);

  // cull the front face so that it defaults the visible face to the back face,
  // effectively hiding the mesh from the camera's point of view
  dragWall.material.frontFaceCulling = true;
  dragWall.isPickable = true; // allow picking on the dragWall

  // create the draggable sphere
  var sphere = BABYLON.Mesh.CreateSphere("sphere", 20.0, 15.0, scene, true);
  sphere.position.y = 10; // position it slightly above the ground
  sphere.material = new BABYLON.StandardMaterial("sphereTexture", scene);
  sphere.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // red

  // these are the box colors starting with the light purple box nearest the
  // camera and rotating counter-clockwise around the box ring
  var boxColors = [
	  new BABYLON.Color3(0.443, 0.263, 0.451),
	  new BABYLON.Color3(0.608, 0, 0.337),
	  new BABYLON.Color3(0.059, 0.008, 0.02),
	  new BABYLON.Color3(0.235, 0.416, 0.165),
	  new BABYLON.Color3(0.114, 0.612, 0.196),
	  new BABYLON.Color3(0.247, 0.29, 0.055),
	  new BABYLON.Color3(0.278, 0.678, 0.294),
	  new BABYLON.Color3(0.486, 0.659, 0.498),
	  new BABYLON.Color3(0.094, 0.102, 0.435),
	  new BABYLON.Color3(0.071, 0.62, 0.549),
	  new BABYLON.Color3(0.675, 0.525, 0.259),
	  new BABYLON.Color3(0.443, 0.706, 0.298)
  ];

  var boxes = []; // array to store box mesh objects

  // create 12 boxes
  for (var i = 0; i < 12; ++i) {
    var box = BABYLON.Mesh.CreateBox("box" + i, 10, scene);
    box.material = new BABYLON.StandardMaterial("box" + i + "Mat", scene);

    // determine the box position using sine and cosine functions to position
    // each box around a circle
    box.position = new BABYLON.Vector3(50 * Math.cos(i * Math.PI / 6), 100, 50 * Math.sin(i * Math.PI / 6));

    // set the box color, because the boxes are positioned starting from the
    // left of the camera view and then rotating clockwise the colors chosen
    // for each box are shifted 9 indices and then the remainder is taken based
    // on the number of box colors, effectively rotating the color selection
    box.material.diffuseColor = boxColors[(i + 9) % 12];
	  box.material.specularColor = boxColors[(i + 9) % 12];

    // set the box physics, low bounce
    box.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 1, friction: 0.5, restitution: 0.0001 });
    boxes.push(box); // add the new mesh to the boxes array
  }

  // this is an easing function used to smooths the effects of various animations
  // that are used in the scene
  var easingFunction = new BABYLON.SineEase();
  easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);

  // now that the meshes are in place, focus the directional lighting on the sphere
  light1.direction = sphere.position.subtract(light1.position).normalize();
	light2.direction = sphere.position.subtract(light2.position).normalize();

	// create the shadow effects
	var shadowGenerator = new BABYLON.ShadowGenerator(1024, light1);
	shadowGenerator.getShadowMap().renderList.push(sphere); // add the sphere

  // add each box to the shadow map
	for (i = 0; i < boxes.length; ++i) {
	  shadowGenerator.getShadowMap().renderList.push(boxes[i]);
  }

  // set the shadow map filter to simple variance
	shadowGenerator.useVarianceShadowMap = true;

  // set the ground mesh to display computed shadows
	ground.receiveShadows = true;

  // create the torus
	var torus = BABYLON.Mesh.CreateTorus("torus", 8, 5, 20, scene, true);
  torus.material = new BABYLON.StandardMaterial("torusTexture", scene);
	torus.position = new BABYLON.Vector3(45, 80, 280);

  // torus colors used in the animation sequence
  var blueTorus = new BABYLON.Color3(0.008, 0, 0.729);
  var turqoisTorus = new BABYLON.Color3(0.047, 0.518, 0.31);
  var greenTorus = new BABYLON.Color3(0.075, 0.898, 0.035);

  // set the default color to blue
  torus.material.diffuseColor = blueTorus;

  // create the torus animation, specifying a color transition
  var torusColorAnimation = new BABYLON.Animation(
    "torusColor", "material.diffuseColor", 30,
    BABYLON.Animation.ANIMATIONTYPE_COLOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

  // animation keys, transition from blue to green and then back to blue
  var keys = [];
  keys.push(
    { frame: 0, value: blueTorus },
    { frame: 50, value: turqoisTorus },
    { frame: 100, value: greenTorus },
    { frame: 150, value: turqoisTorus },
    { frame: 200, value: blueTorus }
  );

  // set the animation keys and add the animation to the torus mesh
  torusColorAnimation.setKeys(keys);
  torus.animations.push(torusColorAnimation);

  // the functions below are adapted from the drag and drop example on the
  // babylonjs playground

  // this function uses the (x, y) position of a mouse click on the ground
  // or on the hidden wall mesh to determine the mouse positions complementary
  // point in the 3D space
	var getPlanePosition = function () {
    // Use a predicate to get position on the drag wall or ground
    var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == dragWall || mesh == ground; });
    if (pickinfo.hit) {
      return pickinfo.pickedPoint;
    }
    return null;
  };

  var currentMesh; // the picked mesh
  var startingPoint; // the current position of the picked mesh

  // when the mouse button is clicked get the picked mesh and the starting pointerX
  // then detach the camera from the canvas for the mouse drag
  var onPointerDown = function (e) {
    if (e.button !== 0) { return; } // check that left mouse button is clicked

    // Use a predicate to get position on the sphere
    var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == sphere; });
    if (pickInfo.hit) {
      currentMesh = pickInfo.pickedMesh;
      startingPoint = getPlanePosition();

      // if the ground or wall is behind the sphere detach the camera
      if (startingPoint) {
        setTimeout(function () {
          camera.detachControl(canvas);
        }, 0);
      }
    }
  };

  // when the left mouse button is released, reattach the camera and null out
  // the starting point for the next mouse click
  var onPointerUp = function () {
    if (startingPoint) {
      camera.attachControl(canvas, true);
      startingPoint = null;
      return;
    }
  };

  // once the left mouse button is clicked and held down start dragging the sphere
  var onPointerMove = function (e) {
    if (!startingPoint) { return; } // check that the mouse hasn't been released

    var current = getPlanePosition(); // get the current position of the mouse in 3D

    if (!current) { return; } // check that the drag is on an allowed mesh

    // use a ray centered on the sphere and directed down to determine the
    // distance between the sphere and the ground mesh
    var pickInfo = scene.pickWithRay(new BABYLON.Ray(sphere.position, new BABYLON.Vector3(0, -1, 0)), function (mesh) { return mesh == ground; });
    var groundDistance = current.y - pickInfo.pickedPoint.y;

    // using the distance, the color of the sphere is transition from red to blue
    // then from blue to green, and finally green to red at the top. each color
    // change uses the groundDistance to determine the color transition
    if (groundDistance >= 0 && groundDistance < 50) {
      sphere.material.diffuseColor = new BABYLON.Color3(0.8 - (groundDistance / 100.0), 0, 0.2 + (groundDistance / 100.0));
    } else if (groundDistance >= 50 && groundDistance < 100) {
        sphere.material.diffuseColor = new BABYLON.Color3(0, 0.2 + (groundDistance / 100.0), 0.8 - (groundDistance / 100.0));
    } else if (groundDistance >= 100 && groundDistance <= 150) {
        sphere.material.diffuseColor = new BABYLON.Color3(0.2 + (groundDistance / 150.0), 1.2 - (groundDistance / 150.0), 0);
    }

    // get the difference between the current mouse position in 3D space and
    // the starting point when the dragging event began
    var diff = current.subtract(startingPoint);

    easingFunction.ease(diff.y); // smooth the y value of the drag difference
    currentMesh.position.addInPlace(diff); // move the sphere to the mouse position
    currentMesh.position.x = 0; // null out x and z since the sphere only moves in y direction
    currentMesh.position.z = 0;
    startingPoint = current; // set the new starting point to the current mouse position
  };

  // add event listeners for the range of mouse actions
  canvas.addEventListener("pointerdown", onPointerDown, false);
  canvas.addEventListener("pointerup", onPointerUp, false);
  canvas.addEventListener("pointermove", onPointerMove, false);

  // when the scene is destroyed, remove the event listeners
  scene.onDispose = function () {
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointermove", onPointerMove);
  };

  // this function is used for the torus animation and the box orientation
  // which are refreshed on each rendering
  scene.registerBeforeRender(function () {
    // get a ray positioned on the camera and facing in its direction with a length of 100 units
		var cameraRay = new BABYLON.Ray(camera.position, camera.cameraDirection, 100);

    // get a picked point based on the camera ray and allowing only the torus
    var pickInfo = scene.pickWithRay(cameraRay, function (mesh) { return mesh == torus; });

    // if the camera is facing the torus, start the animation
    // note: this will only work if the camera is moved slightly towards the torus
		if (pickInfo.hit) {
			torusAnimation = scene.beginAnimation(torus, 0, 200, true);
		}

    // orient each box towards the sphere until they are near the ground
		for (var i = 0; i < boxes.length; ++i) {
			if (boxes[i].position.y > 10) {
				boxes[i].lookAt(sphere.position);
			}
		}
	});

	return scene;
};
