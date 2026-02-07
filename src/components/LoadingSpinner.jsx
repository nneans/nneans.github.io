import React from 'react'

const LoadingSpinner = () => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(145deg, #f8fafc 0%, #eef2ff 50%, #f5f3ff 100%)',
            borderRadius: '12px',
        }}>
            {/* 스피너 */}
            <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid rgba(99, 102, 241, 0.1)',
                borderTop: '4px solid #6366f1',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
            }} />

            {/* 로딩 텍스트 */}
            <p style={{
                marginTop: '16px',
                fontSize: '0.9rem',
                color: '#64748b',
                fontFamily: '"Segoe UI", -apple-system, sans-serif',
            }}>
                Loading projects...
            </p>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}

export default LoadingSpinner
