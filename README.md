# Campaign Budget Calculator

A React-based web application for calculating daily campaign budgets based on current spend and targets. Built with TypeScript, Vite, and TailwindCSS.

## Features

- Calculate daily budgets based on current spend and monthly targets
- Split budgets across multiple campaign types
- Save calculation history locally
- Responsive design for mobile and desktop
- Offline-capable
- Dark mode support

## Live Demo

Visit the live application at: https://[your-username].github.io/BudgetCalc/

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm (v9 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/[your-username]/BudgetCalc.git
   cd BudgetCalc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Running Tests

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Development

### Project Structure

```
src/
├── components/       # React components
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── test/            # Test setup and utilities
```

### Key Technologies

- React 19
- TypeScript
- Vite
- TailwindCSS
- Vitest

## Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment process is handled by GitHub Actions.

To deploy manually:

1. Build the project:
   ```bash
   npm run build
   ```

2. Push to the main branch:
   ```bash
   git push origin main
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React Team for the amazing framework
- Vite Team for the blazing fast build tool
- TailwindCSS Team for the utility-first CSS framework
