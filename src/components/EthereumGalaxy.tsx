import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { type Project } from '@/lib/csv-parser';
import { getRingConfig } from '@/lib/ring-config';

interface EthereumGalaxyProps {
  projects: Project[];
  onProjectSelect: (project: Project | null) => void;
  selectedProject: Project | null;
  hoveredProject: Project | null;
  onProjectHover: (project: Project | null) => void;
  isPaused: boolean;
  speedMultiplier: number;
  visibleTags: Set<string>;
  followMode: boolean;
  theme: 'dark' | 'silk';
}

interface ProjectSphereProps {
  project: Project;
  position: THREE.Vector3;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}

function ProjectSphere({
  project,
  position,
  isSelected,
  isHovered,
  onSelect,
  onHover
}: ProjectSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringConfig = getRingConfig(project.primaryTag);
  const scale = isHovered ? 1.5 : isSelected ? 1.3 : 1.0;
  const size = 1.2;
  const hasLoggedRef = useRef(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [textureLoaded, setTextureLoaded] = useState(false);
  const [textureError, setTextureError] = useState(false);

  // Load texture from logo data URL
  useEffect(() => {
    if (!project.logo) return;

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    loader.load(
      project.logo,
      (loadedTexture) => {
        // Configure texture for sphere mapping
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        // Use default UV mapping for flat logos on sphere
        loadedTexture.wrapS = THREE.RepeatWrapping;
        loadedTexture.wrapT = THREE.RepeatWrapping;
        loadedTexture.needsUpdate = true;
        setTexture(loadedTexture);
        setTextureLoaded(true);
        setTextureError(false);


      },
      undefined,
      (error) => {
        console.error(`❌ [SPHERE TEXTURE] Failed to load texture for "${project.name}"`, error);
        setTextureError(true);
        setTextureLoaded(false);
      }
    );

    return () => {
      // Cleanup texture on unmount
      if (texture) {
        texture.dispose();
      }
    };
  }, [project.logo, project.name]);

  // Log sphere creation with logo info (only once per sphere)
  if (!hasLoggedRef.current) {

    hasLoggedRef.current = true;
  }

  // Log material decision for debugging
  const willUseTexture = project.logo && textureLoaded && texture;
  useEffect(() => {
    if (project.logo) {

    }
  }, [textureLoaded, texture, willUseTexture, project.logo, project.name]);

  return (
    <group position={position} scale={scale}>
      <mesh
        ref={meshRef}
        onClick={onSelect}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
      >
        <sphereGeometry args={[size, 16, 16]} />
        {/* Use texture if available and loaded, otherwise use colored material */}
        {project.logo && textureLoaded && texture ? (
          <meshStandardMaterial
            map={texture}
            color="#ffffff"
            emissive={ringConfig.color}
            emissiveIntensity={isHovered || isSelected ? 0.3 : 0.1}
            metalness={0.1}
            roughness={0.8}
            toneMapped={false}
          />
        ) : (
          <meshStandardMaterial
            color={ringConfig.color}
            emissive={ringConfig.color}
            emissiveIntensity={isHovered || isSelected ? 0.3 : 0.1}
            metalness={0.4}
            roughness={0.6}
          />
        )}
      </mesh>

      {(isHovered || isSelected) && (
        <pointLight
          color={ringConfig.color}
          intensity={2}
          distance={10}
        />
      )}
    </group>
  );
}

function OrbitTrail({ positions, color }: { positions: THREE.Vector3[]; color: string }) {
  if (positions.length < 2) return null;

  return (
    <Line
      points={positions}
      color={color}
      lineWidth={2}
      transparent
      opacity={0.3}
    />
  );
}

function EthereumCore({ theme }: { theme: 'dark' | 'silk' }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const instancedRef = useRef<THREE.InstancedMesh>(null!);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
    }
  });

  const particleCount = 5000;
  const particles = useMemo(() => {
    const data = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 3 + Math.random() * 2;
      data[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      data[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      data[i * 3 + 2] = radius * Math.cos(phi);
    }
    return data;
  }, []);

  useEffect(() => {
    const temp = new THREE.Object3D();
    for (let i = 0; i < particleCount; i++) {
      temp.position.set(particles[i * 3], particles[i * 3 + 1], particles[i * 3 + 2]);
      temp.updateMatrix();
      instancedRef.current.setMatrixAt(i, temp.matrix);
    }
    instancedRef.current.instanceMatrix.needsUpdate = true;
  }, [particles]);

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          color="#627EEA"
          emissive="#627EEA"
          emissiveIntensity={theme === 'silk' ? 2.5 : 1.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      <group ref={groupRef}>
        <instancedMesh ref={instancedRef} args={[null!, null!, particleCount]}>
          <sphereGeometry args={[0.02, 4, 4]} />
          <meshBasicMaterial color="#627EEA" transparent opacity={0.6} />
        </instancedMesh>
      </group>

      <pointLight color="#627EEA" intensity={theme === 'silk' ? 1.5 : 3} distance={100} />
      <pointLight color="#FFFFFF" intensity={theme === 'silk' ? 0.5 : 1} distance={50} />
    </group>
  );
}

function StarField({ theme }: { theme: 'dark' | 'silk' }) {
  const count = 2000;
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  const { positions, scales } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 300;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 300;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 300;
      scl[i] = Math.random() * 0.3 + 0.2;
    }
    return { positions: pos, scales: scl };
  }, []);

  useEffect(() => {
    const temp = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      temp.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      temp.scale.setScalar(scales[i]);
      temp.updateMatrix();
      meshRef.current.setMatrixAt(i, temp.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, scales]);

  return (
    <instancedMesh ref={meshRef} args={[null!, null!, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial 
        color={theme === 'silk' ? "#4A90E2" : "#FFFFFF"} 
        transparent 
        opacity={theme === 'silk' ? 0.8 : 0.8} 
      />
    </instancedMesh>
  );
}

function OrbitalRing({ radius, color, theme }: { radius: number; color: string; theme: 'dark' | 'silk' }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 100; i++) {
      const angle = (i / 100) * Math.PI * 2;
      pts.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ));
    }
    return pts;
  }, [radius]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      transparent
      opacity={theme === 'silk' ? 0.6 : 0.2}
    />
  );
}

interface SceneContentProps {
  projects: Project[];
  onProjectSelect: (project: Project | null) => void;
  selectedProject: Project | null;
  hoveredProject: Project | null;
  onProjectHover: (project: Project | null) => void;
  isPaused: boolean;
  speedMultiplier: number;
  visibleTags: Set<string>;
  followMode: boolean;
  theme: 'dark' | 'silk';
}

function SceneContent({
  projects,
  onProjectSelect,
  selectedProject,
  hoveredProject,
  onProjectHover,
  isPaused,
  speedMultiplier,
  visibleTags,
  followMode,
  theme
}: SceneContentProps) {
  const { camera } = useThree();
  const [orbitalAngles, setOrbitalAngles] = useState<Map<string, number>>(new Map());
  const [trailPositions, setTrailPositions] = useState<Map<string, THREE.Vector3[]>>(new Map());
  const frameCount = useRef(0);

  const ringRadii = useMemo(() => {
    return Array.from({ length: 35 }, (_, i) => 30 + i * 11);
  }, []);

  useEffect(() => {
    const angles = new Map<string, number>();
    const trails = new Map<string, THREE.Vector3[]>();

    projects.forEach((project, index) => {
      const angle = (index / projects.length) * Math.PI * 2;
      angles.set(project.name, angle);
      trails.set(project.name, []);
    });

    setOrbitalAngles(angles);
    setTrailPositions(trails);
  }, [projects]);


  useFrame(() => {
    if (isPaused) return;

    frameCount.current += 1;
    if (frameCount.current % 2 !== 0) return; // Update every 2 frames

    setOrbitalAngles((prev) => {
      const newAngles = new Map(prev);
      const newTrails = new Map(trailPositions);

      projects.forEach((project, index) => {
        const ringConfig = getRingConfig(project.primaryTag);
        const currentAngle = newAngles.get(project.name) || 0;
        const newAngle = currentAngle + ringConfig.speed * speedMultiplier;
        newAngles.set(project.name, newAngle);

        const ringIndex = index % ringRadii.length;
        const radius = ringRadii[ringIndex];

        const x = Math.cos(newAngle) * radius;
        const z = Math.sin(newAngle) * radius;
        const y = Math.sin(newAngle * 3) * 2; // Same y-offset formula
        const position = new THREE.Vector3(x, y, z);

        const currentTrail = newTrails.get(project.name) || [];
        if (frameCount.current % 10 === 0) {
          const updatedTrail = [...currentTrail, position].slice(-50);
          newTrails.set(project.name, updatedTrail);
        }
      });

      if (frameCount.current % 10 === 0) {
        setTrailPositions(newTrails);
      }

      return newAngles;
    });
  });

  useEffect(() => {
    if (followMode && selectedProject) {
      const index = projects.findIndex((p) => p.name === selectedProject.name);
      if (index !== -1) {
        const ringIndex = index % ringRadii.length;
        const radius = ringRadii[ringIndex];
        const angle = orbitalAngles.get(selectedProject.name) || 0;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 3) * 2;

        camera.position.lerp(new THREE.Vector3(x + 10, y + 10, z + 10), 0.05);
        camera.lookAt(x, y, z);
      }
    }
  });

  const visibleProjects = useMemo(() => {
    const filtered = projects.filter(p =>
      visibleTags.has('All') || p.tags.some(tag => visibleTags.has(tag))
    );

    const filteredWithLogos = filtered.filter(p => p.logo).length;

    return filtered;
  }, [projects, visibleTags]);

  return (
    <>
      <ambientLight intensity={theme === 'silk' ? 0.8 : 0.3} />
      <EthereumCore theme={theme} />
      <StarField theme={theme} />

      {ringRadii.map((radius) => (
        <OrbitalRing key={radius} radius={radius} color={theme === 'silk' ? "#627EEA" : "#4A90E2"} theme={theme} />
      ))}

      {visibleProjects.map((project, renderIndex) => {
        const ringConfig = getRingConfig(project.primaryTag);
        const index = projects.findIndex((p) => p.name === project.name);
        const ringIndex = index % ringRadii.length;
        const radius = ringRadii[ringIndex];
        
        const angle = orbitalAngles.get(project.name) || 0;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        // Add slight vertical variation to prevent overlap
        const yOffset = Math.sin(angle * 3) * 2;
        const position = new THREE.Vector3(x, yOffset, z);

        const isSelected = selectedProject?.name === project.name;
        const isHovered = hoveredProject?.name === project.name;

        // Log first few renders for debugging


        return (
          <group key={project.name}>
            <ProjectSphere
              project={project}
              position={position}
              isSelected={isSelected}
              isHovered={isHovered}
              onSelect={() => onProjectSelect(isSelected ? null : project)}
              onHover={(hovered) => onProjectHover(hovered ? project : null)}
            />

            {(isSelected || isHovered) && (
              <OrbitTrail
                positions={trailPositions.get(project.name) || []}
                color={ringConfig.color}
              />
            )}

            {isHovered && (
              <Html position={[position.x, position.y + 2, position.z]} center>
                <div className="bg-black/80 text-white px-3 py-1 rounded text-sm whitespace-nowrap pointer-events-none">
                  {project.name}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}

export function EthereumGalaxy(props: EthereumGalaxyProps) {
  return (
    <Canvas
      camera={{ position: [0, 50, 80], fov: 60 }}
      style={{ 
        width: '100%', 
        height: '100%',
        background: props.theme === 'silk' ? '#F0F2F9' : '#000000'
      }}
    >
      <SceneContent {...props} />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={10}
        maxDistance={500}
      />
    </Canvas>
  );
}
