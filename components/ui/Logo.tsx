export default function Logo({ className = '' }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 200 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Bridge icon */}
            <g>
                <path
                    d="M8 28h24M12 28V18c0-2 2-4 8-4s8 2 8 4v10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M16 28V20M24 28V20"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                <ellipse
                    cx="20"
                    cy="10"
                    rx="6"
                    ry="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                />
            </g>
            {/* Text */}
            <text
                x="44"
                y="26"
                fill="currentColor"
                fontFamily="var(--font-sora), system-ui, sans-serif"
                fontWeight="600"
                fontSize="16"
                letterSpacing="-0.02em"
            >
                SILKBRIDGE
            </text>
            <text
                x="146"
                y="26"
                fill="currentColor"
                fontFamily="var(--font-inter), system-ui, sans-serif"
                fontWeight="400"
                fontSize="10"
                letterSpacing="0.05em"
                opacity="0.7"
            >
                INTL
            </text>
        </svg>
    );
}
