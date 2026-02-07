import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import LoadingSpinner from './LoadingSpinner'

// 카테고리별 색상
const CATEGORY_COLORS = {
    research: { primary: '#6366f1', accent: '#4f46e5' },      // 인디고 - 연구
    personal: { primary: '#10b981', accent: '#059669' },      // 에메랄드 - 개인
    competition: { primary: '#f59e0b', accent: '#d97706' },   // 앰버 - 대회
    industry: { primary: '#ec4899', accent: '#db2777' },      // 핑크 - 산학협력
}

// 카메라 제어 컴포넌트
const CameraRig = ({ targetPosition, isResetting, onFinish, onResetFinish }) => {
    const { camera, controls } = useThree()
    const arrivedRef = useRef(false)
    const prevTargetRef = useRef(null)

    // 배열 비교 함수
    const arraysEqual = (a, b) => {
        if (!a || !b) return a === b
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
    }

    useFrame((state, delta) => {
        if (!controls) return

        // 타겟이 변경되었는지 배열 값으로 비교
        if (!arraysEqual(targetPosition, prevTargetRef.current)) {
            arrivedRef.current = false
            prevTargetRef.current = targetPosition ? [...targetPosition] : null
        }

        // 도착했으면 더 이상 카메라 강제 이동 안 함 (줌/팬 가능하게)
        if (targetPosition && !isResetting && arrivedRef.current) {
            return
        }

        if (targetPosition && !isResetting) {
            const targetCamPos = new THREE.Vector3(
                targetPosition[0] * 1.2,
                targetPosition[1] * 1.2,
                targetPosition[2] + 6
            )

            // 카메라 이동 (속도 높임)
            camera.position.lerp(targetCamPos, 6 * delta)
            controls.target.lerp(new THREE.Vector3(...targetPosition), 6 * delta)
            controls.update()

            // 거리 1.5 이하로 들어오면 도착 처리 (팝업 확실하게 열기)
            if (!arrivedRef.current && camera.position.distanceTo(targetCamPos) < 1.5) {
                arrivedRef.current = true
                onFinish?.()
            }
        } else if (isResetting) {
            // ... (기존 리셋 로직 유지)
            const defaultCamPos = new THREE.Vector3(0, 0, 16)
            camera.position.lerp(defaultCamPos, 4 * delta)
            controls.target.lerp(new THREE.Vector3(0, 0, 0), 4 * delta)
            controls.update()

            if (camera.position.distanceTo(defaultCamPos) < 0.5) {
                onResetFinish?.()
            }
        }
    })
    return null
}

// 프로젝트 노드 컴포넌트
const ProjectNode = ({ project, position, colors, index, onClick, allPositions }) => {
    const meshRef = useRef()
    const [hovered, setHover] = useState(false)
    const nodeSize = 0.9
    const phase = useMemo(() => Math.random() * Math.PI * 2, [])

    useFrame((state) => {
        if (!meshRef.current) return
        const t = state.clock.getElapsedTime()

        let x = position[0]
        let y = position[1] + Math.sin(t * 0.4 + phase) * 0.1
        let z = position[2] + Math.cos(t * 0.3 + phase) * 0.05

        if (allPositions) {
            allPositions.forEach((otherPos, i) => {
                if (i === index) return
                const dx = otherPos[0] - x
                const dy = otherPos[1] - y
                const dz = otherPos[2] - z
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
                if (dist < 2.2) {
                    const push = 0.015 * (2.2 - dist)
                    x -= dx * push / (dist + 0.1)
                    y -= dy * push / (dist + 0.1)
                    z -= dz * push / (dist + 0.1)
                }
            })
        }

        meshRef.current.position.set(x, y, z)
        const scale = hovered ? 1.12 : 1
        meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
    })

    const handleClick = (e) => {
        e.stopPropagation()
        onClick?.(project, position)
    }

    const handlePointerOver = (e) => {
        e.stopPropagation()  // 뒤에 있는 노드에 이벤트 전달 방지
        setHover(true)
        document.body.style.cursor = 'pointer'
    }

    const handlePointerOut = (e) => {
        e.stopPropagation()
        setHover(false)
        document.body.style.cursor = 'auto'
    }

    return (
        <group ref={meshRef} position={position}>
            {/* 글로우 */}
            <mesh onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
                <sphereGeometry args={[nodeSize + 0.12, 24, 24]} />
                <meshBasicMaterial color={colors.accent} transparent opacity={hovered ? 0.25 : 0.12} />
            </mesh>

            {/* 메인 노드 */}
            <mesh onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
                <sphereGeometry args={[nodeSize, 32, 32]} />
                <meshStandardMaterial
                    color={colors.primary}
                    metalness={0.15}
                    roughness={0.5}
                    opacity={0.92}
                    transparent={true}
                />
            </mesh>

            {/* 라벨 */}
            <Html distanceFactor={12} position={[0, nodeSize + 0.7, 0]} center style={{ pointerEvents: 'none' }}>
                <div style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.2s', pointerEvents: 'none' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.97)',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#1e293b',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        whiteSpace: 'nowrap',
                        fontFamily: '"Segoe UI", -apple-system, sans-serif',
                        borderLeft: `3px solid ${colors.primary}`,
                    }}>
                        {project.title.length > 32 ? project.title.slice(0, 32) + '...' : project.title}
                    </div>
                </div>
            </Html>
        </group>
    )
}

// 메인 컴포넌트
const ProjectArchive = ({ profiles, onNodeClick, selectedProject }) => {
    const [targetPos, setTargetPos] = useState(null)
    const [isResetting, setIsResetting] = useState(false)
    const pendingProjectRef = useRef(null)
    const canvasRef = useRef(null)

    // 모든 프로젝트
    const allProjects = useMemo(() => {
        const research = (profiles.researchExperience || []).map(p => ({ ...p, category: 'research' }))
        const personal = (profiles.personalProjects || []).map(p => ({ ...p, category: 'personal' }))
        const industry = (profiles.industryProjects || []).map(p => ({ ...p, category: 'industry' }))
        const competitions = (profiles.competitions || []).map(p => ({ ...p, category: 'competition' }))
        return [...research, ...personal, ...industry, ...competitions]
    }, [profiles])

    // 노드 생성
    const nodes = useMemo(() => {
        const count = allProjects.length
        return allProjects.map((p, i) => {
            const angle = (i / count) * Math.PI * 2 - Math.PI / 2
            const radius = 4.5 + Math.sin(i * 0.8) * 1.2
            return {
                project: p,
                position: [Math.cos(angle) * radius, (Math.sin(i * 1.2) - 0.5) * 1.8, Math.sin(angle) * radius],
                colors: CATEGORY_COLORS[p.category],
                index: i
            }
        })
    }, [allProjects])

    // 이전 선택 상태 추적
    const prevSelectedRef = useRef(null)

    // 모달 닫히면 카메라 리셋 (줌아웃)
    useEffect(() => {
        // 이전에 열려있었다가 닫힌 경우에만 리셋
        if (prevSelectedRef.current && !selectedProject) {
            setTargetPos(null)
            setIsResetting(true)
            pendingProjectRef.current = null
        }
        prevSelectedRef.current = selectedProject
    }, [selectedProject])

    // 노드 클릭: 카메라 이동 시작 (팝업은 도착 후)
    const handleNodeClick = useCallback((project, position) => {
        setIsResetting(false)
        setTargetPos(position)
        pendingProjectRef.current = project  // 카메라 도착 후 열릴 프로젝트
    }, [])

    // 카메라 도착 시 팝업 열기
    const handleCameraFinish = useCallback(() => {
        if (pendingProjectRef.current) {
            onNodeClick?.(pendingProjectRef.current)
        }
    }, [onNodeClick])

    // 빈 공간 클릭 시 리셋
    const handleMissed = useCallback(() => {
        if (!selectedProject) {
            setTargetPos(null)
            setIsResetting(true)
            pendingProjectRef.current = null
        }
    }, [selectedProject])

    return (
        <div
            ref={canvasRef}
            style={{
                width: '100%',
                height: '400px',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                background: 'linear-gradient(145deg, #f8fafc 0%, #eef2ff 50%, #f5f3ff 100%)',
                border: '1px solid rgba(148, 163, 184, 0.25)',
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 16], fov: 40 }}
                dpr={[1, 2]}
                onPointerMissed={handleMissed}
                style={{ pointerEvents: 'auto' }}
                fallback={<LoadingSpinner />}
            >
                <ambientLight intensity={0.7} />
                <pointLight position={[10, 8, 10]} intensity={0.9} />
                <pointLight position={[-8, -5, 5]} intensity={0.4} color="#a5b4fc" />
                <Environment preset="city" />

                {nodes.map((node, i) => (
                    <ProjectNode
                        key={i}
                        {...node}
                        onClick={handleNodeClick}
                        allPositions={nodes.map(n => n.position)}
                    />
                ))}

                {/* 연결선 */}
                {nodes.length > 1 && nodes.map((node, i) => {
                    const next = nodes[(i + 1) % nodes.length]
                    const geo = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(...node.position),
                        new THREE.Vector3(...next.position)
                    ])
                    return (
                        <line key={`line-${i}`} geometry={geo}>
                            <lineBasicMaterial color="#c7d2fe" transparent opacity={0.35} />
                        </line>
                    )
                })}

                <ContactShadows position={[0, -3.5, 0]} opacity={0.12} scale={20} blur={2} />

                <OrbitControls
                    makeDefault
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    autoRotate={!targetPos && !isResetting}
                    autoRotateSpeed={0.5}
                    minDistance={8}
                    maxDistance={30}
                />

                <CameraRig
                    targetPosition={targetPos}
                    isResetting={isResetting}
                    onFinish={handleCameraFinish}
                    onResetFinish={() => setIsResetting(false)}
                />
            </Canvas>

            {/* 안내 텍스트 */}
            <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.8rem',
                color: '#94a3b8',
                pointerEvents: 'none',
                fontFamily: '"Segoe UI", -apple-system, sans-serif',
            }}>
                Drag to rotate · Click node for details
            </div>
        </div>
    )
}

export default ProjectArchive
