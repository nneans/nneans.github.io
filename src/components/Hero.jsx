import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowRight, Mail } from 'lucide-react'

function Hero() {
    const [textIndex, setTextIndex] = useState(0)
    const texts = ["FINANCIAL FREEDOM", "DATA INSIGHTS", "SMART DECISIONS"]

    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex((prev) => (prev + 1) % texts.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <section id="hero" className="hero-section">
            <div className="hero-container">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="hero-badge"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Available for projects
                    </motion.div>

                    <h1 className="hero-title">
                        DESIGNING <br />
                        <span className="text-secondary">
                            {texts[textIndex]}
                        </span> <br />
                        WITH <span className="text-accent">AI</span>
                    </h1>

                    <p className="hero-description">
                        안녕하세요, 데이터와 인공지능으로 복잡한 금융 데이터를
                        명확하고 아름다운 통찰로 바꾸는 개발자 강민균입니다.
                    </p>

                    <div className="hero-actions">
                        <a href="#projects" className="btn btn-primary btn-large">
                            VIEW PROJECTS <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                        </a>
                        <a href="#contact" className="btn btn-outline btn-large">
                            CONTACT ME <Mail size={20} style={{ marginLeft: '8px' }} />
                        </a>
                    </div>
                </motion.div>

                <div className="hero-visual">
                    <motion.div
                        className="visual-card"
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 2, -2, 0]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <div className="visual-inner glass-effect">
                            <div className="illustration-placeholder">
                                <motion.div
                                    className="shape shape-1"
                                    animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                />
                                <motion.div
                                    className="shape shape-2"
                                    animate={{ scale: [1, 0.8, 1], y: [0, -20, 0] }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                />
                                <motion.div
                                    className="shape shape-3"
                                    animate={{ rotate: [0, 180, 360] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                            <div className="code-snippet">
                                <pre>
                                    <code>
                                        {`const future = await AI.predict({
  data: financial_history,
  goal: "freedom"
});`}
                                    </code>
                                </pre>
                            </div>
                        </div>
                        <div className="visual-tag">Mino AI v4.0</div>
                    </motion.div>
                </div>
            </div>

            {/* Background Particles */}
            <div className="particles-container">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 300 + 50}px`,
                            height: `${Math.random() * 300 + 50}px`,
                            background: i % 2 === 0 ? 'var(--secondary-color)' : 'var(--accent-color)',
                        }}
                        animate={{
                            x: [0, Math.random() * 100 - 50],
                            y: [0, Math.random() * 100 - 50],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>
        </section>
    )
}

export default Hero
