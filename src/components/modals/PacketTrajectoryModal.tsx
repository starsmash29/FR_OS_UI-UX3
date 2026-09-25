import React, { useState } from 'react';

interface PacketTrajectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PacketTrajectoryModal: React.FC<PacketTrajectoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [targetIp, setTargetIp] = useState('185.220.101.5');
  const [direction, setDirection] = useState<'wan' | 'lan' | 'wg'>('wan');
  const [protocol, setProtocol] = useState('TCP');
  const [port, setPort] = useState('443');
  const [isSimulating, setIsSimulating] = useState(false);
  const [verdictStatus, setVerdictStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const isTor = targetIp.includes('185.220.101');
  const isCloudflare = targetIp.includes('1.1.1.1');
  const isBudapest = targetIp.includes('195.228.240');
  const isRu = targetIp.includes('92.38.169');

  const handleRunSim = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setVerdictStatus('simulation_done');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#070f19]/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-[1360px] bg-[#141c27] rounded-xl shadow-2xl overflow-hidden flex flex-col border border-[#2d3541] max-h-[94vh] text-[#dbe3f2]">
        {/* Top Status Hairline */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#4cd7f6] to-transparent opacity-80" />

        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#18202b] flex flex-wrap items-center justify-between gap-4 border-b border-[#2d3541]">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-[#232a36] border border-[#2d3541] shadow-md">
              <svg className="w-7 h-7 text-[#4cd7f6]" fill="none" viewBox="0 0 40 40">
                <polygon points="20,3 36,11.5 36,28.5 20,37 4,28.5 4,11.5" stroke="currentColor" strokeWidth="2" />
                <circle cx="20" cy="20" r="4.5" fill="#4cd7f6" />
                <path d="M20 7 V14 M20 26 V33 M8.5 13.5 L14.5 17 M25.5 23 L31.5 26.5" stroke="#4cd7f6" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4edea3]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-['Geist'] text-base md:text-lg font-semibold tracking-tight text-[#dbe3f2]">
                  IP Geo-Lookup & Packet Trajectory Simulator
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#232a36] text-[#bcc9cd] border border-[#2d3541]">
                  // EBPF_SYNTHETIC_PROBE_V4_V6
                </span>
              </div>
              <div className="flex items-center gap-3 mt-0.5 flex-wrap font-mono text-[11px]">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#4cd7f6]/10 text-[#4cd7f6]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse" />
                  <span>MAXMIND GEOIP2 PRECISION ASN ENGINE</span>
                </div>
                <div className="flex items-center gap-1 text-[#bcc9cd]">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  <span>PROBE LATENCY:</span>
                  <span className="text-[#4edea3] font-bold">0.003ms</span>
                </div>
                <span className="text-[#869397]">•</span>
                <span className="text-[#869397]">
                  NAMESPACE: <strong className="text-[#acedff]">diagnostics.packet_sim</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTargetIp('185.220.101.5')}
              className="px-3 py-1 rounded bg-[#232a36] hover:bg-[#323a46] text-[#bcc9cd] hover:text-white font-mono text-xs transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">refresh</span>
              <span>RESET</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#232a36] hover:bg-[#93000a]/50 text-[#bcc9cd] hover:text-white flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-175px)] bg-[#0c141f]">
          {/* SECTION 01: Synthetic Packet Parameters */}
          <div className="bg-[#141c27] rounded-xl p-4 flex flex-col gap-3 border border-[#2d3541]">
            <div className="flex items-center justify-between flex-wrap gap-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#4cd7f6] font-bold uppercase tracking-wider">
                  01 // TARGET IP & SYNTHETIC PACKET PARAMETERS
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#232a36] text-[#bcc9cd] text-[10px]">
                  XDP_TX_INJECT
                </span>
              </div>

              {/* Quick Probes */}
              <div className="flex items-center gap-1 flex-wrap text-[11px]">
                <span className="text-[#869397]">Quick Probes:</span>
                <button
                  type="button"
                  onClick={() => setTargetIp('185.220.101.5')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    isTor ? 'bg-[#4cd7f6] text-[#003640] font-bold' : 'bg-[#18202b] text-[#bcc9cd] hover:text-white'
                  }`}
                >
                  Tor Exit Node (185.220.101.5)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetIp('1.1.1.1')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    isCloudflare ? 'bg-[#4cd7f6] text-[#003640] font-bold' : 'bg-[#18202b] text-[#bcc9cd] hover:text-white'
                  }`}
                >
                  Cloudflare DNS (1.1.1.1)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetIp('195.228.240.1')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    isBudapest ? 'bg-[#4cd7f6] text-[#003640] font-bold' : 'bg-[#18202b] text-[#bcc9cd] hover:text-white'
                  }`}
                >
                  Budapest ISP (195.228.240.1)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetIp('92.38.169.4')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    isRu ? 'bg-[#4cd7f6] text-[#003640] font-bold' : 'bg-[#18202b] text-[#bcc9cd] hover:text-white'
                  }`}
                >
                  RU Scanner (92.38.169.4)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end font-mono">
              <div className="md:col-span-4 flex flex-col gap-1">
                <label className="text-xs text-[#bcc9cd] uppercase flex items-center justify-between">
                  <span>Target IPv4 / IPv6 / CIDR</span>
                  <span className="text-[#4cd7f6] text-[10px]">L3_SRC_MATCH</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[#869397] text-[18px]">
                    travel_explore
                  </span>
                  <input
                    type="text"
                    value={targetIp}
                    onChange={(e) => setTargetIp(e.target.value)}
                    className="w-full bg-[#070f19] text-[#dbe3f2] font-mono text-xs pl-10 pr-3 py-2 rounded-lg border border-[#2d3541] focus:outline-none focus:border-[#4cd7f6]"
                  />
                </div>
              </div>

              <div className="md:col-span-3 flex flex-col gap-1">
                <span className="text-xs text-[#bcc9cd] uppercase">Direction & Ingress Port</span>
                <div className="grid grid-cols-3 gap-1 bg-[#070f19] p-1 rounded-lg border border-[#2d3541] text-xs text-center">
                  {(['wan', 'lan', 'wg'] as const).map((dir) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => setDirection(dir)}
                      className={`py-1 rounded font-semibold transition-colors ${
                        direction === dir
                          ? 'bg-[#06b6d4] text-[#00424f]'
                          : 'text-[#bcc9cd] hover:text-white'
                      }`}
                    >
                      {dir === 'wan' ? 'WAN (eth0)' : dir === 'lan' ? 'LAN (vlan20)' : 'WG (wg0)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-xs text-[#bcc9cd] uppercase">Protocol</label>
                <select
                  value={protocol}
                  onChange={(e) => setProtocol(e.target.value)}
                  className="bg-[#070f19] text-[#dbe3f2] text-xs px-3 py-2 rounded-lg border border-[#2d3541] outline-none cursor-pointer"
                >
                  <option>TCP</option>
                  <option>UDP</option>
                  <option>ICMP (Echo)</option>
                  <option>SCTP</option>
                </select>
              </div>

              <div className="md:col-span-1 flex flex-col gap-1">
                <label className="text-xs text-[#bcc9cd] uppercase">Port</label>
                <input
                  type="text"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="w-full bg-[#070f19] text-[#dbe3f2] text-xs px-2 py-2 rounded-lg border border-[#2d3541] text-center outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={handleRunSim}
                  className="w-full py-2 px-3 rounded-lg bg-[#4cd7f6] hover:bg-[#06b6d4] text-[#003640] font-['Geist'] text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-[18px] ${isSimulating ? 'animate-spin' : ''}`}>
                    {isSimulating ? 'refresh' : 'play_arrow'}
                  </span>
                  <span>{isSimulating ? 'Probing...' : 'Run Simulation'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 02: Geolocation & ASN Dossier */}
          <div className="space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#4cd7f6] font-bold uppercase tracking-wider">
                02 // GEOLOCATION & ASN THREAT INTELLIGENCE DOSSIER
              </span>
              <span className="text-[#bcc9cd] text-[11px]">BGP PREFIX: 185.220.101.0/24</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Details & Tactical Reticle */}
              <div className="lg:col-span-7 bg-[#141c27] rounded-xl p-4 border border-[#2d3541] flex flex-col justify-between gap-3 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#869397] uppercase">Country / City</span>
                      <span className="text-sm font-semibold text-white mt-0.5 flex items-center gap-1.5">
                        <span>🇩🇪 Germany (DE)</span>
                        <span className="text-[#869397]">/</span>
                        <span className="text-[#4cd7f6]">Frankfurt am Main</span>
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#869397] uppercase">Autonomous System & Org</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-[#18202b] text-[#4cd7f6] font-bold text-xs border border-[#2d3541]">
                          AS208323
                        </span>
                        <span className="text-xs text-[#dbe3f2]">Zwiebelfreunde e.V.</span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#869397] uppercase">Carrier Class & Routing Type</span>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-[#18202b] text-xs text-[#dbe3f2] border border-[#2d3541]">
                          Data Center / Hosting
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#93000a]/30 text-[#ffb4ab] text-xs font-semibold">
                          Anonymous Proxy
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#869397] uppercase">Temporal Profile</span>
                      <span className="text-xs text-[#bcc9cd] mt-0.5">
                        Europe/Berlin (UTC+01:00) • Anycast: NO
                      </span>
                    </div>
                  </div>

                  {/* Tactical Reticle */}
                  <div className="relative bg-[#070f19] rounded-lg p-3 flex flex-col justify-between overflow-hidden min-h-[170px] border border-[#2d3541]">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                      <div className="w-28 h-28 rounded-full border border-[#4cd7f6]/30 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full border border-[#4cd7f6]/60 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-ping" />
                        </div>
                      </div>
                      <div className="absolute w-full h-[1px] bg-[#4cd7f6]/20" />
                      <div className="absolute h-full w-[1px] bg-[#4cd7f6]/20" />
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-[#141c27] text-[#4cd7f6] border border-[#2d3541]">
                        LAT: 50.1109° N
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#141c27] text-[#4cd7f6] border border-[#2d3541]">
                        LON: 8.6821° E
                      </span>
                    </div>

                    <div className="relative z-10 flex items-end justify-between mt-auto">
                      <div className="bg-[#141c27]/90 p-1 rounded border border-[#2d3541]">
                        <span className="text-[9px] text-[#869397] block uppercase">Accuracy Radius</span>
                        <span className="text-xs font-bold text-[#4edea3]">&lt; 5 Kilometers</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#4cd7f6] text-[#003640] font-bold text-[10px]">
                        GEO_LPM_HIT
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 bg-[#18202b] -mx-4 -mb-4 px-4 py-2 border-t border-[#2d3541] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[15px] text-[#869397]">dns</span>
                    <span className="text-[#869397] uppercase text-[10px]">PTR / rDNS:</span>
                    <span className="text-white font-semibold">tor-exit-frankfurt-01.torservers.net</span>
                  </div>
                  <span className="text-[#4edea3] flex items-center gap-1 text-[11px]">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    DNSSEC VALIDATED
                  </span>
                </div>
              </div>

              {/* Right: Threat Verdict */}
              <div className="lg:col-span-5 bg-[#141c27] rounded-xl p-4 border border-[#2d3541] flex flex-col justify-between gap-3 shadow-md">
                <div className="p-3 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#ffb4ab] text-[26px] animate-pulse">
                      crisis_alert
                    </span>
                    <div>
                      <span className="text-[10px] text-[#ffb4ab] uppercase font-bold block">
                        SECURITY VERDICT
                      </span>
                      <span className="text-xs font-bold text-[#dbe3f2]">
                        KNOWN TOR EXIT NODE // HIGH RISK
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-[#ffb4ab] text-[#690005] text-[10px] font-bold">
                    DROP TARGET
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#070f19] p-3 rounded-lg border border-[#2d3541] flex flex-col justify-between">
                    <span className="text-[10px] text-[#869397] uppercase">AbuseIPDB Confidence</span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-2xl font-bold text-[#ffb4ab]">98%</span>
                      <span className="text-[10px] text-[#869397]">4,120 reps</span>
                    </div>
                    <div className="w-full bg-[#2d3541] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#ffb4ab] h-full rounded-full" style={{ width: '98%' }} />
                    </div>
                  </div>

                  <div className="bg-[#070f19] p-3 rounded-lg border border-[#2d3541] flex flex-col justify-between">
                    <span className="text-[10px] text-[#869397] uppercase">OTX / CrowdSec Pulse</span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-sm font-bold text-[#ffb4ab]">MALICIOUS</span>
                      <span className="text-[10px] text-[#869397]">14 Pulses</span>
                    </div>
                    <div className="w-full bg-[#2d3541] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#ffb4ab] h-full rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-[#070f19] p-2.5 rounded-lg border border-[#2d3541] flex flex-col gap-1">
                  <span className="text-[10px] text-[#869397] uppercase">Active Threat Category</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping" />
                    <span className="text-xs text-white font-semibold">
                      CobaltStrike C2 Beacon & Darknet SOCKS5 Relay
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 03: STEP-BY-STEP EBPF XDP TRAJECTORY PIPELINE */}
          <div className="space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#4cd7f6] font-bold uppercase tracking-wider">
                03 // STEP-BY-STEP EBPF XDP TRAJECTORY PIPELINE (ZERO-COPY SIMULATOR)
              </span>
              <span className="text-[#4edea3] text-[11px]">KERNEL HOOK: BPF_PROG_TYPE_XDP</span>
            </div>

            <div className="bg-[#141c27] rounded-xl p-4 border border-[#2d3541] flex flex-col gap-3 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {/* Stage 1 */}
                <div className="bg-[#070f19] p-3 rounded-lg border border-[#2d3541] flex flex-col justify-between gap-1 shadow-sm">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#869397]">STAGE 01</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#4edea3]/10 text-[#4edea3] font-bold">RX OK</span>
                  </div>
                  <div className="flex items-center gap-1.5 my-1">
                    <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
                    <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">NIC Ring Buffer</span>
                  </div>
                  <span className="text-[10px] text-[#869397]">Driver: igb (eth0)</span>
                  <span className="text-[10px] text-[#869397]">MTU: 1500 • CRC Valid</span>
                  <div className="mt-2 pt-1 border-t border-[#2d3541]/40 text-[9px] text-[#4edea3] flex justify-between">
                    <span>+0.000 ms</span>
                    <span>INGRESS</span>
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="bg-[#070f19] p-3 rounded-lg border border-[#2d3541] flex flex-col justify-between gap-1 shadow-sm">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#869397]">STAGE 02</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#4edea3]/10 text-[#4edea3] font-bold">ALLOWED</span>
                  </div>
                  <div className="flex items-center gap-1.5 my-1">
                    <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
                    <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">Geo-IP Trie Map</span>
                  </div>
                  <span className="text-[10px] text-[#869397]">Table: geoip_lpm_trie</span>
                  <span className="text-[10px] text-[#869397]">DE (Germany) Whitelist</span>
                  <div className="mt-2 pt-1 border-t border-[#2d3541]/40 text-[9px] text-[#4edea3] flex justify-between">
                    <span>+0.001 ms</span>
                    <span>LPM LOOKUP</span>
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="bg-[#070f19] p-3 rounded-lg border border-[#ffb4ab]/40 flex flex-col justify-between gap-1 shadow-sm bg-[#93000a]/10">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#869397]">STAGE 03</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#93000a]/30 text-[#ffb4ab] font-bold">MATCH</span>
                  </div>
                  <div className="flex items-center gap-1.5 my-1">
                    <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse" />
                    <span className="font-['Geist'] text-xs font-semibold text-[#ffb4ab]">Tor Exit Filter</span>
                  </div>
                  <span className="text-[10px] text-[#869397]">Map: dynamic_tor_exit</span>
                  <span className="text-[10px] text-[#ffb4ab]">Found in Active Blocklist</span>
                  <div className="mt-2 pt-1 border-t border-[#2d3541]/40 text-[9px] text-[#ffb4ab] flex justify-between">
                    <span>+0.002 ms</span>
                    <span>FLAG: BLOCKED</span>
                  </div>
                </div>

                {/* Stage 4 */}
                <div className="bg-[#070f19] p-3 rounded-lg border border-[#ffb4ab]/40 flex flex-col justify-between gap-1 shadow-sm">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#869397]">STAGE 04</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#93000a]/30 text-[#ffb4ab] font-bold">DENY_RULE</span>
                  </div>
                  <div className="flex items-center gap-1.5 my-1">
                    <span className="w-2 h-2 rounded-full bg-[#ffb4ab]" />
                    <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">Conntrack & ACL</span>
                  </div>
                  <span className="text-[10px] text-[#869397]">Rule #104 DENY_TOR</span>
                  <span className="text-[10px] text-[#869397]">TCP SYN 443 Drop Flag</span>
                  <div className="mt-2 pt-1 border-t border-[#2d3541]/40 text-[9px] text-[#ffb4ab] flex justify-between">
                    <span>+0.002 ms</span>
                    <span>ACL TERMINATE</span>
                  </div>
                </div>

                {/* Stage 5 */}
                <div className="bg-[#93000a]/20 p-3 rounded-lg border border-[#ffb4ab]/50 flex flex-col justify-between gap-1 shadow-sm">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#ffb4ab] font-bold">VERDICT</span>
                    <span className="material-symbols-outlined text-[#ffb4ab] text-[16px]">cancel</span>
                  </div>
                  <div className="flex items-center gap-1.5 my-1">
                    <span className="font-['Geist'] text-xs font-bold text-[#ffb4ab]">XDP_DROP</span>
                  </div>
                  <span className="text-[10px] text-[#dbe3f2]">Hardware NIC Purge</span>
                  <span className="text-[10px] text-[#4edea3]">0% Kernel Stack CPU</span>
                  <div className="mt-2 pt-1 border-t border-[#2d3541]/40 text-[9px] text-[#bcc9cd] flex justify-between">
                    <span className="text-[#ffb4ab] font-bold">DISCARDED</span>
                    <span>0.84 μs</span>
                  </div>
                </div>
              </div>

              {/* Execution metric strip */}
              <div className="bg-[#070f19] p-3 rounded-lg border border-[#2d3541] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#4cd7f6] text-[16px]">speed</span>
                    <span className="text-[#869397] uppercase">Total Latency:</span>
                    <span className="text-[#4edea3] font-bold">842 nanoseconds (0.84 μs)</span>
                  </div>
                  <div className="w-px h-3 bg-[#2d3541] hidden md:block" />
                  <div className="flex items-center gap-2">
                    <span className="text-[#869397] uppercase">Drops Incremented:</span>
                    <span className="text-[#4cd7f6] font-semibold">wan_tor_drop_total [+1]</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#18202b] text-[#dbe3f2] text-[10px] border border-[#2d3541]">
                    eBPF JIT: ACTIVE
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3] font-bold text-[10px]">
                    BYPASS_TCP_STACK
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 04: Terminal verification */}
          <div className="space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#4cd7f6] font-bold uppercase tracking-wider">
                04 // LINUX BPFTOOL & NFTABLES MATCH VERIFICATION
              </span>
              <span className="text-[#869397] text-[10px]">root@fros-core01: /sys/fs/bpf/fros_xdp</span>
            </div>

            <div className="bg-[#070f19] rounded-xl p-3.5 border border-[#2d3541] space-y-1.5 text-xs text-[#bcc9cd]">
              <div className="flex items-center gap-2 text-[#dbe3f2] font-semibold">
                <span className="text-[#4cd7f6] font-bold">#</span>
                <span>bpftool map lookup name threat_ip_set key hex b9 dc 65 05</span>
              </div>
              <div className="text-[#4edea3] pl-4">
                --&gt; value: hex 01 (MATCH_EXACT: CATEGORY_TOR_RELAY_ACTIVE)
              </div>
              <div className="flex items-center gap-2 text-[#dbe3f2] font-semibold pt-1">
                <span className="text-[#4cd7f6] font-bold">#</span>
                <span>nft trace rule inet filter prerouting meta mark 0x00000004 drop</span>
              </div>
              <div className="text-[#acedff] pl-4 text-[11px] leading-relaxed">
                trace id a7e012c4 inet filter prerouting packet: iif "eth0" ether saddr 00:1a:2b:3c:4d:5e ip saddr {targetIp} ip daddr 198.51.100.2 tcp sport 49152 tcp dport {port} tcp flags == syn
              </div>
              <div className="text-[#ffb4ab] font-bold pl-4">
                &gt;&gt; PACKET DROPPED BY RULE #104 [XDP_EARLY_INTERCEPT] // STATUS: DROP (0ns overhead)
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#18202b] border-t border-[#2d3541] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-[#bcc9cd]">
            <span className="material-symbols-outlined text-[16px] text-[#4edea3]">verified_user</span>
            <span>MaxMind GeoLite2 City (2025.02.18-UTC) • SHA256: 7f81b3d...e92a Verified</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#232a36] hover:bg-[#323a46] text-[#bcc9cd] hover:text-white transition-colors"
            >
              Close Simulator
            </button>
            <button
              onClick={() => {
                alert(`Added exception whitelist rule for ${targetIp} in kernel XDP bypass map.`);
              }}
              className="px-4 py-1.5 rounded-lg bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Add Exception / Override Rule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
