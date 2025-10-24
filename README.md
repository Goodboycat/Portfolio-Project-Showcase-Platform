# Portfolio Project Showcase Platform

A full-stack web application for managing and displaying coding projects. Users can view, upload, download, and delete projects with support for filtering by language and tags.

https://goodboycat.github.io/Portfolio-Project-Showcase-Platform/

## Features

- 📁 **Project Management**: Upload, view, download, and delete projects
- 🔍 **Advanced Search**: Filter projects by language, tags, or search query
- 🏷️ **Tag System**: Organize projects with custom tags
- 📦 **File Upload**: Support for ZIP and TAR.GZ files (up to 50MB)
- 🎨 **Modern UI**: Responsive design with Tailwind CSS
- ⚡ **Fast Performance**: React with TypeScript + Express backend
- 🗄️ **SQLite Database**: Simple, serverless database for development

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router v6 for navigation
- Tailwind CSS for styling
- Axios for API requests
- Lucide React for icons

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM with SQLite
- Multer for file uploads
- Zod for validation

## Project Structure

```
portfolio-project-showcase/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   └── server.ts       # Entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── styles/        # CSS styles
│   └── package.json
└── uploads/               # Uploaded project files

```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-project-showcase
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up the database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Configure environment variables**
   
   Copy `.env.example` to `.env` in the backend directory:
   ```bash
   cd backend
   cp .env.example .env
   ```

### Running the Application

**Development mode (runs both frontend and backend):**
```bash
npm run dev
```

This will start:
- Backend API on http://localhost:3001
- Frontend dev server on http://localhost:5173

**Run backend only:**
```bash
cd backend
npm run dev
```

**Run frontend only:**
```bash
cd frontend
npm run dev
```

### Building for Production

```bash
npm run build
```

This builds both frontend and backend for production.

## API Endpoints

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects with filters |
| GET | `/api/projects/:id` | Get single project details |
| POST | `/api/projects` | Upload new project |
| PUT | `/api/projects/:id` | Update project metadata |
| DELETE | `/api/projects/:id` | Delete project |
| GET | `/api/projects/:id/download` | Download project file |

### Tags

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tags` | List all tags |
| POST | `/api/tags` | Create new tag |
| DELETE | `/api/tags/:id` | Delete tag |

### Query Parameters for GET /api/projects

- `language` - Filter by programming language
- `tag` - Filter by tag name
- `search` - Search in name/description
- `sort` - Sort by field (createdAt, name, language)
- `order` - Sort order (asc, desc)
- `page` - Page number for pagination
- `limit` - Items per page

## Usage Examples

### Upload a Project

1. Click "Upload Project" button
2. Fill in project details (name, description, language)
3. Add tech stack and tags (optional)
4. Upload a ZIP or TAR.GZ file (optional)
5. Click "Upload Project"

### Filter Projects

- Use the sidebar to filter by language or tag
- Use the search bar to search by name or description
- Click "Reset" to clear all filters

### View Project Details

- Click "View Details" on any project card
- View full project information
- Download, view on GitHub, or delete the project

## Security Features

- Rate limiting on API endpoints
- File type validation
- File size limits (50MB max)
- CORS protection
- Helmet.js security headers
- Input validation with Zod

## Development

### Database Management

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Open Prisma Studio
npx prisma studio
```

### Code Structure

The project follows a modular architecture:

- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Middleware**: Request validation and error handling
- **Routes**: Define API endpoints
- **Components**: Reusable UI components
- **Pages**: Top-level page components
- **Hooks**: Custom React hooks for data fetching

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Project versioning
- [ ] Live project preview in browser
- [ ] Code syntax highlighting
- [ ] Export to GitHub integration
- [ ] AI-powered project recommendations
- [ ] Multi-language support (i18n)
- [ ] Project analytics and statistics

## Support

For issues and questions, please open an issue on GitHub.
