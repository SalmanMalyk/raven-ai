<h1 align="center">Raven AI</h1>

<p align="center">
  <strong>Automate intelligent email responses with AI-powered classification and personalization</strong>
</p>

## 📋 Overview

Raven AI is an intelligent email automation system that leverages LangGraph workflows and Claude AI to classify, personalize, and generate professional email responses. The system uses a sophisticated workflow to analyze incoming emails, classify them by intent, and generate contextual responses based on custom agent profiles.

## ✨ Features

- **🔍 Email Classification** - Automatically categorizes emails into types: Interested, Not Interested, Wrong Person, Check Back Later, and Follow Up
- **🎯 Personalization** - Tailors responses based on agent-specific information (company details, website, description)
- **✍️ Smart Generation** - Generates professional, contextual email responses using Claude AI
- **👤 Agent Management** - CRUD operations for managing custom agent profiles
- **🔐 Authentication** - Secure user authentication with Supabase
- **🔄 LangGraph Workflow** - Sophisticated state machine for email processing
- **📊 Logging** - Comprehensive logging with Winston

## 🛠️ Tech Stack

### Backend
- **Node.js** with **TypeScript** - Runtime and type safety
- **Express.js** - Web framework
- **Supabase** - Authentication and database

### AI & Workflow
- **LangChain** - AI orchestration framework
- **LangGraph** - Workflow state management
- **Anthropic Claude** - Language model (Claude Sonnet 4.5)

### Development Tools
- **TypeScript** - Type-safe development
- **ESLint** & **Prettier** - Code quality and formatting
- **Nodemon** - Hot reloading during development
- **Winston** - Logging infrastructure

## 📦 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Supabase Account** - For authentication and database
- **Anthropic API Key** - For Claude AI access

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd raven-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and fill in your credentials:
   ```env
   # APP
   APP_URL=http://localhost:3000
   NODE_ENV=dev
   PORT=3000
   
   # AI
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
   
   # Supabase
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_DATABASE_URL=your_database_url
   ```

4. **Run the application**
   ```bash
   # Development
   npm run dev
   
   # Production build
   npm run build
   npm start
   ```

## 📂 Project Structure

```
raven-ai/
├── src/
│   ├── ai/                    # AI workflow and tools
│   │   ├── llm.ts            # LLM configuration
│   │   ├── tools/            # AI tools
│   │   │   └── SaveDelegateEmail.ts
│   │   └── workflow/         # LangGraph workflow
│   │       ├── generate.workflow.ts
│   │       └── nodes/        # Workflow nodes
│   │           ├── ClassifyEmail.ts
│   │           ├── PersonalizeEmail.ts
│   │           ├── StructureEmail.ts
│   │           └── edges/    # Classification responses
│   ├── handlers/             # Request handlers
│   ├── routes/               # API routes
│   │   ├── auth.routes.ts
│   │   ├── agents.routes.ts
│   │   ├── generation.routes.ts
│   │   └── user.routes.ts
│   ├── middlewares/          # Express middlewares
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   ├── constants/            # Application constants
│   └── app.ts               # Application entry point
├── supabase/                 # Supabase configuration
├── docs/                     # Documentation
└── dist/                     # Compiled output
```

## 🔄 Workflow Architecture

The email processing workflow uses LangGraph to create a sophisticated state machine:

1. **Personalization Node** - Enhances email context with agent information
2. **Classification Node** - Analyzes email and categorizes intent
3. **Response Routing** - Routes to appropriate response handler based on classification
4. **Response Generation** - Generates tailored response
5. **Structure Node** - Formats the final email response

### Classification Types
- `INTERESTED` - Positive engagement
- `NOT_INTERESTED` - Decline with professionalism
- `WRONG_PERSON` - Redirect to correct contact
- `CHECK_BACK_LATER` - Future follow-up
- `FOLLOW_UP` - Pending response

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/reset-password` - Password reset

### Agent Management
- `GET /api/agents` - List all agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/:id` - Get agent by ID
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### Email Generation
- `POST /api/generation` - Generate email response

### User
- `GET /api/user/profile` - Get user profile

## 🔧 Development

### Available Scripts

```bash
# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Format code
npm run prettier

# Lint and format
npm run lint

# Start production server
npm start
```

### Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type checking

Run linting before committing:
```bash
npm run lint
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `APP_URL` | Application URL | ✅ |
| `NODE_ENV` | Environment (dev/production) | ✅ |
| `PORT` | Server port | ✅ |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude | ✅ |
| `ANTHROPIC_MODEL` | Claude model version | ✅ |
| `SUPABASE_URL` | Supabase project URL | ✅ |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_DATABASE_URL` | Database connection string | ✅ |

## 📄 License

ISC

## 👨‍💻 Author

**SalmanMalyk**

---

<p align="center">Made with ❤️ using LangChain, LangGraph, and Claude AI</p>