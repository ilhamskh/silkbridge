import { ImageResponse } from 'next/og';

export const size = {
    width: 48,
    height: 48,
};

export const contentType = 'image/png';

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0f172a',
                    color: '#ffffff',
                    fontSize: 30,
                    fontWeight: 700,
                    lineHeight: 1,
                    borderRadius: 12,
                }}
            >
                S
            </div>
        ),
        {
            ...size,
        }
    );
}
