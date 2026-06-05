"use client";

import { ArrowRight, Bot, CheckCircle2, FileText, Sparkles, Target, Zap, BarChart3 } from "lucide-react";

export default function LandingPage({ onGoToApp }: { onGoToApp: () => void }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans overflow-x-hidden relative selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Background Pattern & Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-400/20 blur-[120px]" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-300/20 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] rounded-full bg-violet-400/10 blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 md:px-10 h-24 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onGoToApp}>
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            Dilirik
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold text-slate-500 hidden sm:block">Aman & Rahasia</span>
          <button
            onClick={onGoToApp}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            Mulai ke Aplikasi
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-16 lg:pt-20 lg:pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[0.8rem] font-bold mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Solusi analisis CV berbasis AI generasi baru
            </div>
            
            <h1 className="text-[2.75rem] md:text-6xl lg:text-[4rem] font-extrabold leading-[1.05] tracking-tight text-slate-900 mb-6">
              Bikin CV kamu <br />
              pasti <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-indigo-700">
                dilirik
              </span> HRD
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 font-medium">
              Analisis dan nilai CV kamu secara otomatis. Dapatkan skor multi-kriteria, rekomendasi perbaikan, dan temukan celah agar lebih mudah dilirik HRD.
            </p>
            
            <button
              onClick={onGoToApp}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white text-base md:text-lg font-bold px-8 py-4 rounded-2xl shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Analisis CV Saya Gratis
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Visual (Floating Mockup) */}
          <div className="relative lg:ml-auto w-full max-w-[540px] animate-in fade-in zoom-in-95 duration-1000 mt-10 lg:mt-0">
            {/* Main Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-white relative z-10 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">Analisis CV Selesai</h3>
                  <p className="text-sm font-medium text-slate-500">Processing otomatis via AI</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { label: "Keterampilan Teknis", score: 92, width: "92%" },
                  { label: "Pengalaman Profesional", score: 87, width: "87%" },
                  { label: "Edukasi & Formasi", score: 94, width: "94%" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-2.5">
                      <span className="font-bold text-slate-600">{item.label}</span>
                      <span className="font-extrabold text-indigo-600">{item.score}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-500" 
                        style={{ width: item.width }} 
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="font-extrabold text-lg text-slate-900">Skor Keseluruhan</span>
                <span className="text-4xl font-black text-indigo-600">91%</span>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute -top-6 -right-4 md:-right-8 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-white flex items-center gap-2.5 z-20 animate-bounce" style={{ animationDuration: '3.5s' }}>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-bold text-slate-800">Kandidat Sangat Kuat</span>
            </div>
            
            <div className="absolute -bottom-6 -left-4 md:-left-8 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-white flex items-center gap-2.5 z-20">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold text-slate-800">Analisis Instan</span>
            </div>
          </div>
          
        </div>
      </section>



      {/* ── CARA KERJA ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-4 pb-24 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Bagaimana Cara Kerjanya?</h2>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
            Hanya butuh tiga langkah mudah untuk mengoptimalkan CV kamu.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { num: "1", title: "Unggah CV-mu", desc: "Seret & lepas file PDF. Ekstraksi otomatis dan aman." },
            { num: "2", title: "AI Bekerja", desc: "AI mencocokkan CV-mu dengan standar ATS dan posisi incaranmu." },
            { num: "3", title: "Terima Laporan", desc: "Dapatkan skor, area perbaikan, dan rekomendasi kata kunci." },
          ].map((step) => (
            <div key={step.num} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative text-center">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6 text-xl font-black">
                {step.num}
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl mb-3">{step.title}</h3>
              <p className="text-slate-500 font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FITUR LENGKAP ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-32 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Semua yang Kamu Butuhkan</h2>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
            Didesain khusus untuk pencari kerja yang ingin tampil maksimal di depan rekruter.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Target, title: "Skor ATS Akurat", desc: "Evaluasi 15+ kriteria: panjang, format, hingga action verbs.", color: "text-indigo-600", bg: "bg-indigo-100" },
            { icon: Zap, title: "Hasil Instan", desc: "Tidak ada antrean. Laporan lengkap keluar dalam hitungan detik.", color: "text-amber-600", bg: "bg-amber-100" },
            { icon: FileText, title: "Penyesuaian Posisi", desc: "AI menyesuaikan analisis khusus dengan posisi incaranmu.", color: "text-emerald-600", bg: "bg-emerald-100" },
            { icon: CheckCircle2, title: "Data 100% Aman", desc: "CV-mu diproses privat, tidak disimpan permanen atau dijual.", color: "text-rose-600", bg: "bg-rose-100" },
            { icon: BarChart3, title: "Riwayat Analisis", desc: "Pantau perkembangan perbaikan CV-mu di dashboard khusus.", color: "text-blue-600", bg: "bg-blue-100" },
            { icon: Bot, title: "Laporan Detail", desc: "Breakdown kelebihan, kekurangan, dan saran perbaikan per baris.", color: "text-violet-600", bg: "bg-violet-100" },
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
