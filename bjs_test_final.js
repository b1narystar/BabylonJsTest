var createScene = function () {
	var scene = new BABYLON.Scene(engine);
	  scene.enablePhysics(new BABYLON.Vector3(0, -0.8, 0), BABYLON.OimoJSPlugin());

	// Setup environment
	/*var camera = new BABYLON.ArcRotateCamera("ArcCamera", 1, 0.8, 10, new BABYLON.Vector3(0, 100, -400), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);*/

  var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(50, 100, 315), scene);
  camera.rotation = new BABYLON.Vector3(0.3, Math.PI, 0);
  camera.rotation.y = Math.PI + 0.2;
  //camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  //var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  //light.intensity = 0.7;

	var light1 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
  //light1.direction = new BABYLON.Vector3(-1, -2, -1);
  light1.position = new BABYLON.Vector3(-100, 500, -100);
  light1.intensity = 0.7;
  light1.shadowOrthoScale = 0.1;

   var lightSphere = BABYLON.Mesh.CreateSphere("lightSphere", 10, 10.0, scene, true);
  lightSphere.position = light1.position;
  lightSphere.material = new BABYLON.StandardMaterial("light", scene);
  lightSphere.material.emmissiveColor = new BABYLON.Color3(1, 1, 0);


  var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
  //light1.direction = new BABYLON.Vector3(-1, -2, -1);
  light2.position = new BABYLON.Vector3(300, 500, -50);
  light2.intensity = 0.3;

   var lightSphere = BABYLON.Mesh.CreateSphere("lightSphere", 10, 10.0, scene, true);
  lightSphere.position = light2.position;
  lightSphere.material = new BABYLON.StandardMaterial("light", scene);
  lightSphere.material.emmissiveColor = new BABYLON.Color3(1, 1, 0);



	// Ground
  var ground = BABYLON.Mesh.CreatePlane("ground", 150.0, scene);
  ground.material = new BABYLON.StandardMaterial("groundMat", scene);
  ground.material.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7);
  ground.material.backFaceCulling = false;
  ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
  ground.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.1 });
  ground.updatePhysicsBody();
  ground.isPickable = true;

  var dragWall = BABYLON.Mesh.CreatePlane("drag", 150.0, scene);
  dragWall.material = new BABYLON.StandardMaterial("dragMat", scene);
  dragWall.material.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7);
  dragWall.position = new BABYLON.Vector3(0, 75, 75);
  dragWall.material.frontFaceCulling = true;
  //dragWall.material.backFaceCulling = false;

    var sphere = BABYLON.Mesh.CreateSphere("sphere", 20.0, 15.0, scene, true);
  //sphere.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, { mass: 0, friction: 0.0, restitution: 0.0 });
  //sphere.updatePhysicsBody();
  sphere.position.y = 10;
  sphere.material = new BABYLON.StandardMaterial("sphereTexture", scene);
  sphere.material.diffuseColor = new BABYLON.Color3(1, 0, 0);

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
  ]

  var boxes = [];

  for (var i = 0; i < 12; ++i) {
    var box = BABYLON.Mesh.CreateBox("box" + i, 10, scene);
    box.material = new BABYLON.StandardMaterial("box" + i + "Mat", scene);
    box.material.diffuseColor = boxColors[(i + 9) % 12];
	box.material.specularColor = boxColors[(i + 9) % 12];
    box.position = new BABYLON.Vector3(50 * Math.cos(i * Math.PI / 6), 100, 50 * Math.sin(i * Math.PI / 6));
    box.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 1, friction: 0.5, restitution: 0.0001 });
    //box.rotate(new BABYLON.Vector3(Math.PI / 4, 0, 0));
    boxes.push(box);
  }

  var easingFunction = new BABYLON.SineEase();
  easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);

  light1.direction = sphere.position.subtract(light1.position).normalize();
	light2.direction = sphere.position.subtract(light2.position).normalize();

	// Shadows
	var shadowGenerator = new BABYLON.ShadowGenerator(1024, light1);
	shadowGenerator.getShadowMap().renderList.push(sphere);

	for (var i = 0; i < boxes.length; ++i) {
	  shadowGenerator.getShadowMap().renderList.push(boxes[i]);
  }
	shadowGenerator.useVarianceShadowMap = true;

	ground.receiveShadows = true;

	var torus = BABYLON.Mesh.CreateTorus("torus", 8, 5, 20, scene, true);
    var torusMaterial = new BABYLON.StandardMaterial("torusTexture", scene);
	torus.position = new BABYLON.Vector3(45, 80, 280);

    var blueTorus = new BABYLON.Color3(0.008, 0, 0.729);
    var turqoisTorus = new BABYLON.Color3(0.047, 0.518, 0.31);
    var greenTorus = new BABYLON.Color3(0.075, 0.898, 0.035);

    torusMaterial.diffuseColor = blueTorus;
    torus.material = torusMaterial;

    var torusColorAnimation = new BABYLON.Animation(
    	"torusColor", "material.diffuseColor", 30,
        BABYLON.Animation.ANIMATIONTYPE_COLOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var keys = [];
    keys.push(
    	{ frame: 0, value: blueTorus },
        { frame: 50, value: turqoisTorus },
        { frame: 100, value: greenTorus },
        { frame: 150, value: turqoisTorus },
        { frame: 200, value: blueTorus }
    );

    torusColorAnimation.setKeys(keys);
    torus.animations.push(torusColorAnimation);

	var getPlanePosition = function () {
    // Use a predicate to get position on the drag wall
    var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == dragWall || mesh == ground; });
    if (pickinfo.hit) {
      return pickinfo.pickedPoint;
    }
    return null;
  };

  var currentMesh;
  var startingPoint;

  var onPointerDown = function (e) {
    if (e.button !== 0) { return; }

    var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == sphere; });
    if (pickInfo.hit) {
      currentMesh = pickInfo.pickedMesh;
      startingPoint = getPlanePosition();

      if (startingPoint) {
        setTimeout(function () {
          camera.detachControl(canvas);
        }, 0);
      }
    }
  };

  var onPointerUp = function () {
    if (startingPoint) {
      camera.attachControl(canvas, true);
      startingPoint = null;
      return;
    }
  };

  var onPointerMove = function (e) {
    if (!startingPoint) { return; }

    var current = getPlanePosition();

    if (!current) { return; }

    var pickInfo = scene.pickWithRay(new BABYLON.Ray(sphere.position, new BABYLON.Vector3(0, -1, 0)), function (mesh) { return mesh == ground; });
    var groundDistance = current.y - pickInfo.pickedPoint.y;

    if (groundDistance >= 0 && groundDistance < 50) {
      sphere.material.diffuseColor = new BABYLON.Color3(0.8 - (groundDistance / 100.0), 0, 0.2 + (groundDistance / 100.0));
      //console.log(sphere.material.diffuseColor);
    } else if (groundDistance >= 50 && groundDistance < 100) {
        sphere.material.diffuseColor = new BABYLON.Color3(0, 0.2 + (groundDistance / 100.0), 0.8 - (groundDistance / 100.0));
        //console.log(sphere.material.diffuseColor);
    } else if (groundDistance >= 100 && groundDistance <= 150) {
        sphere.material.diffuseColor = new BABYLON.Color3(0.2 + (groundDistance / 150.0), 1.2 - (groundDistance / 150.0), 0);
    }

    var diff = current.subtract(startingPoint);

    easingFunction.ease(diff.y);
    currentMesh.position.addInPlace(diff);
    currentMesh.position.x = 0;
    currentMesh.position.z = 0;
    startingPoint = current;
  };

  canvas.addEventListener("pointerdown", onPointerDown, false);
  canvas.addEventListener("pointerup", onPointerUp, false);
  canvas.addEventListener("pointermove", onPointerMove, false);

  scene.onDispose = function () {
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointermove", onPointerMove);
  };

  var torusAnimation = null;

  scene.registerBeforeRender(function () {
		//console.log(camera.position);

		var cameraRay = new BABYLON.Ray(camera.position, camera.cameraDirection, 100);
        var pickInfo = scene.pickWithRay(cameraRay, function (mesh) { return mesh == torus; });
		//console.log(pickInfo);

		if (pickInfo.hit) {
			torusAnimation = scene.beginAnimation(torus, 0, 200, true);
		}

		for (var i = 0; i < boxes.length; ++i) {
			if (boxes[i].position.y > 10) {
				boxes[i].lookAt(sphere.position);
			} else {
				//boxes[i].applyImpulse(new BABYLON.Vector3(0, 0.01, 0), new BABYLON.Vector3(0.01, 0.01, 0.01));
			}
		}
	});

	return scene;
}
