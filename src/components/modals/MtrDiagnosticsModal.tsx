import React, { useState, useEffect } from 'react';
import { MTR_HOPS } from '../../data/mockData';
import { MtrHop } from '../../types';

interface MtrDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MtrDiagnosticsModal: React.FC<MtrDiagnosticsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [targetIp, setTargetIp] = useState('1.1.1.1');
  const [isStreaming, setIsStreaming] = useState(true);
  const [copiedReport, setCopiedReport] = useState(false);
  const [capturedPcap, setCapturedPcap] = useState(false);
  const [hops, setHops] = useState<MtrHop[]>(MTR_HOPS);
  const [avgLatency, setAvgLatency] = useState(11.24);

  // Generate 60 oscilloscope bars
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: 60 }, (_, i) => 40 + Math.floor(Math.sin(i * 0.4) * 8 + Math.random() * 6))
  );

  useEffect(() => {
    if (!isOpen || !isStreaming) return;
    const interval = setInterval(() => {
      setBars((prev) => {
        const next = [...prev.slice(1)];
        const newVal = 42 + Math.floor(Math.random() * 10);
        next.push(newVal);
        return next;
      });
      setAvgLatency((prev) => +(11.1 + Math.random() * 0.3).toFixed(2));
    }, 400);

    return () => clearInterval(interval);
  }, [isOpen, isStreaming]);

  if (!isOpen) return null;

  const handleCopyReport = () => {
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleCapturePcap = () => {
    setCapturedPcap(true);
    setTimeout(() => setCapturedPcap(false), 2500);
  };

  const setPreset = (ip: string) => {
    setTargetIp(ip);
    setAvgLatency(+(10.5 + Math.random() * 2).toFixed(2));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#070f19]/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl my-auto bg-[#0c141f] rounded-xl shadow-2xl overflow-hidden flex flex-col border border-[#1e293b] text-[#dbe3f2]">
        {/* Top Decorative Cyan Line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#4cd7f6] to-[#4edea3]/40" />

        {/* Modal Header */}
        <header className="px-6 py-4 bg-[#101926] border-b border-[#1e293b] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-11 h-11 shrink-0 bg-[#070f19] border border-[#1e293b] rounded-lg shadow-inner">
              <svg className="w-8 h-8 text-[#4cd7f6] drop-shadow-[0_0_8px_rgba(76,215,246,0.6)]" fill="none" viewBox="0 0 100 100">
                <polygon points="50,4 90,26 90,74 50,96 10,74 10,26" stroke="#4cd7f6" strokeWidth="3.5" />
                <polygon points="50,33 65,42 65,58 50,67 35,58 35,42" stroke="#dbe3f2" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="3" fill="#4cd7f6" />
                <circle cx="50" cy="18" r="4" fill="#070f19" stroke="#4cd7f6" strokeWidth="2.5" />
                <path d="M50,22 L50,33" stroke="#4cd7f6" strokeWidth="2.5" />
                <circle cx="78" cy="34" r="4" fill="#070f19" stroke="#4cd7f6" strokeWidth="2.5" />
                <circle cx="78" cy="66" r="4" fill="#070f19" stroke="#4cd7f6" strokeWidth="2.5" />
                <circle cx="50" cy="82" r="4" fill="#070f19" stroke="#4cd7f6" strokeWidth="2.5" />
                <circle cx="22" cy="66" r="4" fill="#070f19" stroke="#4cd7f6" strokeWidth="2.5" />
                <circle cx="22" cy="34" r="4" fill="#070f19" stroke="#4cd7f6" strokeWidth="2.5" />
              </svg>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-['Geist'] text-base md:text-lg font-semibold tracking-tight text-white">
                  MTR Real-Time Path & Jitter Diagnostics
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#18202b] text-[#4cd7f6] border border-[#1e293b] font-semibold">
                  RFC_792_EBPF_PROBE
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-400 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-[#4edea3]">
                  <span className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.8)] animate-pulse" />
                  PROBE ENGINE: eBPF ICMP/UDP CYCLIC INJECTOR
                </span>
                <span className="text-slate-600">/</span>
                <span>SAMPLE INTERVAL: <strong className="text-white">250ms</strong></span>
                <span className="text-slate-600">/</span>
                <span>NAMESPACE: <strong className="text-slate-300">net.diag.mtr_jitter</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <div className="flex items-center bg-[#070f19] border border-[#1e293b] rounded-lg p-0.5">
              <button
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono text-slate-300 hover:text-white hover:bg-[#18202b] transition-colors"
              >
                <span className="material-symbols-outlined text-[15px] text-[#4cd7f6]">download</span>
                <span>Export CSV</span>
              </button>
              <div className="w-px h-4 bg-[#1e293b]" />
              <button
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono text-slate-300 hover:text-white hover:bg-[#18202b] transition-colors"
              >
                <span className="material-symbols-outlined text-[15px] text-[#d0bcff]">data_object</span>
                <span>JSON</span>
              </button>
            </div>

            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18202b] border border-[#1e293b] hover:bg-[#232a36] text-slate-200 text-xs font-mono transition-colors"
            >
              <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-[#4edea3] animate-pulse' : 'bg-slate-500'}`} />
              <span>{isStreaming ? 'Pause Stream' : 'Resume Stream'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#18202b] border border-[#1e293b] hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </header>

        {/* Target Probe Parameters Bar */}
        <section className="p-5 bg-[#0e1724] border-b border-[#1e293b] flex flex-col gap-3 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            {/* Destination */}
            <div className="md:col-span-5 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-wider">
                <span>TARGET NODE DESTINATION</span>
                <span className="text-[#4cd7f6] lowercase font-normal">ipv4/ipv6 anycast resolved</span>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#4cd7f6] pointer-events-none">
                  hub
                </span>
                <input
                  type="text"
                  value={targetIp}
                  onChange={(e) => setTargetIp(e.target.value)}
                  className="w-full pl-10 pr-32 py-1.5 rounded-lg bg-[#070f19] border border-[#1e293b] text-slate-100 font-mono text-xs focus:outline-none focus:border-[#4cd7f6]"
                />
                <span className="absolute right-3 text-[11px] text-slate-500 pointer-events-none">
                  {targetIp === '1.1.1.1' ? 'one.one.one.one' : targetIp === '8.8.8.8' ? 'dns.google' : 'anycast'}
                </span>
              </div>
            </div>

            {/* Interface */}
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 uppercase">Egress Interface</label>
              <select className="w-full pl-3 pr-6 py-1.5 rounded-lg bg-[#070f19] border border-[#1e293b] text-slate-200 text-xs focus:outline-none cursor-pointer">
                <option>WAN (eth0 - 10G SFP+)</option>
                <option>LAN (vlan20 - Direct Trunk)</option>
                <option>VPN (wg0 - Encrypted Mesh)</option>
              </select>
            </div>

            {/* Payload */}
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 uppercase">Probe Payload</label>
              <select className="w-full pl-3 pr-6 py-1.5 rounded-lg bg-[#070f19] border border-[#1e293b] text-slate-200 text-xs focus:outline-none cursor-pointer">
                <option>ICMP Echo (RFC 792)</option>
                <option>UDP Synth (Port 33434)</option>
                <option>TCP SYN (Port 443 Handshake)</option>
              </select>
            </div>

            {/* Size */}
            <div className="md:col-span-1 flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 uppercase">Size</label>
              <select className="w-full pl-2 pr-4 py-1.5 rounded-lg bg-[#070f19] border border-[#1e293b] text-slate-200 text-xs focus:outline-none cursor-pointer">
                <option>64 B</option>
                <option>1472 B</option>
                <option>9000 B</option>
              </select>
            </div>

            {/* Restart Trigger */}
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => setAvgLatency(+(10.8 + Math.random()).toFixed(2))}
                className="w-full py-1.5 px-3 rounded-lg bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.35)] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">replay</span>
                <span>Restart Deep Trace</span>
              </button>
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
            <span className="text-slate-500 uppercase text-[10px]">Fast Targets:</span>
            <button
              onClick={() => setPreset('1.1.1.1')}
              className={`px-2.5 py-0.5 rounded border transition-colors ${
                targetIp === '1.1.1.1'
                  ? 'bg-[#18202b] text-[#4cd7f6] border-[#4cd7f6]/50'
                  : 'bg-[#101926] text-slate-400 border-[#1e293b] hover:text-white'
              }`}
            >
              Cloudflare (1.1.1.1)
            </button>
            <button
              onClick={() => setPreset('8.8.8.8')}
              className={`px-2.5 py-0.5 rounded border transition-colors ${
                targetIp === '8.8.8.8'
                  ? 'bg-[#18202b] text-[#4cd7f6] border-[#4cd7f6]/50'
                  : 'bg-[#101926] text-slate-400 border-[#1e293b] hover:text-white'
              }`}
            >
              Google (8.8.8.8)
            </button>
            <button
              onClick={() => setPreset('3.120.0.1')}
              className={`px-2.5 py-0.5 rounded border transition-colors ${
                targetIp === '3.120.0.1'
                  ? 'bg-[#18202b] text-[#4cd7f6] border-[#4cd7f6]/50'
                  : 'bg-[#101926] text-slate-400 border-[#1e293b] hover:text-white'
              }`}
            >
              AWS Frankfurt (eu-central-1)
            </button>
            <button
              onClick={() => setPreset('208.67.222.222')}
              className={`px-2.5 py-0.5 rounded border transition-colors ${
                targetIp === '208.67.222.222'
                  ? 'bg-[#18202b] text-[#4cd7f6] border-[#4cd7f6]/50'
                  : 'bg-[#101926] text-slate-400 border-[#1e293b] hover:text-white'
              }`}
            >
              OpenDNS Core
            </button>
          </div>
        </section>

        {/* Bento KPI Cards */}
        <section className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#0a121c] border-b border-[#1e293b] font-mono">
          <div className="p-3.5 rounded-xl bg-[#141d2b] border border-[#1e293b] flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase">Target Endpoint</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
                ONLINE // STABLE
              </span>
            </div>
            <div className="my-2">
              <div className="text-sm font-bold text-white tracking-tight">AS13335 CLOUDFLARENET</div>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span>🇩🇪 Frankfurt am Main, DE</span>
                <span className="text-slate-600">·</span>
                <span className="text-[#4cd7f6]">8 Hops Ingress</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1e293b]">
              <span>Convergence</span>
              <span className="text-[#4edea3] font-semibold">BGP 100% Sync</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141d2b] border border-[#1e293b] flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase">Packet Loss Rate</span>
              <span className="text-[10px] text-[#4edea3] font-semibold">0 Drops</span>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#4edea3] tracking-tight">0.0%</span>
              <span className="text-xs text-slate-400">/ Zero Drops</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1e293b]">
              <span>Transmitted / Received</span>
              <span className="text-slate-200">1,200 / 1,200 probes</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141d2b] border border-[#1e293b] flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase">Round Trip Time (RTT)</span>
              <span className="text-[10px] text-[#4cd7f6] font-semibold">Jitter ±0.41ms</span>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#4cd7f6] tracking-tight">{avgLatency}</span>
              <span className="text-xs text-slate-400">ms (Avg)</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center text-[10px] bg-[#070f19] p-1 rounded border border-[#1e293b]">
              <div><span className="text-slate-500 block text-[9px]">MIN</span><span className="text-white font-semibold">10.81ms</span></div>
              <div><span className="text-slate-500 block text-[9px]">MAX</span><span className="text-white font-semibold">13.62ms</span></div>
              <div><span className="text-slate-500 block text-[9px]">DEV</span><span className="text-[#4edea3] font-semibold">0.41ms</span></div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141d2b] border border-[#1e293b] flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase">Real-Time QoS Score</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20 font-bold">GRADE A+</span>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#4edea3] tracking-tight">4.48</span>
              <span className="text-xs text-slate-400">/ 5.0 MOS</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1e293b]">
              <span>VoIP / High-Hz Media</span>
              <span className="text-[#4edea3] font-semibold">Optimal Latency</span>
            </div>
          </div>
        </section>

        {/* Hop-by-Hop MTR Table */}
        <section className="p-5 flex flex-col bg-[#0c141f] border-b border-[#1e293b]">
          <div className="flex items-center justify-between mb-3 font-mono">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">alt_route</span>
              <h2 className="font-['Geist'] text-xs md:text-sm font-semibold text-white">
                Path Hop Dispersion & Statistical Latency Distribution
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Real-time socket: <strong className="text-[#4cd7f6]">AF_XDP Zero-Copy</strong></span>
          </div>

          <div className="w-full overflow-x-auto rounded-lg border border-[#1e293b] bg-[#070f19]">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-[#0f172a] text-[10px] text-slate-400 uppercase tracking-wider border-b border-[#1e293b]">
                  <th className="py-2 px-3 w-12 text-center"># Hop</th>
                  <th className="py-2 px-3">Host Descriptor & Resolved IP</th>
                  <th className="py-2 px-3">BGP Routing & Origin ASN</th>
                  <th className="py-2 px-3 text-center">Loss %</th>
                  <th className="py-2 px-3 text-center">Snt/Rcv</th>
                  <th className="py-2 px-3 text-right">Last</th>
                  <th className="py-2 px-3 text-right text-[#4cd7f6]">Avg</th>
                  <th className="py-2 px-3 text-right">Best</th>
                  <th className="py-2 px-3 text-right">Wrst</th>
                  <th className="py-2 px-3 text-right text-[#4edea3]">StDev</th>
                  <th className="py-2 px-3 w-40 text-left">RTT Dispersion Spectrum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {hops.map((hop) => {
                  const isTarget = hop.hopNumber === 8;
                  return (
                    <tr
                      key={hop.hopNumber}
                      className={`transition-colors ${
                        isTarget
                          ? 'bg-[#06b6d4]/10 hover:bg-[#06b6d4]/15 border-l-2 border-[#4cd7f6]'
                          : 'hover:bg-[#141d2b]'
                      }`}
                    >
                      <td className="py-2 px-3 text-center text-[#4cd7f6] font-bold">
                        {hop.hopNumber < 10 ? `0${hop.hopNumber}` : hop.hopNumber}
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${isTarget ? 'bg-[#4cd7f6] animate-pulse' : 'bg-[#4edea3]'}`} />
                          <span className={`font-semibold ${isTarget ? 'text-[#4cd7f6]' : 'text-slate-100'}`}>
                            {hop.ip}
                          </span>
                          <span className="text-slate-500 text-[11px]">{hop.hostname}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-slate-400">
                        {hop.asn} {hop.asnName}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#4edea3]/10 text-[#4edea3]">
                          {hop.lossPercent.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center text-slate-400">
                        {hop.sent}/{hop.received}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-200">{hop.lastMs}ms</td>
                      <td className="py-2 px-3 text-right text-[#4cd7f6] font-bold">{hop.avgMs}ms</td>
                      <td className="py-2 px-3 text-right text-slate-400">{hop.bestMs}ms</td>
                      <td className="py-2 px-3 text-right text-slate-400">{hop.worstMs}ms</td>
                      <td className="py-2 px-3 text-right text-[#4edea3] font-semibold">{hop.stdDevMs}ms</td>
                      <td className="py-2 px-3">
                        <div className="w-full h-2 bg-[#18202b] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isTarget ? 'bg-[#4cd7f6] shadow-[0_0_6px_rgba(76,215,246,0.8)]' : 'bg-[#4edea3]'}`}
                            style={{ width: `${hop.spectrumPercent}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Real-Time Jitter & Latency Variance Oscilloscope */}
        <section className="p-5 bg-[#0e1724] border-b border-[#1e293b] flex flex-col gap-3 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4edea3] text-[18px]">multiline_chart</span>
              <span className="font-['Geist'] text-xs font-semibold text-white">
                Target Latency Drift & Packet Variance Oscilloscope
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#18202b] border border-[#1e293b] text-slate-400">
                Last 60 Seconds @ 250ms
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#4edea3]" />
                <span className="text-slate-400">&lt; 15ms (Nominal)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#eab308]" />
                <span className="text-slate-400">15-40ms (Jitter Alert)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#ef4444]" />
                <span className="text-slate-400">&gt; 40ms / Drop</span>
              </div>
            </div>
          </div>

          {/* 60-Bar Waveform Canvas */}
          <div className="w-full h-32 bg-[#070f19] border border-[#1e293b] rounded-lg p-3 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-x-3 top-3 flex items-center justify-between text-[10px] text-slate-600 pointer-events-none">
              <span>25ms</span>
              <div className="w-full mx-2 h-px bg-[#18202b]" />
            </div>
            <div className="absolute inset-x-3 top-14 flex items-center justify-between text-[10px] text-slate-600 pointer-events-none">
              <span>15ms</span>
              <div className="w-full mx-2 h-px bg-[#18202b]" />
            </div>
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between text-[10px] text-slate-600 pointer-events-none">
              <span>5ms</span>
              <div className="w-full mx-2 h-px bg-[#18202b]" />
            </div>

            <div className="relative z-10 w-full h-full flex items-end justify-between gap-1 pt-3 pb-1">
              {bars.map((heightPercent, idx) => {
                const isLast = idx === bars.length - 1;
                const isWarning = heightPercent > 65;
                const isDrop = heightPercent > 85;
                const color = isLast
                  ? 'bg-[#4cd7f6] shadow-[0_0_8px_rgba(76,215,246,0.9)] animate-pulse'
                  : isDrop
                  ? 'bg-[#ef4444]'
                  : isWarning
                  ? 'bg-[#eab308]'
                  : 'bg-[#4edea3]/75 hover:bg-[#4edea3]';

                return (
                  <div
                    key={idx}
                    className={`flex-1 rounded-t-sm transition-all ${color}`}
                    style={{ height: `${heightPercent}%` }}
                    title={`Probe #${idx}: ${(heightPercent * 0.25).toFixed(1)}ms`}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-1">
            <span>Hardware Timestamping: <strong className="text-white">SO_TIMESTAMPING (NIC Level)</strong></span>
            <span>eBPF Subsystem: <strong className="text-[#4cd7f6]">AF_XDP (XDP_DRV Mode Zero-Copy)</strong></span>
          </div>
        </section>

        {/* Modal Telemetry Footer */}
        <footer className="px-6 py-4 bg-[#101926] flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3 text-slate-400 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.7)]" />
              <span>Continuous probe active (250ms cadence)</span>
            </div>
            <span className="text-slate-600">|</span>
            <span>Kernel Drops: <strong className="text-[#4edea3]">0</strong></span>
            <span className="text-slate-600">|</span>
            <span>Ring Buffer Overruns: <strong className="text-[#4edea3]">0</strong></span>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={handleCopyReport}
              className="px-3.5 py-1.5 rounded-lg bg-[#18202b] border border-[#1e293b] hover:bg-[#232a36] text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px] text-slate-400">
                {copiedReport ? 'check' : 'content_copy'}
              </span>
              <span>{copiedReport ? 'Copied to Clipboard!' : 'Copy MTR Report'}</span>
            </button>
            <button
              onClick={handleCapturePcap}
              className="px-3.5 py-1.5 rounded-lg bg-[#141d2b] border border-[#4cd7f6]/40 hover:bg-[#18202b] text-[#4cd7f6] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">
                {capturedPcap ? 'check' : 'capture'}
              </span>
              <span>{capturedPcap ? 'Saved: trace.pcap' : 'Capture Extended PCAP'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-[#070f19] border border-[#1e293b] hover:bg-[#18202b] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Close Diagnostics
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
