import React from 'react';
import { MainSection, ActiveModal } from '../../types';

interface SidebarProps {
  activeSection: MainSection;
  onSelectSection: (section: MainSection) => void;
  activeModal: ActiveModal;
  onOpenModal: (modal: ActiveModal) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  activeModal,
  onOpenModal,
}) => {
  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-[#070f19] z-40 flex flex-col justify-between py-3 shadow-[2px_0_12px_rgba(0,0,0,0.45)] border-r border-[#2d3541]/40 overflow-hidden">
      {/* Top Engine Status Badge */}
      <div className="flex flex-col gap-3 px-3 overflow-y-auto">
        <div className="px-2.5 py-1.5 rounded bg-[#141c27] border border-[#2d3541]/50 flex items-center justify-between text-[#869397] font-mono text-[11px] uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse" />
            Active Engine
          </span>
          <span className="text-[#4edea3] font-bold">L7 DPI (XDP)</span>
        </div>

        {/* Section Modules Navigation */}
        <div className="flex flex-col gap-1">
          <span className="px-2 text-[10px] font-mono uppercase text-[#869397] tracking-wider">
            Subsystems
          </span>
          <button
            onClick={() => onSelectSection('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded font-mono text-xs text-left transition-all ${
              activeSection === 'dashboard'
                ? 'bg-[#18202b] text-[#4cd7f6] font-semibold border-l-2 border-[#4cd7f6]'
                : 'text-[#bcc9cd] hover:bg-[#141c27] hover:text-[#dbe3f2]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">
              space_dashboard
            </span>
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => onSelectSection('interfaces')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded font-mono text-xs text-left transition-all ${
              activeSection === 'interfaces'
                ? 'bg-[#18202b] text-[#4cd7f6] font-semibold border-l-2 border-[#4cd7f6]'
                : 'text-[#bcc9cd] hover:bg-[#141c27] hover:text-[#dbe3f2]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">hub</span>
            <span>Physical Ports & LAG</span>
          </button>

          <button
            onClick={() => onSelectSection('firewall-and-nat')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded font-mono text-xs text-left transition-all ${
              activeSection === 'firewall-and-nat'
                ? 'bg-[#18202b] text-[#4cd7f6] font-semibold border-l-2 border-[#4cd7f6]'
                : 'text-[#bcc9cd] hover:bg-[#141c27] hover:text-[#dbe3f2]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">shield</span>
            <span>Firewall Rules & NAT</span>
          </button>

          <button
            onClick={() => onSelectSection('protection-and-ips')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded font-mono text-xs text-left transition-all ${
              activeSection === 'protection-and-ips'
                ? 'bg-[#18202b] text-[#4cd7f6] font-semibold border-l-2 border-[#4cd7f6]'
                : 'text-[#bcc9cd] hover:bg-[#141c27] hover:text-[#dbe3f2]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">public</span>
            <span>Geo-IP & Threat Defense</span>
          </button>

          <button
            onClick={() => onSelectSection('dns-and-dhcp')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded font-mono text-xs text-left transition-all ${
              activeSection === 'dns-and-dhcp'
                ? 'bg-[#18202b] text-[#4cd7f6] font-semibold border-l-2 border-[#4cd7f6]'
                : 'text-[#bcc9cd] hover:bg-[#141c27] hover:text-[#dbe3f2]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">dns</span>
            <span>DNS & CoreDHCP</span>
          </button>

          <button
            onClick={() => onSelectSection('diagnostics')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded font-mono text-xs text-left transition-all ${
              activeSection === 'diagnostics'
                ? 'bg-[#18202b] text-[#4cd7f6] font-semibold border-l-2 border-[#4cd7f6]'
                : 'text-[#bcc9cd] hover:bg-[#141c27] hover:text-[#dbe3f2]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">
              troubleshoot
            </span>
            <span>Diagnostics Hub</span>
          </button>
        </div>

        {/* Quick Launch Diagnostics Modals */}
        <div className="flex flex-col gap-1 pt-2 border-t border-[#2d3541]/40">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-mono uppercase text-[#4cd7f6] tracking-wider font-semibold">
              Diagnostic Modals
            </span>
            <span className="text-[9px] font-mono text-[#869397]">12 TOOLS</span>
          </div>

          <button
            onClick={() => onOpenModal('lag-bond')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-[#141c27] hover:bg-[#18202b] text-[#dbe3f2] font-mono text-[11px] transition-colors border border-[#2d3541]/40"
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">
                lan
              </span>
              <span>LACP Bond Config</span>
            </span>
            <span className="text-[9px] text-[#4edea3]">20G</span>
          </button>

          <button
            onClick={() => onOpenModal('vlan-provision')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-[#141c27] hover:bg-[#18202b] text-[#dbe3f2] font-mono text-[11px] transition-colors border border-[#2d3541]/40"
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">
                router
              </span>
              <span>VLAN 802.1Q Encap</span>
            </span>
            <span className="text-[9px] text-[#4cd7f6]">vlan40</span>
          </button>

          <button
            onClick={() => onOpenModal('mtr-diagnostics')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-[#141c27] hover:bg-[#18202b] text-[#dbe3f2] font-mono text-[11px] transition-colors border border-[#2d3541]/40"
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-[#4edea3]">
                multiline_chart
              </span>
              <span>MTR Path & Jitter</span>
            </span>
            <span className="text-[9px] text-[#4edea3]">11.2ms</span>
          </button>

          <button
            onClick={() => onOpenModal('iperf-benchmark')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-[#141c27] hover:bg-[#18202b] text-[#dbe3f2] font-mono text-[11px] transition-colors border border-[#2d3541]/40"
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-[#06b6d4]">
                speed
              </span>
              <span>iPerf3 10G Wire-Speed</span>
            </span>
            <span className="text-[9px] text-[#06b6d4]">9.42G</span>
          </button>

          <button
            onClick={() => onOpenModal('packet-capture')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-[#141c27] hover:bg-[#18202b] text-[#dbe3f2] font-mono text-[11px] transition-colors border border-[#2d3541]/40"
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-[#d0bcff]">
                view_headline
              </span>
              <span>Live PCAP Dissector</span>
            </span>
            <span className="text-[9px] text-[#d0bcff]">HEX</span>
          </button>

          <button
            onClick={() => onOpenModal('bgp-explorer')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-[#141c27] hover:bg-[#18202b] text-[#dbe3f2] font-mono text-[11px] transition-colors border border-[#2d3541]/40"
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">
                schema
              </span>
              <span>BGP Peering (BIRD2)</span>
            </span>
            <span className="text-[9px] text-[#4cd7f6]">948k</span>
          </button>

          <button
            onClick={() => onOpenModal('arp-ndp-cache')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-[#141c27] hover:bg-[#18202b] text-[#dbe3f2] font-mono text-[11px] transition-colors border border-[#2d3541]/40"
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-[#4edea3]">
                share
              </span>
              <span>ARP / NDP Neighbors</span>
            </span>
            <span className="text-[9px] text-[#4edea3]">348 L2</span>
          </button>

          <button
            onClick={() => onOpenModal('packet-trajectory')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-[#141c27] hover:bg-[#18202b] text-[#dbe3f2] font-mono text-[11px] transition-colors border border-[#2d3541]/40"
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-[#ffb4ab]">
                travel_explore
              </span>
              <span>Trajectory Simulator</span>
            </span>
            <span className="text-[9px] text-[#ffb4ab]">XDP</span>
          </button>

          <button
            onClick={() => onOpenModal('geo-ip-perimeter')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-[#141c27] hover:bg-[#18202b] text-[#dbe3f2] font-mono text-[11px] transition-colors border border-[#2d3541]/40"
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">
                public
              </span>
              <span>Geo-IP Filter Policy</span>
            </span>
            <span className="text-[9px] text-[#4edea3]">HU/EU</span>
          </button>

          <button
            onClick={() => onOpenModal('dns-leak')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-[#141c27] hover:bg-[#18202b] text-[#dbe3f2] font-mono text-[11px] transition-colors border border-[#2d3541]/40"
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-[#4edea3]">
                query_stats
              </span>
              <span>DNS Leak Telemetry</span>
            </span>
            <span className="text-[9px] text-[#4edea3]">0 Leak</span>
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Card: Throughput / Packets / Uptime */}
      <div className="px-3 pt-2 flex flex-col gap-2 shrink-0 border-t border-[#2d3541]/40 bg-[#070f19]">
        <div className="p-2.5 rounded-lg bg-[#141c27] border border-[#2d3541]/40 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[#869397] font-mono text-[11px]">
            <span>Throughput</span>
            <span className="text-[#4cd7f6] font-bold">4.2 Gbps</span>
          </div>
          <div className="w-full h-1.5 rounded bg-[#2d3541] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#06b6d4] to-[#4cd7f6] rounded shadow-[0_0_8px_rgba(76,215,246,0.5)] animate-pulse"
              style={{ width: '68%' }}
            />
          </div>
          <div className="flex items-center justify-between text-[#869397] font-mono text-[10px]">
            <span>Packets/s</span>
            <span className="text-[#dbe3f2] font-semibold">142.8 kpps</span>
          </div>
        </div>

        <div className="px-2.5 py-1.5 rounded bg-[#18202b] border border-[#2d3541]/40 text-[#bcc9cd] font-mono text-[10px] flex items-center justify-between">
          <span className="text-[#869397]">Uptime</span>
          <span className="text-[#dbe3f2] font-bold">42d 18h 12m</span>
        </div>

        <div className="p-1.5 rounded bg-[#141c27] flex items-center justify-between text-[10px] font-mono">
          <div className="flex items-center gap-1 text-[#869397]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
            <span>STATEFUL ENGINE</span>
          </div>
          <span className="text-[#4edea3] font-bold">PASS</span>
        </div>
      </div>
    </aside>
  );
};
