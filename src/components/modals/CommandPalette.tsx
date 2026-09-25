import React, { useState, useEffect } from 'react';
import { MainSection, ActiveModal } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModal: (modal: ActiveModal) => void;
  onSelectSection: (section: MainSection) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectModal,
  onSelectSection,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    {
      id: 'mtr-diagnostics',
      category: 'Diagnostics & Latency',
      title: 'MTR Real-Time Path & Jitter Diagnostics',
      badge: 'RFC 792 eBPF',
      action: () => onSelectModal('mtr-diagnostics'),
    },
    {
      id: 'iperf-benchmark',
      category: 'Diagnostics & Latency',
      title: 'iPerf3 Wire-Speed & 10G Throughput Benchmark',
      badge: 'RFC 2544',
      action: () => onSelectModal('iperf-benchmark'),
    },
    {
      id: 'packet-capture',
      category: 'Inspection & PCAP',
      title: 'Live Packet Capture & Dissector (Hex / ASCII)',
      badge: 'Wireshark Pipe',
      action: () => onSelectModal('packet-capture'),
    },
    {
      id: 'packet-trajectory',
      category: 'Security & Forensics',
      title: 'IP Geo-Lookup & Packet Trajectory Simulator',
      badge: 'eBPF XDP Zero-Copy',
      action: () => onSelectModal('packet-trajectory'),
    },
    {
      id: 'geo-ip-perimeter',
      category: 'Security & Forensics',
      title: 'Geo-IP Country Filter & Ingress/Egress Perimeter Policy',
      badge: 'LPM-Trie Map',
      action: () => onSelectModal('geo-ip-perimeter'),
    },
    {
      id: 'bgp-explorer',
      category: 'Routing & Peering',
      title: 'BGP Dynamic Routing Table & Peering Explorer (BIRD 2)',
      badge: 'RFC 4271 FIB',
      action: () => onSelectModal('bgp-explorer'),
    },
    {
      id: 'arp-ndp-cache',
      category: 'Interfaces & L2',
      title: 'ARP & NDP Neighbor Discovery & L2/L3 Cache',
      badge: 'RFC 4861 Netlink',
      action: () => onSelectModal('arp-ndp-cache'),
    },
    {
      id: 'lag-bond',
      category: 'Interfaces & L2',
      title: 'Provision Link Aggregation Group (LAG / Bond)',
      badge: 'IEEE 802.3ad',
      action: () => onSelectModal('lag-bond'),
    },
    {
      id: 'vlan-provision',
      category: 'Interfaces & L2',
      title: 'Provision New VLAN Interface (IEEE 802.1Q Encap)',
      badge: 'RTNETLINK',
      action: () => onSelectModal('vlan-provision'),
    },
    {
      id: 'dns-override',
      category: 'DNS & DHCP',
      title: 'Provision DNS Static Override & Host Record',
      badge: 'CoreDNS Zonefile',
      action: () => onSelectModal('dns-override'),
    },
    {
      id: 'encrypted-dns',
      category: 'DNS & DHCP',
      title: 'Configure Encrypted Upstream DNS Resolver (DoT/DoH/DoQ)',
      badge: 'Quad9 / Cloudflare',
      action: () => onSelectModal('encrypted-dns'),
    },
    {
      id: 'dns-leak',
      category: 'DNS & DHCP',
      title: 'DNS Leak Test & Resolver Telemetry Diagnostics',
      badge: '60 Probes',
      action: () => onSelectModal('dns-leak'),
    },
  ];

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.badge.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#070f19]/80 backdrop-blur-md flex items-start justify-center pt-24 px-4 animate-in fade-in duration-100">
      <div className="w-full max-w-2xl bg-[#141c27] border border-[#2d3541] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        {/* Search header */}
        <div className="p-3.5 bg-[#18202b] border-b border-[#2d3541] flex items-center gap-3">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
            search
          </span>
          <input
            autoFocus
            type="text"
            className="w-full bg-transparent text-[#dbe3f2] font-mono text-sm placeholder:text-[#869397] focus:outline-none"
            placeholder="Type a telemetry diagnostic, interface, or protocol command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="px-2 py-0.5 rounded bg-[#232a36] text-[11px] font-mono text-[#869397]">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-[#869397] text-xs font-mono">
              No matching FR_OS subroutines found.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                className="w-full p-2.5 rounded-lg hover:bg-[#18202b] text-left flex items-center justify-between group transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-[#4cd7f6] uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-xs font-semibold text-[#dbe3f2] group-hover:text-white font-mono">
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#232a36] text-[10px] font-mono text-[#bcc9cd]">
                    {item.badge}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-[#869397] group-hover:text-[#4cd7f6] transition-colors">
                    arrow_forward
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#0c141f] border-t border-[#2d3541] flex items-center justify-between text-[11px] font-mono text-[#869397]">
          <span>Navigation: Use ↑ ↓ and ↵ to select</span>
          <span className="text-[#4edea3]">FR_OS v4.8.2 Active Kernel</span>
        </div>
      </div>
    </div>
  );
};
