import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Trash2, Clock, MessageSquare, ExternalLink, Search, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from './Toast';

type LeadStatus = 'new' | 'contacted' | 'booked' | 'lost';

interface AdLead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  zip_code: string | null;
  service_type: string | null;
  message: string | null;
  source: string;
  campaign: string | null;
  status: LeadStatus;
  created_at: string;
}

const JOBBER_URL = 'https://clienthub.getjobber.com/hubs/935796ca-8da1-401b-a3dd-604659dcbf70/public/requests/2258657/new';

const serviceLabels: Record<string, string> = {
  junk_removal: 'General Junk Removal',
  appliance: 'Appliance Removal',
  cleanout: 'Garage / Estate Cleanout',
  debris: 'Construction Debris',
  yard: 'Yard Waste Cleanup',
  other: 'Other',
};

const sourceLabels: Record<string, string> = {
  google: 'Google Ads',
  meta: 'Meta Ads',
  direct: 'Direct',
};

const statusColors: Record<LeadStatus, string> = {
  new: 'bg-green-100 text-green-700',
  contacted: 'bg-blue-100 text-blue-700',
  booked: 'bg-purple-100 text-purple-700',
  lost: 'bg-gray-200 text-gray-600',
};

const statusOptions: LeadStatus[] = ['new', 'contacted', 'booked', 'lost'];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function AdminLeads() {
  const [leads, setLeads] = useState<AdLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('ad_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data as AdLead[] || []);
    } catch {
      showToast('Failed to load leads', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const { error } = await supabase
        .from('ad_leads')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', leadId);

      if (error) throw error;
      setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: newStatus } : l));
      showToast(`Lead marked as ${newStatus}`, 'success');
    } catch {
      showToast('Failed to update lead', 'error');
    }
  };

  const deleteLead = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('ad_leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      showToast('Lead deleted', 'success');
    } catch {
      showToast('Failed to delete lead', 'error');
    }
  };

  const filteredLeads = leads
    .filter((l) => filter === 'all' || l.status === filter)
    .filter((l) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return l.name.toLowerCase().includes(q) || l.phone.toLowerCase().includes(q) || (l.email && l.email.toLowerCase().includes(q));
    });

  const getCount = (status: LeadStatus) => leads.filter((l) => l.status === status).length;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Loading leads...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-1">Lead Inbox</h2>
        <p className="text-sm text-gray-500">Leads from your Google &amp; Meta ad landing page</p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 sm:gap-2 flex-wrap mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          All ({leads.length})
        </button>
        {statusOptions.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm capitalize ${filter === s ? 'bg-slate-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {s} ({getCount(s)})
          </button>
        ))}
      </div>

      {filteredLeads.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">No leads yet</p>
          <p className="text-gray-400 text-sm mt-1">Leads from your ad landing page will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                {/* Left: lead info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-slate-800 text-base sm:text-lg truncate">{lead.name}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-gray-600 mb-2">
                    <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-green-600 hover:text-green-700 font-medium">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      {lead.phone}
                    </a>
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{lead.email}</span>
                      </a>
                    )}
                    {lead.zip_code && (
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        {lead.zip_code}
                      </span>
                    )}
                  </div>

                  {lead.service_type && (
                    <div className="mb-2">
                      <span className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                        {serviceLabels[lead.service_type] || lead.service_type}
                      </span>
                    </div>
                  )}

                  {lead.message && (
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mb-2 leading-relaxed">
                      "{lead.message}"
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {timeAgo(lead.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-semibold">{sourceLabels[lead.source] || lead.source}</span>
                      {lead.campaign && <span>· {lead.campaign}</span>}
                    </span>
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex sm:flex-col gap-2 sm:items-end flex-shrink-0">
                  <a
                    href={`tel:${lead.phone}`}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5 flex-1 sm:flex-none whitespace-nowrap"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                  <a
                    href={JOBBER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 flex-1 sm:flex-none whitespace-nowrap"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Jobber
                  </a>
                  <button
                    onClick={() => deleteLead(lead.id)}
                    className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5 flex-1 sm:flex-none whitespace-nowrap"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Status changer */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-gray-500">Mark as:</span>
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(lead.id, s)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors capitalize ${
                      lead.status === s
                        ? 'bg-slate-700 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
