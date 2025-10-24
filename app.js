// API Configuration
const API_BASE_URL = '/api';

// State
let projects = [];
let tags = [];
let techStack = [];
let projectTags = [];
let currentFilters = {
    language: '',
    tag: '',
    search: ''
};

// Languages list
const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust',
    'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin'
];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadTags();
    loadProjects();
    renderLanguageFilters();
});

// Event Listeners
function initializeEventListeners() {
    document.getElementById('uploadBtn').addEventListener('click', openUploadModal);
    document.getElementById('searchInput').addEventListener('input', debounce(handleSearch, 300));
    document.getElementById('resetBtn').addEventListener('click', resetFilters);
    document.getElementById('uploadForm').addEventListener('submit', handleUploadSubmit);
    document.getElementById('projectFile').addEventListener('change', handleFileSelect);
    
    // Close modal when clicking outside
    document.getElementById('uploadModal').addEventListener('click', (e) => {
        if (e.target.id === 'uploadModal') closeUploadModal();
    });
    document.getElementById('detailModal').addEventListener('click', (e) => {
        if (e.target.id === 'detailModal') closeDetailModal();
    });
}

// API Functions
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        if (response.status === 204) return null;
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

async function loadProjects() {
    showLoading();
    hideError();
    
    try {
        const params = new URLSearchParams();
        if (currentFilters.language) params.append('language', currentFilters.language);
        if (currentFilters.tag) params.append('tag', currentFilters.tag);
        if (currentFilters.search) params.append('search', currentFilters.search);
        
        const data = await apiRequest(`/projects?${params}`);
        projects = data.projects;
        renderProjects();
        updateProjectCount(data.projects.length, data.pagination.total);
    } catch (error) {
        showError('Failed to load projects. Please try again.');
    } finally {
        hideLoading();
    }
}

async function loadTags() {
    try {
        tags = await apiRequest('/tags');
        renderTagFilters();
    } catch (error) {
        console.error('Failed to load tags:', error);
    }
}

async function createProject(formData) {
    const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create project');
    }
    
    return await response.json();
}

async function deleteProject(id) {
    await apiRequest(`/projects/${id}`, { method: 'DELETE' });
}

async function getProjectById(id) {
    return await apiRequest(`/projects/${id}`);
}

// Render Functions
function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (projects.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    grid.innerHTML = projects.map(project => createProjectCard(project)).join('');
}

function createProjectCard(project) {
    const techStackHTML = project.techStack && project.techStack.length > 0
        ? `<div class="tech-stack">
            ${project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
           </div>`
        : '';
    
    const tagsHTML = project.tags && project.tags.length > 0
        ? `<div class="project-tags">
            ${project.tags.map(tag => `<span class="project-tag">#${tag.name}</span>`).join('')}
           </div>`
        : '';
    
    const sampleBadge = project.isSample
        ? '<span class="badge badge-sample">Sample</span>'
        : '';
    
    const date = new Date(project.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    return `
        <div class="project-card">
            <div class="project-header">
                <div>
                    <h3 class="project-title">${escapeHtml(project.name)}</h3>
                    <div class="project-language">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="16 18 22 12 16 6"></polyline>
                            <polyline points="8 6 2 12 8 18"></polyline>
                        </svg>
                        <span>${escapeHtml(project.language)}</span>
                    </div>
                </div>
                ${sampleBadge}
            </div>
            ${project.description ? `<p class="project-description">${escapeHtml(project.description)}</p>` : ''}
            ${techStackHTML}
            ${tagsHTML}
            <div class="project-date">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>${date}</span>
            </div>
            <div class="project-actions">
                <button class="btn btn-primary" onclick="viewProject('${project.id}')">View Details</button>
                ${project.githubUrl ? `
                    <a href="${project.githubUrl}" target="_blank" class="btn-icon" title="GitHub">
                        <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>
                ` : ''}
                ${project.demoUrl ? `
                    <a href="${project.demoUrl}" target="_blank" class="btn-icon" title="Demo">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                    </a>
                ` : ''}
                ${project.filePath ? `
                    <a href="${API_BASE_URL}/projects/${project.id}/download" class="btn-icon" title="Download">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </a>
                ` : ''}
            </div>
        </div>
    `;
}

function renderLanguageFilters() {
    const container = document.getElementById('languageFilters');
    container.innerHTML = languages.map(lang => `
        <label>
            <input type="radio" name="language" value="${lang}" onchange="handleLanguageFilter('${lang}')">
            <span>${lang}</span>
        </label>
    `).join('');
}

function renderTagFilters() {
    const container = document.getElementById('tagFilters');
    if (tags.length === 0) {
        container.innerHTML = '<p style="font-size: 0.875rem; color: var(--gray-600);">No tags available</p>';
        return;
    }
    container.innerHTML = tags.map(tag => `
        <label>
            <input type="radio" name="tag" value="${tag.name}" onchange="handleTagFilter('${tag.name}')">
            <span>#${tag.name}</span>
        </label>
    `).join('');
}

// Filter Functions
function handleSearch(e) {
    currentFilters.search = e.target.value;
    loadProjects();
}

function handleLanguageFilter(language) {
    currentFilters.language = language;
    updateResetButton();
    loadProjects();
}

function handleTagFilter(tag) {
    currentFilters.tag = tag;
    updateResetButton();
    loadProjects();
}

function resetFilters() {
    currentFilters = { language: '', tag: '', search: '' };
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
    updateResetButton();
    loadProjects();
}

function updateResetButton() {
    const resetBtn = document.getElementById('resetBtn');
    const hasFilters = currentFilters.language || currentFilters.tag;
    resetBtn.style.display = hasFilters ? 'flex' : 'none';
}

// Modal Functions
function openUploadModal() {
    document.getElementById('uploadModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeUploadModal() {
    document.getElementById('uploadModal').classList.remove('active');
    document.body.style.overflow = '';
    resetUploadForm();
}

function openDetailModal() {
    document.getElementById('detailModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('active');
    document.body.style.overflow = '';
}

// Upload Form Functions
function addTech() {
    const input = document.getElementById('techStackInput');
    const value = input.value.trim();
    
    if (value && !techStack.includes(value)) {
        techStack.push(value);
        renderTechStack();
        input.value = '';
    }
}

function removeTech(tech) {
    techStack = techStack.filter(t => t !== tech);
    renderTechStack();
}

function renderTechStack() {
    const container = document.getElementById('techStackList');
    container.innerHTML = techStack.map(tech => `
        <span class="tag-item">
            ${escapeHtml(tech)}
            <button type="button" class="tag-remove" onclick="removeTech('${escapeHtml(tech)}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </span>
    `).join('');
}

function addTag() {
    const input = document.getElementById('tagInput');
    const value = input.value.trim();
    
    if (value && !projectTags.includes(value)) {
        projectTags.push(value);
        renderProjectTags();
        input.value = '';
    }
}

function removeTag(tag) {
    projectTags = projectTags.filter(t => t !== tag);
    renderProjectTags();
}

function renderProjectTags() {
    const container = document.getElementById('tagList');
    container.innerHTML = projectTags.map(tag => `
        <span class="tag-item primary">
            #${escapeHtml(tag)}
            <button type="button" class="tag-remove" onclick="removeTag('${escapeHtml(tag)}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </span>
    `).join('');
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    const fileNameEl = document.getElementById('fileName');
    
    if (file) {
        const sizeMB = (file.size / 1024 / 1024).toFixed(2);
        fileNameEl.textContent = `Selected: ${file.name} (${sizeMB} MB)`;
    } else {
        fileNameEl.textContent = '';
    }
}

async function handleUploadSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const errorDiv = document.getElementById('uploadError');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading...';
    errorDiv.style.display = 'none';
    
    try {
        const formData = new FormData();
        formData.append('name', document.getElementById('projectName').value);
        formData.append('description', document.getElementById('projectDescription').value);
        formData.append('language', document.getElementById('projectLanguage').value);
        formData.append('githubUrl', document.getElementById('githubUrl').value);
        formData.append('demoUrl', document.getElementById('demoUrl').value);
        formData.append('techStack', JSON.stringify(techStack));
        formData.append('tags', JSON.stringify(projectTags));
        
        const file = document.getElementById('projectFile').files[0];
        if (file) {
            formData.append('file', file);
        }
        
        await createProject(formData);
        closeUploadModal();
        await loadProjects();
        await loadTags();
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Upload Project';
    }
}

function resetUploadForm() {
    document.getElementById('uploadForm').reset();
    techStack = [];
    projectTags = [];
    renderTechStack();
    renderProjectTags();
    document.getElementById('fileName').textContent = '';
    document.getElementById('uploadError').style.display = 'none';
}

// Project Detail Functions
async function viewProject(id) {
    openDetailModal();
    
    try {
        const project = await getProjectById(id);
        renderProjectDetail(project);
    } catch (error) {
        document.getElementById('projectDetail').innerHTML = `
            <div class="error-message">Failed to load project details.</div>
        `;
    }
}

function renderProjectDetail(project) {
    const date = new Date(project.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const techStackHTML = project.techStack && project.techStack.length > 0
        ? `<div class="detail-section">
            <h2>Tech Stack</h2>
            <div class="tech-stack">
                ${project.techStack.map(tech => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join('')}
            </div>
           </div>`
        : '';
    
    const tagsHTML = project.tags && project.tags.length > 0
        ? `<div class="detail-section">
            <h2>Tags</h2>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="project-tag">#${tag.name}</span>`).join('')}
            </div>
           </div>`
        : '';
    
    const fileInfoHTML = project.filePath && project.fileSize
        ? `<div class="detail-section">
            <h2>File Information</h2>
            <p>Size: ${(project.fileSize / 1024 / 1024).toFixed(2)} MB</p>
           </div>`
        : '';
    
    const sampleBadge = project.isSample
        ? '<span class="badge badge-sample">Sample Project</span>'
        : '';
    
    document.getElementById('projectDetail').innerHTML = `
        <div class="detail-header">
            <div class="detail-title">
                <h1>${escapeHtml(project.name)}</h1>
                ${sampleBadge}
            </div>
            <div class="detail-meta">
                <div class="detail-meta-item">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                    <span>${escapeHtml(project.language)}</span>
                </div>
                <div class="detail-meta-item">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>${date}</span>
                </div>
            </div>
        </div>
        
        ${project.description ? `
            <div class="detail-section">
                <h2>Description</h2>
                <p>${escapeHtml(project.description)}</p>
            </div>
        ` : ''}
        
        ${techStackHTML}
        ${tagsHTML}
        ${fileInfoHTML}
        
        <div class="detail-actions">
            ${project.githubUrl ? `
                <a href="${project.githubUrl}" target="_blank" class="btn btn-dark">
                    <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View on GitHub
                </a>
            ` : ''}
            ${project.demoUrl ? `
                <a href="${project.demoUrl}" target="_blank" class="btn btn-primary">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    View Demo
                </a>
            ` : ''}
            ${project.filePath ? `
                <a href="${API_BASE_URL}/projects/${project.id}/download" class="btn btn-success">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download Project
                </a>
            ` : ''}
            <button class="btn btn-danger" onclick="handleDeleteProject('${project.id}')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Delete Project
            </button>
        </div>
    `;
}

async function handleDeleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) {
        return;
    }
    
    try {
        await deleteProject(id);
        closeDetailModal();
        await loadProjects();
    } catch (error) {
        alert('Failed to delete project');
    }
}

// UI Helper Functions
function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'flex';
    document.getElementById('projectsGrid').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('projectsGrid').style.display = 'grid';
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

function updateProjectCount(showing, total) {
    document.getElementById('projectCount').textContent = `Showing ${showing} of ${total} projects`;
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
