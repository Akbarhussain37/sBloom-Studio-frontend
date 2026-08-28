import { useState, useEffect } from 'react';
import { FiVideo, FiImage } from 'react-icons/fi';
import { getSecureMediaUrl } from '../../lib/creatorService';

interface MediaPreviewProps {
  storagePath: string;
  fileType: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
}

export default function MediaPreview({ storagePath, fileType, className = '', controls = false, autoPlay = false }: MediaPreviewProps) {
  const [secureUrl, setSecureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchUrl() {
      if (!storagePath) {
        setLoading(false);
        setError(true);
        return;
      }

      if (storagePath.startsWith('blob:')) {
        setSecureUrl(storagePath);
        setLoading(false);
        setError(false);
        return;
      }

      try {
        setLoading(true);
        const url = await getSecureMediaUrl(storagePath);
        if (mounted) {
          setSecureUrl(url);
          setError(false);
        }
      } catch (err) {
        console.error('Error fetching secure URL for media:', err);
        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchUrl();

    return () => {
      mounted = false;
    };
  }, [storagePath]);

  const isVideo = fileType.startsWith('video/');
  const isImage = fileType.startsWith('image/');

  if (loading) {
    return (
      <div className={`bg-slate-100 animate-pulse flex items-center justify-center ${className}`}>
        {isVideo ? <FiVideo className="text-slate-300 text-xl" /> : <FiImage className="text-slate-300 text-xl" />}
      </div>
    );
  }

  if (error || !secureUrl) {
    return (
      <div className={`bg-slate-100 flex items-center justify-center ${className}`}>
        {isVideo ? <FiVideo className="text-slate-400 text-xl" /> : <FiImage className="text-slate-400 text-xl" />}
      </div>
    );
  }

  if (isVideo) {
    if (controls) {
      return (
        <video
          src={secureUrl}
          className={className}
          controls
          autoPlay={autoPlay}
        />
      );
    }

    return (
      <div className={`relative bg-black flex items-center justify-center overflow-hidden ${className}`}>
        <video
          src={secureUrl}
          className="w-full h-full object-cover opacity-80"
          muted
          loop
          playsInline
          onMouseOver={(e) => e.currentTarget.play()}
          onMouseOut={(e) => e.currentTarget.pause()}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
            <FiVideo className="text-white text-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (isImage) {
    return (
      <img
        src={secureUrl}
        alt="Preview"
        className={`${className.includes('object-') ? '' : 'object-cover '}${className}`}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div className={`bg-slate-100 flex items-center justify-center ${className}`}>
      <FiImage className="text-slate-400 text-xl" />
    </div>
  );
}
