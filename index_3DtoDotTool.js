"use strict";
exports.__esModule = true;
var THREE = require("three");
onload = function () {
    var width = 960;
    var height = 540;
    var canvas = document.getElementById('myCanvas');
    var renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 800 / 600, 1, 10000);
    var geometry = new THREE.BoxGeometry(500, 500, 500);
    var material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    var box = new THREE.Mesh(geometry, material);
    // シーンに追加
    scene.add(box);
    // new THREE.DirectionalLight(色)
    var light = new THREE.DirectionalLight(0xffffff);
    light.intensity = 2; // 光の強さを倍に
    // シーンに追加
    scene.add(light);
    light.position.set(1, 1, 1);
    tick();
    function tick() {
        requestAnimationFrame(tick);
        // 箱を回転させる
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;
        // レンダリング
        renderer.render(scene, camera);
    }
};
