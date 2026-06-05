"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud, FileText, Loader2, ArrowRight, Check,
  ChevronRight, User, Clock, CheckCircle2, TrendingUp,
  X, Briefcase, BarChart3, ArrowUpRight, Sparkles
} from "lucide-react";

export default function AppView({ onBack }: { onBack: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [jobPosition, setJobPosition] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [history, setHistory] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>("");

  const fetchHistory = useCallback(async (uid: string) => {
    if (!uid) return;
    try {
      const res = await fetch(`/api/history?userId=${uid}`);
      const data = await res.json();
      if (Array.isArray(data)) setHistory(data);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    let storedUserId = localStorage.getItem("dilirik_userId");
    if (!storedUserId) {
      storedUserId = "user_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("dilirik_userId", storedUserId);
    }
    setUserId(storedUserId);
    fetchHistory(storedUserId);
  }, [fetchHistory]);

  useEffect(() => {
    if (result) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [result]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    multiple: false,
    useFsAccessApi: false,
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setErrorMsg("");
    setLoadingStep(1);
    setResult(null);

    const timer1 = setTimeout(() => setLoadingStep(2), 2500);
    const timer2 = setTimeout(() => setLoadingStep(3), 6000);

    try {
      const formData = new FormData();
      formData.append("cv", file);
      if (jobPosition.trim()) formData.append("jobPosition", jobPosition.trim());
      if (userId) formData.append("userId", userId);
      const response = await fetch("/api/analyze", { method: "POST", body: formData });
      const responseText = await response.text();
      if (responseText.startsWith("<!DOCTYPE") || responseText.startsWith("<html")) {
        const match = responseText.match(/<title>([\s\S]*?)<\/title>/);
        throw new Error(`Server error: "${match ? match[1] : "Unknown"}". Silakan coba lagi.`);
      }
      const data = JSON.parse(responseText);
      setResult(data);
      fetchHistory(userId);
    } catch (error: any) {
      setErrorMsg(error.message || "Terjadi kesalahan yang tidak terduga.");
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const clearForm = () => { setFile(null); setResult(null); setJobPosition(""); setErrorMsg(""); };

  const avgScore = history.length > 0
    ? Math.round(history.reduce((a, c) => a + (c.score || 0), 0) / history.length)
    : 0;

  const scoreColor = (s: number) =>
    s >= 80 ? "#3DAB75" : s >= 60 ? "#E8A838" : "#E05252";

  const tabs = [
    { id: "overview", label: "Overview", Icon: TrendingUp },
    { id: "details", label: "Details", Icon: FileText },
    { id: "insights", label: "Insights", Icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">

      {/* NAV */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-[1.1rem] tracking-tight">
              Dilirik
            </span>
          </div>
          <button
            onClick={onBack}
            className="group flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
            Beranda
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10 space-y-8">

        {/* UPLOAD CARD */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="px-8 py-6 border-b border-slate-50">
            <h2 className="font-extrabold text-lg text-slate-900">Analisis Baru</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Unggah CV dan tentukan posisi pekerjaan yang dituju.
            </p>
          </div>

          <div className="p-8 flex flex-col gap-6">
            
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[220px] ${
                isDragActive
                  ? "border-indigo-400 bg-indigo-50 scale-[1.01]"
                  : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50"
              }`}
            >
              <input {...getInputProps()} disabled={loading} />
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-5">
                <UploadCloud className={`w-8 h-8 ${isDragActive ? "text-indigo-600 animate-bounce" : "text-indigo-500"}`} />
              </div>
              
              {isDragActive ? (
                <h3 className="text-lg font-extrabold text-indigo-600 mb-2">Lepaskan file di sini...</h3>
              ) : (
                <>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                    Seret & lepas dokumen CV-mu ke sini
                  </h3>
                  <p className="text-sm font-medium text-slate-500 mb-5">
                    atau <span className="text-indigo-600 font-bold hover:underline decoration-indigo-300 underline-offset-4">Jelajahi File</span> dari komputermu
                  </p>
                </>
              )}
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white shadow-sm border border-slate-100 text-[0.7rem] font-bold text-slate-500 uppercase tracking-widest">
                PDF / DOCX <span className="w-1 h-1 bg-slate-300 rounded-full" /> MAKS 5MB
              </div>
            </div>

            {/* Input posisi */}
            <div className="flex flex-col gap-2 mt-2">
              <label htmlFor="jobPosition" className="text-sm font-bold text-slate-700">
                Posisi Pekerjaan
                <span className="text-slate-400 font-medium normal-case ml-1.5">(opsional)</span>
              </label>
              <input
                id="jobPosition"
                type="text"
                placeholder="mis. Frontend Developer, UI/UX Designer"
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
                disabled={loading}
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
              />
              <p className="text-xs text-slate-500 font-medium mt-1">
                Membantu AI memberikan saran yang lebih relevan dengan peran yang kamu lamar.
              </p>
            </div>

          </div>

          {/* Action bar */}
          {file && (
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-[300px]">{file.name}</p>
                    <p className="text-xs text-slate-500 font-medium">Siap dianalisis</p>
                  </div>
                  {!loading && (
                    <button
                      onClick={() => setFile(null)}
                      className="ml-2 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-8 py-3.5 rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-600/20 disabled:opacity-100 disabled:bg-slate-100 disabled:text-slate-500 disabled:shadow-none"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                      <span className="text-slate-600">
                        {loadingStep === 1 && "Membaca teks..."}
                        {loadingStep === 2 && "Menganalisis..."}
                        {loadingStep === 3 && "Menyusun laporan..."}
                      </span>
                    </div>
                  ) : (
                    <><span>Mulai Analisis</span><ChevronRight className="w-5 h-5" /></>
                  )}
                </button>
              </div>
              
              {/* Error Message Inline */}
              {errorMsg && (
                <div className="p-3 mt-1 bg-[#E05252]/10 border border-[#E05252]/20 rounded-xl flex items-start gap-2.5 animate-in fade-in duration-300">
                  <div className="w-5 h-5 rounded-full bg-[#E05252]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-[#E05252]" />
                  </div>
                  <p className="text-[0.8rem] text-[#E05252] font-semibold leading-relaxed">{errorMsg}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total CV", value: history.length, Icon: FileText, color: "text-indigo-600", bg: "bg-indigo-100" },
            { label: "Dianalisis", value: history.length, Icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
            { label: "Dalam Proses", value: 0, Icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
            { label: "Rata-rata Skor", value: `${avgScore}%`, Icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-100" },
          ].map(({ label, value, Icon, color, bg }) => (
            <div key={label} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-500">{label}</span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        {/* HISTORY TABLE */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-slate-50">
            <h3 className="font-extrabold text-lg text-slate-900">Riwayat Analisis</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Kandidat", "Skor ATS", "Posisi", "Tanggal", ""].map((h) => (
                    <th key={h} className="px-8 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                          <FileText className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-lg font-extrabold text-slate-900">Ruang kerja masih kosong</p>
                        <p className="text-sm text-slate-500 font-medium max-w-xs">
                          Unggah CV pertamamu di atas untuk melihat riwayat evaluasi ATS di sini.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  history.map((item) => (
                      <tr
                      key={item.id}
                      onClick={() => { setResult(item); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-indigo-600" />
                          </div>
                          <span className="font-bold text-slate-900 truncate max-w-[200px]">{item.fileName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-extrabold text-base" style={{ color: scoreColor(item.score) }}>
                          {item.score}%
                        </span>
                      </td>
                      <td className="px-8 py-5 text-slate-500 font-medium truncate max-w-[160px]">
                        {item.jobPosition || "—"}
                      </td>
                      <td className="px-8 py-5 text-slate-400 font-medium whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="inline-flex items-center gap-1.5 text-indigo-600 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg group-hover:bg-indigo-100 transition-all">
                          Lihat <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL RESULT */}
      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FAFAFA] rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">

            {/* Modal header */}
            <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="font-extrabold text-lg text-slate-900 truncate max-w-[300px]">{result.fileName}</p>
                  <p className="text-sm text-slate-500 font-medium">
                    {result.createdAt ? new Date(result.createdAt).toLocaleDateString("id-ID") : new Date().toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
              <button
                onClick={clearForm}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-[#1A1A1A]/8 px-7">
              {tabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 py-4 px-1 mr-6 text-[0.8rem] font-bold border-b-2 transition-all ${
                    activeTab === id
                      ? "border-[#5B5BD6] text-[#5B5BD6]"
                      : "border-transparent text-[#9B9B9B] hover:text-[#1A1A1A]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto p-7 bg-[#F5F4EF]/40 space-y-5">

              {activeTab === "overview" && (
                <div className="flex flex-col items-center py-8">
                  <div
                    className="w-36 h-36 rounded-full flex items-center justify-center mb-4"
                    style={{ border: `8px solid ${scoreColor(result.score)}20`, background: `${scoreColor(result.score)}08` }}
                  >
                    <div className="text-center">
                      <p className="text-[3rem] font-black leading-none" style={{ color: scoreColor(result.score) }}>
                        {result.score}
                      </p>
                      <p className="text-[0.65rem] font-black text-[#9B9B9B] tracking-[0.08em] uppercase">Score</p>
                    </div>
                  </div>
                  <p className="text-[0.88rem] text-[#6B6B6B] font-medium text-center max-w-xs leading-relaxed">
                    CV ini memiliki skor kelayakan ATS <strong style={{ color: scoreColor(result.score) }}>{result.score}%</strong> untuk posisi{" "}
                    <strong className="text-[#1A1A1A]">{result.jobPosition || "yang dituju"}</strong>.
                  </p>
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-5">
                  {/* Personal Info */}
                  <div className="bg-white border border-[#1A1A1A]/8 rounded-xl p-6">
                    <h3 className="font-black text-[0.82rem] tracking-[0.06em] uppercase text-[#9B9B9B] mb-4 flex items-center gap-2">
                      <User className="w-3.5 h-3.5" /> Personal
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Nama", val: result.details?.name },
                        { label: "Email", val: result.details?.email },
                      ].map(({ label, val }) => (
                        <div key={label}>
                          <p className="text-[0.72rem] text-[#9B9B9B] font-medium mb-0.5">{label}</p>
                          <p className="font-bold text-[0.88rem] text-[#1A1A1A]">{val || "—"}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="bg-white border border-[#1A1A1A]/8 rounded-xl p-6">
                    <h3 className="font-black text-[0.82rem] tracking-[0.06em] uppercase text-[#9B9B9B] mb-4 flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5" /> Pengalaman
                    </h3>
                    {result.details?.experience?.length > 0 ? (
                      <div className="space-y-4">
                        {result.details.experience.map((exp: any, i: number) => (
                          <div key={i} className={`${i < result.details.experience.length - 1 ? "pb-4 border-b border-[#1A1A1A]/6" : ""}`}>
                            <div className="flex items-start justify-between gap-4 mb-1">
                              <p className="font-black text-[0.9rem] text-[#1A1A1A]">{exp.role}</p>
                              <span className="text-[0.72rem] text-[#9B9B9B] font-medium shrink-0">{exp.duration}</span>
                            </div>
                            <p className="text-[0.8rem] text-[#6B6B6B] font-medium mb-2">{exp.company}</p>
                            {exp.skills?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {exp.skills.map((s: string, j: number) => (
                                  <span key={j} className="text-[0.7rem] font-bold px-2.5 py-1 bg-[#5B5BD6]/8 text-[#5B5BD6] rounded-full">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[0.82rem] text-[#9B9B9B] italic">Data belum tersedia.</p>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="bg-white border border-[#1A1A1A]/8 rounded-xl p-6">
                    <h3 className="font-black text-[0.82rem] tracking-[0.06em] uppercase text-[#9B9B9B] mb-4 flex items-center gap-2">
                      <BarChart3 className="w-3.5 h-3.5" /> Skills
                    </h3>
                    {result.details?.skills?.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {result.details.skills.map((s: string, i: number) => (
                          <span key={i} className="text-[0.72rem] font-bold px-2.5 py-1 bg-[#E8A838]/10 text-[#B07A10] rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[0.82rem] text-[#9B9B9B] italic">Tidak tersedia.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "insights" && (
                <div className="space-y-5">
                  {[
                    {
                      label: "Kelebihan",
                      items: result.kelebihan,
                      color: "#3DAB75",
                      Icon: CheckCircle2,
                      empty: "Tidak ada kelebihan spesifik.",
                    },
                    {
                      label: "Area Perbaikan",
                      items: result.kekurangan,
                      color: "#E05252",
                      Icon: X,
                      empty: "Hampir tidak ada celah di CV kamu.",
                    },
                    {
                      label: "Rekomendasi",
                      items: result.saran,
                      color: "#5B5BD6",
                      Icon: ArrowRight,
                      empty: "Tidak ada rekomendasi tambahan.",
                    },
                  ].map(({ label, items, color, Icon, empty }) => (
                    <div key={label} className="bg-white border border-[#1A1A1A]/8 rounded-xl p-6">
                      <h3 className="font-black text-[0.82rem] tracking-[0.06em] uppercase mb-4" style={{ color }}>
                        {label}
                      </h3>
                      {items?.length > 0 ? (
                        <ul className="space-y-3">
                          {items.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-[0.88rem] text-[#1A1A1A] font-medium">
                              <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color }} />
                              <span className="leading-relaxed text-[#4B4B4B]">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[0.82rem] text-[#9B9B9B] italic">{empty}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
