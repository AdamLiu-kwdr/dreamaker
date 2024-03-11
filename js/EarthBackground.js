import * as THREE from 'three';
import { getFresnelMat } from "./fresnelMaterial.js";
import getStarfield from './getStarField.js';
import gsap from 'gsap';

export function setUpEarthBackground() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
        antialias: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }


    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = -23.4 * Math.PI / 180;

    const loader = new THREE.TextureLoader();
    const earthGeometry = new THREE.IcosahedronGeometry(1, 12);
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: loader.load("textures/earth_color.jpg"),
        specularMap: loader.load("textures/specular_map.jpg"),
        bumpMap: loader.load("textures/topography.jpg"),
        bumpScale: 2,
        emissive: 0xfff5c9,
        emissiveMap: loader.load("textures/earth_nightlights.jpg"),
        emissiveIntensity: 0.2,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial)
    earthGroup.add(earth);

    const cloudsMat = new THREE.MeshStandardMaterial({
        map: loader.load("textures/earth_clouds.jpg"),
        blending: THREE.AdditiveBlending,
        opacity: 0.7,
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

    const stars = getStarfield({ numStars: 2000 });
    scene.add(stars);

    // gsap.fromTo(camera.position, { x: 1, y: 1, z: 3, }, {
    //     scrollTrigger: {
    //         trigger: "#project-track",
    //         scroller: "#scroll-container",
    //         start: "top bottom"
    //     },
    //     duration: 2,
    //     x: -3.5, y: 1, z: -1,
    //     ease: "power3.inOut",
    //     onUpdate: function () {
    //         camera.lookAt(new THREE.Vector3(0, 0, 0))
    //     }
    // })

    camera.position.set(0, 0, 20)
    function animate() {
        requestAnimationFrame(animate);
        earth.rotation.y += 0.002;
        earthClouds.rotation.y += 0.0021;
        stars.rotation.y -= 0.0002;
        renderer.render(scene, camera);
    }

    animate();

    var moveCamera = gsap.timeline()
    moveCamera.to(camera.position, {
        duration: 2, z: 4, onUpdate: function () {
            camera.lookAt(new THREE.Vector3(0, 0, 0))
        }
    })
    moveCamera.to(camera.position, {
        duration: 2, x: 1, y: 1, z: 3, ease: "power2.inOut",
        onUpdate: function () {
            camera.lookAt(new THREE.Vector3(0, 0, 0))
        }
    })
    // gsap.to(camera.position, { duration: 2, z: 4, ease: "power2.out" });
}