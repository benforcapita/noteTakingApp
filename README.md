# Meeting Notes App

A modern web application for taking and managing meeting notes with AI-powered summarization.

## Features

- 📝 Real-time note-taking interface
- 🤖 AI-powered note summarization (supports multiple languages)
- 💾 Import/Export notes as JSON
- 🌓 Dark/Light mode support
- 🔐 Secure API key management
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18.x or later
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd meeting-notes
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
```env
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Deployment

This app can be easily deployed to Vercel:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository on [Vercel](https://vercel.com)
3. Add your OpenAI API key in the Environment Variables section
4. Deploy!

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [OpenAI API](https://openai.com/) - AI summarization
- [Vercel](https://vercel.com) - Deployment

## License

MIT
