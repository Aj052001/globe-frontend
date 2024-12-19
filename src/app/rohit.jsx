import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import ThreeGlobe from "three-globe";
import countries from "./files/globe-data-min.json";
import travelHistory from "./files/my-flights.json";

const Globe = React.memo(() => {
  const globeRef = useRef(null);
  const animationRef = useRef(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const windowHalfX = useRef(window.innerWidth / 5);
  const windowHalfY = useRef(window.innerHeight / 5);
  const renderer = useRef(new THREE.WebGLRenderer({ antialias: true }));
  const camera = useRef(new THREE.PerspectiveCamera());
  const scene = useRef(new THREE.Scene());
  const controls = useRef(
    new OrbitControls(camera.current, renderer.current.domElement)
  );

  // Sample data for markers
  const locations = [
    { lat: 28.6139, lng: 77.209, name: "Delhi", color: "#ff0000" },
    { lat: 40.7128, lng: -74.006, name: "New York", color: "#00ff00" },
    { lat: 51.5074, lng: -0.1278, name: "London", color: "#0000ff" },
    { lat: 35.6895, lng: 139.6917, name: "Tokyo", color: "#ffff00" },
    { lat: -33.8688, lng: 151.2093, name: "Sydney", color: "#ff00ff" },
    { lat: 48.8566, lng: 2.3522, name: "Paris", color: "#00ffff" },
    { lat: 55.7558, lng: 37.6173, name: "Moscow", color: "#ff7700" },
  ];
  

  useEffect(() => {
    const onWindowResize = () => {
      const container = globeRef.current;
      if (container) {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        camera.current.aspect = width / height;
        camera.current.updateProjectionMatrix();
        renderer.current.setSize(width, height);
        windowHalfX.current = width / 2;
        windowHalfY.current = height / 2;
      }
    };

    const onMouseMove = (event) => {
      mouseX.current = event.clientX - windowHalfX.current;
      mouseY.current = event.clientY - windowHalfY.current;
    };

    const animate = () => {
      scene.current.rotation.y -= 0.0005;

      camera.current.position.x +=
        Math.abs(mouseX.current) <= windowHalfX.current / 2
          ? (mouseX.current / 2 - camera.current.position.x) * 0.005
          : 0;
      camera.current.position.y +=
        (-mouseY.current / 2 - camera.current.position.y) * 0.005;
      camera.current.lookAt(scene.current.position);
      controls.current.update();
      renderer.current.render(scene.current, camera.current);
      animationRef.current = requestAnimationFrame(animate);
    };

    const init = () => {
      const container = globeRef.current;
      if (!container) return;

      renderer.current.setPixelRatio(window.devicePixelRatio);
      renderer.current.setSize(container.offsetWidth, container.offsetHeight);
      container.appendChild(renderer.current.domElement);

      scene.current.add(new THREE.AmbientLight(0xffffff, 0.5));
      const dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.position.set(5, 3, 4);
      scene.current.add(dirLight);
      scene.current.background = new THREE.Color(0x030712);

      camera.current.aspect = container.offsetWidth / container.offsetHeight;
      camera.current.position.z = 400;
      camera.current.position.x = 0;
      camera.current.position.y = 0;
      camera.current.updateProjectionMatrix();

      controls.current.enableDamping = true;
      controls.current.dynamicDampingFactor = 0.01;
      controls.current.enablePan = false;
      controls.current.enableZoom = false; // Disable zoom functionality
      controls.current.rotateSpeed = 0.8;
      controls.current.autoRotate = false;
      controls.current.minPolarAngle = Math.PI / 3.5;
      controls.current.maxPolarAngle = Math.PI - Math.PI / 3;

      window.addEventListener("resize", onWindowResize);
      document.addEventListener("mousemove", onMouseMove);
    };

    const initGlobe = () => {
      const Globe = new ThreeGlobe({
        waitForGlobeReady: true,
        animateIn: true,
      })
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(true)
        .atmosphereColor("#3a228a")
        .atmosphereAltitude(0.25)
        .hexPolygonColor((e) =>
          ["KGZ", "KOR", "THA", "RUS", "UZB", "IDN", "KAZ", "MYS"].includes(
            e.properties.ISO_A3
          )
            ? "rgba(255,255,255, 0.7)"
            : "rgba(255,255,255, 1)"
        )
        .pointsData(locations)
        .pointAltitude(0.1) // Marker altitude
        .pointColor((e) => e.color)
        .pointRadius(2) // Marker size
        .pointResolution(12); // Marker resolution

      setTimeout(() => {
        Globe.arcsData(travelHistory.flights)
          .arcColor((e) => (e.status ? "#00ff00" : "#ff0000"))
          .arcAltitude((e) => e.arcAlt)
          .arcStroke((e) => (e.status ? 0.5 : 0.3))
          .arcDashLength(0.9)
          .arcDashGap(4)
          .arcDashAnimateTime(1000)
          .arcsTransitionDuration(1000)
          .arcDashInitialGap((e) => e.order * 1);
      }, 1000);

      Globe.rotateY(-Math.PI * (5 / 9));
      Globe.rotateZ(-Math.PI / 6);
      const globeMaterial = Globe.globeMaterial();
      globeMaterial.color = new THREE.Color(0x3a228a);
      globeMaterial.emissive = new THREE.Color(0x220038);
      globeMaterial.emissiveIntensity = 0.1;
      globeMaterial.shininess = 0.7;
      globeMaterial.opacity = 0.2;
      globeMaterial.transparent = true;

      scene.current.add(Globe);
    };

    init();
    initGlobe();
    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", onWindowResize);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div
      ref={globeRef}
      style={{
        width: "33%",
        height: "65%",
        position: "absolute",
        left: "17%",
      }}
    />
  );
});

// Add displayName for debugging purposes
Globe.displayName = "Globe";

export default Globe;
