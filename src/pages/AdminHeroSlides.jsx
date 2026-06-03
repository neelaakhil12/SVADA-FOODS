import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Plus, Trash2, Pencil, Check, X, ImagePlay, GripVertical, Eye } from 'lucide-react';

const AdminHeroSlides = () => {
  const { heroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide } = useContext(ShopContext);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewId, setPreviewId] = useState(null);

  const emptyForm = { name: '', image: '', desc: '' };
  const [newSlide, setNewSlide] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);

  const handleAdd = () => {
    if (!newSlide.name.trim() || !newSlide.image.trim()) {
      alert('Please fill in at least the Title and Image URL.');
      return;
    }
    addHeroSlide(newSlide);
    setNewSlide(emptyForm);
    setShowAddForm(false);
  };

  const startEdit = (slide) => {
    setEditingId(slide.id);
    setEditForm({ name: slide.name, image: slide.image, desc: slide.desc });
    setPreviewId(null);
  };

  const handleEditSave = (id) => {
    if (!editForm.name.trim() || !editForm.image.trim()) {
      alert('Please fill in at least the Title and Image URL.');
      return;
    }
    updateHeroSlide(id, editForm);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (heroSlides.length <= 1) {
      alert('You must keep at least one hero slide.');
      return;
    }
    if (window.confirm('Delete this hero slide?')) {
      deleteHeroSlide(id);
      if (previewId === id) setPreviewId(null);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px', height: '42px', background: 'linear-gradient(135deg, #f97316, #ea580c)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ImagePlay size={22} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Hero Slides</h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              {heroSlides.length} slide{heroSlides.length !== 1 ? 's' : ''} · Manage your homepage banner slideshow
            </p>
          </div>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setEditingId(null); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.6rem 1.2rem', background: 'linear-gradient(135deg, #f97316, #ea580c)',
            color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600,
            cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(249,115,22,0.3)'
          }}
        >
          <Plus size={16} /> Add Slide
        </button>
      </div>

      {/* Add Slide Form */}
      {showAddForm && (
        <div style={{
          background: 'white', border: '2px solid #f97316', borderRadius: '12px',
          padding: '1.5rem', marginBottom: '1.5rem',
          boxShadow: '0 8px 32px rgba(249,115,22,0.12)'
        }}>
          <h3 style={{ margin: '0 0 1rem', color: '#ea580c', fontSize: '1rem', fontWeight: 700 }}>
            ✨ New Hero Slide
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#374151', fontSize: '0.85rem' }}>
                Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Pure Natural Farms"
                value={newSlide.name}
                onChange={e => setNewSlide({ ...newSlide, name: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#374151', fontSize: '0.85rem' }}>
                Image URL *
              </label>
              <input
                type="text"
                placeholder="e.g. /hero-banner.jpg or https://..."
                value={newSlide.image}
                onChange={e => setNewSlide({ ...newSlide, image: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#374151', fontSize: '0.85rem' }}>
              Subtitle / Description
            </label>
            <input
              type="text"
              placeholder="e.g. 100% Homemade & Preservative-free"
              value={newSlide.desc}
              onChange={e => setNewSlide({ ...newSlide, desc: e.target.value })}
              style={inputStyle}
            />
          </div>
          {newSlide.image && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.4rem' }}>Image Preview:</p>
              <img
                src={newSlide.image}
                alt="preview"
                onError={e => { e.target.style.display = 'none'; }}
                style={{ height: '100px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
              />
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleAdd} style={btnPrimaryStyle}>
              <Check size={15} /> Save Slide
            </button>
            <button onClick={() => { setShowAddForm(false); setNewSlide(emptyForm); }} style={btnSecondaryStyle}>
              <X size={15} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Slides List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {heroSlides.length === 0 && (
          <div style={{
            background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '12px',
            padding: '3rem', textAlign: 'center', color: '#94a3b8'
          }}>
            <ImagePlay size={40} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
            <p style={{ margin: 0, fontWeight: 600 }}>No hero slides yet</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>Click "Add Slide" to create your first banner</p>
          </div>
        )}

        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            style={{
              background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0',
              overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'box-shadow 0.2s'
            }}
          >
            {editingId === slide.id ? (
              /* Edit Mode */
              <div style={{ padding: '1.25rem' }}>
                <h4 style={{ margin: '0 0 1rem', color: '#f97316', fontSize: '0.9rem', fontWeight: 700 }}>
                  Editing Slide #{index + 1}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>Title *</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Image URL *</label>
                    <input
                      type="text"
                      value={editForm.image}
                      onChange={e => setEditForm({ ...editForm, image: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={labelStyle}>Subtitle / Description</label>
                  <input
                    type="text"
                    value={editForm.desc}
                    onChange={e => setEditForm({ ...editForm, desc: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                {editForm.image && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.4rem' }}>Image Preview:</p>
                    <img
                      src={editForm.image}
                      alt="preview"
                      onError={e => { e.target.style.display = 'none'; }}
                      style={{ height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                    />
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button onClick={() => handleEditSave(slide.id)} style={btnPrimaryStyle}>
                    <Check size={14} /> Save
                  </button>
                  <button onClick={() => setEditingId(null)} style={btnSecondaryStyle}>
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div style={{ display: 'flex', alignItems: 'stretch' }}>
                {/* Slide Number Badge */}
                <div style={{
                  width: '44px', background: 'linear-gradient(180deg, #fff7ed, #ffedd5)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  borderRight: '1px solid #fed7aa', gap: '4px', flexShrink: 0
                }}>
                  <GripVertical size={14} color="#f97316" style={{ opacity: 0.5 }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ea580c' }}>{index + 1}</span>
                </div>

                {/* Thumbnail */}
                <div style={{
                  width: '120px', flexShrink: 0, background: '#f1f5f9',
                  borderRight: '1px solid #e2e8f0', overflow: 'hidden'
                }}>
                  {slide.image ? (
                    <img
                      src={slide.image}
                      alt={slide.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '80px' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ImagePlay size={24} color="#cbd5e1" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{slide.name || <em style={{ color: '#94a3b8' }}>No title</em>}</p>
                  {slide.desc && <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.82rem' }}>{slide.desc}</p>}
                  <p style={{ margin: '0.3rem 0 0', color: '#94a3b8', fontSize: '0.75rem', wordBreak: 'break-all' }}>{slide.image}</p>
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '0.5rem', padding: '0.75rem', borderLeft: '1px solid #e2e8f0', flexShrink: 0
                }}>
                  <button
                    title="Preview image"
                    onClick={() => setPreviewId(previewId === slide.id ? null : slide.id)}
                    style={{ ...iconBtnStyle, color: '#3b82f6', background: '#eff6ff' }}
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    title="Edit slide"
                    onClick={() => startEdit(slide)}
                    style={{ ...iconBtnStyle, color: '#f97316', background: '#fff7ed' }}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    title="Delete slide"
                    onClick={() => handleDelete(slide.id)}
                    style={{ ...iconBtnStyle, color: '#ef4444', background: '#fef2f2' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Full Preview Panel */}
            {previewId === slide.id && !editingId && (
              <div style={{ borderTop: '1px solid #e2e8f0', padding: '1rem', background: '#f8fafc' }}>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Banner Preview
                </p>
                <div style={{
                  position: 'relative', width: '100%', maxWidth: '600px', aspectRatio: '16/5',
                  background: '#1e293b', borderRadius: '10px', overflow: 'hidden'
                }}>
                  <img
                    src={slide.image}
                    alt={slide.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', padding: '1.5rem', background: 'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, transparent 100%)'
                  }}>
                    <p style={{ margin: 0, color: 'white', fontWeight: 800, fontSize: '1.1rem', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{slide.name}</p>
                    {slide.desc && <p style={{ margin: '0.25rem 0 0', color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem' }}>{slide.desc}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Help text */}
      <div style={{
        marginTop: '2rem', padding: '1rem 1.25rem', background: '#fff7ed',
        borderRadius: '10px', border: '1px solid #fed7aa'
      }}>
        <p style={{ margin: 0, fontSize: '0.82rem', color: '#92400e' }}>
          <strong>💡 Tip:</strong> Use image paths like <code>/hero-banner.jpg</code> for files placed in the <code>public/</code> folder, or paste a full URL (e.g. https://...). Images auto-slide on the homepage every 2 seconds. At least 1 slide must exist at all times.
        </p>
      </div>
    </div>
  );
};

// Shared styles
const inputStyle = {
  width: '100%', padding: '0.55rem 0.75rem', border: '1.5px solid #e2e8f0',
  borderRadius: '7px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s', fontFamily: 'inherit'
};

const labelStyle = {
  display: 'block', marginBottom: '0.35rem', fontWeight: 600, color: '#374151', fontSize: '0.82rem'
};

const btnPrimaryStyle = {
  display: 'flex', alignItems: 'center', gap: '0.4rem',
  padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #f97316, #ea580c)',
  color: 'white', border: 'none', borderRadius: '7px',
  fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem'
};

const btnSecondaryStyle = {
  display: 'flex', alignItems: 'center', gap: '0.4rem',
  padding: '0.5rem 1rem', background: '#f1f5f9',
  color: '#475569', border: '1px solid #e2e8f0', borderRadius: '7px',
  fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem'
};

const iconBtnStyle = {
  width: '32px', height: '32px', border: 'none', borderRadius: '7px',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'opacity 0.2s'
};

export default AdminHeroSlides;


