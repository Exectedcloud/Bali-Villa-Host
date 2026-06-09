'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, XCircle, Play, Info, MapPin, 
  Bed, Bath, Users, DollarSign
} from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function AdminPage() {
  const queryClient = useQueryClient();
  const [selectedVilla, setSelectedVilla] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  // Fetch pending villas
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-pending-villas'],
    queryFn: () => api.get('/admin/villas/pending/'),
  });

  const villas = data?.villas || [];

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (id) => api.post(`/admin/villas/${id}/approve/`),
    onSuccess: () => {
      toast.success('Villa approved and published!');
      queryClient.invalidateQueries(['admin-pending-villas']);
      setSelectedVilla(null);
    },
    onError: (err) => toast.error(err.message || 'Approval failed'),
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => api.post(`/admin/villas/${id}/reject/`, { reason }),
    onSuccess: () => {
      toast.success('Villa rejected and sent back to draft.');
      queryClient.invalidateQueries(['admin-pending-villas']);
      setSelectedVilla(null);
      setIsRejecting(false);
      setRejectReason('');
    },
    onError: (err) => toast.error(err.message || 'Rejection failed'),
  });

  if (isLoading) return <div className="p-8 text-center text-mist">Loading applications...</div>;
  if (error) return <div className="p-8 text-center text-danger">Error loading villas: {error.message}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink">Villa Review Dashboard</h1>
          <p className="text-mist mt-1">{villas.length} applications awaiting review</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Applications List */}
        <div className="lg:col-span-1 space-y-4">
          {villas.length === 0 ? (
            <div className="bg-surface rounded-xl border border-rule border-dashed p-12 text-center text-mist">
              No pending applications
            </div>
          ) : (
            villas.map((villa) => (
              <motion.div
                key={villa.id}
                layoutId={`villa-${villa.id}`}
                onClick={() => setSelectedVilla(villa)}
                className={`cursor-pointer group p-4 rounded-xl border transition-all ${
                  selectedVilla?.id === villa.id 
                    ? 'bg-jade/5 border-jade shadow-sm' 
                    : 'bg-surface border-rule hover:border-jade-mute'
                }`}
              >
                <div className="flex gap-4">
                  <div className="relative size-16 rounded-lg overflow-hidden bg-surface-alt shrink-0">
                    <img 
                      src={villa.coverPhotoUrl || '/Villa1.jpg'} 
                      alt="" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-ink truncate group-hover:text-jade transition-colors">
                      {villa.titleEn}
                    </h3>
                    <p className="text-xs text-mist flex items-center gap-1 mt-0.5">
                      <MapPin className="size-3" /> {villa.region}, {villa.city}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-warn/10 text-warn font-bold uppercase tracking-wider">
                         Pending
                       </span>
                       <span className="text-xs text-ink-mute font-mono">
                         ID: {villa.id}
                       </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Main Content: Review Details */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedVilla ? (
              <motion.div
                key={selectedVilla.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-surface rounded-2xl border border-rule overflow-hidden shadow-sm"
              >
                {/* Hero / Media Section */}
                <div className="aspect-video bg-ink relative group">
                  {selectedVilla.videoUrl ? (
                    <video 
                      src={selectedVilla.videoUrl} 
                      controls 
                      className="w-full h-full object-contain"
                      poster={selectedVilla.coverPhotoUrl}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-mist bg-surface-alt border-b border-rule">
                      <div className="size-16 rounded-full bg-ink/5 flex items-center justify-center mb-4 text-ink-mute">
                        <Play className="size-8" />
                      </div>
                      <p className="text-sm">No verification video provided</p>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-ink/80 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest backdrop-blur-sm">
                      VERIFICATION MEDIA
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                      <h2 className="font-display text-2xl font-medium text-ink">{selectedVilla.titleEn}</h2>
                      <p className="text-mist mt-1">{selectedVilla.location}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs text-mist font-mono uppercase tracking-widest">Base Rate</p>
                       <p className="font-display text-2xl font-medium text-jade">
                         Rp {(selectedVilla.basePriceIdr / 1000000).toFixed(1)}M
                       </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-8">
                    {[
                      { icon: Bed, label: 'Bedrooms', val: selectedVilla.bedrooms },
                      { icon: Bath, label: 'Bathrooms', val: selectedVilla.bathrooms },
                      { icon: Users, label: 'Max Guests', val: selectedVilla.maxGuests },
                      { icon: DollarSign, label: 'Currency', val: 'IDR' },
                    ].map(item => (
                      <div key={item.label} className="bg-surface-alt rounded-lg p-3 border border-rule/50">
                        <item.icon className="size-4 text-jade mb-1.5" />
                        <p className="text-[10px] text-mist uppercase font-bold tracking-tighter">{item.label}</p>
                        <p className="text-base font-semibold text-ink">{item.val}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-6">
                    <section>
                       <h4 className="text-sm font-bold text-ink uppercase tracking-widest mb-2 flex items-center gap-2">
                         <Info className="size-4 text-jade" /> Description (EN)
                       </h4>
                       <p className="text-ink-soft text-sm leading-relaxed whitespace-pre-wrap bg-surface-alt/50 p-4 rounded-xl border border-rule/30">
                         {selectedVilla.descriptionEn || 'No description provided.'}
                       </p>
                    </section>

                    <section>
                      <h4 className="text-sm font-bold text-ink uppercase tracking-widest mb-3">Photos</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedVilla.photos?.map((ph, idx) => (
                          <div key={ph.id || idx} className="aspect-video bg-surface-alt rounded-lg overflow-hidden border border-rule text-center">
                            <img src={ph.url} alt="" className="w-full h-full object-cover rounded-lg" />
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-12 pt-8 border-t border-rule flex items-center justify-between gap-4">
                    <button 
                      onClick={() => setIsRejecting(true)}
                      className="px-6 py-2.5 rounded-xl border border-danger/30 text-danger text-sm font-semibold hover:bg-danger/5 transition-colors"
                    >
                      Request Changes
                    </button>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setSelectedVilla(null)}
                        className="px-6 py-2.5 rounded-xl text-ink-mute text-sm font-semibold hover:text-ink transition-colors"
                      >
                        Skip
                      </button>
                      <button 
                         disabled={approveMutation.isPending}
                         onClick={() => approveMutation.mutate(selectedVilla.id)}
                         className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep shadow-md shadow-jade/20 transition-all active:scale-95 disabled:opacity-50"
                      >
                         {approveMutation.isPending ? 'Processing...' : (
                           <>
                             <CheckCircle className="size-4" />
                             Approve & Publish
                           </>
                         )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Rejection Modal Overlay */}
                {isRejecting && (
                  <div className="absolute inset-0 bg-surface/95 backdrop-blur-sm z-20 p-8 flex flex-col items-center justify-center text-center">
                    <XCircle className="size-16 text-danger mb-4" />
                    <h3 className="font-display text-2xl font-medium text-ink mb-2">Request Changes</h3>
                    <p className="text-mist text-sm max-w-sm mb-6">
                      Let the host know why this listing was rejected. They will see this note in their dashboard.
                    </p>
                    <textarea 
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g. Photo quality is too low, or video proof is missing..."
                      className="w-full max-w-md h-32 p-4 rounded-xl border border-rule focus:border-jade focus:ring-1 focus:ring-jade outline-none text-sm mb-6 bg-surface resize-none"
                    />
                    <div className="flex gap-3">
                      <button 
                        onClick={() => { setIsRejecting(false); setRejectReason(''); }}
                        className="px-6 py-2 rounded-lg text-mist hover:text-ink text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button 
                        disabled={!rejectReason.trim() || rejectMutation.isPending}
                        onClick={() => rejectMutation.mutate({ id: selectedVilla.id, reason: rejectReason })}
                        className="px-8 py-2 rounded-lg bg-danger text-white text-sm font-semibold hover:bg-danger/90 transition-colors disabled:opacity-50"
                      >
                        {rejectMutation.isPending ? 'Sending...' : 'Confirm Rejection'}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-mist p-12 bg-surface-alt/20 rounded-2xl border-2 border-dashed border-rule">
                <Info className="size-12 mb-4 opacity-20" />
                <h3 className="font-medium text-ink/40">Select an application to start reviewing</h3>
                <p className="text-sm mt-1 max-w-xs">Each listing requires manual verification of details and media before going public.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
