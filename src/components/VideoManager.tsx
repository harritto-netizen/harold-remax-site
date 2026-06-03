import { useEffect, useState } from 'react';
import { Trash2, CheckCircle, XCircle, Plus, Save, Upload, X } from 'lucide-react';
import { supabase, PropertyVideo } from '../lib/supabase';

type VideoForm = {
  id?: string;
  title: string;
  description: string;
  video_type: 'embed' | 'upload';
  video_url: string;
  thumbnail_url: string;
  display_order: number;
  is_active: boolean;
};

const emptyForm: VideoForm = {
  title: '',
  description: '',
  video_type: 'embed',
  video_url: '',
  thumbnail_url: '',
  display_order: 0,
  is_active: true,
};

export default function VideoManager() {
  const [videos, setVideos] = useState<PropertyVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<VideoForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('property_videos')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    setVideos((data as PropertyVideo[]) || []);
    setLoading(false);
  };

  const startNew = () => {
    setForm({ ...emptyForm, display_order: videos.length });
    setError(null);
    setShowForm(true);
  };

  const startEdit = (v: PropertyVideo) => {
    setForm({
      id: v.id,
      title: v.title,
      description: v.description || '',
      video_type: v.video_type,
      video_url: v.video_url,
      thumbnail_url: v.thumbnail_url || '',
      display_order: v.display_order,
      is_active: v.is_active,
    });
    setError(null);
    setShowForm(true);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split('.').pop() || 'mp4';
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('property-videos')
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from('property-videos').getPublicUrl(path);
      setForm((f) => ({ ...f, video_type: 'upload', video_url: data.publicUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.video_url.trim()) {
      setError('Title and video URL are required');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      video_type: form.video_type,
      video_url: form.video_url.trim(),
      thumbnail_url: form.thumbnail_url.trim(),
      display_order: form.display_order,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };
    if (form.id) {
      const { error: upErr } = await supabase
        .from('property_videos')
        .update(payload)
        .eq('id', form.id);
      if (upErr) {
        setError(upErr.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: insErr } = await supabase
        .from('property_videos')
        .insert(payload);
      if (insErr) {
        setError(insErr.message);
        setSaving(false);
        return;
      }
    }
    setSaving(false);
    setShowForm(false);
    setForm(emptyForm);
    loadVideos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video? This cannot be undone.')) return;
    const { error: delErr } = await supabase
      .from('property_videos')
      .delete()
      .eq('id', id);
    if (!delErr) loadVideos();
  };

  const toggleActive = async (v: PropertyVideo) => {
    const { error: upErr } = await supabase
      .from('property_videos')
      .update({ is_active: !v.is_active })
      .eq('id', v.id);
    if (!upErr) {
      setVideos(videos.map((x) => (x.id === v.id ? { ...x, is_active: !v.is_active } : x)));
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-lato text-sm text-cream/60">
            {videos.length} video{videos.length === 1 ? '' : 's'} total
          </p>
        </div>
        <button
          onClick={startNew}
          className="flex items-center space-x-2 bg-cream text-charcoal px-4 py-2 text-sm uppercase tracking-wider hover:opacity-80 transition-opacity font-lato"
        >
          <Plus className="w-4 h-4" />
          <span>Add Video</span>
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-cream/5 border border-cream/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-montserrat text-lg uppercase tracking-wide">
              {form.id ? 'Edit Video' : 'New Video'}
            </h3>
            <button
              onClick={() => { setShowForm(false); setForm(emptyForm); setError(null); }}
              className="text-cream/60 hover:text-cream"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-lato text-xs uppercase tracking-wider text-cream/60 mb-2">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-charcoal border border-cream/30 text-cream px-3 py-2 font-lato text-sm"
                placeholder="Luxury Villa Tour - Punta Cana"
              />
            </div>
            <div>
              <label className="block font-lato text-xs uppercase tracking-wider text-cream/60 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                className="w-full bg-charcoal border border-cream/30 text-cream px-3 py-2 font-lato text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-lato text-xs uppercase tracking-wider text-cream/60 mb-2">
                Description (optional)
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full bg-charcoal border border-cream/30 text-cream px-3 py-2 font-lato text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-lato text-xs uppercase tracking-wider text-cream/60 mb-2">
                Video Source
              </label>
              <div className="flex space-x-2 mb-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, video_type: 'embed' })}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-lato ${form.video_type === 'embed' ? 'bg-cream text-charcoal' : 'border border-cream/30 text-cream'}`}
                >
                  YouTube / Vimeo Link
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, video_type: 'upload' })}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-lato ${form.video_type === 'upload' ? 'bg-cream text-charcoal' : 'border border-cream/30 text-cream'}`}
                >
                  Upload MP4
                </button>
              </div>

              {form.video_type === 'embed' ? (
                <input
                  type="url"
                  value={form.video_url}
                  onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                  className="w-full bg-charcoal border border-cream/30 text-cream px-3 py-2 font-lato text-sm"
                  placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                />
              ) : (
                <div className="space-y-2">
                  <label className="flex items-center justify-center space-x-2 border border-dashed border-cream/30 px-4 py-6 cursor-pointer hover:border-cream/60 transition-colors">
                    <Upload className="w-5 h-5" />
                    <span className="font-lato text-sm">
                      {uploading ? 'Uploading...' : form.video_url ? 'Replace video file' : 'Click to upload MP4'}
                    </span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(file);
                      }}
                    />
                  </label>
                  {form.video_url && (
                    <p className="font-lato text-xs text-cream/60 break-all">{form.video_url}</p>
                  )}
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block font-lato text-xs uppercase tracking-wider text-cream/60 mb-2">
                Thumbnail URL (optional - YouTube auto-generates)
              </label>
              <input
                type="url"
                value={form.thumbnail_url}
                onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                className="w-full bg-charcoal border border-cream/30 text-cream px-3 py-2 font-lato text-sm"
                placeholder="https://..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                />
                <span className="font-lato text-sm text-cream/80">
                  Visible on website
                </span>
              </label>
            </div>
          </div>

          {error && (
            <p className="mt-4 font-lato text-sm text-red-400">{error}</p>
          )}

          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleSave}
              disabled={saving || uploading}
              className="flex items-center space-x-2 bg-cream text-charcoal px-4 py-2 text-sm uppercase tracking-wider hover:opacity-80 transition-opacity font-lato disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Video'}</span>
            </button>
            <button
              onClick={() => { setShowForm(false); setForm(emptyForm); setError(null); }}
              className="px-4 py-2 border border-cream/30 text-cream text-sm uppercase tracking-wider hover:bg-cream/10 transition-all font-lato"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="font-lato text-cream/60 text-center py-12">Loading videos...</p>
      ) : videos.length === 0 ? (
        <p className="font-lato text-cream/60 text-center py-12">
          No videos yet. Add your first property tour above.
        </p>
      ) : (
        <div className="space-y-3">
          {videos.map((v) => (
            <div key={v.id} className="bg-cream/5 border border-cream/20 p-4 hover:border-cream/40 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  {v.is_active ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                  )}
                  <div className="min-w-0">
                    <h4 className="font-montserrat text-base uppercase tracking-wide truncate">
                      {v.title}
                    </h4>
                    <p className="font-lato text-xs text-cream/60 mt-1">
                      Order: {v.display_order} &middot; {v.video_type === 'embed' ? 'Embed' : 'Uploaded'}
                    </p>
                    <p className="font-lato text-xs text-cream/50 mt-1 truncate">{v.video_url}</p>
                  </div>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(v)}
                    className="px-3 py-1 border border-cream/30 text-cream text-xs uppercase tracking-wider hover:bg-cream hover:text-charcoal transition-all font-lato"
                  >
                    {v.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => startEdit(v)}
                    className="px-3 py-1 border border-cream/30 text-cream text-xs uppercase tracking-wider hover:bg-cream hover:text-charcoal transition-all font-lato"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="p-2 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                    aria-label="Delete video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
