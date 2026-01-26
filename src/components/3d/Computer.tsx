'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';

interface ComputerModelProps {
  position?: [number, number, number];
}

function ComputerModel(props: ComputerModelProps) {
  const ref = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [time, setTime] = useState(0);
//   const [isTyping, setIsTyping] = useState(false);

  // 动画文本内容
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Hello World! 👋\nWelcome to my personal website';
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => prev + 0.01);
    }, 16);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (textIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, textIndex + 1));
        setTextIndex(textIndex + 1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // 3 秒后重置
      setTimeout(() => {
        setDisplayText('');
        setTextIndex(0);
      }, 3000);
    }
  }, [textIndex, fullText]);

  useFrame(() => {
    if (ref.current) {
      // 平滑旋转与悬停动画
      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        hovered ? Math.PI / 6 : 0,
        0.05
      );
      ref.current.position.y = THREE.MathUtils.lerp(
        ref.current.position.y,
        hovered ? 0.3 : 0,
        0.05
      );

      // 轻柔漂浮动画
      ref.current.position.y += Math.sin(time * 2) * 0.01;
    }

    // 屏幕发光效果
    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.2 + Math.sin(time * 3) * 0.1;
    }
  });

  return (
    <group
      ref={ref}
      {...props}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 带辉光的显示器屏幕 */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 1.4, 0.1]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.1} 
          roughness={0.8}
          emissive="#000000"
        />
      </mesh>

      {/* 材质更好的显示器边框 */}
      <mesh castShadow receiveShadow position={[0, 0, 0.06]}>
        <boxGeometry args={[2.4, 1.6, 0.05]} />
        <meshStandardMaterial 
          color="#2a2a2a" 
          metalness={0.3} 
          roughness={0.4}
          emissive="#111111"
        />
      </mesh>

      {/* 带辉光效果的屏幕显示区 */}
      <mesh ref={screenRef} position={[0, 0, 0.06]}>
        <planeGeometry args={[2, 1.2]} />
        <meshStandardMaterial 
          color="#000000" 
          emissive="#0066ff"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* 屏幕内容 */}
      <Html position={[0, 0, 0.07]} center>
        <div className="w-80 h-48 bg-black/80 rounded-lg p-4 font-mono text-green-400 text-sm leading-relaxed">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-gray-400 text-xs">welcome.js</span>
          </div>
          <div className="whitespace-pre-line font-mono">
            {displayText}
            <span className="animate-pulse">|</span>
          </div>
        </div>
      </Html>

      {/* 带辉光的显示器支架 */}
      <mesh castShadow receiveShadow position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
        <meshStandardMaterial 
          color="#2a2a2a" 
          metalness={0.4} 
          roughness={0.3}
          emissive="#111111"
        />
      </mesh>

      {/* 带 LED 光环的显示器底座 */}
      <mesh castShadow receiveShadow position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 8]} />
        <meshStandardMaterial 
          color="#2a2a2a" 
          metalness={0.4} 
          roughness={0.3}
          emissive="#111111"
        />
      </mesh>

      {/* 底座周围的 LED 光环 */}
      <mesh position={[0, -1.15, 0]}>
        <ringGeometry args={[0.35, 0.45, 32]} />
        <meshStandardMaterial 
          color="#0066ff" 
          emissive="#0066ff"
          emissiveIntensity={0.3 + Math.sin(time * 4) * 0.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 带发光按键的键盘 */}
      <mesh castShadow receiveShadow position={[0, -1.8, 0.5]}>
        <boxGeometry args={[2.8, 0.1, 0.8]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.2} 
          roughness={0.6}
          emissive="#111111"
        />
      </mesh>

      {/* 键盘按键 */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} castShadow position={[-1.2 + i * 0.3, -1.75, 0.5]}>
          <boxGeometry args={[0.2, 0.05, 0.2]} />
          <meshStandardMaterial 
            color="#333333" 
            emissive="#0066ff"
            emissiveIntensity={hovered ? 0.1 : 0}
          />
        </mesh>
      ))}

      {/* 带辉光的鼠标 */}
      <mesh castShadow receiveShadow position={[1.2, -1.8, 0.5]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.2} 
          roughness={0.6}
          emissive="#111111"
        />
      </mesh>

      {/* 鼠标 LED */}
      <mesh position={[1.2, -1.8, 0.65]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial 
          color="#ff0066" 
          emissive="#ff0066"
          emissiveIntensity={0.5 + Math.sin(time * 5) * 0.3}
        />
      </mesh>

      {/* 带柔和辉光的桌面 */}
      <mesh castShadow receiveShadow position={[0, -2.2, 0]}>
        <boxGeometry args={[4, 0.2, 2]} />
        <meshStandardMaterial 
          color="#3a3a3a" 
          metalness={0.2} 
          roughness={0.8}
          emissive="#111111"
        />
      </mesh>

      {/* 桌面边缘辉光 */}
      <mesh position={[0, -2.1, 0]}>
        <boxGeometry args={[4.2, 0.02, 2.2]} />
        <meshStandardMaterial 
          color="#0066ff" 
          emissive="#0066ff"
          emissiveIntensity={0.1}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* 漂浮粒子 */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={i} position={[
          Math.sin(time + i) * 3,
          Math.cos(time * 0.5 + i) * 2 + 1,
          Math.sin(time * 0.3 + i) * 2
        ]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial 
            color="#0066ff" 
            emissive="#0066ff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Computer() {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
    const gl =
      canvas?.getContext('webgl') ||
      canvas?.getContext('experimental-webgl') ||
      canvas?.getContext('webgl2');
    setWebglSupported(Boolean(gl));

    if (gl && 'getExtension' in gl) {
      (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext?.();
    }
  }, []);

  if (webglSupported === false) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-gray-200">
        当前环境不支持 WebGL，无法显示 3D 背景
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <color attach="background" args={['#0a0a0a']} />

        {/* 增强照明 */}
        <ambientLight intensity={0.2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
          color="#ffffff"
        />
        <pointLight 
          position={[-10, -10, -10]} 
          intensity={0.3}
          color="#0066ff"
        />
        <pointLight 
          position={[10, -10, -10]} 
          intensity={0.2}
          color="#ff0066"
        />

        <ComputerModel position={[0, 0, 0]} />

        {/* 增强接触阴影 */}
        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.6}
          scale={12}
          blur={4}
          far={3}
          color="#0066ff"
        />

        <Environment preset="city" />

        {/* 增强轨道控制 */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.3}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
