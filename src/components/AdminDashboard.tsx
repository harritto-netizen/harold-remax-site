import { useState, useEffect } from 'react';
import { LogOut, Mail, Phone, MapPin, Home, DollarSign, Calendar, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { signOut } from '../lib/auth';
import VideoManager from './VideoManager';

interface PropertyAlert {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  property_type: string | null;
  location: string | null;
  price_min: number | null;
  price_max: number | null;
  is_active: boolean;
  created_at: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [alerts, setAlerts] = useState<PropertyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [tab, setTab] = useState<'alerts' | 'videos'>('alerts');
  const [hasAdminRole, setHasAdminRole] = useState<boolean | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    fetchAlerts();
    checkAdminRole();
  }, []);

  const checkAdminRole = async () => {
    const { data } = await supabase.auth.getSession();
    const role = data.session?.user?.app_metadata?.role;
    setHasAdminRole(role === 'admin');
  };

  const fetchAlerts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('property_alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAlerts(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this alert?')) return;
    setActionError(null);

    const { data, error } = await supabase
      .from('property_alerts')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) {
      setActionError('Delete failed. Please try again.');
      return;
    }

    if (!data || data.length === 0) {
      setActionError(
        'Your account does not have permission to delete records. Ask the site owner to grant your user the admin role.'
      );
      await fetchAlerts();
      return;
    }

    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setActionError(null);

    const { data, error } = await supabase
      .from('property_alerts')
      .update({ is_active: !currentStatus })
      .eq('id', id)
      .select('id');

    if (error) {
      setActionError('Update failed. Please try again.');
      return;
    }

    if (!data || data.length === 0) {
      setActionError(
        'Your account does not have permission to change records. Ask the site owner to grant your user the admin role.'
      );
      await fetchAlerts();
      return;
    }

    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, is_active: !currentStatus } : alert
    ));
  };

  const handleSignOut = async () => {
    await signOut();
    onLogout();
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'active') return alert.is_active;
    if (filter === 'inactive') return !alert.is_active;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number | null) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-charcoal text-cream">
      <div className="border-b border-cream/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <h1 className="font-montserrat text-2xl sm:text-3xl font-light uppercase tracking-wider">
            Admin Dashboard
          </h1>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 border border-cream/30 text-cream px-4 py-2 text-sm uppercase tracking-wider hover:bg-cream hover:text-charcoal transition-all duration-300 font-lato"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6 -mb-px">
          <button
            onClick={() => setTab('alerts')}
            className={`py-3 text-sm uppercase tracking-wider font-lato border-b-2 transition-colors ${tab === 'alerts' ? 'border-cream text-cream' : 'border-transparent text-cream/60 hover:text-cream'}`}
          >
            Property Alerts
          </button>
          <button
            onClick={() => setTab('videos')}
            className={`py-3 text-sm uppercase tracking-wider font-lato border-b-2 transition-colors ${tab === 'videos' ? 'border-cream text-cream' : 'border-transparent text-cream/60 hover:text-cream'}`}
          >
            Property Videos
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tab === 'videos' ? (
          <VideoManager />
        ) : (
          <>
        {hasAdminRole === false && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/40 text-yellow-100 p-4 font-lato text-sm">
            <p className="font-medium mb-1">Your account cannot delete or change records.</p>
            <p className="text-yellow-100/80">
              The database only allows changes from admin accounts. To grant your account admin
              access, open Supabase Studio, go to Authentication, edit your user, and set
              app metadata to <code className="bg-charcoal/40 px-1 py-0.5">{"{\"role\":\"admin\"}"}</code>.
              Then sign out and sign back in.
            </p>
          </div>
        )}
        {actionError && (
          <div className="mb-6 bg-red-500/10 border border-red-500/40 text-red-200 p-4 font-lato text-sm flex items-start justify-between">
            <span>{actionError}</span>
            <button
              onClick={() => setActionError(null)}
              className="ml-4 text-red-200/70 hover:text-red-100 text-xs uppercase tracking-wider"
            >
              Dismiss
            </button>
          </div>
        )}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm uppercase tracking-wider font-lato transition-all ${
                filter === 'all'
                  ? 'bg-cream text-charcoal'
                  : 'border border-cream/30 text-cream hover:bg-cream/10'
              }`}
            >
              All ({alerts.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 text-sm uppercase tracking-wider font-lato transition-all ${
                filter === 'active'
                  ? 'bg-cream text-charcoal'
                  : 'border border-cream/30 text-cream hover:bg-cream/10'
              }`}
            >
              Active ({alerts.filter(a => a.is_active).length})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-4 py-2 text-sm uppercase tracking-wider font-lato transition-all ${
                filter === 'inactive'
                  ? 'bg-cream text-charcoal'
                  : 'border border-cream/30 text-cream hover:bg-cream/10'
              }`}
            >
              Inactive ({alerts.filter(a => !a.is_active).length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="font-lato text-cream/60">Loading alerts...</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-lato text-cream/60">No property alerts found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-cream/5 border border-cream/20 p-6 hover:border-cream/40 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {alert.is_active ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    )}
                    <div>
                      <h3 className="font-montserrat text-lg uppercase tracking-wide text-cream">
                        {alert.name || 'Anonymous'}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="w-4 h-4 text-cream/60" />
                        <span className="font-lato text-sm text-cream/60">
                          {formatDate(alert.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleActive(alert.id, alert.is_active)}
                      className="px-3 py-1 border border-cream/30 text-cream text-xs uppercase tracking-wider hover:bg-cream hover:text-charcoal transition-all font-lato"
                    >
                      {alert.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="p-2 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-cream/60" />
                    <span className="font-lato text-sm text-cream/90">{alert.email}</span>
                  </div>
                  {alert.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-cream/60" />
                      <span className="font-lato text-sm text-cream/90">{alert.phone}</span>
                    </div>
                  )}
                  {alert.property_type && (
                    <div className="flex items-center space-x-2">
                      <Home className="w-4 h-4 text-cream/60" />
                      <span className="font-lato text-sm text-cream/90 capitalize">{alert.property_type}</span>
                    </div>
                  )}
                  {alert.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-cream/60" />
                      <span className="font-lato text-sm text-cream/90">{alert.location}</span>
                    </div>
                  )}
                  {(alert.price_min || alert.price_max) && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-cream/60" />
                      <span className="font-lato text-sm text-cream/90">
                        {formatPrice(alert.price_min)} - {formatPrice(alert.price_max)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
