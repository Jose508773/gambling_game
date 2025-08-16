# 🎰 Casino Gambling Game

A modern, interactive casino gambling game built with React, TypeScript, and Tailwind CSS. Features multiple casino games with beautiful animations and a realistic gambling experience.

## 🎮 Games Available

### Free Games
- **🪙 Coin Flip** - Classic heads or tails betting game
- **🎯 Number Guess** - Guess the mystery number 1-100
- **🎲 Dice Roller** - Roll dice and predict outcomes
- **🃏 Blackjack Pro** - Beat the dealer to 21 with enhanced gameplay

### Premium Games (Available in Store)
- **🃏 Poker Showdown** - 5-card poker battles
- **🎰 Roulette Wheel** - Classic casino roulette game

## ✨ Features

- **🎨 Beautiful Casino UI** - Stunning animations and casino-themed design
- **💰 Token System** - Earn and spend chips across all games
- **🏆 Leaderboard** - Compete with other players
- **🛒 Game Store** - Purchase premium games and cosmetics
- **📱 Responsive Design** - Works on desktop and mobile devices
- **🎭 Animations** - Smooth transitions and celebration effects

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Jose508773/gambling_game.git
cd gambling_game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## 🛠️ Built With

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Shadcn/ui** - UI components
- **Lucide React** - Icons

## 🎯 Game Rules

### Blackjack Pro
- Beat the dealer to 21 without going over
- Aces count as 1 or 11
- Face cards (J, Q, K) count as 10
- Dealer hits on 16 and below, stands on 17+
- Win pays 2:1, Push returns your bet

### Coin Flip
- Bet on heads or tails
- 50/50 chance to win
- Win pays 1:1

### Number Guess
- Guess a number between 1-100
- Exact guess pays 10x your bet
- Within 5 numbers pays 0.5x your bet

### Dice Roller
- Predict dice outcomes
- High/Low or exact number betting
- Various payout multipliers

## 📁 Project Structure

```
src/
├── components/
│   ├── games/           # Game components
│   ├── ui/             # Reusable UI components
│   ├── GameCard.tsx    # Game card component
│   ├── GameStore.tsx   # Store component
│   ├── Leaderboard.tsx # Leaderboard component
│   └── TokenDisplay.tsx # Token display component
├── pages/
│   ├── Index.tsx       # Main game page
│   └── NotFound.tsx    # 404 page
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── main.tsx           # App entry point
```

## 🎨 Customization

The game uses Tailwind CSS for styling, making it easy to customize:
- Colors and themes in `tailwind.config.ts`
- Component styles in individual `.tsx` files
- Animations and effects throughout the codebase

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🎉 Acknowledgments

- Built with modern web technologies
- Inspired by classic casino games
- Designed for entertainment purposes only

---

**⚠️ Disclaimer**: This is a game for entertainment purposes only. No real money is involved, and this should not be used as a substitute for professional gambling advice.
