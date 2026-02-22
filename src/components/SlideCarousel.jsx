import React, { useState, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SlideCarousel = ({ slides, title }) => {
    const [current, setCurrent] = useState(0)
    const [dragStart, setDragStart] = useState(null)
    const [dragOffset, setDragOffset] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const containerRef = useRef(null)

    const total = slides.length

    const goTo = useCallback((idx) => {
        setCurrent(Math.max(0, Math.min(idx, total - 1)))
    }, [total])

    const prev = () => setCurrent(curr => (curr === 0 ? total - 1 : curr - 1))
    const next = () => setCurrent(curr => (curr === total - 1 ? 0 : curr + 1))

    // Drag handlers
    const handleDragStart = (clientX) => {
        setDragStart(clientX)
        setIsDragging(true)
    }

    const handleDragMove = (clientX) => {
        if (dragStart === null) return
        setDragOffset(clientX - dragStart)
    }

    const handleDragEnd = () => {
        if (dragStart === null) return
        if (Math.abs(dragOffset) > 60) {
            if (dragOffset < 0) next()
            else prev()
        }
        setDragStart(null)
        setDragOffset(0)
        setIsDragging(false)
    }

    // Mouse events
    const onMouseDown = (e) => {
        e.preventDefault()
        handleDragStart(e.clientX)
    }
    const onMouseMove = (e) => handleDragMove(e.clientX)
    const onMouseUp = () => handleDragEnd()

    // Touch events
    const onTouchStart = (e) => handleDragStart(e.touches[0].clientX)
    const onTouchMove = (e) => handleDragMove(e.touches[0].clientX)
    const onTouchEnd = () => handleDragEnd()

    // Keyboard
    const handleKey = (e) => {
        if (e.key === 'ArrowLeft') prev()
        else if (e.key === 'ArrowRight') next()
    }

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                marginTop: '16px',
                marginBottom: '10px',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#0f172a',
                userSelect: 'none',
            }}
            tabIndex={0}
            onKeyDown={handleKey}
            ref={containerRef}
        >
            {/* Slide viewport */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '45%',
                    overflow: 'hidden',
                    cursor: isDragging ? 'grabbing' : 'grab',
                }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        transform: `translateX(calc(-${current * 100}% + ${dragOffset}px))`,
                        transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    {slides.map((src, i) => (
                        <div
                            key={i}
                            style={{
                                minWidth: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <img
                                src={src}
                                alt={`${title || 'Slide'} - ${i + 1}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                }}
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation arrows */}
            {/* Navigation arrows & Page indicator - only show if multiple slides */}
            {total > 1 && (
                <>
                    <button
                        onClick={prev}
                        style={{
                            position: 'absolute',
                            left: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(0,0,0,0.35)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            width: '42px',
                            height: '42px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(0,0,0,0.55)'
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(0,0,0,0.35)'
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
                        }}
                    >
                        <ChevronLeft size={22} />
                    </button>

                    <button
                        onClick={next}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(0,0,0,0.35)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            width: '42px',
                            height: '42px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(0,0,0,0.55)'
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(0,0,0,0.35)'
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
                        }}
                    >
                        <ChevronRight size={22} />
                    </button>

                    <div
                        style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '14px',
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(4px)',
                            color: 'white',
                            padding: '5px 12px',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontFamily: "'Nanum Pen Script', cursive",
                            fontWeight: '500',
                        }}
                    >
                        {current + 1} / {total}
                    </div>
                </>
            )}
        </div>
    )
}

export default SlideCarousel
