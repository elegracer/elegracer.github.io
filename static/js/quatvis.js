import * as THREE from "./threejs/build/three.module.js";

import { OrbitControls } from "./threejs/examples/jsm/controls/OrbitControls.js";
import { LineMaterial } from "./threejs/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "./threejs/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "./threejs/examples/jsm/lines/LineSegmentsGeometry.js";

let group, camera, scene, renderer;

init();
animate();

function init() {

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(document.body.clientWidth, document.body.clientWidth / 4 * 3);
    document.getElementById('canvas_div').appendChild(renderer.domElement);

    // camera

    camera = new THREE.PerspectiveCamera(40, 4 / 3, 1, 1000);
    camera.position.set(15, 20, 30);
    camera.up = new THREE.Vector3(0, 0, 1);
    scene.add(camera);

    // controls

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 20;
    controls.maxDistance = 100;
    // controls.maxPolarAngle = Math.PI;

    // ambient light

    scene.add(new THREE.AmbientLight(0x222222));

    // point light

    const light = new THREE.PointLight(0xffffff, 1);
    camera.add(light);

    // helper

    scene.add(new THREE.AxesHelper(20));

    // textures

    group = new THREE.Group();
    scene.add(group);

    // points

    const camera_geometry = new THREE.BufferGeometry();
    camera_geometry.setFromPoints([
        new THREE.Vector3(0, 0, 0), // line 1
        new THREE.Vector3(3.2, 2.4, 5.0),
        new THREE.Vector3(0, 0, 0), // line 2
        new THREE.Vector3(3.2, -2.4, 5.0),
        new THREE.Vector3(0, 0, 0), // line 3
        new THREE.Vector3(-3.2, -2.4, 5.0),
        new THREE.Vector3(0, 0, 0), // line 4
        new THREE.Vector3(-3.2, 2.4, 5.0),
        new THREE.Vector3(3.2, 2.4, 5.0), // line 5
        new THREE.Vector3(3.2, -2.4, 5.0),
        new THREE.Vector3(3.2, -2.4, 5.0), // line 6
        new THREE.Vector3(-3.2, -2.4, 5.0),
        new THREE.Vector3(-3.2, -2.4, 5.0), // line 7
        new THREE.Vector3(-3.2, 2.4, 5.0),
        new THREE.Vector3(-3.2, 2.4, 5.0), // line 8
        new THREE.Vector3(3.2, 2.4, 5.0),
    ]);
    const camera_material = new THREE.LineBasicMaterial({
        color: 0xffffff
    });
    const camera_points = new THREE.LineSegments(camera_geometry, camera_material);
    group.add(camera_points);

    const camera_axis_geometry = new LineSegmentsGeometry();
    camera_axis_geometry.setPositions([
        0, 0, 0,
        5, 0, 0,
        0, 0, 0,
        0, 5, 0,
        0, 0, 0,
        0, 0, 5,
    ]);
    camera_axis_geometry.setColors([
        1, 0, 0,
        1, 0, 0,
        0, 1, 0,
        0, 1, 0,
        0, 0, 1,
        0, 0, 1,
    ]);
    const matLine = new LineMaterial({
        linewidth: 5,
        worldUnits: false,
        vertexColors: true,
        alphaToCoverage: true,
    });
    const camera_axis_lines = new LineSegments2(camera_axis_geometry, matLine);
    group.add(camera_axis_lines);

    const input_array = document.getElementById("input_quaternion").value.trim().split(/[, ]+/).map(x => +x);
    if (input_array.length >= 4) {
        group.quaternion.copy(new THREE.Quaternion(input_array[0], input_array[1], input_array[2], input_array[3]));
    }

    scene.add(group);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = 4 / 3;
    camera.updateProjectionMatrix();

    renderer.setSize(document.body.clientWidth, document.body.clientWidth / 4 * 3);
}

function animate() {
    const input_array = document.getElementById("input_quaternion").value.trim().split(/[, ]+/).map(x => +x);
    // console.log(input_array);
    if (input_array.length >= 4) {
        group.quaternion.copy(new THREE.Quaternion(input_array[0], input_array[1], input_array[2], input_array[3]));
    }

    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}
