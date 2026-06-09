'use client';

import { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { api, ApiError } from '@/lib/api-client';

export default function PhotosSection({ villaId, photos = [] }) {
  const t = useTranslations('listingSettings.photos');
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (photoId) => api.delete(`/host/villas/${villaId}/photos/${photoId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-villa', String(villaId)] });
    },
    onError: () => toast.error(t('deleteError')),
  });

  async function handleFiles(files) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('image', file);
        await api.upload(`/host/villas/${villaId}/photos/`, fd);
      }
      queryClient.invalidateQueries({ queryKey: ['host-villa', String(villaId)] });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <section className="bg-surface rounded-2xl border border-rule p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink">{t('title')}</h2>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rule text-sm font-medium text-ink-soft hover:bg-surface-alt hover:text-ink disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          <Camera className="size-4" />
          {uploading ? t('uploading') : t('add')}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {photos.length === 0 ? (
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 py-12 rounded-xl border-2 border-dashed border-rule hover:border-jade/40 hover:bg-jade-soft/30 disabled:pointer-events-none transition-colors"
        >
          <Camera className="size-8 text-ink-mute" />
          <div className="text-center">
            <p className="text-sm font-medium text-ink-soft">{t('emptyTitle')}</p>
            <p className="text-xs text-ink-mute mt-0.5">{t('emptyHint')}</p>
          </div>
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo, idx) => (
            <div key={photo.id} className="relative aspect-video rounded-xl overflow-hidden border border-rule group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt="" className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-jade text-white text-[10px] font-semibold uppercase tracking-wide">
                  {t('cover')}
                </span>
              )}
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(photo.id)}
                className="absolute top-2 right-2 size-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 disabled:opacity-50 transition-opacity"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
