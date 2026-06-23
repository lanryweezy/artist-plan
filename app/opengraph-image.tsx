import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Artist Plan - Music Career Management'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #0a0a0a, #1a1a1a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Accents */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          }}
        />

        {/* Music Waveform Representation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 8,
            marginBottom: 40,
          }}
        >
          {[40, 70, 45, 90, 65, 100, 80, 50, 85, 60].map((h, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: h,
                background: 'linear-gradient(to top, #ef4444, #f87171)',
                borderRadius: 6,
                opacity: 0.8,
              }}
            />
          ))}
        </div>

        {/* Main Text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontSize: 84,
              fontWeight: 900,
              color: 'white',
              margin: 0,
              letterSpacing: '-0.05em',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            Artist Plan
          </h1>
          <p
            style={{
              fontSize: 32,
              color: '#9ca3af',
              marginTop: 12,
              fontWeight: 500,
            }}
          >
            The Protector of Your Music Career
          </p>
        </div>

        {/* Footer Info */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '12px 24px',
            borderRadius: 100,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#ef4444',
            }}
          />
          <span style={{ color: '#e5e7eb', fontSize: 20, fontWeight: 600 }}>
            Powered by Street Heart Technologies
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
