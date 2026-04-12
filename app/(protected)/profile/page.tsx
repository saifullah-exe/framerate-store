'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  useEffect(() => {
    if (session) {
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          setFormData({ name: data.name, phone: data.phone || '' });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsEditing(false);
        setProfile({ ...profile, ...formData });
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!session) return <p className="mt-20 text-center">Unauthenticated access.</p>;
  if (loading) return <div className="mt-20 text-center animate-pulse text-brand-400">Loading Databanks...</div>;

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl relative">
       {/* Ambient Glow */}
       <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-brand-500/6 blur-[160px] rounded-full -z-10" />

       <div className="mb-12">
          <h1 className="text-4xl font-display font-black text-white mb-2">Operative <span className="text-brand-400">Dashboard</span></h1>
          <p className="text-surface-400">Manage your identity code, shipping coordinates, and active orders.</p>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#0f0f11] rounded-2xl p-6 text-center border border-white/8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-surface-800 to-surface-900 rounded-full border-2 border-brand-500/50 flex items-center justify-center text-3xl font-display font-bold text-white shadow-[0_0_20px_rgba(20,184,166,0.2)] mb-4">
              {profile.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{profile.name}</h2>
            <p className="text-surface-400 text-sm mt-1 mb-4">{profile.email}</p>
            <div className="inline-block bg-brand-500/10 text-brand-400 border border-brand-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
               {profile.role} Class
            </div>
          </div>
          
          <div className="bg-[#0f0f11] border border-white/8 rounded-2xl p-2 flex flex-col gap-1">
             <Link href="/orders" className="p-3 hover:bg-white/6 text-white/70 hover:text-white rounded-xl transition-all font-medium text-sm flex items-center justify-between group">
               Order History <span className="text-surface-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all">→</span>
             </Link>
             <button onClick={() => setIsEditing(!isEditing)} className="p-3 hover:bg-white/6 text-white/70 hover:text-white rounded-xl transition-all font-medium text-sm flex items-center justify-between group text-left">
               Edit Identity <span className="text-surface-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all">→</span>
             </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-[#0f0f11] border border-white/8 rounded-2xl p-8 lg:p-10">
             <h3 className="text-xl font-display font-bold text-white border-b border-white/8 pb-4 mb-6 tracking-tight">Profile Details</h3>
             
             {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-surface-500 uppercase tracking-widest mb-2 pl-1">Handle / Name</label>
                  <input
                    type="text"
                    className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-surface-500 uppercase tracking-widest mb-2 pl-1">Commlink / Phone</label>
                  <input
                    type="text"
                    className="w-full bg-surface-900 border border-surface-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                 <div className="pt-4 border-t border-surface-800 flex gap-3">
                  <button type="submit" className="button-primary text-sm tracking-widest uppercase">Save Changes</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="button-secondary text-sm tracking-widest uppercase">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <label className="text-xs text-surface-500 uppercase font-bold tracking-widest block mb-1">Handle</label>
                    <p className="text-white font-medium text-lg">{profile.name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-surface-500 uppercase font-bold tracking-widest block mb-1">Email Classification</label>
                    <p className="text-white font-medium text-lg">{profile.email}</p>
                  </div>
                  <div>
                    <label className="text-xs text-surface-500 uppercase font-bold tracking-widest block mb-1">Phone</label>
                    <p className="text-white font-medium text-lg">{profile.phone || 'Not Configured'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-surface-500 uppercase font-bold tracking-widest block mb-1">Status</label>
                    <p className="text-brand-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2 mt-1"><span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span> Active</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-10 pt-7 border-t border-white/8">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-display font-bold text-white">Saved Addresses</h3>
                  <button className="text-xs font-bold tracking-widest uppercase bg-surface-800 text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-surface-700 transition-colors">+ Add New</button>
               </div>
               
              {profile.addresses?.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {profile.addresses.map((addr: any, i: number) => (
                    <div key={i} className="bg-white/[0.03] border border-white/8 rounded-xl p-5 hover:border-brand-500/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                         <span className="font-bold text-white">{addr.name}</span>
                         {addr.isDefault && <span className="bg-brand-500/10 text-brand-400 border border-brand-500/20 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded">Default Dropzone</span>}
                      </div>
                      <p className="text-surface-400 text-sm leading-relaxed">{addr.street}<br/>{addr.city}, {addr.province}<br/>{addr.country}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-white/[0.02] rounded-xl border border-dashed border-white/8">
                  <p className="text-white/30 text-sm">No addresses saved yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
