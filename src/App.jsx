import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { getDummyResult } from "./data/dummyScanResults";

const NAV = [
  { label: "Dashboard", href: "#" },
  { label: "Reports", href: "#" },
  { label: "About", href: "#" },
];

function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-b border-slate-700/50 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            <span className="text-cyan-400">Link</span>Sentinel
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            AI-Powered Link Infrastructure Auditor
          </p>
        </div>
        <nav className="flex gap-6">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-slate-400 hover:text-cyan-400 transition-colors text-sm font-medium"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}

function ScanSection({ onScan, isLoading }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) onScan(url.trim());
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="max-w-3xl mx-auto px-4 py-10"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter suspicious URL here..."
            className="w-full px-5 py-4 rounded-xl bg-slate-800/80 border border-slate-600/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
            disabled={isLoading}
          />
        </div>
        <motion.button
          type="submit"
          disabled={isLoading || !url.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-xl font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 glow-blue disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyan-400 transition-all"
        >
          {isLoading ? "Scanning..." : "Scan Link"}
        </motion.button>
      </form>
    </motion.section>
  );
}

function ResultCard({ result }) {
  const isSafe = result.status === "SAFE";
  const scoreColor = result.riskScore <= 30 ? "text-emerald-400" : result.riskScore <= 60 ? "text-amber-400" : "text-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="max-w-3xl mx-auto px-4 mb-8"
    >
      <div className="rounded-2xl border border-slate-600/30 bg-slate-800/40 backdrop-blur-xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <RiskCircle score={result.riskScore} scoreColor={scoreColor} />
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Risk Score</p>
              <p className={`text-2xl font-bold ${scoreColor}`}>{result.riskScore}%</p>
            </div>
          </div>
          <StatusBadge isSafe={isSafe} />
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <InfoRow label="Domain Age" value={result.domainAge} />
          <InfoRow label="SSL Certificate" value={result.sslStatus} />
          <InfoRow label="Cookie Behavior" value={result.cookieBehavior} />
          <InfoRow label="Hosting Location" value={result.hostingLocation} />
        </div>
      </div>
    </motion.div>
  );
}

function RiskCircle({ score, scoreColor }) {
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const strokeDash = (score / 100) * circumference;

  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="rgba(51, 65, 85, 0.8)"
          strokeWidth="8"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className={scoreColor}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - strokeDash }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-200">
        {score}
      </span>
    </div>
  );
}

function StatusBadge({ isSafe }) {
  return (
    <motion.span
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${
        isSafe
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
          : "bg-red-500/20 text-red-400 border border-red-500/40"
      }`}
    >
      {isSafe ? "Safe" : "Malicious"}
    </motion.span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-slate-500 uppercase text-xs tracking-wider">{label}</span>
      <span className="text-slate-200">{value}</span>
    </div>
  );
}

const BREAKDOWN_KEYS = [
  { key: "lexicalRisk", label: "Lexical Risk", color: "#38bdf8" },
  { key: "domainTrust", label: "Domain Trust", color: "#4ade80" },
  { key: "sslIntegrity", label: "SSL Integrity", color: "#a78bfa" },
  { key: "behavioralAnalysis", label: "Behavioral", color: "#f87171" },
];

function RiskBreakdown({ result }) {
  const radarData = BREAKDOWN_KEYS.map(({ key, label }) => ({
    subject: label,
    value: result.breakdown[key],
    fullMark: 100,
  }));

  const barData = BREAKDOWN_KEYS.map(({ key, label, color }) => ({
    name: label,
    value: result.breakdown[key],
    color,
  }));

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="max-w-4xl mx-auto px-4 pb-16"
    >
      <h2 className="text-lg font-semibold text-slate-300 mb-4">Risk Breakdown</h2>
      <div className="rounded-2xl border border-slate-600/30 bg-slate-800/40 backdrop-blur-xl p-6">
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <XAxis type="number" domain={[0, 100]} stroke="#64748b" />
              <YAxis type="category" dataKey="name" width={100} stroke="#64748b" tick={{ fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={32}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#475569" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#64748b" }} />
              <Radar name="Score" dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.section>
  );
}

export default function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = (url) => {
    setIsLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(getDummyResult(url));
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Header />
      <main className="pt-4">
        <ScanSection onScan={handleScan} isLoading={isLoading} />
        <AnimatePresence mode="wait">
          {result && (
            <>
              <ResultCard result={result} key="card" />
              <RiskBreakdown result={result} key="chart" />
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
