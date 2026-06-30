'use client';

import { useEffect, useState } from 'react';
import { useContactInfo, useUpdateContactInfo } from '@/hooks/useCms';
import { Settings, Save, MapPin, Phone, Mail, Link as LinkIcon, Clock } from 'lucide-react';

export default function AdminContactInfoPage() {
  const { data: contact, isLoading } = useContactInfo();
  const { mutate: updateContact, isPending } = useUpdateContactInfo();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [email1, setEmail1] = useState('');
  const [email2, setEmail2] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [mapEmbed, setMapEmbed] = useState('');
  const [workingHours, setWorkingHours] = useState('');

  useEffect(() => {
    if (contact) {
      setAddress(contact.address || '');
      setCity(contact.city || '');
      setCountry(contact.country || '');
      setPhone1(contact.phone1 || '');
      setPhone2(contact.phone2 || '');
      setEmail1(contact.email1 || '');
      setEmail2(contact.email2 || '');
      setFacebook(contact.facebook || '');
      setTwitter(contact.twitter || '');
      setLinkedin(contact.linkedin || '');
      setInstagram(contact.instagram || '');
      setWhatsapp(contact.whatsapp || '');
      setMapEmbed(contact.mapEmbed || '');
      setWorkingHours(contact.workingHours || '');
    }
  }, [contact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContact({
      address, city, country, phone1, phone2, email1, email2,
      facebook, twitter, linkedin, instagram, whatsapp, mapEmbed, workingHours
    });
  };

  if (isLoading) {
    return (
      <div className="pt-20 space-y-6 max-w-4xl animate-pulse">
        <div className="h-6 bg-slate-100 rounded w-1/4" />
        <div className="h-96 bg-slate-50 border border-slate-100 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Contact Info Settings</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-semibold">Update physical offices, hotline numbers, and global desks</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs font-semibold text-slate-700">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Address & Hours Card */}
          <div className="glass rounded-3xl p-6 border border-slate-100 bg-white shadow-sm space-y-4">
            <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> Head Office</h3>
            
            <div className="space-y-3.5">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 block">Street Address</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. 12-B Industrial Area, Sialkot"
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 block">City</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Sialkot"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 block">Country</label>
                  <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Pakistan"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 block">Working Hours</label>
                <input value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} placeholder="Mon - Fri: 9:00 AM - 6:00 PM"
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
              </div>
            </div>
          </div>

          {/* Logistics Numbers Card */}
          <div className="glass rounded-3xl p-6 border border-slate-100 bg-white shadow-sm space-y-4">
            <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><Phone size={14} className="text-primary" /> Communications Desk</h3>
            
            <div className="space-y-3.5">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 block">Primary Phone / WhatsApp</label>
                <input value={phone1} onChange={(e) => setPhone1(e.target.value)} placeholder="+92 52 1234567"
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 block">Secondary Phone / WhatsApp</label>
                <input value={phone2} onChange={(e) => setPhone2(e.target.value)} placeholder="+92 300 1234567"
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 block">Direct WhatsApp (No prefix)</label>
                <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="923001234567"
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800 font-mono" />
              </div>
            </div>
          </div>

          {/* Emails Card */}
          <div className="glass rounded-3xl p-6 border border-slate-100 bg-white shadow-sm space-y-4">
            <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><Mail size={14} className="text-primary" /> Corporate Emails</h3>
            
            <div className="space-y-3.5">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 block">Primary Sourcing Email</label>
                <input value={email1} onChange={(e) => setEmail1(e.target.value)} type="email" placeholder="info@dewantraders.com"
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 block">Logistics/Support Email</label>
                <input value={email2} onChange={(e) => setEmail2(e.target.value)} type="email" placeholder="export@dewantraders.com"
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
              </div>
            </div>
          </div>

          {/* Social Profiles Card */}
          <div className="glass rounded-3xl p-6 border border-slate-100 bg-white shadow-sm space-y-4">
            <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><LinkIcon size={14} className="text-primary" /> Social Channels</h3>
            
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 block">LinkedIn URL</label>
                <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/company/..."
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 block">Facebook URL</label>
                <input value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/..."
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 block">Twitter URL</label>
                <input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://twitter.com/..."
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 block">Instagram URL</label>
                <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/..."
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Map Embed Card */}
        <div className="glass rounded-3xl p-6 border border-slate-100 bg-white shadow-sm space-y-4">
          <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> Map Integration</h3>
          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 block">Google Maps Embed Source Link (src parameter in iframe)</label>
            <input value={mapEmbed} onChange={(e) => setMapEmbed(e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800 font-mono" />
          </div>
        </div>

        <button type="submit" disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-sky-600 hover:from-primary-hover hover:to-sky-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10 transition-all disabled:opacity-60">
          <Save size={14} /> {isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
