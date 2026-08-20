import { useState, useEffect } from 'react';
import { FiFolder, FiPlus } from 'react-icons/fi';
import { getProjects, createProject } from '../../lib/creatorService';
import type { Database } from '../../types/database.types';
import ProductionStatusBadge from '../../components/dashboard/ProductionStatusBadge';

type Project = Database['public']['Tables']['projects_studio']['Row'];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const loadProjects = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    
    const trimmedName = newProjectName.trim();
    if (!trimmedName) {
      setCreateError('Project name cannot be empty.');
      return;
    }
    
    setCreateLoading(true);
    try {
      const newProject = await createProject(trimmedName, newProjectDesc.trim());
      setProjects(prev => [newProject, ...prev]);
      setNewProjectName('');
      setNewProjectDesc('');
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating project:', error);
      setCreateError('Failed to create project. Please try again.');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold font-heading text-slate-900 mb-2">Projects</h2>
          <p className="text-slate-500 max-w-lg text-sm">
            Organize your content into dedicated project workspaces.
          </p>
        </div>
        {!isCreating && (
          <button 
            onClick={() => {
              setIsCreating(true);
              setCreateError('');
            }}
            className="px-6 py-2.5 bg-brand-red text-white rounded-xl font-bold hover:bg-[#F02865] transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <FiPlus className="text-lg" /> New Project
          </button>
        )}
      </div>

      {isCreating && (
        <div className="bg-[#F7F9FC] border border-slate-200 p-6 rounded-[1.5rem] mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Project</h3>
          <form onSubmit={handleCreateProject} className="flex flex-col gap-4 max-w-2xl">
            {createError && (
              <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
                {createError}
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              <label htmlFor="projectName" className="text-sm font-semibold text-slate-700">Project Name *</label>
              <input 
                id="projectName"
                type="text" 
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g., Doctor FAQ Series" 
                className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red transition-all"
                autoFocus
                disabled={createLoading}
                maxLength={255}
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label htmlFor="projectDesc" className="text-sm font-semibold text-slate-700">Description (Optional)</label>
              <textarea 
                id="projectDesc"
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                placeholder="Briefly describe this project..." 
                className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red transition-all resize-none h-24"
                disabled={createLoading}
                maxLength={1000}
              />
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button 
                type="button" 
                onClick={() => {
                  setIsCreating(false);
                  setCreateError('');
                }} 
                disabled={createLoading}
                className="px-6 py-3 font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={createLoading || !newProjectName.trim()} 
                className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {createLoading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
             <div key={i} className="bg-white border border-slate-100 rounded-[1.5rem] p-6 h-48 animate-pulse"></div>
          ))}
        </div>
      ) : loadError ? (
        <div className="py-20 text-center bg-[#F7F9FC] rounded-[2rem] border border-dashed border-red-200">
          <h4 className="text-lg font-bold text-slate-900 mb-4">Unable to load projects. Please try again.</h4>
          <button 
            onClick={loadProjects}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm inline-flex"
          >
            Retry
          </button>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-20 text-center bg-[#F7F9FC] rounded-[2rem] border border-dashed border-slate-300">
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-400">
            <FiFolder className="text-2xl" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 mb-1">No projects yet</h4>
          <p className="text-slate-500 mb-6 text-sm max-w-sm mx-auto">Create a project to organize your videos and track production progress.</p>
          {!isCreating && (
            <button 
              onClick={() => {
                setIsCreating(true);
                setCreateError('');
              }}
              className="px-6 py-3 bg-brand-red text-white rounded-xl font-bold hover:bg-[#F02865] transition-colors flex items-center justify-center gap-2 mx-auto shadow-sm"
            >
              <FiPlus className="text-lg" /> Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white border border-slate-200 rounded-[1.5rem] p-6 hover:shadow-lg hover:border-brand-red/30 transition-all group relative">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-[#F7F9FC] rounded-xl flex items-center justify-center text-brand-red">
                   <FiFolder className="text-2xl" />
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-brand-red transition-colors">{project.name}</h3>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                {project.description || 'No description provided.'}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-400">
                  Updated {new Date(project.updated_at).toLocaleDateString()}
                </div>
                <ProductionStatusBadge status={project.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
