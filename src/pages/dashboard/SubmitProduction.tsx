import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getProjects } from '../../lib/creatorService';
import {
  submitProduction,
  ApiError
} from '../../lib/productionApi';
import type {
  ProductionSubmissionRequest,
  ProductionSubmissionResponse,
  SourceType,
  SourceProvider
} from '../../lib/productionApi';
import type { Database } from '../../types/database.types';

type Project = Database['public']['Tables']['projects_studio']['Row'];

export default function SubmitProduction() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState('');

  const [projectId, setProjectId] = useState('');
  const [sourceType, setSourceType] = useState<SourceType>('FILE');
  const [sourceProvider, setSourceProvider] = useState<SourceProvider>('GOOGLE_DRIVE');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [attested, setAttested] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [successData, setSuccessData] = useState<ProductionSubmissionResponse['submission'] | null>(null);

  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    setProjectsError('');
    try {
      const data = await getProjects();
      setProjects(data);
      if (data && data.length > 0) {
        setProjectId(data[0].id);
      }
    } catch (err: any) {
      setProjectsError(err.message || 'Failed to load projects');
    } finally {
      setLoadingProjects(false);
    }
  };

  const validateForm = (): string | null => {
    if (!projectId) return 'Please select a project.';

    const trimmedUrl = sourceUrl.trim();
    if (!trimmedUrl) return 'Enter a valid HTTPS share link.';
    try {
      const parsedUrl = new URL(trimmedUrl);
      if (parsedUrl.protocol !== 'https:') return 'Enter a valid HTTPS share link.';
      if (trimmedUrl.length > 2048) return 'Enter a valid HTTPS share link.';
    } catch {
      return 'Enter a valid HTTPS share link.';
    }

    const trimmedInstructions = instructions.trim();
    if (!trimmedInstructions) return 'Please provide editing instructions.';
    if (trimmedInstructions.length > 5000) return 'Editing instructions cannot exceed 5000 characters.';

    const trimmedName = sourceName.trim();
    if (trimmedName && trimmedName.length > 255) return 'Source name cannot exceed 255 characters.';

    if (!attested) return 'You must attest that sharing permissions have been configured.';

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError('');
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new ApiError(401, 'Your session has expired. Please sign in again.');
      }

      const requestData: ProductionSubmissionRequest = {
        project_id: projectId,
        source_type: sourceType,
        source_provider: sourceProvider,
        source_url: sourceUrl.trim(),
        source_name: sourceName.trim() || null,
        instructions: instructions.trim(),
        source_access_attested: true
      };

      const response = await submitProduction(session.access_token, requestData);
      setSourceUrl('');
      setInstructions('');
      setAttested(false);
      setSuccessData(response.submission);
      setTimeout(() => {
        successRef.current?.focus();
      }, 0);
    } catch (err: any) {
      if (err instanceof ApiError) {
        switch (err.status) {
          case 400:
            setFormError('Please verify your form inputs and attestation.');
            break;
          case 401:
            setFormError('Your session has expired. Please sign in again.');
            break;
          case 403:
            setFormError('You do not have permission to submit content for this project.');
            break;
          case 404:
            setFormError('This project is no longer available. Refresh your projects.');
            break;
          default:
            setFormError('We couldn\'t submit your content right now. Please try again.');
        }
      } else {
        setFormError('We couldn\'t submit your content right now. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
      if (formError || validationError) {
        setTimeout(() => {
          errorRef.current?.focus();
        }, 0);
      }
    }
  };

  const handleReset = () => {
    setSourceUrl('');
    setSourceName('');
    setInstructions('');
    setAttested(false);
    setSuccessData(null);
    setFormError('');
  };

  if (loadingProjects) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (projectsError) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        <h3 className="text-lg font-medium">Error loading projects</h3>
        <p className="mt-2">{projectsError}</p>
        <button
          onClick={fetchProjects}
          className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">You need a project before submitting content.</h3>
        <Link
          to="/dashboard/projects"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create a Project
        </Link>
      </div>
    );
  }

  if (successData) {
    const project = projects.find(p => p.id === successData.project_id);

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h2
          ref={successRef}
          tabIndex={-1}
          className="text-2xl font-bold text-center text-gray-900 mb-2 focus:outline-none"
        >
          Submitted for production
        </h2>
        <p className="text-gray-600 text-center mb-8">
          We received your source link and editing instructions. The production team will verify access before work begins.
        </p>

        <div className="bg-gray-50 rounded-md p-6 mb-8">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Project</dt>
              <dd className="mt-1 text-sm text-gray-900">{project?.name || 'Unknown Project'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">{successData.access_status.replace(/_/g, ' ')}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Source Type</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">{successData.source_type.toLowerCase()}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Provider</dt>
              <dd className="mt-1 text-sm text-gray-900">{successData.source_provider.replace(/_/g, ' ')}</dd>
            </div>
            {successData.source_name && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Source Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{successData.source_name}</dd>
              </div>
            )}
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Submitted At</dt>
              <dd className="mt-1 text-sm text-gray-900">{new Date(successData.submitted_at).toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard/projects"
            className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Projects
          </Link>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Submit Content for Production</h1>
        <p className="mt-2 text-gray-600">
          Keep your original files in your own cloud storage. Share a file or folder link with sBloom and tell us how you want it edited.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">

          {formError && (
            <div
              ref={errorRef}
              tabIndex={-1}
              id="form-error"
              className="bg-red-50 text-red-700 p-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              role="alert"
            >
              {formError}
            </div>
          )}

          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">
              Project *
            </label>
            <select
              id="projectId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            >
              <option value="" disabled>Select a project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="sourceType" className="block text-sm font-medium text-gray-700 mb-1">
                Source Type *
              </label>
              <select
                id="sourceType"
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as SourceType)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                required
              >
                <option value="FILE">File</option>
                <option value="FOLDER">Folder</option>
              </select>
            </div>

            <div>
              <label htmlFor="sourceProvider" className="block text-sm font-medium text-gray-700 mb-1">
                Cloud Provider *
              </label>
              <select
                id="sourceProvider"
                value={sourceProvider}
                onChange={(e) => setSourceProvider(e.target.value as SourceProvider)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                required
              >
                <option value="GOOGLE_DRIVE">Google Drive</option>
                <option value="ONEDRIVE">OneDrive</option>
                <option value="SHAREPOINT">SharePoint</option>
                <option value="DROPBOX">Dropbox</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="sourceUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Share Link (HTTPS) *
            </label>
            <input
              type="url"
              id="sourceUrl"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://"
              className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
              required
              autoComplete="off"
              spellCheck="false"
              maxLength={2048}
            />
          </div>

          <div>
            <label htmlFor="sourceName" className="block text-sm font-medium text-gray-700 mb-1">
              Source Name <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              id="sourceName"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              placeholder="e.g., August product shoot"
              className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
              maxLength={255}
            />
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                Editing Instructions *
              </label>
              <span className="text-xs text-gray-500">
                {instructions.length} / 5000
              </span>
            </div>
            <textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={5}
              className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
              required
              maxLength={5000}
              placeholder="Tell us how you want this edited..."
            />
          </div>

          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="attestation"
                type="checkbox"
                checked={attested}
                onChange={(e) => setAttested(e.target.checked)}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="attestation" className="font-medium text-gray-700 cursor-pointer">
                I confirm that this link is shared with the access needed for the sBloom production team to work with these files.
              </label>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-lg border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting || !attested || !sourceUrl || !instructions || !projectId}
            className="inline-flex justify-center items-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit for Production'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
