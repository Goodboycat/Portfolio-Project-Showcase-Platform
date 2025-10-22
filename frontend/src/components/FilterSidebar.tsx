import { useState, useEffect } from 'react';
import { tagsApi } from '../services/api';
import { Tag } from '../types';
import { Filter, X } from 'lucide-react';

interface FilterSidebarProps {
  selectedLanguage?: string;
  selectedTag?: string;
  onLanguageChange: (language: string) => void;
  onTagChange: (tag: string) => void;
  onReset: () => void;
}

const languages = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'Go',
  'Rust',
  'C++',
  'C#',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
];

export const FilterSidebar = ({
  selectedLanguage,
  selectedTag,
  onLanguageChange,
  onTagChange,
  onReset,
}: FilterSidebarProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await tagsApi.getAll();
        setTags(data);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  const hasFilters = selectedLanguage || selectedTag;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        {hasFilters && (
          <button
            onClick={onReset}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <X size={16} />
            Reset
          </button>
        )}
      </div>

      {/* Language Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Language</h3>
        <div className="space-y-2">
          {languages.map((language) => (
            <label key={language} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="language"
                value={language}
                checked={selectedLanguage === language}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{language}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
        {loading ? (
          <p className="text-sm text-gray-500">Loading tags...</p>
        ) : tags.length === 0 ? (
          <p className="text-sm text-gray-500">No tags available</p>
        ) : (
          <div className="space-y-2">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="tag"
                  value={tag.name}
                  checked={selectedTag === tag.name}
                  onChange={(e) => onTagChange(e.target.value)}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">#{tag.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
