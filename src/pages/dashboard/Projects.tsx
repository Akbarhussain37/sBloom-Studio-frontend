import { useState, useEffect } from 'react';
import { FiFolder, FiPlus, FiMoreVertical } from 'react-icons/fi';
import { getProjects, createProject } from '../../lib/creatorService';
import type { Database } from '../../types/database.types';
import ProductionStatusBadge from '../../components/dashboard/ProductionStatusBadge';

type Project = Database['public']['Tables']['projects_studio']['Row'];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'In Progress' | 'In Review' | 'Completed'>('All');

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'All') return true;
    if (activeTab === 'In Progress') return ['DRAFT', 'UPLOADED', 'SUBMITTED', 'EDITING', 'CHANGES_REQUESTED'].includes(project.status);
    if (activeTab === 'In Review') return ['IN_REVIEW', 'READY_FOR_REVIEW'].includes(project.status);
    if (activeTab === 'Completed') return project.status === 'COMPLETED';
    return true;
  });

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    
    try {
      const newProject = await createProject(newProjectName);
      setProjects(prev => [newProject, ...prev]);
      setNewProjectName('');
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
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
        <button 
          onClick={() => setIsCreating(true)}
          className="px-6 py-2.5 bg-brand-primary text-white rounded-xl font-bold hover:bg-[#F02865] transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <FiPlus className="text-lg" /> New Project
        </button>
      </div>

      {isCreating && (
        <div className="bg-white border border-slate-200 p-6 rounded-[1.5rem] mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Project</h3>
          <form onSubmit={handleCreateProject} className="flex gap-4">
            <input 
              type="text" 
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="e.g., Doctor FAQ Series" 
              className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all"
              autoFocus
            />
            <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-3 font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={!newProjectName.trim()} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50">
              Create
            </button>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200 mb-6">
        {['All', 'In Progress', 'In Review', 'Completed'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === tab 
                ? 'border-brand-primary text-brand-primary' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
             <div key={i} className="bg-white border border-slate-100 rounded-[1.5rem] p-6 h-48 animate-pulse"></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-300">
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-400">
            <FiFolder className="text-2xl" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 mb-1">No projects found</h4>
          <p className="text-slate-500 mb-6 text-sm max-w-sm mx-auto">
            {activeTab === 'All' 
              ? "Create a project to organize your videos and track production progress." 
              : `No projects found in the "${activeTab}" status.`}
          </p>
          {activeTab === 'All' && (
            <button 
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-[#F02865] transition-colors flex items-center justify-center gap-2 mx-auto shadow-sm"
            >
              <FiPlus className="text-lg" /> Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div key={project.id} className="bg-white border border-slate-200 rounded-[1.5rem] p-6 hover:shadow-lg hover:border-brand-primary/30 transition-all group relative cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-primary">
                   <FiFolder className="text-2xl" />
                </div>
                <button className="text-slate-400 hover:text-slate-900 p-2 -mr-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <FiMoreVertical />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-brand-primary transition-colors">{project.name}</h3>
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
