import React, { useState } from 'react';

interface IperfBenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IperfBenchmarkModal: React.FC<IperfBenchmarkModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [mode, setMode] = useState<'client' | 'server'>('client');
  const [targetHost, setTargetHost] = useState('192.168.1.50 (fr-nas.local)');
  const [streams, setStreams] = useState(8);
  const [direction, setDirection] = useState('bidir');
  const [duration, setDuration] = useState('10 SEC');
  const [isRunning, setIsRunning] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [exportedPdf, setExportedPdf] = useState(false);

  const [rxRate, setRxRate] = useState(9.42);
  const [txRate, setTxRate] = useState(9.18);

  if (!isOpen) return null;

  const handleRerun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setRxRate(+(9.35 + Math.random() * 0.25).toFixed(2));
      setTxRate(+(9.1 + Math.random() * 0.2).toFixed(2));
      setIsRunning(false);
    }, 1000);
  };

  const handleCopyCli = () => {
    navigator.clipboard.writeText('iperf3 -c 192.168.1.50 -P 8 -t 10 -b 10G');
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handleExport = () => {
    setExportedPdf(true);
    setTimeout(() => setExportedPdf(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#070f19]/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-[1100px] my-auto bg-[#141c27] rounded-xl shadow-[0_12px_48px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-[#dbe3f2] border border-[#2d3541]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#18202b] flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2d3541]">
          <div className="flex items-start md:items-center gap-4">
            <div className="relative w-11 h-11 shrink-0 flex items-center justify-center bg-[#070f19] rounded-lg border border-[#2d3541]">
              <svg className="w-8 h-8 text-[#4cd7f6]" fill="none" stroke="currentColor" viewBox="0 0 64 64">
                <polygon points="32 4, 58 19, 58 45, 32 60, 6 45, 6 19" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <polygon points="32 24, 39 28, 39 36, 32 40, 25 36, 25 28" fill="currentColor" fillOpacity="0.15" strokeWidth="1.8" />
                <line x1="32" y1="12" x2="32" y2="24" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="32" y1="40" x2="32" y2="52" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="32" cy="32" r="2.5" fill="#4cd7f6" />
              </svg>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[#4edea3] rounded-full animate-ping" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-['Geist'] text-base md:text-lg font-bold text-[#dbe3f2]">FR_OS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]" />
                <h2 className="font-['Geist'] text-base font-semibold text-[#dbe3f2]">
                  iPerf3 Wire-Speed & Throughput Benchmark
                </h2>
                <span className="font-mono text-[10px] text-[#869397]">RFC_2544_EBPF_PROBE</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap font-mono text-[11px] mt-0.5">
                <span className="bg-[#232a36] px-2 py-0.5 rounded text-[#4edea3]">
                  RUNNER: iPerf 3.16-eBPF ACCELERATED
                </span>
                <span className="bg-[#232a36] px-2 py-0.5 rounded text-[#4cd7f6]">
                  TEST TYPE: Bi-Directional Dual-Stream (TX/RX)
                </span>
                <span className="text-[#869397]">NAMESPACE: net.diag.iperf3_wire</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center font-mono text-xs">
            <button
              onClick={handleExport}
              className="px-3 py-1 rounded bg-[#232a36] text-[#bcc9cd] hover:text-white transition-colors flex items-center gap-1 border border-[#2d3541]"
            >
              <span className="material-symbols-outlined text-[15px]">file_download</span>
              <span>{exportedPdf ? 'Exported!' : 'JSON'}</span>
            </button>
            <button
              onClick={handleCopyCli}
              className="px-3 py-1 rounded bg-[#232a36] text-[#bcc9cd] hover:text-white transition-colors flex items-center gap-1 border border-[#2d3541]"
            >
              <span className="material-symbols-outlined text-[15px]">terminal</span>
              <span>Raw Log</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded bg-[#232a36] hover:bg-[#93000a]/40 text-[#869397] hover:text-white flex items-center justify-center transition-colors ml-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* SECTION 01: Test Configuration */}
        <div className="p-5 bg-[#141c27] flex flex-col gap-3 border-b border-[#2d3541] font-mono">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="inline-flex bg-[#070f19] p-1 rounded-lg border border-[#2d3541]">
              <button
                onClick={() => setMode('client')}
                className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                  mode === 'client' ? 'bg-[#4cd7f6] text-[#003640] shadow-sm font-bold' : 'text-[#bcc9cd]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">send</span>
                Client Mode (TX/RX Stress)
              </button>
              <button
                onClick={() => setMode('server')}
                className={`px-3 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                  mode === 'server' ? 'bg-[#4cd7f6] text-[#003640] shadow-sm font-bold' : 'text-[#bcc9cd]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">dns</span>
                Server Daemon (Port 5201)
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-[10px]">
              <span className="text-[#869397] uppercase">Presets:</span>
              <button
                onClick={() => setTargetHost('192.168.1.50 (fr-nas.local)')}
                className="px-2 py-0.5 rounded bg-[#232a36] text-[#4cd7f6] border border-[#2d3541]"
              >
                LAN 10G NAS
              </button>
              <button
                onClick={() => setTargetHost('193.188.137.4 (bix-core01)')}
                className="px-2 py-0.5 rounded bg-[#232a36] text-[#bcc9cd] border border-[#2d3541]"
              >
                BIX Core 10G
              </button>
              <button
                onClick={() => setTargetHost('188.40.24.1 (hetzner-ffm)')}
                className="px-2 py-0.5 rounded bg-[#232a36] text-[#bcc9cd] border border-[#2d3541]"
              >
                Hetzner FFM
              </button>
              <button
                onClick={() => setTargetHost('3.120.0.1 (aws-frankfurt)')}
                className="px-2 py-0.5 rounded bg-[#232a36] text-[#bcc9cd] border border-[#2d3541]"
              >
                AWS eu-central-1
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 bg-[#070f19] p-3.5 rounded-lg border border-[#2d3541] items-end text-xs">
            <div className="lg:col-span-4 flex flex-col gap-1">
              <label className="text-[#bcc9cd] uppercase text-[10px] flex justify-between">
                <span>Target Host / IP Address</span>
                <span className="text-[#4edea3]">RESOLVED (10G SFP+)</span>
              </label>
              <div className="flex items-center bg-[#18202b] px-2.5 py-1.5 rounded border border-[#2d3541]">
                <span className="material-symbols-outlined text-[16px] text-[#4cd7f6] mr-1.5">router</span>
                <input
                  type="text"
                  value={targetHost}
                  onChange={(e) => setTargetHost(e.target.value)}
                  className="w-full bg-transparent text-[#dbe3f2] focus:outline-none"
                />
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-1">
              <label className="text-[#bcc9cd] uppercase text-[10px]">Parallel Streams</label>
              <div className="flex items-center bg-[#18202b] px-2.5 py-1.5 rounded justify-between border border-[#2d3541]">
                <span>TCP : -P {streams}</span>
                <span className="text-[10px] px-1 rounded bg-[#232a36] text-[#4cd7f6]">{streams} THREADS</span>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-1">
              <label className="text-[#bcc9cd] uppercase text-[10px]">Directionality</label>
              <div className="flex items-center bg-[#18202b] px-2.5 py-1.5 rounded justify-between border border-[#2d3541]">
                <span className="text-[#4edea3]">Dual (--bidir)</span>
                <span className="material-symbols-outlined text-[15px] text-[#4edea3]">sync_alt</span>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-1">
              <label className="text-[#bcc9cd] uppercase text-[10px]">Interface / Time</label>
              <div className="flex items-center bg-[#18202b] px-2.5 py-1.5 rounded justify-between border border-[#2d3541]">
                <span>eth0 (WAN)</span>
                <span className="text-[10px] text-[#869397]">{duration}</span>
              </div>
            </div>

            <div className="lg:col-span-2">
              <button
                type="button"
                onClick={handleRerun}
                className="w-full py-1.5 px-3 rounded font-semibold bg-[#4cd7f6] hover:bg-[#06b6d4] text-[#003640] transition-all shadow-[0_0_16px_rgba(6,182,212,0.4)] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className={`material-symbols-outlined text-[17px] ${isRunning ? 'animate-spin' : ''}`}>
                  play_arrow
                </span>
                <span>{isRunning ? 'Benchmarking...' : 'Re-Run Benchmark'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 02: KPI METRICS */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#18202b] font-mono">
          <div className="bg-[#141c27] p-3 rounded-lg border border-[#2d3541] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#869397] uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#4edea3]" /> INGRESS / RX THROUGHPUT
              </span>
              <span className="text-[9px] text-[#4edea3] bg-[#4edea3]/10 px-1 py-0.5 rounded font-bold">
                94.2% LINE RATE
              </span>
            </div>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-3xl font-bold text-[#4edea3] tracking-tight">{rxRate}</span>
              <span className="text-xs text-[#bcc9cd]">Gbps</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#869397]">
              <span>Peak: <strong className="text-white">9.68 Gbps</strong></span>
              <span>Total: <strong className="text-white">11.78 GB</strong></span>
            </div>
            <div className="w-full bg-[#232a36] h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#4edea3] h-full rounded-full" style={{ width: '94.2%' }} />
            </div>
          </div>

          <div className="bg-[#141c27] p-3 rounded-lg border border-[#2d3541] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#869397] uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#4cd7f6]" /> EGRESS / TX THROUGHPUT
              </span>
              <span className="text-[9px] text-[#4cd7f6] bg-[#4cd7f6]/10 px-1 py-0.5 rounded font-bold">
                91.8% LINE RATE
              </span>
            </div>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-3xl font-bold text-[#4cd7f6] tracking-tight">{txRate}</span>
              <span className="text-xs text-[#bcc9cd]">Gbps</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#869397]">
              <span>Peak: <strong className="text-white">9.35 Gbps</strong></span>
              <span>Total: <strong className="text-white">11.47 GB</strong></span>
            </div>
            <div className="w-full bg-[#232a36] h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#4cd7f6] h-full rounded-full" style={{ width: '91.8%' }} />
            </div>
          </div>

          <div className="bg-[#141c27] p-3 rounded-lg border border-[#2d3541] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#869397] uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#4edea3]" /> RETRANSMITS & LOSS
              </span>
              <span className="text-[9px] text-[#4edea3] bg-[#4edea3]/10 px-1 py-0.5 rounded font-bold">
                LOSS: 0.000%
              </span>
            </div>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-3xl font-bold text-white tracking-tight">0</span>
              <span className="text-xs text-[#4edea3]">Retransmits</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#869397]">
              <span>Cwnd: <strong className="text-white">1.84 MB</strong></span>
              <span>Algo: <strong className="text-[#4cd7f6]">BBRv3</strong></span>
            </div>
            <div className="w-full bg-[#232a36] h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#4edea3] h-full rounded-full w-full" />
            </div>
          </div>

          <div className="bg-[#141c27] p-3 rounded-lg border border-[#2d3541] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#869397] uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#4cd7f6]" /> CPU OFF-LOAD / XDP
              </span>
              <span className="text-[9px] text-[#4cd7f6] bg-[#4cd7f6]/10 px-1 py-0.5 rounded font-bold">
                AF_XDP 0-COPY
              </span>
            </div>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-3xl font-bold text-white tracking-tight">4.2%</span>
              <span className="text-xs text-[#869397]">Core 0-3 Avg</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#869397]">
              <span>TSO/GRO: <strong className="text-[#4edea3]">ENABLED</strong></span>
              <span>IRQ: <strong className="text-white">Ring #4</strong></span>
            </div>
            <div className="w-full bg-[#232a36] h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#4cd7f6] h-full rounded-full" style={{ width: '4.2%' }} />
            </div>
          </div>
        </div>

        {/* SECTION 03: LIVE OSCILLOSCOPE & BREAKDOWN SPLIT */}
        <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 bg-[#141c27] border-b border-[#2d3541] font-mono">
          {/* Vector Chart */}
          <div className="lg:col-span-7 bg-[#070f19] p-4 rounded-xl border border-[#2d3541] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">equalizer</span>
                <h3 className="font-['Geist'] text-xs font-semibold text-white">Real-Time Wire Throughput Stream</h3>
                <span className="text-[10px] bg-[#18202b] text-[#869397] px-1.5 py-0.5 rounded border border-[#2d3541]">
                  1-SEC INTERVALS
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-[#4edea3]">
                  <span className="w-2 h-2 rounded-full bg-[#4edea3]" /> RX
                </span>
                <span className="flex items-center gap-1 text-[#4cd7f6]">
                  <span className="w-2 h-2 rounded-full bg-[#4cd7f6]" /> TX
                </span>
                <span className="text-[#869397] text-[10px]">10.0G Max</span>
              </div>
            </div>

            <div className="w-full h-44 relative flex flex-col justify-end pt-3 pb-1">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 text-[10px] text-[#869397]">
                <div className="border-b border-[#2d3541] w-full">10.0 Gbps</div>
                <div className="border-b border-[#2d3541] w-full">7.5 Gbps</div>
                <div className="border-b border-[#2d3541] w-full">5.0 Gbps</div>
                <div className="border-b border-[#2d3541] w-full">2.5 Gbps</div>
                <div />
              </div>

              <svg className="w-full h-full z-10" preserveAspectRatio="none" viewBox="0 0 500 120">
                <defs>
                  <linearGradient id="iperfRx" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4edea3" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#4edea3" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="iperfTx" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="6" x2="500" y2="6" stroke="#869397" strokeDasharray="4 4" strokeWidth="1" className="opacity-60" />
                <path d="M 0,120 L 0,14 Q 50,11 100,12 T 200,10 T 300,11 T 400,9 L 500,11 L 500,120 Z" fill="url(#iperfRx)" />
                <polyline points="0,14 50,12 100,11 150,13 200,10 250,12 300,11 350,10 400,9 450,11 500,11" fill="none" stroke="#4edea3" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 0,120 L 0,18 Q 50,16 100,17 T 200,15 T 300,16 T 400,15 L 500,16 L 500,120 Z" fill="url(#iperfTx)" />
                <polyline points="0,18 50,17 100,16 150,18 200,15 250,16 300,16 350,15 400,15 450,16 500,16" fill="none" stroke="#4cd7f6" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[#869397] text-[10px] pt-1 border-t border-[#2d3541]">
              <span>0.00s</span>
              <span>2.00s</span>
              <span>4.00s</span>
              <span>6.00s</span>
              <span>8.00s</span>
              <span className="text-[#4cd7f6] font-bold">10.00s (FINAL)</span>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="lg:col-span-5 bg-[#070f19] p-4 rounded-xl border border-[#2d3541] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-['Geist'] text-xs font-semibold text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#4edea3]">alt_route</span>
                Stream Breakdown (-P 8)
              </h3>
              <span className="text-[10px] text-[#4cd7f6] font-bold">AVG: 1.18 Gbps/th</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead className="text-[#869397] uppercase text-[9px] border-b border-[#2d3541]">
                  <tr>
                    <th className="py-1 px-1">ID</th>
                    <th className="py-1 px-1">Interval</th>
                    <th className="py-1 px-1 text-right">Transfer</th>
                    <th className="py-1 px-1 text-right">Bandwidth</th>
                    <th className="py-1 px-1 text-right">Retr</th>
                    <th className="py-1 px-1 text-right">Cwnd</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#18202b]">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
                    <tr key={id} className="hover:bg-[#141c27] transition-colors">
                      <td className="py-1 px-1 text-[#4cd7f6]">[0{id}]</td>
                      <td className="py-1 px-1 text-[#bcc9cd]">0.0-10.0s</td>
                      <td className="py-1 px-1 text-right text-white">1.47 GB</td>
                      <td className="py-1 px-1 text-right text-[#4edea3] font-semibold">1.18 Gbps</td>
                      <td className="py-1 px-1 text-right text-[#bcc9cd]">0</td>
                      <td className="py-1 px-1 text-right text-[#869397]">240 KB</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION 04: BUFFERBLOAT */}
        <div className="px-6 py-3 bg-[#18202b] flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs border-b border-[#2d3541]">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#869397] uppercase">Unloaded Baseline Ping</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-bold text-white">0.28</span>
                <span className="text-[10px] text-[#869397]">ms</span>
              </div>
            </div>
            <div className="w-px h-6 bg-[#2d3541] hidden md:block" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#869397] uppercase">Loaded Download Latency</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-bold text-[#4edea3]">0.84 ms</span>
                <span className="text-[9px] bg-[#4edea3]/15 text-[#4edea3] px-1 rounded font-bold">+0.56ms (A+)</span>
              </div>
            </div>
            <div className="w-px h-6 bg-[#2d3541] hidden md:block" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#869397] uppercase">Loaded Upload Latency</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-bold text-[#4cd7f6]">1.02 ms</span>
                <span className="text-[9px] bg-[#4cd7f6]/15 text-[#4cd7f6] px-1 rounded font-bold">+0.74ms (A+)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[#bcc9cd] bg-[#141c27] px-3 py-1 rounded border border-[#2d3541] text-[11px]">
            <span className="material-symbols-outlined text-[15px] text-[#4cd7f6]">tune</span>
            <span>AQM: Cake SQM / FQ_CoDel: <strong className="text-white">Bypass Active</strong></span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#070f19] flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3 text-[#bcc9cd] flex-wrap text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
              eBPF Kernel XDP Hook: <strong className="text-white">ACTIVE</strong>
            </span>
            <span className="text-[#869397]">/</span>
            <span>Socket Zero-Copy: <strong className="text-[#4cd7f6]">ENABLED</strong></span>
            <span className="text-[#869397]">/</span>
            <span>Ring Drops: <strong className="text-[#4edea3]">0 pkts</strong></span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyCli}
              className="px-3 py-1.5 rounded bg-[#18202b] hover:bg-[#232a36] text-[#bcc9cd] hover:text-[#4cd7f6] transition-colors border border-[#2d3541] flex items-center gap-1 text-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">content_copy</span>
              <span>{copiedCli ? 'Copied Command!' : 'iperf3 -c 192.168.1.50 -P 8 -t 10 -b 10G'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-[#232a36] text-[#bcc9cd] hover:text-white transition-colors"
            >
              Close Diagnostics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
