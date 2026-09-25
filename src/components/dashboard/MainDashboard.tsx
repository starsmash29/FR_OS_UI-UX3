import React, { useState, useEffect } from 'react';
import { ActiveModal, MainSection } from '../../types';

interface MainDashboardProps {
  onOpenModal: (modal: ActiveModal) => void;
  activeSection: MainSection;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  onOpenModal,
  activeSection,
}) => {
  // Live dynamic counter for packets and throughput simulation
  const [rxRate, setRxRate] = useState(14.82);
  const [txRate, setTxRate] = useState(11.45);
  const [pps, setPps] = useState(1284500);
  const [cpuLoad, setCpuLoad] = useState(18);

  useEffect(() => {
    const timer = setInterval(() => {
      setRxRate((prev) => +(prev + (Math.random() * 0.8 - 0.4)).toFixed(2));
      setTxRate((prev) => +(prev + (Math.random() * 0.6 - 0.3)).toFixed(2));
      setPps((prev) => Math.floor(prev + (Math.random() * 10000 - 5000)));
      setCpuLoad((prev) => Math.min(65, Math.max(12, Math.floor(prev + (Math.random() * 4 - 2)))));
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  const toolCards = [
    {
      id: 'lag-bond' as ActiveModal,
      title: 'Provision LAG / Bond',
      category: 'Interfaces & L2',
      tag: 'IEEE 802.3ad LACP',
      desc: 'Aggregate multiple 10G/25G physical NICs with Hash Policy Layer 3+4 & fast LACP rate.',
      icon: 'hub',
      badge: 'BOND0 ACTIVE',
      badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40',
      actionText: 'Configure LAG Bond',
    },
    {
      id: 'vlan-provision' as ActiveModal,
      title: 'Provision VLAN Interface',
      category: 'Interfaces & L2',
      tag: '802.1Q Encap',
      desc: 'Deploy isolated security zones (DMZ, IoT, Core) with eBPF hardware offload & MTU 9000.',
      icon: 'lan',
      badge: 'eBPF XDP',
      badgeColor: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/40',
      actionText: 'Provision VLAN',
    },
    {
      id: 'dns-override' as ActiveModal,
      title: 'DNS Host Overrides',
      category: 'DNS & Core Services',
      tag: 'Local Resolver FIB',
      desc: 'Map FQDNs directly to private IPs, configure CNAME aliases, and bypass upstream recursion.',
      icon: 'dns',
      badge: 'STATIC FIB',
      badgeColor: 'text-teal-400 bg-teal-950/60 border-teal-500/40',
      actionText: 'Manage Host Overrides',
    },
    {
      id: 'encrypted-dns' as ActiveModal,
      title: 'Encrypted Upstream DNS',
      category: 'DNS & Core Services',
      tag: 'DoT / DoH / DoQ',
      desc: 'TLS 1.3 cryptographic DNS resolvers, ECH support, SPKI pin sets, and DNSSEC validation.',
      icon: 'lock',
      badge: 'TLS 1.3 PINNED',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40',
      actionText: 'Configure Resolvers',
    },
    {
      id: 'dns-leak' as ActiveModal,
      title: 'DNS Leak Test & Auditor',
      category: 'Security & Audit',
      tag: 'Zero-Leak Telemetry',
      desc: 'Live probe runner verifying transparent ISP proxy absence, EDNS stripping & DNSSEC enforcement.',
      icon: 'verified_user',
      badge: 'GRADE A+',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40',
      actionText: 'Run Leak Diagnostic',
    },
    {
      id: 'geoip-perimeter' as ActiveModal,
      title: 'Geo-IP Country Perimeter',
      category: 'Firewall & NAT',
      tag: 'eBPF LPM Trie',
      desc: 'In-kernel 0-cost wire drop for restricted regions, high-risk ASNs, and geo-fencing policies.',
      icon: 'public',
      badge: '0ns DROP LATENCY',
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-500/40',
      actionText: 'Tune Perimeter Rules',
    },
    {
      id: 'packet-trajectory' as ActiveModal,
      title: 'Packet Trajectory Simulator',
      category: 'Diagnostics',
      tag: 'MaxMind GeoIP2',
      desc: 'Synthesize synthetic packets through the eBPF TC/XDP pipeline, NAT state, and conntrack.',
      icon: 'radar',
      badge: 'SIMULATOR ON',
      badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40',
      actionText: 'Simulate Trajectory',
    },
    {
      id: 'mtr-diagnostics' as ActiveModal,
      title: 'MTR & Jitter Oscilloscope',
      category: 'Diagnostics',
      tag: 'Cyclic ICMP/UDP',
      desc: 'Multi-hop real-time path traceroute, bufferbloat assessment, standard deviation & loss heatmaps.',
      icon: 'show_chart',
      badge: 'LIVE OSCILLOSCOPE',
      badgeColor: 'text-sky-400 bg-sky-950/60 border-sky-500/40',
      actionText: 'Launch MTR Tracer',
    },
    {
      id: 'iperf-benchmark' as ActiveModal,
      title: 'iPerf3 Wire-Speed Benchmark',
      category: 'Diagnostics',
      tag: 'RFC 2544 Probe',
      desc: 'Multi-stream bi-directional TCP/UDP saturation test with zero retransmission tracking.',
      icon: 'speed',
      badge: '10G/25G READY',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40',
      actionText: 'Run iPerf3 Test',
    },
    {
      id: 'packet-capture' as ActiveModal,
      title: 'Live eBPF Packet Capture',
      category: 'Diagnostics',
      tag: 'BPF Filter & PCAP',
      desc: 'Zero-copy kernel packet dissector, L2-L7 protocol breakdown, and hex memory inspection.',
      icon: 'troubleshoot',
      badge: 'DISSECTOR ACTIVE',
      badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-500/40',
      actionText: 'Start Packet Sniffer',
    },
    {
      id: 'bgp-explorer' as ActiveModal,
      title: 'BGP Dynamic Routing Table',
      category: 'Routing & FIB',
      tag: 'BIRD 2.15 / FRR',
      desc: 'Full routing table inspection, AS-Path analysis, prefix community tags & peer peering cards.',
      icon: 'alt_route',
      badge: '4 PEERS UP',
      badgeColor: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/40',
      actionText: 'Explore BGP Table',
    },
    {
      id: 'arp-ndp' as ActiveModal,
      title: 'ARP & NDP Neighbor Discovery',
      category: 'Interfaces & L2',
      tag: 'RFC 4861 / RFC 826',
      desc: 'Kernel AF_NETLINK neighbor cache inspection, OUI vendor lookup, Dynamic ARP Inspection.',
      icon: 'account_tree',
      badge: 'L2 CACHE SYNC',
      badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40',
      actionText: 'Inspect Neighbors',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 font-mono text-slate-300">
      
      {/* Top Banner / System State */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-gradient-to-r from-[#07111c] via-[#0d1a29] to-[#07111c] p-6 shadow-xl shadow-cyan-950/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                KERNEL KMOD: eBPF XDP DRIVER LOADED
              </span>
              <span className="text-xs text-slate-500">|</span>
              <span className="text-xs text-slate-400">Node: edge-core-01.lon04.fros.internal</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              FR_OS Network Telemetry & Operations Suite
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Real-time hardware packet offload, eBPF XDP hook pipeline, L2-L7 protocol dissection,
              cryptographic upstream DNS orchestration, and dynamic carrier BGP peering explorer.
            </p>
          </div>

          {/* Quick Metrics Cluster */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="p-3 rounded-lg bg-[#070e17]/80 border border-cyan-500/20 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">RX Ingress</div>
              <div className="text-lg font-bold text-cyan-400 mt-0.5">{rxRate} <span className="text-xs">Gbps</span></div>
              <div className="text-[10px] text-emerald-400 mt-0.5">+4.2% peak</div>
            </div>

            <div className="p-3 rounded-lg bg-[#070e17]/80 border border-cyan-500/20 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">TX Egress</div>
              <div className="text-lg font-bold text-indigo-400 mt-0.5">{txRate} <span className="text-xs">Gbps</span></div>
              <div className="text-[10px] text-slate-500 mt-0.5">Wire line rate</div>
            </div>

            <div className="p-3 rounded-lg bg-[#070e17]/80 border border-cyan-500/20 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">PPS Rate</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">{(pps / 1000000).toFixed(2)}M</div>
              <div className="text-[10px] text-slate-500 mt-0.5">packets/sec</div>
            </div>

            <div className="p-3 rounded-lg bg-[#070e17]/80 border border-cyan-500/20 text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">CPU Offload</div>
              <div className="text-lg font-bold text-cyan-300 mt-0.5">{cpuLoad}%</div>
              <div className="text-[10px] text-cyan-400 mt-0.5">XDP native</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interfaces & Hardware Status Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { name: 'eth0', type: 'WAN Uplink', speed: '25 Gbps', status: 'UP', color: 'emerald', ip: '195.66.225.14/24' },
          { name: 'eth1', type: 'Core Trunk', speed: '10 Gbps', status: 'UP', color: 'emerald', ip: '10.0.1.1/24' },
          { name: 'bond0', type: 'LAG 802.3ad', speed: '20 Gbps', status: 'UP', color: 'cyan', ip: '10.200.0.1/16' },
          { name: 'vlan10', type: 'Management', speed: '10 Gbps', status: 'UP', color: 'indigo', ip: '192.168.10.1/24' },
          { name: 'vlan20', type: 'DMZ Public', speed: '10 Gbps', status: 'UP', color: 'amber', ip: '172.16.20.1/24' },
          { name: 'wg0', type: 'WireGuard', speed: '4 Gbps', status: 'ACTIVE', color: 'purple', ip: '10.50.0.1/32' },
        ].map((iface) => (
          <div
            key={iface.name}
            className="p-3 rounded-lg bg-[#0a121c] border border-slate-800 hover:border-cyan-500/40 transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">{iface.name}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                  iface.color === 'emerald'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : iface.color === 'cyan'
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    : iface.color === 'indigo'
                    ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                    : iface.color === 'amber'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                }`}
              >
                {iface.status}
              </span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">{iface.type}</div>
            <div className="text-[10px] text-slate-500 font-mono">{iface.ip}</div>
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>{iface.speed}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: All 12 Screen Modals / Enterprise Network Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-wider uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-400 text-lg">widgets</span>
              Operational Network Modules & Diagnostics
            </h2>
            <p className="text-xs text-slate-400">
              Click any module card below or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 text-[10px]">Cmd + K</kbd> to open its dedicated inspection modal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">12 Subsystems Online</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {toolCards.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onOpenModal(tool.id)}
              className="group relative cursor-pointer rounded-xl bg-[#09111c] border border-slate-800 hover:border-cyan-500/60 p-4 shadow-lg hover:shadow-cyan-950/40 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-lg bg-cyan-950/50 border border-cyan-500/30 group-hover:border-cyan-400 flex items-center justify-center text-cyan-400 transition-colors">
                    <span className="material-symbols-outlined text-lg">{tool.icon}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase tracking-wider ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                </div>

                {/* Title & Tag */}
                <div>
                  <div className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-wider">{tool.category}</div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mt-0.5">
                    {tool.title}
                  </h3>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{tool.tag}</div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {tool.desc}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-400 group-hover:text-cyan-200 flex items-center gap-1 transition-colors">
                  {tool.actionText}
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </span>
                <span className="text-[10px] text-slate-600 font-mono">v4.18</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-Time Telemetry & eBPF Pipeline Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* eBPF XDP Pipeline Card */}
        <div className="p-4 rounded-xl bg-[#09111c] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-400 text-sm">memory</span>
              eBPF Hook Lifecycle
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">XDP_PASS (99.8%)</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-slate-300 font-semibold">1. XDP Driver (NIC Ring)</span>
              </div>
              <span className="text-[10px] text-cyan-400">0.02 µs latency</span>
            </div>

            <div className="p-2 rounded bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="text-slate-300 font-semibold">2. TC Ingress (LPM Trie)</span>
              </div>
              <span className="text-[10px] text-indigo-400">GeoIP check</span>
            </div>

            <div className="p-2 rounded bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span className="text-slate-300 font-semibold">3. Netfilter Conntrack</span>
              </div>
              <span className="text-[10px] text-teal-400">128,490 states</span>
            </div>

            <div className="p-2 rounded bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-slate-300 font-semibold">4. FIB Lookup & Forward</span>
              </div>
              <span className="text-[10px] text-emerald-400">HW L3 Offload</span>
            </div>
          </div>
        </div>

        {/* Live Kernel Ring Buffer Logs */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-[#09111c] border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-400 text-sm">terminal</span>
              Kernel Ring Buffer (dmesg | grep fros_xdp)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">ring0: 256MB allocated</span>
          </div>

          <div className="p-3 rounded bg-black/60 border border-slate-900 font-mono text-[11px] space-y-1.5 text-slate-400 overflow-x-auto">
            <div><span className="text-cyan-400">[ +0.0012]</span> fros_xdp: bond0 LACP 802.3ad actor state established on eth1, eth2 (hash: L3+L4)</div>
            <div><span className="text-emerald-400">[ +0.0045]</span> coredns[102]: TLS 1.3 DoT handshake completed with 1.1.1.1:853 (0.42ms)</div>
            <div><span className="text-indigo-400">[ +0.0089]</span> bird2[892]: BGP AS13335 (Cloudflare) RIB updated: 940,210 prefixes accepted</div>
            <div><span className="text-amber-400">[ +0.0134]</span> xdp_geoip: Ingress drop from 185.220.101.5 (RU/Tor Exit node) by policy PERIMETER_BLOCKED</div>
            <div><span className="text-cyan-300">[ +0.0210]</span> tc_filter: Anti-ARP spoofing verified neighbor 192.168.1.100 [52:54:00:12:34:56]</div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Filter: kernel.warn / notice</span>
            <button
              onClick={() => onOpenModal('packet-capture')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              Open Live Packet Dissector
              <span className="material-symbols-outlined text-xs">open_in_new</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
