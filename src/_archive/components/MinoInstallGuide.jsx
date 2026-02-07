import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download, Shield, Terminal, CheckCircle,
    AlertTriangle, Copy, ChevronDown, ChevronUp,
    Apple, FolderOpen, Play
} from 'lucide-react';
import './MinoInstallGuide.css';

const INSTALL_STEPS = [
    {
        id: 'download',
        title: 'DMG 파일 다운로드',
        icon: Download,
        desc: '위의 "앱 다운로드 (macOS)" 버튼을 클릭하여 Mino DMG 파일을 다운로드합니다.',
        colorClass: 'step-blue'
    },
    {
        id: 'install',
        title: '앱 설치',
        icon: FolderOpen,
        desc: 'DMG 파일을 열고, Mino 앱을 Applications 폴더로 드래그합니다.',
        colorClass: 'step-purple'
    },
    {
        id: 'security',
        title: '보안 설정',
        icon: Shield,
        desc: 'macOS 보안 정책으로 인해 추가 허용이 필요합니다. 아래를 확인하세요.',
        colorClass: 'step-amber',
        isExpandable: true
    },
    {
        id: 'run',
        title: '앱 실행',
        icon: Play,
        desc: 'Applications에서 Mino를 우클릭 → "열기"로 실행합니다.',
        colorClass: 'step-green'
    }
];

const TERMINAL_COMMANDS = [
    {
        id: 'quarantine',
        title: '"손상된 앱" 오류 해결',
        desc: '인터넷에서 다운로드한 앱에 붙는 격리 속성을 제거합니다.',
        command: 'xattr -cr /Applications/Mino.app'
    },
    {
        id: 'alternative',
        title: '대체 명령어',
        desc: '위 명령어가 작동하지 않을 경우 사용합니다.',
        command: 'xattr -d com.apple.quarantine /Applications/Mino.app'
    }
];

const MinoInstallGuide = () => {
    const [expandedStep, setExpandedStep] = useState(null);
    const [copiedCommand, setCopiedCommand] = useState(null);

    const copyToClipboard = async (text, id) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedCommand(id);
            setTimeout(() => setCopiedCommand(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const toggleExpand = (stepId) => {
        setExpandedStep(expandedStep === stepId ? null : stepId);
    };

    return (
        <div className="install-guide-container">
            <div className="install-guide-header">
                <div className="install-guide-icon">
                    <Apple size={24} />
                </div>
                <div>
                    <h3 className="install-guide-title">macOS 설치 가이드</h3>
                    <p className="install-guide-subtitle">
                        서명되지 않은 앱이므로 최초 실행 시 추가 설정이 필요합니다
                    </p>
                </div>
            </div>

            {/* Why this is needed */}
            <div className="install-notice">
                <AlertTriangle size={18} />
                <span>
                    Mino는 개인 프로젝트로, Apple 개발자 프로그램에 등록되지 않았습니다.
                    macOS Gatekeeper가 앱을 차단할 수 있으며, 아래 단계를 따라 허용해주세요.
                </span>
            </div>

            {/* Installation Steps */}
            <div className="install-steps">
                {INSTALL_STEPS.map((step, index) => {
                    const Icon = step.icon;
                    const isExpanded = expandedStep === step.id;

                    return (
                        <motion.div
                            key={step.id}
                            className={`install-step ${step.colorClass}`}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div
                                className={`step-header ${step.isExpandable ? 'expandable' : ''}`}
                                onClick={() => step.isExpandable && toggleExpand(step.id)}
                            >
                                <div className="step-number">{index + 1}</div>
                                <div className="step-icon">
                                    <Icon size={20} />
                                </div>
                                <div className="step-content">
                                    <h4 className="step-title">{step.title}</h4>
                                    <p className="step-desc">{step.desc}</p>
                                </div>
                                {step.isExpandable && (
                                    <div className="step-expand-icon">
                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                )}
                            </div>

                            {/* Expandable Security Section */}
                            <AnimatePresence>
                                {step.isExpandable && isExpanded && (
                                    <motion.div
                                        className="step-expanded-content"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="security-options">
                                            {/* Option 1: Right-click open */}
                                            <div className="security-option">
                                                <h5>방법 1: 우클릭으로 열기 (권장)</h5>
                                                <ol>
                                                    <li>Finder에서 Applications 폴더로 이동</li>
                                                    <li>Mino 앱을 <strong>우클릭</strong> (또는 Control + 클릭)</li>
                                                    <li>메뉴에서 <strong>"열기"</strong> 선택</li>
                                                    <li>경고창에서 다시 <strong>"열기"</strong> 클릭</li>
                                                </ol>
                                            </div>

                                            {/* Option 2: Terminal commands */}
                                            <div className="security-option">
                                                <h5>방법 2: 터미널 명령어</h5>
                                                <p className="terminal-intro">
                                                    "손상된 앱" 오류가 나타날 경우, 터미널에서 아래 명령어를 실행하세요.
                                                </p>

                                                {TERMINAL_COMMANDS.map((cmd) => (
                                                    <div key={cmd.id} className="terminal-block">
                                                        <div className="terminal-header">
                                                            <Terminal size={14} />
                                                            <span>{cmd.title}</span>
                                                        </div>
                                                        <div className="terminal-body">
                                                            <code>{cmd.command}</code>
                                                            <button
                                                                className={`copy-btn ${copiedCommand === cmd.id ? 'copied' : ''}`}
                                                                onClick={() => copyToClipboard(cmd.command, cmd.id)}
                                                            >
                                                                {copiedCommand === cmd.id ? (
                                                                    <><CheckCircle size={14} /> 복사됨</>
                                                                ) : (
                                                                    <><Copy size={14} /> 복사</>
                                                                )}
                                                            </button>
                                                        </div>
                                                        <p className="terminal-desc">{cmd.desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* Data Storage Info */}
            <div className="data-info">
                <h4>📂 데이터 저장 위치</h4>
                <p>모든 지출 데이터는 로컬에 안전하게 저장됩니다:</p>
                <code className="data-path">~/Library/Application Support/Mino/Mino.db</code>
                <p className="data-note">
                    앱 삭제 시에도 데이터는 보존됩니다. 백업은 같은 폴더의 Mino_Backups에 자동 저장됩니다.
                </p>
            </div>
        </div>
    );
};

export default MinoInstallGuide;
