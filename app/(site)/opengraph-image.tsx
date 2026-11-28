import { ImageResponse } from 'next/og';

export const alt = 'ShafaCode: transparent software partner for growing teams';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Default social image: brand background, wordmark and tagline. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: 'radial-gradient(60% 70% at 20% 0%, rgba(174,248,0,0.22), #0d100f 70%)',
          color: '#f7f8f5',
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, color: '#aef800', textTransform: 'uppercase' }}>
          [ Software studio · Barishal, Bangladesh ]
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 84, fontWeight: 600, lineHeight: 1.02, letterSpacing: -3 }}>
          <span>Transparent software partner</span>
          <span style={{ color: '#aef800', fontStyle: 'italic' }}>for growing teams</span>
        </div>
        <div style={{ fontSize: 36, fontWeight: 600 }}>shafacode</div>
      </div>
    ),
    size
  );
}
