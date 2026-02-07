import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard, MessageSquare, Smartphone, Mail,
    RefreshCw, Database, BrainCircuit,
    ArrowRight, ArrowDown
} from 'lucide-react';
import './MinoWorkflow.css';

// --- 데이터 정의 ---
const PHASE_1 = [
    {
        id: 'p1-1',
        title: '카드 결제',
        desc: '온/오프라인 결제 즉시 감지',
        icon: CreditCard,
        colorClass: 'color-red'
    },
    {
        id: 'p1-2',
        title: '문자 수신',
        desc: '카드사 SMS 알림 도착',
        icon: MessageSquare,
        colorClass: 'color-blue'
    },
    {
        id: 'p1-3',
        title: 'iOS 단축어',
        desc: '백그라운드 자동 트리거 실행',
        icon: Smartphone,
        colorClass: 'color-indigo'
    },
    {
        id: 'p1-4',
        title: 'Gmail 백업',
        desc: 'Mino_DATA 태그로 안전 보관',
        icon: Mail,
        colorClass: 'color-purple'
    },
];

const PHASE_2 = [
    {
        id: 'p2-1',
        title: '동기화 클릭',
        desc: '앱 내 [동기화] 버튼 터치',
        icon: RefreshCw,
        colorClass: 'color-orange'
    },
    {
        id: 'p2-2',
        title: '데이터 수집',
        desc: 'Gmail에서 미처리 내역 파싱',
        icon: Mail,
        colorClass: 'color-sky'
    },
    {
        id: 'p2-3',
        title: 'LLM AI 엔진',
        desc: '비정형 텍스트 → JSON 정제',
        icon: BrainCircuit,
        colorClass: 'color-fuchsia'
    },
    {
        id: 'p2-4',
        title: 'INBOX 저장',
        desc: 'DB 저장 및 대시보드 반영',
        icon: Database,
        colorClass: 'color-emerald'
    },
];

// --- 개별 카드 컴포넌트 ---
const WorkflowCard = ({ step, index, total, hoveredId, setHoveredId }) => {
    const isHovered = hoveredId === step.id;
    const Icon = step.icon;

    return (
        <div className="workflow-card-wrapper">
            {/* 카드 본체 */}
            <motion.div
                className={`workflow-card ${isHovered ? `active ${step.colorClass}` : 'default'}`}
                onHoverStart={() => setHoveredId(step.id)}
                onHoverEnd={() => setHoveredId(null)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
            >
                <Icon size={32} className="card-icon" />
                <h3 className="card-title">{step.title}</h3>

                {/* 설명 (툴팁) */}
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card-tooltip"
                    >
                        {step.desc}
                    </motion.div>
                )}
            </motion.div>

            {/* 연결 화살표 (마지막 카드 제외) */}
            {index < total - 1 && (
                <>
                    <div className="arrow-separator">
                        <ArrowRight size={24} />
                    </div>
                    <div className="arrow-separator-mobile">
                        <ArrowDown size={24} />
                    </div>
                </>
            )}
        </div>
    );
};

// --- 메인 컴포넌트 ---
const MinoWorkflow = () => {
    const [hoveredId, setHoveredId] = useState(null);

    return (
        <div className="workflow-container">
            <div className="workflow-header">
                <h2 className="workflow-title">How Mino Works</h2>
                <p className="workflow-subtitle">
                    복잡한 과정은 숨기고, 결과만 보여줍니다.<br />
                    <span className="workflow-subtitle-highlight-1">자동 수집</span>과 <span className="workflow-subtitle-highlight-2">AI 분석</span>의 2단계 파이프라인.
                </p>
            </div>

            {/* Phase 1 Area */}
            <div className="phase-section">
                <div className="phase-header">
                    <span className="phase-badge">Phase 1</span>
                    <h3 className="phase-title">자동 수집 및 백업 (Auto-Capture)</h3>
                </div>

                <div className="phase-cards-container">
                    {PHASE_1.map((step, idx) => (
                        <WorkflowCard
                            key={step.id}
                            step={step}
                            index={idx}
                            total={PHASE_1.length}
                            hoveredId={hoveredId}
                            setHoveredId={setHoveredId}
                        />
                    ))}
                </div>
            </div>

            {/* 연결선 (Phase 1 -> Phase 2) */}
            <div className="phase-connector">
                <div className="phase-line"></div>
            </div>

            {/* Phase 2 Area */}
            <div className="phase-section">
                <div className="phase-header">
                    <span className="phase-badge">Phase 2</span>
                    <h3 className="phase-title">지능형 데이터 처리 (AI Processing)</h3>
                </div>

                <div className="phase-cards-container">
                    {PHASE_2.map((step, idx) => (
                        <WorkflowCard
                            key={step.id}
                            step={step}
                            index={idx}
                            total={PHASE_2.length}
                            hoveredId={hoveredId}
                            setHoveredId={setHoveredId}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MinoWorkflow;
