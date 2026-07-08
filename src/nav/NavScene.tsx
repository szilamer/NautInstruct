import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { detectViolation, forwardVector, isGoalReached, stepBoat } from './engine'
import type { BoatInput, BoatState, NavMission, Vessel, Violation } from './types'

export interface NavRefs {
  boat: MutableRefObject<BoatState>
  input: MutableRefObject<BoatInput>
  vessels: MutableRefObject<Vessel[]>
  fogTimer: MutableRefObject<number>
}

const lightHex: Record<string, string> = { feher: '#ffffff', piros: '#ff3b3b', zold: '#28d17c' }

function BoatMesh({ boatRef }: { boatRef: MutableRefObject<BoatState> }) {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!group.current) return
    const b = boatRef.current
    group.current.position.set(b.x, Math.sin(state.clock.elapsedTime * 2) * 0.06, b.z)
    group.current.rotation.y = b.heading
  })
  return (
    <group ref={group}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[1, 0.4, 2.2]} />
        <meshStandardMaterial color="#eef2f6" />
      </mesh>
      <mesh position={[0, 0.6, -0.2]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.8]} />
        <meshStandardMaterial color="#b9c4cf" />
      </mesh>
      <mesh position={[0, 0.25, 1.25]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.5, 0.8, 4]} />
        <meshStandardMaterial color="#eef2f6" />
      </mesh>
    </group>
  )
}

function VesselMesh({ vesselsRef, index }: { vesselsRef: MutableRefObject<Vessel[]>; index: number }) {
  const group = useRef<THREE.Group>(null)
  useFrame(() => {
    const v = vesselsRef.current[index]
    if (!group.current || !v) return
    group.current.position.set(v.x, 0, v.z)
    group.current.rotation.y = v.heading
  })
  const v = vesselsRef.current[index]
  return (
    <group ref={group}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.2, 0.5, 2.6]} />
        <meshStandardMaterial color="#3a4653" />
      </mesh>
      {v?.lights?.map((l, i) => (
        <mesh key={i} position={[l.dx, 1, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial
            color={lightHex[l.color]}
            emissive={lightHex[l.color]}
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function ChaseCamera({ boatRef }: { boatRef: MutableRefObject<BoatState> }) {
  const { camera } = useThree()
  useFrame(() => {
    const b = boatRef.current
    const fwd = forwardVector(b.heading)
    const target = new THREE.Vector3(b.x - fwd.x * 10, 8, b.z - fwd.z * 10)
    camera.position.lerp(target, 0.1)
    camera.lookAt(b.x + fwd.x * 4, 0, b.z + fwd.z * 4)
  })
  return null
}

function Simulation({
  mission,
  refs,
  running,
  onViolation,
  onGoal,
}: {
  mission: NavMission
  refs: NavRefs
  running: boolean
  onViolation: (v: Violation) => void
  onGoal: () => void
}) {
  useFrame((_, delta) => {
    if (!running) return
    const dt = Math.min(delta, 1 / 30)
    const prev = { ...refs.boat.current }
    refs.boat.current = stepBoat(refs.boat.current, refs.input.current, dt)

    for (const v of refs.vessels.current) {
      const f = forwardVector(v.heading)
      v.x += f.x * v.speed * dt
      v.z += f.z * v.speed * dt
    }

    // Ködsebesség debounce.
    let fogOver = false
    if (mission.visibility === 'kod' && mission.speedLimit != null) {
      if (refs.boat.current.speed > mission.speedLimit) {
        refs.fogTimer.current += dt
        if (refs.fogTimer.current > 1.2) fogOver = true
      } else {
        refs.fogTimer.current = 0
      }
    }

    const violation = detectViolation(prev, refs.boat.current, mission, fogOver)
    if (violation) {
      onViolation(violation)
      return
    }
    if (isGoalReached(refs.boat.current, mission)) onGoal()
  })
  return null
}

function Water({ night }: { night: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 18]} receiveShadow>
      <planeGeometry args={[120, 120]} />
      <meshStandardMaterial color={night ? '#0a2036' : '#1f6fb0'} roughness={0.7} metalness={0.1} />
    </mesh>
  )
}

function Buoy({ x, z, color }: { x: number; z: number; color: 'red' | 'green' }) {
  const c = color === 'red' ? '#e23b3b' : '#1faa59'
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 1, 12]} />
        <meshStandardMaterial color={c} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <coneGeometry args={[0.3, 0.4, 12]} />
        <meshStandardMaterial color={c} />
      </mesh>
    </group>
  )
}

function ZoneRing({
  x,
  z,
  radius,
  kind,
  label,
}: {
  x: number
  z: number
  radius: number
  kind: string
  label?: string
}) {
  const color = kind === 'goal' ? '#4ade80' : kind === 'anchor' ? '#38bdf8' : '#ef4444'
  return (
    <group position={[x, 0.02, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.25, radius, 40]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 40]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
      {label && (
        <Html position={[0, 0.5, 0]} center distanceFactor={22}>
          <div className="whitespace-nowrap rounded bg-black/60 px-2 py-0.5 text-xs text-white">{label}</div>
        </Html>
      )}
    </group>
  )
}

function Hazard({ x, z, radius, label }: { x: number; z: number; radius: number; label?: string }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[radius, 0.6, radius]} />
        <meshStandardMaterial color="#8a5a2b" />
      </mesh>
      {label && (
        <Html position={[0, 1, 0]} center distanceFactor={22}>
          <div className="whitespace-nowrap rounded bg-amber-500 px-2 py-0.5 text-xs font-bold text-black">
            {label}
          </div>
        </Html>
      )}
    </group>
  )
}

export function NavScene({
  mission,
  refs,
  running,
  onViolation,
  onGoal,
}: {
  mission: NavMission
  refs: NavRefs
  running: boolean
  onViolation: (v: Violation) => void
  onGoal: () => void
}) {
  const night = mission.timeOfDay === 'ejszaka'
  const fog = mission.visibility === 'kod'
  return (
    <div className="h-full w-full" data-testid="nav-scene">
      <Canvas shadows camera={{ position: [0, 8, -10], fov: 55 }} dpr={[1, 1.7]}>
        <color attach="background" args={[night ? '#04101f' : fog ? '#c3d0d9' : '#8fc7ef']} />
        {fog && <fog attach="fog" args={['#c3d0d9', 4, 20]} />}
        <ambientLight intensity={night ? 0.2 : 0.85} />
        <directionalLight position={[6, 12, 4]} intensity={night ? 0.25 : 1.1} castShadow />
        <Water night={night} />
        {mission.buoys.map((b) => (
          <Buoy key={b.id} x={b.x} z={b.z} color={b.color} />
        ))}
        {mission.zones.map((z) => (
          <ZoneRing key={z.id} x={z.x} z={z.z} radius={z.radius} kind={z.kind} label={z.label} />
        ))}
        {mission.hazards.map((h) => (
          <Hazard key={h.id} x={h.x} z={h.z} radius={h.radius} label={h.label} />
        ))}
        {mission.vessels.map((_, i) => (
          <VesselMesh key={i} vesselsRef={refs.vessels} index={i} />
        ))}
        <BoatMesh boatRef={refs.boat} />
        <ChaseCamera boatRef={refs.boat} />
        <Simulation mission={mission} refs={refs} running={running} onViolation={onViolation} onGoal={onGoal} />
      </Canvas>
    </div>
  )
}
