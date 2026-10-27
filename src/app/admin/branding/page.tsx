'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PREDEFINED_THEMES, PredefinedThemeId } from '@/lib/theme';
import { ThemeBrandingConfig } from '@/lib/types';
import ZavianLogo from '@/components/ui/ZavianLogo';
import {
  Palette,
  CheckCircle2,
  Save,
  Image as ImageIcon,
  Code,
  Sparkles,
  RefreshCw,
  Sun,
  Moon,
  Upload,
  Trash2,
  FileImage,
  AlertCircle,
} from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function ThemeBrandingPage() {
  const { setThemeId, setMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const svgFileInputRef = useRef<HTMLInputElement>(null);

  const [branding, setBranding] = useState<ThemeBrandingConfig>({
    activeThemeId: 'crimson-cyber',
    defaultMode: 'dark',
    logoMode: 'default',
    logoImageUrl: '',
    logoSvgContent: '',
    wordmark1: 'ZAVIAN',
    wordmark1Color: '#ffffff',
    wordmark2: 'LABS',
    wordmark2Color: '#DC2626',
    tagline: 'AI AUTOMATION & SOFTWARE STUDIO',
  });

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.content && data.content.themeBranding) {
          setBranding(data.content.themeBranding);
          setThemeId(data.content.themeBranding.activeThemeId);
          if (data.content.themeBranding.defaultMode) {
            setMode(data.content.themeBranding.defaultMode);
          }
        }
      })
      .catch((err) => console.error('Failed to load branding:', err))
      .finally(() => setLoading(false));
  }, [setThemeId, setMode]);

  const processImageFile = async (file: File) => {
    if (!file) return;
    setUploadError('');

    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif', 'image/x-icon', 'image/vnd.microsoft.icon'];
    const isSvg = file.name.toLowerCase().endsWith('.svg');

    if (!validTypes.includes(file.type) && !isSvg) {
      setUploadError('Unsupported format. Please select an SVG, PNG, WebP, or JPEG logo image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit. Please select an optimized logo asset.');
      return;
    }

    setUploadLoading(true);
    setUploadedFileName(file.name);
    setUploadedFileSize((file.size / 1024).toFixed(1) + ' KB');

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setBranding((prev) => ({
            ...prev,
            logoMode: 'image',
            logoImageUrl: dataUrl,
          }));

          // Background upload for persistent disk asset when supported
          try {
            const formData = new FormData();
            formData.append('file', file);
            const uploadRes = await fetch('/api/admin/upload', {
              method: 'POST',
              body: formData,
            });
            if (uploadRes.ok) {
              const resData = await uploadRes.json();
              if (resData.url && !resData.url.startsWith('data:')) {
                setBranding((prev) => ({
                  ...prev,
                  logoImageUrl: resData.url,
                }));
              }
            }
          } catch {
            // Keep the dataUrl fallback intact
          }
        }
        setUploadLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError(err.message || 'Error processing file');
      setUploadLoading(false);
    }
  };

  const handleSvgFileUpload = (file: File) => {
    if (!file) return;
    setUploadError('');
    if (!file.name.toLowerCase().endsWith('.svg') && file.type !== 'image/svg+xml') {
      setUploadError('Please select a valid .svg vector file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setBranding((prev) => ({
          ...prev,
          logoMode: 'svg',
          logoSvgContent: text,
        }));
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectTheme = (themeId: PredefinedThemeId) => {
    const updated = { ...branding, activeThemeId: themeId };
    setBranding(updated);
    setThemeId(themeId); // Instantly preview on UI & 3D canvas!
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await fetch('/api/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'themeBranding',
          data: branding,
        }),
      });

      if (!res.ok) throw new Error('Save failed');

      setSuccessMsg('Theme & Branding configuration saved! Live storefront updated instantly.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Error saving branding');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-xs font-mono text-zinc-500">
        Loading Theme &amp; Branding configuration...
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-mono mb-2 uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5" />
            IDENTITY &amp; THEME ENGINE
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Theme &amp; Branding</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure the dual theme engine (Dark / Light), 5 predefined color themes, SVG/image logo, custom wordmark, and sub-tagline.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. Dual Theme Mode (Dark Mode ⇄ Light Mode) */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Dual Theme Engine (Dark Mode ⇄ Light Mode)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Set the default mode for first-time visitors. Visitors can also toggle on-the-fly using the animated Sun &amp; Moon button in the navbar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => {
              setBranding({ ...branding, defaultMode: 'dark' });
              setMode('dark');
            }}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
              (branding.defaultMode || 'dark') === 'dark'
                ? 'bg-white/10 border-white/40 shadow-xl ring-2 ring-red-500/50'
                : 'bg-black/30 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-black border border-white/15 flex items-center justify-center text-amber-300 shadow-md">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Dark Mode (Obsidian)</span>
                {(branding.defaultMode || 'dark') === 'dark' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                    DEFAULT
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">High-contrast cyber obsidian aesthetic with glowing WebGL core</p>
            </div>
          </div>

          <div
            onClick={() => {
              setBranding({ ...branding, defaultMode: 'light' });
              setMode('light');
            }}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
              branding.defaultMode === 'light'
                ? 'bg-white/10 border-white/40 shadow-xl ring-2 ring-red-500/50'
                : 'bg-black/30 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-white border border-black/10 flex items-center justify-center text-amber-500 shadow-md">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Light Mode (Titanium)</span>
                {branding.defaultMode === 'light' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                    DEFAULT
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">Crisp, clean editorial light mode with chromatic glass refractions</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Predefined Color Theme Selector */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-500" />
            <span>5 Predefined Color Themes</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Select one of the 5 engineered color themes. Changes apply instantly to titles, highlights, buttons, and background 3D canvas lighting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(PREDEFINED_THEMES) as PredefinedThemeId[]).map((key) => {
            const t = PREDEFINED_THEMES[key];
            const isSelected = branding.activeThemeId === key;

            return (
              <div
                key={key}
                onClick={() => handleSelectTheme(key)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white/10 border-white/40 shadow-xl ring-2 ring-red-500/50'
                    : 'bg-black/30 border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full shadow-md"
                      style={{ backgroundColor: t.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full shadow-md"
                      style={{ backgroundColor: t.secondary }}
                    />
                  </div>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{t.name}</h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{t.tagline}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>Primary: {t.primary}</span>
                  <span>3D Tint: {t.lightTint3D}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Logo Icon Customization */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-red-500" />
            <span>Logo Icon Configuration</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Choose between the default signature geometric node, an uploaded file or external image URL, or raw SVG code.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'default', label: 'Preset Geometric "Z"', desc: 'Cyber notch vector badge' },
            { id: 'image', label: 'Custom Image / Upload', desc: 'Direct file upload or external image URL' },
            { id: 'svg', label: 'Custom Inline SVG', desc: 'Raw XML/SVG vector path code' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setBranding({ ...branding, logoMode: mode.id as any })}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                branding.logoMode === mode.id
                  ? 'bg-red-600/15 border-red-500 text-white font-semibold shadow-md'
                  : 'bg-black/30 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
              }`}
            >
              <div className="text-xs font-mono font-bold uppercase">{mode.label}</div>
              <div className="text-[11px] text-zinc-400 mt-1">{mode.desc}</div>
            </button>
          ))}
        </div>

        {uploadError && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Dynamic Inputs based on logoMode */}
        {branding.logoMode === 'image' && (
          <div className="space-y-5 pt-2">
            {/* Hidden file input for native file selection dialog */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processImageFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {/* Drag & Drop File Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                isDragging
                  ? 'border-red-500 bg-red-600/10 scale-[1.01]'
                  : 'border-white/15 hover:border-red-500/60 bg-black/40 hover:bg-black/60'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500 mb-3 group-hover:scale-110 group-hover:bg-red-600/10 group-hover:border-red-500/30 transition-all">
                {uploadLoading ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-red-400" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">
                  <span className="text-red-400 underline underline-offset-2">Click to upload</span> or drag and drop logo file
                </p>
                <p className="text-xs text-zinc-400 font-mono">
                  SVG, PNG, WebP, or JPEG (Max 5MB · Vector or transparent background recommended)
                </p>
              </div>

              <button
                type="button"
                className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs flex items-center gap-2 pointer-events-none"
              >
                <FileImage className="w-3.5 h-3.5 text-red-400" />
                <span>Browse Files</span>
              </button>
            </div>

            {/* Current Uploaded / Active Logo Status Card */}
            {branding.logoImageUrl && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-black/80 border border-white/20 p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    <img
                      src={branding.logoImageUrl}
                      alt="Uploaded Logo Asset"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white truncate">
                        {uploadedFileName || 'Custom Logo Asset'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono shrink-0">
                        ACTIVE ASSET
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                      {uploadedFileSize ? `${uploadedFileSize} · ` : ''}
                      {branding.logoImageUrl.startsWith('data:')
                        ? 'Base64 Embedded Data URI (Zero External CDN Dependency)'
                        : branding.logoImageUrl}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Replace</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBranding({ ...branding, logoImageUrl: '' });
                      setUploadedFileName('');
                      setUploadedFileSize('');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
            )}

            {/* Separator */}
            <div className="flex items-center gap-3 pt-1">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Or Use External Logo URL
              </span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            {/* External URL Input */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Logo Image URL (HTTPS)
              </label>
              <input
                type="url"
                value={branding.logoImageUrl || ''}
                onChange={(e) => setBranding({ ...branding, logoImageUrl: e.target.value })}
                placeholder="https://example.com/assets/logo.png"
                className="app-input font-mono text-xs"
              />
            </div>
          </div>
        )}

        {branding.logoMode === 'svg' && (
          <div className="space-y-3 pt-2">
            <input
              ref={svgFileInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleSvgFileUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-red-400" />
                <span>Raw SVG Code (&lt;svg ...&gt;...&lt;/svg&gt;)</span>
              </label>

              <button
                type="button"
                onClick={() => svgFileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-zinc-300 hover:text-white text-[11px] font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Upload className="w-3 h-3 text-red-400" />
                <span>Upload .SVG File</span>
              </button>
            </div>

            <textarea
              rows={5}
              value={branding.logoSvgContent || ''}
              onChange={(e) => setBranding({ ...branding, logoSvgContent: e.target.value })}
              placeholder='<svg viewBox="0 0 24 24" fill="currentColor"> ... </svg>'
              className="app-input font-mono text-xs"
            />
          </div>
        )}
      </section>

      {/* 4. Logo Title & Sub-Tagline */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-500" />
            <span>Wordmark &amp; Tagline Editor</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Customize the primary dual-word brand name and corporate sub-tagline shown on navbar and footer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Wordmark Word 1 (Default: ZAVIAN)
            </label>
            <input
              type="text"
              value={branding.wordmark1}
              onChange={(e) => setBranding({ ...branding, wordmark1: e.target.value })}
              className="app-input"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Wordmark Word 2 (Default: LABS)
            </label>
            <input
              type="text"
              value={branding.wordmark2}
              onChange={(e) => setBranding({ ...branding, wordmark2: e.target.value })}
              className="app-input"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            Sub-Tagline (Default: AI AUTOMATION &amp; SOFTWARE STUDIO)
          </label>
          <input
            type="text"
            value={branding.tagline}
            onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
            className="app-input"
          />
        </div>
      </section>

      {/* 5. Live Interactive Preview */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase tracking-wider text-zinc-400">
            Live Header Brand Preview
          </h2>
          <span className="text-[11px] font-mono text-zinc-500">
            Active Theme: {branding.activeThemeId} ({branding.defaultMode || 'dark'})
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-[#060609] border border-white/10 flex items-center justify-between">
          <ZavianLogo
            showTagline={true}
            wordmarkWhite={branding.wordmark1}
            wordmarkCrimson={branding.wordmark2}
            wordmark1Color={branding.wordmark1Color}
            wordmark2Color={branding.wordmark2Color}
            tagline={branding.tagline}
            logoMode={branding.logoMode}
            logoImageUrl={branding.logoImageUrl}
            logoSvgContent={branding.logoSvgContent}
          />
        </div>
      </section>
    </div>
  );
}
