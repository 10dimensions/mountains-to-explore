import React, { Component } from "react";
import * as THREE from "three";
import MTLLoader from "three-mtl-loader";
import OBJLoader from "three-obj-loader";
import OrbitControls from "three-orbitcontrols";
OBJLoader(THREE);

var earthMesh, freedomMesh;
var scene;

class Earth extends Component {
  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 8;
    this.camera.position.y = 5;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor("#000008");
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    //Add SPHERE
    //LOAD TEXTURE and on completion apply it on box
    var loader = new THREE.TextureLoader();
    loader.load(
      "./assets/bis-earth.jpg",
      this.onLoad,
      this.onProgress,
      this.onError
    );

    //LIGHTS
    var lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 3, 0);
    lights[1] = new THREE.PointLight(0xffffff, 0.2, 0);
    lights[0].position.set(200, 0, 0);
    lights[1].position.set(-500, 0, 0);
    scene.add(lights[0]);
    scene.add(lights[1]);

    var mtlLoader = new MTLLoader();
    mtlLoader.setBaseUrl("./assets/");
    // load material
    mtlLoader.load("freedom.mtl", function (materials) {
      materials.preload();
      console.log("loaded Material");

      // load Object
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(
        "./assets/freedom.obj",
        function (object) {
          freedomMesh = object;
          freedomMesh.position.setY(3); //or  this
          freedomMesh.scale.set(0.02, 0.02, 0.02);
          //scene.add(freedomMesh);
        },
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // called when loading has errors
        function (error) {
          console.log("An error happened" + error);
        }
      );
      // objLoader.load("freedom.obj", function(object) {
      //   freedomMesh = object;
      //   freedomMesh.position.setY(3); //or  this
      //   freedomMesh.scale.set(0.02, 0.02, 0.02);
      //   scene.add(freedomMesh);
      // });
    });
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }
  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };
  stop = () => {
    cancelAnimationFrame(this.frameId);
  };
  animate = () => {
    this.earthMesh.rotation.y += 0.001;
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };
  renderScene = () => {
    if (this.renderer) this.renderer.render(scene, this.camera);
  };

  onLoad = (texture) => {
    var objGeometry = new THREE.SphereBufferGeometry(3, 200, 200);
    var objMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      shading: THREE.FlatShading
    });

    this.earthMesh = new THREE.Mesh(objGeometry, objMaterial);
    scene.add(this.earthMesh);
    this.renderScene();
    //start animation
    this.start();
  };

  onProgress = (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  };

  // Function called when download errors
  onError = (error) => {
    console.log("An error happened" + error);
  };

  render() {
    return (
      <div
        style={{ width: "100%", height: "800px" }}
        ref={(mount) => {
          this.mount = mount;
        }}
      />
    );
  }
}
export default Earth;
