'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Star, MessageSquare, ShieldCheck, Send, User } from 'lucide-react';

export default function ProductReviews({ productSlug }: { productSlug: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/products/${productSlug}/reviews`);
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    setError('');

    try {
      const res = await fetch(`/api/products/${productSlug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit review');
      } else {
        setNewReview({ rating: 5, comment: '' });
        fetchReviews();
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="mt-20 border-t border-white/5 pt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-display font-black text-white mb-2 tracking-tight">User Verifications.</h2>
          <p className="text-surface-400">Feedback from the operative community on this hardware.</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-900 px-6 py-4 rounded-2xl border border-white/5 shadow-inner">
           <div className="text-4xl font-display font-black text-brand-400">
             {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
           </div>
           <div>
             <div className="flex text-amber-400 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)) ? 'currentColor' : 'none'} />
                ))}
             </div>
             <p className="text-xs font-bold text-surface-500 uppercase tracking-widest">{reviews.length} SECURE REVIEWS</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Post Review Form */}
        <div className="lg:col-span-5">
           {session ? (
              <div className="glass-card p-8 rounded-3xl border border-white/5 sticky top-32">
                 <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-3">
                   <MessageSquare className="text-brand-400" size={20} /> Submit Intelligence
                 </h3>
                 
                 {error && (
                   <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs mb-6 font-medium">
                     {error}
                   </div>
                 )}

                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                       <label className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-3 block">Performance Rating</label>
                       <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setNewReview({ ...newReview, rating: num })}
                              className={`w-10 h-10 rounded-lg border transition-all flex items-center justify-center ${newReview.rating >= num ? 'bg-brand-500 border-brand-400 text-surface-950 scale-105' : 'bg-surface-950 border-white/5 text-surface-500 hover:border-surface-600'}`}
                            >
                              <Star size={18} fill={newReview.rating >= num ? 'currentColor' : 'none'} />
                            </button>
                          ))}
                       </div>
                    </div>

                    <div>
                       <label className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-3 block">Field Report / Comment</label>
                       <textarea
                         required
                         rows={4}
                         className="w-full bg-surface-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-surface-700 focus:outline-none focus:border-brand-500 transition-all resize-none"
                         placeholder="Document your findings with this hardware..."
                         value={newReview.comment}
                         onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                       />
                    </div>

                    <button
                      type="submit"
                      disabled={posting}
                      className="button-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 text-sm tracking-widest uppercase"
                    >
                      {posting ? <div className="w-5 h-5 border-2 border-surface-950 border-t-transparent rounded-full animate-spin"></div> : <><Send size={16} /> Transmit Review</>}
                    </button>
                 </form>
              </div>
           ) : (
             <div className="bg-surface-900/30 border border-white/10 p-10 rounded-3xl text-center backdrop-blur-md">
                <div className="w-16 h-16 bg-surface-800 rounded-full mx-auto mb-6 flex items-center justify-center text-surface-500 border border-white/5">
                  <User size={24} />
                </div>
                <h3 className="text-white font-display font-bold text-lg mb-2">Authentication Required</h3>
                <p className="text-surface-400 text-sm mb-6">Unauthorized access to review system. Please identify yourself to contribute intelligence.</p>
                <div className="flex flex-col gap-3">
                   <a href={`/login?callbackUrl=/products/${productSlug}`} className="button-primary py-3 rounded-xl text-xs tracking-widest uppercase">Authenticate</a>
                </div>
             </div>
           )}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-7">
           {loading ? (
             <div className="space-y-6">
               {[1, 2, 3].map(i => <div key={i} className="h-32 bg-surface-900 animate-pulse rounded-2xl"></div>)}
             </div>
           ) : reviews.length > 0 ? (
             <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="glass p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                     <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-surface-800 to-surface-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden">
                              {review.userId?.avatar ? <img src={review.userId.avatar} alt="" className="w-full h-full object-cover" /> : review.userId?.name?.charAt(0)}
                           </div>
                           <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{review.userId?.name}</span>
                                {review.isVerifiedPurchase && (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-brand-400 uppercase tracking-widest bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                                    <ShieldCheck size={10} /> Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-surface-500 uppercase tracking-widest font-bold mt-0.5">
                                {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                           </div>
                        </div>
                        <div className="flex text-amber-400">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} size={12} fill={i < review.rating ? 'currentColor' : 'none'} />
                           ))}
                        </div>
                     </div>
                     <p className="text-surface-300 text-sm leading-relaxed italic">"{review.comment}"</p>
                  </div>
                ))}
             </div>
           ) : (
             <div className="text-center py-20 bg-surface-900/20 rounded-3xl border border-dashed border-white/10">
                <p className="text-surface-500 text-sm font-medium">No intelligence reports found for this unit. <br/>Be the first to contribute.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
