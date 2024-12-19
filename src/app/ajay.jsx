import React, { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import ThreeGlobe from "three-globe";
import countries from "./files/globe-data-min.json";
import { Text } from "troika-three-text";
import travelHistory from "./files/my-flights.json";
const Globe = React.memo(({ dataA, dataB, dataC, gitData, processedData }) => {
  const globeRef = useRef(null);
  const animationRef = useRef(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const renderer = useRef(new THREE.WebGLRenderer({ antialias: true }));
  const camera = useRef(new THREE.PerspectiveCamera());
  const scene = useRef(new THREE.Scene());
  const controls = useRef(
    new OrbitControls(camera.current, renderer.current.domElement)
  );

  const [popupInfo, setPopupInfo] = useState({
    visible: false,
    location: null,
  });

  const locations = [
    { lat: 28.6139, lng: 77.209, name: "Delhi", color: "#0000ff" },
    { lat: 40.7128, lng: -74.006, name: "New York", color: "#0000ff" },
    { lat: 51.5074, lng: -0.1278, name: "London", color: "#0000ff" },
    { lat: 35.6895, lng: 139.6917, name: "Tokyo", color: "#0000ff" },
    { lat: -33.8688, lng: 151.2093, name: "Sydney", color: "#0000ff" },
    { lat: 48.8566, lng: 2.3522, name: "Paris", color: "#0000ff" },
    { lat: 55.7558, lng: 37.6173, name: "Moscow", color: "#0000ff" },
  ];

  const hardcodedData = [
    {
      name: "San Francisco",
      lat: 37.7749,
      lng: -122.4194,
      applications: 1000,
      grants: 10500,
      investments: 0,
      revenue: 0,
      color: "#0000ff",
    },
    {
      name: "Dubai",
      lat: 25.276987,
      lng: 55.296249,
      applications: 800,
      grants: 0,
      investments: 0,
      revenue: 0,
      color: "#0000ff",
    },
    {
      name: "Bangalore",
      lat: 12.9716,
      lng: 77.5946,
      applications: 600,
      grants: 3000,
      investments: 201,
      revenue: 0,
      color: "#0000ff",
    },
    {
      name: "Mumbai",
      lat: 19.076,
      lng: 72.8777,
      applications: 485,
      grants: 0,
      investments: 0,
      revenue: 0,
      color: "#0000ff",
    },
    {
      name: "New York",
      lat: 40.7128,
      lng: -74.006,
      applications: 400,
      grants: 0,
      investments: 0,
      revenue: 0,
      color: "#0000ff",
    },
    {
      name: "Mumbai",
      lat: 19.076,
      lng: 72.8777,
      applications: 200,
      grants: 0,
      investments: 0,
      revenue: 0,
      color: "#0000ff",
    },
    {
      name: "Mumbai",
      lat: 19.076,
      lng: 72.8777,
      applications: 100,
      grants: 0,
      investments: 0,
      revenue: 0,
      color: "#0000ff",
    },
  ];


  const [overviewData, setOverviewData] = useState(hardcodedData);
const [isRealDataLoaded, setIsRealDataLoaded] = useState(false); // Track if real data is loaded

useEffect(() => {
  const aggregateData = () => {
    const cleanName = (name) =>
      name
        ?.replace(/\s*house\s*$/i, "")
        .toLowerCase()
        .trim();

    const houseMapping = {
      sf: { name: "San Francisco", lat: 37.7749, lng: -122.4194 },
      ny: { name: "New York", lat: 40.7128, lng: -74.006 },
      bangalore: { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
      dubai: { name: "Dubai", lat: 25.276987, lng: 55.296249 },
    };

    const grantsByHouse = dataB.reduce((acc, item) => {
      const house = cleanName(item.home || item.house || "unknown");
      acc[house] = (acc[house] || 0) + (item.grant || 0);
      return acc;
    }, {});

    const investmentsByHouse = dataC.reduce((acc, item) => {
      const house = cleanName(item.home || item.house || "unknown");
      acc[house] = (acc[house] || 0) + (item.investment_size || 0);
      return acc;
    }, {});

    const revenueByHouse = dataA.reduce((acc, item) => {
      const house = cleanName(item.house || "unknown");
      acc[house] = (acc[house] || 0) + (item.mrr || 0);
      return acc;
    }, {});

    const aggregatedData = processedData.map((item) => {
      const house = cleanName(item.house);
      const houseInfo = houseMapping[house] || {
        name: "Mumbai",
        lat: 19.076,
        lng: 72.8777,
      };

      return {
        name: houseInfo.name,
        lat: houseInfo.lat,
        lng: houseInfo.lng,
        applications: item.applications || 0,
        grants: grantsByHouse[house] || 0,
        investments: investmentsByHouse[house] || 0,
        revenue: revenueByHouse[house] || 0,
        color: "#0000ff",
      };
    });

    setOverviewData(aggregatedData);
    setIsRealDataLoaded(true); // Mark that real data is now loaded
  };

  if (!isRealDataLoaded && dataA && dataB && dataC && processedData) {
    aggregateData();
  }
}, [dataA, dataB, dataC, processedData, isRealDataLoaded]);

  // useEffect(() => {
  //   const aggregateData = () => {
  //     const cleanName = (name) =>
  //       name
  //         ?.replace(/\s*house\s*$/i, "")
  //         .toLowerCase()
  //         .trim();

  //     const houseMapping = {
  //       sf: { name: "San Francisco", lat: 37.7749, lng: -122.4194 },
  //       ny: { name: "New York", lat: 40.7128, lng: -74.006 },
  //       bangalore: { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  //       dubai: { name: "Dubai", lat: 25.276987, lng: 55.296249 },
  //     };

  //     const grantsByHouse = dataB.reduce((acc, item) => {
  //       const house = cleanName(item.home || item.house || "unknown");
  //       acc[house] = (acc[house] || 0) + (item.grant || 0);
  //       return acc;
  //     }, {});

  //     const investmentsByHouse = dataC.reduce((acc, item) => {
  //       const house = cleanName(item.home || item.house || "unknown");
  //       acc[house] = (acc[house] || 0) + (item.investment_size || 0);
  //       return acc;
  //     }, {});

  //     const revenueByHouse = dataA.reduce((acc, item) => {
  //       const house = cleanName(item.house || "unknown");
  //       acc[house] = (acc[house] || 0) + (item.mrr || 0);
  //       return acc;
  //     }, {});

  //     const aggregatedData = processedData.map((item) => {
  //       const house = cleanName(item.house);
  //       const houseInfo = houseMapping[house] || {
  //         name: "Mumbai",
  //         lat: 19.076,
  //         lng: 72.8777,
  //       };

  //       return {
  //         name: houseInfo.name,
  //         lat: houseInfo.lat,
  //         lng: houseInfo.lng,
  //         applications: item.applications,
  //         grants: grantsByHouse[house] || 0,
  //         investments: investmentsByHouse[house] || 0,
  //         revenue: revenueByHouse[house] || 0,
  //         color: "#0000ff",
  //       };
  //     });

  //     setOverviewData(aggregatedData);
  //   };

  //   if (dataA && dataB && dataC && processedData) {
  //     aggregateData();
  //   }
  // }, [dataA, dataB, dataC, processedData]);


  console.log(overviewData)

  useEffect(() => {
    const onWindowResize = () => {
      const container = globeRef.current;
      if (container) {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        camera.current.aspect = width / height;
        camera.current.updateProjectionMatrix();
        renderer.current.setSize(width, height);
      }
    };

    const onMouseClick = (event) => {
      const container = globeRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Raycaster logic to detect click on markers
        raycaster.current.setFromCamera(mouse.current, camera.current);
        const intersects = raycaster.current.intersectObjects(
          scene.current.children,
          true
        );

        // Check if the clicked object is a marker
        if (intersects.length > 0) {
          const clickedObject = intersects[0].object;

          if (
            clickedObject.userData &&
            clickedObject.userData.type === "marker"
          ) {
            // Retrieve the full location data from userData
            const locationData = clickedObject.userData;

            // Log the location data
            console.log("Clicked Location Data:", locationData);

            // Update the popup info with full location data
            setPopupInfo({ visible: true, location: locationData });
          }
        }
      }
    };

    const onMouseMove = (event) => {
      const container = globeRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Raycaster logic to detect hovering over markers
        raycaster.current.setFromCamera(mouse.current, camera.current);
        const intersects = raycaster.current.intersectObjects(
          scene.current.children
        );

        if (intersects.length > 0) {
          container.style.cursor = "pointer"; // Change cursor to pointer
        } else {
          container.style.cursor = "default"; // Reset cursor to default
        }
      }
    };

    const animate = () => {
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

      // Enable rotation and zoom
      controls.current.enableDamping = true;
      controls.current.dynamicDampingFactor = 0.01;
      controls.current.enablePan = false; // Pan disabled for smoother experience
      controls.current.enableZoom = true; // Enable zoom
      controls.current.rotateSpeed = 1; // Adjust rotation speed
      controls.current.autoRotate = true; // Enable auto rotation
      controls.current.autoRotateSpeed = 1; // Speed of auto rotation
      controls.current.minDistance = 100; // Minimum zoom distance
      controls.current.maxDistance = 1000; // Maximum zoom distance
      controls.current.minPolarAngle = Math.PI / 6; // Restrict vertical rotation
      controls.current.maxPolarAngle = Math.PI - Math.PI / 6;

      window.addEventListener("resize", onWindowResize);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("click", onMouseClick); // Add click event listener
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
            ? "rgba(255,255,255, 1)"
            : "rgba(255,255,255, 0.7)"
        );

      overviewData.forEach((location) => {
        const markerGeometry = new THREE.SphereGeometry(4, 18, 18);
        const markerMaterial = new THREE.MeshBasicMaterial({
          color: location.color,
        });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);

        // Convert lat/lng to 3D coordinates
        const { x, y, z } = Globe.getCoords(location.lat, location.lng);
        marker.position.set(x+2, y+2, z+2);
        marker.userData = { ...location, type: "marker" };

        scene.current.add(marker);

        // Add text label for the marker
        const label = new Text();
        label.text = location.name;
        label.fontSize = 5;
        label.color = "green";
        label.position.set(x + 5, y + 10, z + 5); // Adjust position above the marker
        label.lookAt(camera.current.position); // Ensure text faces the camera
        scene.current.add(label);
      });

      setTimeout(() => {
        Globe.arcsData(travelHistory.flights)
          .arcColor((e) => (e.status ? "#FFD700" : "#ff0000"))
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
      document.removeEventListener("click", onMouseClick); // Unsubscribe click listener
    };
  }, []);

  // Popup component
  const LocationPopup = () => {
    console.log(popupInfo);
    if (!popupInfo.visible) return null;

    return (
      <div
        className="absolute z-50 bottom-4 left-1/2 transform -translate-x-1/2 
        bg-gray-800 text-white p-4 rounded-lg shadow-lg"
        style={{ minWidth: "200px", position: "relative", top: 157, left: 275 }}
      >
        <h3 className="text-lg font-bold mb-2">{popupInfo.location.name}</h3>
        <p className="text-md">{`Total Revenue = ${popupInfo.location.revenue}`}</p>
        <p className="text-md">{`Total Grants = ${popupInfo.location.grants}`}</p>
        <p className="text-md">{`Total Investments = ${popupInfo.location.investments}`}</p>
        <p className="text-md">{`Total GitHub Activity = ${popupInfo.location.applications}`}</p>

        <button
          onClick={() => setPopupInfo({ visible: false, location: null })}
          className="mt-3 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <>
      <div
        ref={globeRef}
        style={{
          width: "33%",
          height: "65%",
          position: "absolute",
          left: "17%",
        }}
      />
      <LocationPopup popupInfo={popupInfo} setPopupInfo={setPopupInfo} />
    </>
  );
});

// Add displayName for debugging purposes
Globe.displayName = "Globe";

export default Globe;
