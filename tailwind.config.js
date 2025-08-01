/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            animation: {
                pulsePromo: 'pulsePromo 2.5s infinite',
            },
            keyframes: {
                pulsePromo: {
                    '0%, 100%': {
                        transform: 'scale(1)',
                        boxShadow: '0 0 0 rgba(251,146,60, 0)',
                    },
                    '50%': {
                        transform: 'scale(1.03)',
                        boxShadow: '0 0 30px rgba(251,146,60, 0.4)',
                    },
                },
            },
        },
    },
    plugins: [],
};
