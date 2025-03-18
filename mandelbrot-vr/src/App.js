import React from "react";
import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { XR, Hands, useHandInput } from "@react-three/xr";

function Mandelbrot3D() {
  const meshRef = useRef();
  const handInput = useHandInput();
  let scale = 1.0;

  useFrame(() => {
    if (handInput.left?.pinchStrength > 0.5 && handInput.right?.pinchStrength > 0.5) {
      scale *= 1.02; // Zoom in
    } else if (handInput.left?.pinchStrength < 0.2 && handInput.right?.pinchStrength < 0.2) {
      scale *= 0.98; // Zoom out
    }

    if (meshRef.current) {
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial attach="material" args={[{
        uniforms: {
          time: { value: 0 },
          resolution: { value: new THREE.Vector2(1, 1) },
        },
        vertexShader: `
          varying vec3 vPosition;
          void main() {
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vPosition;
          void main() {
            float d = length(vPosition);
            vec3 color = vec3(sin(d * 10.0), cos(d * 15.0), sin(d * 5.0));
            gl_FragColor = vec4(color, 1.0);
          }
        `,
      }]} />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas>
      <XR>
        <Hands />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Mandelbrot3D />
        <OrbitControls enableZoom={false} />
      </XR>
    </Canvas>
  );
}
