"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { useMemo } from "react";
import { useDesignerStore } from "@/lib/store";
import * as THREE from "three";

function Walls({ w, l, h, color }: { w: number; l: number; h: number; color: string }) {
  const wallMat = useMemo(() => new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0.0 }), [color]);
  // thickness
  const t = 0.05;
  return (
    <group>
      {/* back wall (z=0) */}
      <mesh position={[w / 2, h / 2, -t / 2]} material={wallMat}>
        <boxGeometry args={[w, h, t]} />
      </mesh>
      {/* front wall (z=l) */}
      <mesh position={[w / 2, h / 2, l + t / 2]} material={wallMat}>
        <boxGeometry args={[w, h, t]} />
      </mesh>
      {/* left wall (x=0) */}
      <mesh position={[-t / 2, h / 2, l / 2]} material={wallMat}>
        <boxGeometry args={[t, h, l]} />
      </mesh>
      {/* right wall (x=w) */}
      <mesh position={[w + t / 2, h / 2, l / 2]} material={wallMat}>
        <boxGeometry args={[t, h, l]} />
      </mesh>
    </group>
  );
}

export function Preview3D() {
  const { draft } = useDesignerStore();
  const room = draft.room;

  return (
    <div className="h-[640px] bg-zinc-950">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div>
          <div className="font-semibold">3D Preview</div>
          <div className="text-xs text-zinc-400">Orbit to inspect. Colors + shade update live from the sidebar.</div>
        </div>
        <div className="text-xs text-zinc-400">
          Items: <span className="text-zinc-100 font-medium">{draft.items.length}</span>
        </div>
      </div>

      <div className="h-[calc(640px-56px)]">
        <Canvas
          shadows
          camera={{ position: [room.width * 1.15, room.height * 1.2, room.length * 1.25], fov: 45 }}
        >
          <ambientLight intensity={0.2 + draft.shade * 0.9} />
          <directionalLight position={[5, 6, 3]} intensity={0.5 + draft.shade * 1.2} castShadow />

          {/* floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[room.width, room.length]} />
            <meshStandardMaterial color={room.floorColor} roughness={0.95} metalness={0.0} />
          </mesh>

          {/* helper grid */}
          <Grid
            args={[room.width, room.length]}
            position={[room.width / 2, 0.001, room.length / 2]}
            infiniteGrid={false}
            cellSize={1}
            cellThickness={0.6}
            sectionSize={5}
            sectionThickness={1.2}
            fadeDistance={0}
          />

          <group position={[0, 0, 0]}>
            <Walls w={room.width} l={room.length} h={room.height} color={room.wallColor} />
          </group>

          {/* items */}
          {draft.items.map((it) => {
            return (
              <mesh
                key={it.id}
                castShadow
                receiveShadow
                position={[it.x + it.w / 2, it.h / 2, it.z + it.d / 2]}
                rotation={[0, it.rotY, 0]}
              >
                <boxGeometry args={[it.w, it.h, it.d]} />
                <meshStandardMaterial color={it.color} roughness={0.75} metalness={0.05} />
              </mesh>
            );
          })}

          <OrbitControls
            makeDefault
            target={[room.width / 2, room.height * 0.35, room.length / 2]}
            maxPolarAngle={Math.PI / 2.05}
          />
        </Canvas>
      </div>
    </div>
  );
}
