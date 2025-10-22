import { Project } from '../types';
import { Calendar, Code, Download, ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {project.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Code size={16} />
              <span className="font-medium">{project.language}</span>
              {project.isSample && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Sample
                </span>
              )}
            </div>
          </div>
        </div>

        {project.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {project.description}
          </p>
        )}

        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Calendar size={14} />
          <span>{formatDate(project.createdAt)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/projects/${project.id}`}
            className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium text-center"
          >
            View Details
          </Link>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="View on GitHub"
            >
              <Github size={18} />
            </a>
          )}

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="View Demo"
            >
              <ExternalLink size={18} />
            </a>
          )}

          {project.filePath && (
            <a
              href={`/api/projects/${project.id}/download`}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Download Project"
            >
              <Download size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
