import * as THREE from 'three';
import { getFresnelMat } from "./fresnelMaterial.js";

export function setUpEarthBackground() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
        antialias: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = -23.4 * Math.PI / 180;

    const loader = new THREE.TextureLoader();
    const earthGeometry = new THREE.IcosahedronGeometry(1, 12);
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: loader.load("/textures/earth_color.jpeg"),
        specularMap: loader.load("/textures/specular_map.jpeg"),
        bumpMap: loader.load("/textures/topography.jpeg"),
        bumpScale: 2,
        emissive: 0xfff5c9,
        emissiveMap: loader.load("/textures/earth_nightlights.jpeg"),
        emissiveIntensity: 0.2,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial)
    earthGroup.add(earth);

    const cloudsMat = new THREE.MeshStandardMaterial({
        map: loader.load("/textures/earth_clouds.jpeg"),
        blending: THREE.AdditiveBlending,
        opacity: 0.6,
    })
    const earthClouds = new THREE.Mesh(earthGeometry, cloudsMat);
    earthClouds.scale.setScalar(1.01);
    earthGroup.add(earthClouds);

    const fresnelMat = getFresnelMat();
    const glowMesh = new THREE.Mesh(earthGeometry, fresnelMat);
    glowMesh.scale.setScalar(1.012);
    earthGroup.add(glowMesh);

    scene.add(earthGroup);

    const sunLight = new THREE.DirectionalLight(0xffffff);
    sunLight.position.set(-2, 0, 2);
    scene.add(sunLight);

    camera.position.z = 4;
    function animate() {
        requestAnimationFrame(animate);
        earth.rotation.y += 0.002;
        earthClouds.rotation.y += 0.0021;
        renderer.render(scene, camera);
    }

    animate();
}