import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { SceneConfig, SceneObject } from '../content/types'

const WORLD_X = 6
const WORLD_Z = 12

function toWorld(o: SceneObject): [number, number, number] {
  return [o.x * WORLD_X, 0, -o.z * WORLD_Z]
}

const lightColorHex: Record<NonNullable<SceneObject['lightColor']>, string> = {
  feher: '#ffffff',
  piros: '#ff3b3b',
  zold: '#28d17c',
  sarga: '#4aa3ff', // "kék" jelzőfények a veszélyes áruhoz
}

function Water({ night }: { night: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      const m = ref.current.material as THREE.MeshStandardMaterial
      m.opacity = 0.95
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.05 - 0.05
    }
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -4]} receiveShadow>
      <planeGeometry args={[40, 40, 1, 1]} />
      <meshStandardMaterial
        color={night ? '#0a1f38' : '#1f6fb0'}
        transparent
        opacity={0.95}
        metalness={0.1}
        roughness={0.6}
      />
    </mesh>
  )
}

function Boat({ steer }: { steer: boolean }) {
  const group = useRef<THREE.Group>(null)
  const dir = useRef(0)
  useEffect(() => {
    if (!steer) return
    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (e.key === 'ArrowLeft') dir.current = down ? -1 : 0
      if (e.key === 'ArrowRight') dir.current = down ? 1 : 0
    }
    const kd = (e: KeyboardEvent) => onKey(e, true)
    const ku = (e: KeyboardEvent) => onKey(e, false)
    window.addEventListener('keydown', kd)
    window.addEventListener('keyup', ku)
    return () => {
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
    }
  }, [steer])

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.08
    if (steer) {
      group.current.position.x = THREE.MathUtils.clamp(
        group.current.position.x + dir.current * delta * 3,
        -WORLD_X,
        WORLD_X,
      )
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -dir.current * 0.2, 0.1)
    }
  })

  return (
    <group ref={group} position={[0, 0, -4]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[1.1, 0.4, 2.4]} />
        <meshStandardMaterial color="#e8e8ec" />
      </mesh>
      <mesh position={[0, 0.6, -0.2]} castShadow>
        <boxGeometry args={[0.7, 0.4, 0.9]} />
        <meshStandardMaterial color="#c9d3dc" />
      </mesh>
      <mesh position={[0, 0.25, 1.35]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.55, 0.9, 4]} />
        <meshStandardMaterial color="#e8e8ec" />
      </mesh>
    </group>
  )
}

function Buoy({ o }: { o: SceneObject }) {
  const color = o.kind === 'buoy-red' ? '#e23b3b' : o.kind === 'buoy-green' ? '#1faa59' : '#f4c430'
  const [x, , z] = toWorld(o)
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.36, 1, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <coneGeometry args={[0.28, 0.4, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

function SignObj({ o }: { o: SceneObject }) {
  const [x, , z] = toWorld(o)
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2, 8]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
      <mesh position={[0, 2.1, 0]}>
        <boxGeometry args={[1.1, 0.9, 0.08]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {o.label && (
        <Html position={[0, 2.1, 0.1]} center distanceFactor={12}>
          <div className="select-none rounded bg-white px-2 py-1 text-lg font-bold text-red-600 shadow">
            {o.label}
          </div>
        </Html>
      )}
    </group>
  )
}

function LightObj({ o }: { o: SceneObject }) {
  const [x, , z] = toWorld(o)
  const color = lightColorHex[o.lightColor ?? 'feher']
  return (
    <group position={[x, 1.6, z]}>
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <pointLight color={color} intensity={6} distance={6} />
    </group>
  )
}

function Hazard({ o }: { o: SceneObject }) {
  const [x, , z] = toWorld(o)
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color="#b1471f" />
      </mesh>
      {o.label && (
        <Html position={[0, 1.1, 0]} center distanceFactor={12}>
          <div className="select-none rounded bg-amber-400 px-2 py-0.5 text-sm font-bold text-black shadow">
            {o.label}
          </div>
        </Html>
      )}
    </group>
  )
}

function StaticBoat({ o }: { o: SceneObject }) {
  const [x, , z] = toWorld(o)
  return (
    <group position={[x, 0, z]} scale={0.85}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[1.1, 0.4, 2.4]} />
        <meshStandardMaterial color="#d5dde4" />
      </mesh>
      <mesh position={[0, 0.6, -0.2]} castShadow>
        <boxGeometry args={[0.7, 0.4, 0.9]} />
        <meshStandardMaterial color="#aeb9c4" />
      </mesh>
      <mesh position={[0, 0.25, 1.35]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.55, 0.9, 4]} />
        <meshStandardMaterial color="#d5dde4" />
      </mesh>
    </group>
  )
}

function renderObject(o: SceneObject, i: number) {
  switch (o.kind) {
    case 'boat':
      return <StaticBoat key={i} o={o} />
    case 'buoy-red':
    case 'buoy-green':
    case 'buoy-yellow':
      return <Buoy key={i} o={o} />
    case 'sign':
      return <SignObj key={i} o={o} />
    case 'light':
      return <LightObj key={i} o={o} />
    case 'hazard':
      return <Hazard key={i} o={o} />
    default:
      return null
  }
}

export function SituationScene({ config }: { config: SceneConfig }) {
  const night = config.timeOfDay === 'ejszaka'
  const fog = config.visibility === 'kod'
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])

  return (
    <div className="h-full w-full" data-testid="situation-scene">
      <Canvas shadows camera={{ position: [0, 6, 8], fov: 50 }} dpr={[1, 1.8]}>
        <color attach="background" args={[night ? '#04101f' : '#8fc7ef']} />
        {fog && <fog attach="fog" args={[night ? '#04101f' : '#c4d8e6', 6, 22]} />}
        <ambientLight intensity={night ? 0.15 : 0.8} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={night ? 0.2 : 1.1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <Water night={night} />
        {config.objects.map(renderObject)}
        {ready && (
          <group position={[0, 0, 2]}>
            <Boat steer />
          </group>
        )}
      </Canvas>
    </div>
  )
}
