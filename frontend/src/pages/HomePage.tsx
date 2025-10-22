import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from '../components/ProjectCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { SearchBar } from '../components/SearchBar';
import { UploadModal } from '../components/UploadModal';
import { Plus, Loader } from 'lucide-react';

export const HomePage = () => {
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('');
  const [tag, setTag] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const { data, loading, error, refetch } = useProjects({
    search: search || undefined,
    language: language || undefined,
    tag: tag || undefined,
  });

  const handleReset = () => {
    setLanguage('');
    setTag('');
    setSearch('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Portfolio Project Showcase
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Browse and manage your coding projects
              </p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus size={20} />
              Upload Project
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar onSearch={setSearch} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
              selectedLanguage={language}
              selectedTag={tag}
              onLanguageChange={setLanguage}
              onTagChange={setTag}
              onReset={handleReset}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin h-8 w-8 text-primary-600" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            ) : data?.projects.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 mb-4">No projects found</p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Upload your first project
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {data?.projects.length} of {data?.pagination.total} projects
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data?.projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
};
