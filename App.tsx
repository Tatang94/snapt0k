
import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Link2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  Play, 
  Info,
  CheckCircle2,
  Github,
  Twitter,
  Instagram,
  ShieldCheck,
  Zap,
  FileVideo,
  Music,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react';
import { VideoData, AnalysisResult, HistoryItem } from './types';
import { analyzeTikTokContent, getTikTokVideoData } from './services/geminiService';
import HistorySidebar from './components/HistorySidebar';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<any | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('snaptok_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (newUrl: string, title: string) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      url: newUrl,
      title: title || "TikTok Video",
      date: Date.now()
    };
    const updated = [newItem, ...history.filter(h => h.url !== newUrl)].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('snaptok_history', JSON.stringify(updated));
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes('tiktok.com')) {
      setError('Masukkan link TikTok yang valid (contoh: https://vt.tiktok.com/...)');
      return;
    }

    setLoading(true);
    setError(null);
    setVideoData(null);
    setAnalysis(null);

    try {
      setLoadingStage('Menghubungkan ke Sistem...');
      const data = await getTikTokVideoData(url);
      
      setLoadingStage('Berhasil mengambil data video...');
      setVideoData(data);
      saveToHistory(url, data.title || "Video TikTok");
    } catch (err: any) {
      setError(err.message || 'Gagal memproses video. Pastikan link publik dan coba lagi.');
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  /**
   * Fungsi Helper untuk memastikan URL valid
   * Menghindari masalah "www.tikwm.comhttps"
   */
  const getFullUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // Jika hanya path, baru tambahkan domain
    return `https://www.tikwm.com${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const downloadFile = (fileUrl: string, fileName: string) => {
    const finalUrl = getFullUrl(fileUrl);
    
    // Gunakan window.open untuk file cross-origin agar browser menangani unduhan/pemutaran
    const win = window.open(finalUrl, '_blank');
    if (win) {
      win.focus();
    } else {
      // Fallback jika popup diblokir
      const link = document.createElement('a');
      link.href = finalUrl;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const runAnalysis = async () => {
    if (!videoData) return;
    setAnalyzing(true);
    try {
      const result = await analyzeTikTokContent(url, videoData.title);
      setAnalysis(result);
    } catch (err) {
      setError("Gagal menganalisis konten.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f1a] text-slate-100">
      <header className="sticky top-0 z-50 glass-card border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-10 h-10 tiktok-gradient rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform">
              <Download className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter">
              SNAP<span className="text-cyan-400">TOK</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-green-500 uppercase">API: TikWM Online</span>
            </div>
            <button className="hidden sm:block px-5 py-2 rounded-full text-sm font-bold bg-white text-black hover:bg-cyan-400 hover:text-white transition-all">
              Go Pro
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 md:py-12 gap-8 flex flex-col lg:flex-row">
        <HistorySidebar 
          history={history} 
          onClear={() => { localStorage.removeItem('snaptok_history'); setHistory([]); }} 
          onSelect={(u) => setUrl(u)} 
        />

        <div className="flex-1 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Zap className="w-3 h-3 fill-cyan-400" /> Free Public Access
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              TikTok Downloader <br/>
              <span className="text-transparent bg-clip-text tiktok-gradient">No Watermark HD</span>
            </h2>
            <p className="text-gray-400 text-base md:text-lg">
              Tempel link, klik download, simpan video tanpa tanda air secara gratis.
            </p>
          </div>

          <div className="max-w-3xl mx-auto w-full">
            <form onSubmit={handleDownload} className="relative group">
              <div className="absolute inset-0 tiktok-gradient opacity-10 blur-3xl group-focus-within:opacity-20 transition-opacity"></div>
              <div className="relative flex flex-col sm:flex-row p-2 bg-slate-900/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-sm">
                <div className="flex items-center pl-4 text-gray-500 py-4 sm:py-0">
                  <Link2 className="w-5 h-5" />
                </div>
                <input 
                  type="text"
                  placeholder="https://www.tiktok.com/@user/video/..."
                  className="flex-1 bg-transparent px-4 py-4 focus:outline-none text-white placeholder:text-gray-600 text-lg"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button 
                  disabled={loading || !url}
                  className="bg-white text-black font-bold px-10 py-4 rounded-xl hover:bg-cyan-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                  {loading ? 'Sabar ya...' : 'Download'}
                </button>
              </div>
            </form>
            
            {loading && (
              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-cyan-400 font-medium animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{loadingStage}</span>
                </div>
                <div className="w-full max-w-xs h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 animate-[progress_3s_ease-in-out_infinite]"></div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </div>

          {videoData && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card rounded-3xl overflow-hidden p-4 space-y-6 flex flex-col border-white/10">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group shadow-2xl bg-slate-800">
                    <img 
                      src={videoData.cover} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex items-end p-6">
                      <div className="w-full">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-700">
                               <img src={videoData.author?.avatar} alt="" className="w-full h-full object-cover" />
                            </div>
                          </div>
                          <span className="text-sm font-bold text-white/90">@{videoData.author?.unique_id}</span>
                        </div>
                        <p className="font-bold text-lg line-clamp-2 text-white mb-4">{videoData.title}</p>
                        
                        <div className="flex items-center justify-between text-white/60 text-xs">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> {videoData.digg_count}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3 text-cyan-400 fill-cyan-400" /> {videoData.comment_count}</span>
                            <span className="flex items-center gap-1"><Share2 className="w-3 h-3 text-green-400" /> {videoData.share_count}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => downloadFile(videoData.play, `SnapTok_NoWM_${videoData.id}.mp4`)}
                      className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download No Watermark
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                       <button 
                        onClick={() => downloadFile(videoData.hdplay || videoData.play, `SnapTok_HD_${videoData.id}.mp4`)}
                        className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        <FileVideo className="w-4 h-4" />
                        HD Quality
                      </button>
                      <button 
                        onClick={() => downloadFile(videoData.music, `SnapTok_Audio_${videoData.id}.mp3`)}
                        className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        <Music className="w-4 h-4" />
                        Download MP3
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 flex flex-col gap-6">
                {!analysis ? (
                   <div className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6 h-full border-dashed border-2 border-white/10 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-colors duration-500"></div>
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center relative">
                        <Sparkles className="w-10 h-10 text-cyan-400/40 group-hover:text-cyan-400 transition-colors" />
                        <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping opacity-20"></div>
                      </div>
                      <div className="relative">
                        <h3 className="text-xl font-bold text-white mb-2">Ingin Analisis Viral?</h3>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">Gunakan Sistem untuk membedah strategi konten ini, hashtag terbaik, dan tips re-upload.</p>
                        <button 
                          onClick={runAnalysis}
                          disabled={analyzing}
                          className="px-8 py-3 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-400 border border-cyan-400/20 rounded-xl font-bold transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
                        >
                          {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                          Mulai Analisis 
                        </button>
                      </div>
                   </div>
                ) : (
                  <div className="glass-card rounded-3xl p-8 space-y-8 h-full animate-in zoom-in-95 duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-400/5 blur-[100px] -z-10"></div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Analisis AI Gemini</h3>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Content Insight</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold text-gray-400 uppercase">
                        Sentimen: {analysis.sentiment}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                          <Info className="w-3 h-3" /> Ringkasan Cerita
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5 italic">
                          "{analysis.summary}"
                        </p>
                      </div>

                      <div className="space-y-4">
                         <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Hashtag Rekomendasi</h4>
                         <div className="flex flex-wrap gap-2">
                          {analysis.hashtags.map((tag, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1.5 bg-slate-800 text-cyan-400 rounded-lg text-xs font-bold border border-cyan-400/10 hover:scale-105 transition-transform cursor-pointer"
                            >
                              #{tag.replace('#', '')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Kenapa Bisa Viral? (Strategi)</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {analysis.engagementTips.map((tip, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-xs text-gray-300 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-cyan-400/30 transition-colors">
                             <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center text-[10px] font-bold text-cyan-400">
                               {idx + 1}
                             </div>
                             {tip}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-center">
                       <p className="text-[10px] text-gray-600 font-medium">Data dianalisis menggunakan Gemini 3 Pro Preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!videoData && !loading && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
               {[
                 { icon: ShieldCheck, title: "100% Free API", desc: "Menggunakan jalur API publik TikWM yang stabil dan gratis.", color: "text-green-500", bg: "bg-green-500/10" },
                 { icon: Zap, title: "No Watermark", desc: "Dapatkan video bersih tanpa logo TikTok dalam hitungan detik.", color: "text-cyan-400", bg: "bg-cyan-400/10" },
                 { icon: Music, title: "Audio Extractor", desc: "Ambil musik latar favoritmu dalam format MP3 kualitas tinggi.", color: "text-pink-500", bg: "bg-pink-500/10" }
               ].map((f, i) => (
                 <div key={i} className="p-8 glass-card rounded-3xl space-y-4 hover:translate-y-[-4px] transition-all cursor-default border-white/5 group">
                    <div className={`w-12 h-12 ${f.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <f.icon className={`w-6 h-6 ${f.color}`} />
                    </div>
                    <h3 className="text-xl font-bold">{f.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                 </div>
               ))}
            </div>
          )}
        </div>
      </main>

      <footer className="glass-card border-t border-white/5 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-6 h-6 tiktok-gradient rounded flex items-center justify-center">
                <Download className="text-white w-4 h-4" />
              </div>
              <h1 className="text-lg font-black tracking-tighter">SNAPTOK PRO</h1>
            </div>
            <p className="text-xs text-gray-600 max-w-xs">
              Powered by Tangtainment.
            </p>
          </div>
          
          <div className="flex gap-6">
             <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors"><Twitter className="w-5 h-5" /></a>
             <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors"><Instagram className="w-5 h-5" /></a>
             <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors"><Github className="w-5 h-5" /></a>
          </div>

          <p className="text-[10px] text-gray-600 font-medium">
            © {new Date().getFullYear()} SnapTok. Build for Creators.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes progress {
          0% { width: 0%; opacity: 0.5; }
          50% { width: 70%; opacity: 1; }
          100% { width: 100%; opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default App;
