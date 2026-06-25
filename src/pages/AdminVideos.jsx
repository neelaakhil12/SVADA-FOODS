import React, { useState, useContext, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import {
  Video, Plus, Pencil, Trash2, Upload, Link, X, Check,
  AlertCircle, Loader, Play, Film
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || ((import.meta.env.DEV && window.location.hostname === 'localhost') ? 'http://localhost:5000/api' : '/api');

const EMPTY_FORM = {
  title: '',
  desc: '',
  keyword: '',
  videoUrl: '',
};

export default function AdminVideos() {
  const { watchBuyVideos, addWatchBuyVideo, updateWatchBuyVideo, deleteWatchBuyVideo } = useContext(ShopContext);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploadMode, setUploadMode] = useState('url'); // 'url' | 'file'
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const fileInputRef = useRef();

  // ---------- helpers ----------

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setUploadMode('url');
    setUploadError('');
    setShowForm(true);
  };

  const openEdit = (video) => {
    setForm({
      title: video.title || '',
      desc: video.desc || '',
      keyword: video.keyword || '',
      videoUrl: video.videoUrl || '',
    });
    setEditingId(video.id);
    setUploadMode('url');
    setUploadError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setUploadError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Upload a local file to the server
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a valid video file (MP4, WebM, OGG, MOV).');
      return;
    }
    if (file.size > 200 * 1024 * 1024) {
      setUploadError('File is too large. Maximum size is 200 MB.');
      return;
    }

    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('video', file);
      const res = await fetch(`${API_BASE}/videos/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setForm(prev => ({ ...prev, videoUrl: data.videoUrl }));
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Save (add or update)
  const handleSave = async () => {
    if (!form.title.trim()) { setUploadError('Video title is required.'); return; }
    if (!form.videoUrl.trim()) { setUploadError('Please provide a video URL or upload a file.'); return; }
    if (!form.keyword.trim()) { setUploadError('A search keyword is required.'); return; }

    setSaving(true);
    setUploadError('');
    try {
      if (editingId) {
        updateWatchBuyVideo(editingId, { ...form });
      } else {
        addWatchBuyVideo({ ...form });
      }
      closeForm();
    } catch (err) {
      setUploadError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    deleteWatchBuyVideo(id);
    setDeleteConfirmId(null);
  };

  const isYouTube = (url) => url && (url.includes('youtube.com') || url.includes('youtu.be'));

  const getVideoThumbnail = (url) => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`;
    return null;
  };

  // ---------- render ----------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Film size={28} className="text-[#3B1E0A]" />
            Watch &amp; Buy Videos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage shoppable videos shown on the home page.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#3B1E0A] hover:bg-[#5a2e11] text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow"
        >
          <Plus size={18} />
          Add Video
        </button>
      </div>

      {/* Video Grid */}
      {watchBuyVideos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-16 flex flex-col items-center justify-center text-center">
          <Video size={52} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">No Videos Yet</h3>
          <p className="text-gray-400 text-sm mt-1 mb-6">Add your first Watch &amp; Buy video to get started.</p>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#3B1E0A] hover:bg-[#5a2e11] text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
          >
            <Plus size={18} />
            Add Video
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {watchBuyVideos.map((video) => {
            const thumb = getVideoThumbnail(video.videoUrl);
            const isHovered = hoveredId === video.id;
            return (
              <div
                key={video.id}
                className="bg-white rounded-xl shadow-md overflow-hidden group border border-gray-100 hover:shadow-lg transition-shadow"
                onMouseEnter={() => setHoveredId(video.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Thumbnail / Preview */}
                <div className="relative aspect-[9/16] bg-gray-900 overflow-hidden">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : video.videoUrl ? (
                    <video
                      src={video.videoUrl}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      {...(isHovered ? { autoPlay: true } : {})}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video size={40} className="text-gray-500" />
                    </div>
                  )}

                  {/* Play overlay */}
                  {!isHovered && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Play size={20} className="text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Keyword badge */}
                  {video.keyword && (
                    <span className="absolute top-2 left-2 bg-[#3B1E0A]/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
                      #{video.keyword}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{video.title}</h3>
                  {video.desc && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{video.desc}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => openEdit(video)}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium py-1.5 rounded-lg transition-colors"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>
                    {deleteConfirmId === video.id ? (
                      <div className="flex-1 flex gap-1">
                        <button
                          onClick={() => handleDelete(video.id)}
                          className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-1.5 rounded-lg transition-colors"
                        >
                          <Check size={13} />
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="flex-1 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-600 text-xs font-medium py-1.5 rounded-lg transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(video.id)}
                        className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium py-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Video size={20} className="text-[#3B1E0A]" />
                {editingId ? 'Edit Video' : 'Add New Video'}
              </h2>
              <button
                onClick={closeForm}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Svada Traditional Farm Prep"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B1E0A]/30 focus:border-[#3B1E0A]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="desc"
                  value={form.desc}
                  onChange={handleChange}
                  placeholder="Short description of the video..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B1E0A]/30 focus:border-[#3B1E0A] resize-none"
                />
              </div>

              {/* Keyword */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Keyword <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="keyword"
                  value={form.keyword}
                  onChange={handleChange}
                  placeholder="e.g. pickle, podi, ghee, sweet"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B1E0A]/30 focus:border-[#3B1E0A]"
                />
                <p className="text-xs text-gray-400 mt-1">Used to match and link a related product on the home page.</p>
              </div>

              {/* Video Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Source <span className="text-red-500">*</span>
                </label>

                {/* Toggle */}
                <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-3">
                  <button
                    onClick={() => setUploadMode('url')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors ${
                      uploadMode === 'url'
                        ? 'bg-[#3B1E0A] text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Link size={15} />
                    URL / YouTube
                  </button>
                  <button
                    onClick={() => setUploadMode('file')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors ${
                      uploadMode === 'file'
                        ? 'bg-[#3B1E0A] text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Upload size={15} />
                    Upload File
                  </button>
                </div>

                {uploadMode === 'url' ? (
                  <input
                    type="text"
                    name="videoUrl"
                    value={form.videoUrl}
                    onChange={handleChange}
                    placeholder="https://youtube.com/... or /uploads/video.mp4"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B1E0A]/30 focus:border-[#3B1E0A]"
                  />
                ) : (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-6 text-sm text-gray-500 hover:border-[#3B1E0A] hover:text-[#3B1E0A] transition-colors disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <Loader size={22} className="animate-spin" />
                          <span>Uploading…</span>
                        </>
                      ) : (
                        <>
                          <Upload size={22} />
                          <span>Click to select a video file</span>
                          <span className="text-xs text-gray-400">MP4, WebM, MOV · Max 200 MB</span>
                        </>
                      )}
                    </button>
                    {form.videoUrl && (
                      <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                        <Check size={13} />
                        Uploaded: {form.videoUrl}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Error */}
              {uploadError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-xl">
                  <AlertCircle size={16} />
                  {uploadError}
                </div>
              )}

              {/* Preview */}
              {form.videoUrl && !uploading && (
                <div className="rounded-xl overflow-hidden bg-black aspect-video">
                  {isYouTube(form.videoUrl) ? (
                    <iframe
                      src={form.videoUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                      title="preview"
                    />
                  ) : (
                    <video
                      src={form.videoUrl}
                      className="w-full h-full object-contain"
                      controls
                      muted
                    />
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button
                onClick={closeForm}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="flex-1 py-2.5 rounded-xl bg-[#3B1E0A] hover:bg-[#5a2e11] text-white font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader size={15} className="animate-spin" /> : <Check size={15} />}
                {editingId ? 'Save Changes' : 'Add Video'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
