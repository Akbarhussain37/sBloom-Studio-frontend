import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import MediaGrid from '../../components/dashboard/MediaGrid';
import { getMediaAssets, getSecureMediaUrl } from '../../lib/creatorService';
import type { Database } from '../../types/database.types';

type MediaAsset = Database['public']['Tables']['media_assets']['Row'];

export default function CompletedContent() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadAssets() {
      try {
        const data = await getMediaAssets();
        setAssets(data.filter(a => a.status === 'COMPLETED'));
      } catch (error) {
        console.error('Error loading completed assets:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAssets();
  }, []);

  const handleDownload = async (asset: MediaAsset) => {
    try {
      const url = await getSecureMediaUrl(asset.storage_path);
      const a = document.createElement('a');
      a.href = url;
      a.download = asset.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error getting download url:', error);
      alert('Failed to start download.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold font-heading text-slate-900 mb-2">Completed Content</h2>
          <p className="text-slate-500 max-w-lg text-sm">
            Access and download your finalized production assets.
          </p>
        </div>
      </div>

      <MediaGrid 
        assets={assets} 
        loading={loading}
        onPreview={(asset) => navigate(`/dashboard/videos/${asset.id}`)}
        onDownload={handleDownload}
        emptyState={
          <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-300">
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-green-500">
              <FiCheckCircle className="text-2xl" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">No completed content yet</h4>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">Videos that have finished production will appear here for you to download.</p>
          </div>
        }
      />
    </div>
  );
}
