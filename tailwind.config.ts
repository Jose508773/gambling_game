import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-gold': 'var(--gradient-gold)',
				'gradient-card': 'var(--gradient-card)',
				'gradient-game': 'var(--gradient-game)'
			},
			boxShadow: {
				'neon': 'var(--shadow-neon)',
				'gold': 'var(--shadow-gold)',
				'game': 'var(--shadow-game)'
			},
			transitionTimingFunction: {
				'smooth': 'var(--transition-smooth)',
				'bounce': 'var(--transition-bounce)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px hsl(270 80% 60% / 0.3)'
					},
					'50%': {
						boxShadow: '0 0 40px hsl(270 80% 60% / 0.6)'
					}
				},
				'token-bounce': {
					'0%': { transform: 'scale(1) rotate(0deg)' },
					'50%': { transform: 'scale(1.2) rotate(180deg)' },
					'100%': { transform: 'scale(1) rotate(360deg)' }
				},
				'card-flip': {
					'0%': { transform: 'rotateY(0deg)' },
					'100%': { transform: 'rotateY(180deg)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'slide-up': {
					from: {
						transform: 'translateY(30px)',
						opacity: '0'
					},
					to: {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'slide-down': {
					from: {
						transform: 'translateY(-30px)',
						opacity: '0'
					},
					to: {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'fade-in': {
					from: {
						opacity: '0'
					},
					to: {
						opacity: '1'
					}
				},
				'scale-in': {
					from: {
						transform: 'scale(0.8)',
						opacity: '0'
					},
					to: {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'bounce-in': {
					'0%': {
						transform: 'scale(0.3)',
						opacity: '0'
					},
					'50%': {
						transform: 'scale(1.05)',
						opacity: '0.8'
					},
					'70%': {
						transform: 'scale(0.9)',
						opacity: '1'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-200% 0'
					},
					'100%': {
						backgroundPosition: '200% 0'
					}
				},
				'wiggle': {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' }
				},
				'heartbeat': {
					'0%': { transform: 'scale(1)' },
					'14%': { transform: 'scale(1.3)' },
					'28%': { transform: 'scale(1)' },
					'42%': { transform: 'scale(1.3)' },
					'70%': { transform: 'scale(1)' }
				},
				'number-pop': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.3) rotate(5deg)' },
					'100%': { transform: 'scale(1) rotate(0deg)' }
				},
				'coin-flip-3d': {
					'0%': { transform: 'rotateX(0deg) rotateY(0deg)' },
					'25%': { transform: 'rotateX(90deg) rotateY(90deg)' },
					'50%': { transform: 'rotateX(180deg) rotateY(180deg)' },
					'75%': { transform: 'rotateX(270deg) rotateY(270deg)' },
					'100%': { transform: 'rotateX(360deg) rotateY(360deg)' }
				},
				'particles': {
					'0%': {
						transform: 'translateY(0) scale(1)',
						opacity: '1'
					},
					'100%': {
						transform: 'translateY(-100px) scale(0)',
						opacity: '0'
					}
				},
				'win-celebration': {
					'0%': { transform: 'scale(1) rotate(0deg)' },
					'25%': { transform: 'scale(1.2) rotate(90deg)' },
					'50%': { transform: 'scale(1.4) rotate(180deg)' },
					'75%': { transform: 'scale(1.2) rotate(270deg)' },
					'100%': { transform: 'scale(1) rotate(360deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'token-bounce': 'token-bounce 0.6s ease-in-out',
				'card-flip': 'card-flip 0.6s ease-in-out',
				'float': 'float 3s ease-in-out infinite',
				'slide-up': 'slide-up 0.6s ease-out',
				'slide-down': 'slide-down 0.6s ease-out',
				'fade-in': 'fade-in 0.8s ease-out',
				'scale-in': 'scale-in 0.5s ease-out',
				'bounce-in': 'bounce-in 0.8s ease-out',
				'shimmer': 'shimmer 2s linear infinite',
				'wiggle': 'wiggle 1s ease-in-out infinite',
				'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
				'number-pop': 'number-pop 0.4s ease-out',
				'coin-flip-3d': 'coin-flip-3d 1.5s ease-in-out',
				'particles': 'particles 2s ease-out forwards',
				'win-celebration': 'win-celebration 1s ease-in-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
