import React, { useState } from 'react';
import { BGP_PEERS, BGP_ROUTES } from '../../data/mockData';
import { BgpRoute } from '../../types';

interface BgpExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BgpExplorerModal: React.FC<BgpExplorerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [filterQuery, setFilterQuery] = useState('1.1.1.0/24 or AS13335');
  const [addressFamily, setAddressFamily] = useState('IPv4 Unicast (AFI 1 / SAFI 1)');
  const [routeStatus, setRouteStatus] = useState('Best Path Only [* >]');
  const [communityFilter, setCommunityFilter] = useState('Community: All Active');
  const [selectedRoute, setSelectedRoute] = useState<BgpRoute>(BGP_ROUTES[0]);
  const [isDampeningCleared, setIsDampeningCleared] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleClearDampening = () => {
    setIsDampeningCleared(true);
    setTimeout(() => setIsDampeningCleared(false), 2000);
  };

  const filteredRoutes = BGP_ROUTES.filter((r) => {
    if (routeStatus.includes('Best Path') && !r.isBest) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#070f19]/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-[1440px] my-auto bg-[#141c27] rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[96vh] border border-[#2d3541] text-[#dbe3f2]">
        {/* Top Accent Line */}
        <div className="w-full h-1 bg-gradient-to-r from-[#4cd7f6] via-[#4edea3] to-[#4cd7f6]/40" />

        {/* 1. Modal Header & Identity Bar */}
        <div className="px-6 py-4 bg-[#18202b] flex flex-wrap items-center justify-between gap-4 border-b border-[#2d3541]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#232a36] flex items-center justify-center border border-[#2d3541] shadow-sm">
                <svg className="w-7 h-7 text-[#4cd7f6]" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <polygon points="24 4, 42 14, 42 34, 24 44, 6 34, 6 14" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="24" cy="24" r="5" strokeWidth="2" fill="#070f19" />
                  <circle cx="24" cy="24" r="1.8" fill="#4cd7f6" className="animate-ping" />
                  <path d="M24 10v4M24 34v4M12 18l3.5 2M32.5 28l3.5 2M12 30l3.5-2M32.5 20l3.5-2" strokeWidth="2" strokeLinecap="round" className="stroke-[#4edea3]" />
                </svg>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-['Geist'] text-lg font-bold text-white uppercase">FR_OS</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#232a36] text-[#4cd7f6] border border-[#2d3541]">
                    // RFC_4271_FRR_BIRD2_FIB
                  </span>
                </div>
                <h1 className="font-['Geist'] text-sm font-semibold text-[#bcc9cd]">
                  BGP Dynamic Routing Table & Peering Explorer
                </h1>
              </div>
            </div>

            <div className="hidden xl:flex items-center gap-2 font-mono text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
                ENGINE: BIRD 2.15.1 + Linux Kernel FIB
              </span>
              <span className="px-2 py-1 rounded bg-[#232a36] text-[#dbe3f2] border border-[#2d3541]">
                ROUTER ID: <strong className="text-[#4cd7f6]">195.228.240.15</strong>
              </span>
              <span className="px-2 py-1 rounded bg-[#232a36] text-[#dbe3f2] border border-[#2d3541]">
                LOCAL ASN: <strong className="text-[#4edea3]">AS212450</strong> (FR-TRANSIT)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleRefresh}
              className="px-3 py-1.5 rounded-lg bg-[#06b6d4] text-[#003640] hover:bg-[#4cd7f6] transition-colors flex items-center gap-1.5 font-bold shadow-sm"
            >
              <span className={`material-symbols-outlined text-[16px] ${isRefreshing ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Routes'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#232a36] hover:bg-[#93000a]/40 text-[#869397] hover:text-white flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto bg-[#0c141f]">
          {/* Peer Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            {BGP_PEERS.map((peer) => (
              <div
                key={peer.id}
                className="p-3.5 rounded-xl bg-[#141c27] hover:bg-[#18202b] transition-all border border-[#2d3541] flex flex-col gap-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white truncate max-w-[170px]">{peer.name}</span>
                    <span className="text-[10px] text-[#869397]">{peer.ip} · {peer.interface}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#4edea3]/15 text-[#4edea3] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
                    {peer.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div>
                    <span className="text-[#869397] text-[9px] block uppercase">Pfx Rcv/Act</span>
                    <span className="text-base text-[#4cd7f6] font-bold">{peer.pfxReceived}</span>
                    <span className="text-[#869397] text-[10px]"> / {peer.pfxActive}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#869397] text-[9px] block uppercase">Hold / Latency</span>
                    <span className="text-white text-xs block">{peer.holdTime}</span>
                    <span className="text-[#4edea3] text-[10px]">RTT: {peer.rtt}</span>
                  </div>
                </div>

                <div className="w-full bg-[#232a36] h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-[#4cd7f6] h-full rounded-full" style={{ width: `${peer.loadPercent}%` }} />
                </div>

                <div className="flex items-center justify-between text-[#869397] text-[10px] pt-1">
                  <span>{peer.type}</span>
                  <span>Up: {peer.uptime}</span>
                </div>
              </div>
            ))}
          </div>

          {/* KPI Summary Bar */}
          <div className="p-4 rounded-xl bg-[#141c27] border border-[#2d3541] flex flex-wrap items-center justify-between gap-4 font-mono">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-[#232a36] flex items-center justify-center text-[#4cd7f6]">
                  <span className="material-symbols-outlined text-[20px]">account_tree</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#869397] uppercase">Total RIB Prefixes</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-white">948,820</span>
                    <span className="text-xs text-[#bcc9cd]">(IPv4: 924k | IPv6: 186k)</span>
                  </div>
                </div>
              </div>

              <div className="h-8 w-px bg-[#2d3541] hidden md:block" />

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-[#232a36] flex items-center justify-center text-[#4edea3]">
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#869397] uppercase">Installed Kernel FIB</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-[#4edea3]">924,112</span>
                    <span className="text-xs text-[#869397]">Wire-speed eBPF</span>
                  </div>
                </div>
              </div>

              <div className="h-8 w-px bg-[#2d3541] hidden md:block" />

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-[#232a36] flex items-center justify-center text-[#d0bcff]">
                  <span className="material-symbols-outlined text-[20px]">memory</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#869397] uppercase">Memory Consumption</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-white">412 MB</span>
                    <span className="text-xs text-[#bcc9cd]">Slab Cache</span>
                  </div>
                </div>
              </div>

              <div className="h-8 w-px bg-[#2d3541] hidden md:block" />

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-[#232a36] flex items-center justify-center text-[#4cd7f6]">
                  <span className="material-symbols-outlined text-[20px]">speed</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#869397] uppercase">Convergence Latency</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-[#4cd7f6]">14.2 ms</span>
                    <span className="text-xs text-[#4edea3]">BFD 50ms Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sparkline */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#869397] uppercase">RIB Delta:</span>
              <svg className="w-24 h-6 text-[#4cd7f6]" fill="none" viewBox="0 0 100 24">
                <path d="M0 18 L15 17 L30 19 L45 10 L60 12 L75 4 L90 7 L100 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M0 18 L15 17 L30 19 L45 10 L60 12 L75 4 L90 7 L100 2 V 24 H 0 Z" fill="currentColor" fillOpacity="0.15" />
              </svg>
            </div>
          </div>

          {/* Looking Glass Filter */}
          <div className="p-3.5 rounded-xl bg-[#141c27] border border-[#2d3541] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 font-mono text-xs">
            <div className="flex-1 flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[240px]">
                <span className="material-symbols-outlined absolute left-3 top-2 text-[16px] text-[#869397]">search</span>
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#070f19] text-[#dbe3f2] border border-[#2d3541] focus:outline-none"
                  placeholder="Filter prefix, ASN, or community..."
                />
              </div>

              <select
                value={addressFamily}
                onChange={(e) => setAddressFamily(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#070f19] text-[#dbe3f2] border border-[#2d3541] outline-none"
              >
                <option>IPv4 Unicast (AFI 1 / SAFI 1)</option>
                <option>IPv6 Unicast (AFI 2 / SAFI 1)</option>
                <option>EVPN / VXLAN</option>
              </select>

              <select
                value={routeStatus}
                onChange={(e) => setRouteStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#070f19] text-[#dbe3f2] border border-[#2d3541] outline-none"
              >
                <option>Best Path Only [* &gt;]</option>
                <option>All Candidate Paths</option>
              </select>

              <select
                value={communityFilter}
                onChange={(e) => setCommunityFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#070f19] text-[#dbe3f2] border border-[#2d3541] outline-none"
              >
                <option>Community: All Active</option>
                <option>Blackhole (65535:666)</option>
                <option>Local Transit (212450:100)</option>
              </select>
            </div>

            <button
              onClick={handleRefresh}
              className="px-4 py-1.5 rounded-lg bg-[#4cd7f6] hover:bg-[#06b6d4] text-[#003640] font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              <span>Run Route Lookup</span>
            </button>
          </div>

          {/* Active RIB Master Table */}
          <div className="rounded-xl bg-[#141c27] border border-[#2d3541] overflow-hidden font-mono text-xs">
            <div className="px-4 py-2.5 bg-[#18202b] border-b border-[#2d3541] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-['Geist'] text-xs font-semibold text-white">Active RIB Master Table</span>
                <span className="px-2 py-0.5 rounded bg-[#4cd7f6]/10 text-[#4cd7f6] text-[10px]">Table: master4</span>
                <span className="text-[#869397] text-[10px]">Displaying matches</span>
              </div>
              <span className="text-[#869397] text-[10px]">COLUMNS: BIRD_DEFAULT_EXPANDED</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#070f19] text-[#869397] text-[10px] uppercase border-b border-[#2d3541]">
                  <tr>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Prefix / CIDR</th>
                    <th className="py-2 px-3">Next Hop (Via)</th>
                    <th className="py-2 px-3">Neighbor Peer</th>
                    <th className="py-2 px-3 text-right">MED</th>
                    <th className="py-2 px-3 text-right">LocalPref</th>
                    <th className="py-2 px-3">AS-Path</th>
                    <th className="py-2 px-3">Communities</th>
                    <th className="py-2 px-3 text-center">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d3541]/40 text-[11px]">
                  {filteredRoutes.map((route, i) => (
                    <tr
                      key={i}
                      onClick={() => setSelectedRoute(route)}
                      className={`cursor-pointer transition-colors ${
                        selectedRoute.prefix === route.prefix && selectedRoute.nextHop === route.nextHop
                          ? 'bg-[#06b6d4]/15 border-l-2 border-[#4cd7f6]'
                          : route.isBlackhole
                          ? 'bg-[#93000a]/15 text-[#ffb4ab]'
                          : 'hover:bg-[#18202b]'
                      }`}
                    >
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 font-bold ${
                          route.isBest ? 'text-[#4edea3]' : route.isBlackhole ? 'text-[#ffb4ab]' : 'text-[#869397]'
                        }`}>
                          <span className="material-symbols-outlined text-[13px]">
                            {route.isBest ? 'star' : route.isBlackhole ? 'block' : 'remove'}
                          </span>
                          <span>{route.status}</span>
                        </span>
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-[#4cd7f6] font-semibold">
                        {route.prefix}
                        <span className="text-[#869397] text-[10px] ml-1">{route.description}</span>
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-white">
                        {route.nextHop}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span className="text-white font-semibold">{route.peerAsn}</span>
                        <span className="text-[#869397] text-[10px] block">{route.peerName}</span>
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-right text-[#869397]">{route.metric}</td>
                      <td className={`py-2 px-3 whitespace-nowrap text-right font-bold ${route.localPref >= 200 ? 'text-[#4edea3]' : 'text-white'}`}>
                        {route.localPref}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        {route.asPath.map((as, aIdx) => (
                          <span key={aIdx} className="px-1.5 py-0.5 rounded bg-[#232a36] text-[#4cd7f6] font-bold mr-1 text-[10px]">
                            {as}
                          </span>
                        ))}
                        <span className="text-[#4edea3] font-semibold">{route.origin}</span>
                      </td>
                      <td className="py-2 px-3 text-[10px]">
                        {route.communities.map((c, cIdx) => (
                          <span key={cIdx} className="px-1 py-0.5 rounded bg-[#232a36] text-[#bcc9cd] mr-1">
                            {c}
                          </span>
                        ))}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button className="p-1 rounded bg-[#232a36] text-[#4cd7f6] hover:bg-[#4cd7f6] hover:text-[#003640] transition-colors">
                          <span className="material-symbols-outlined text-[15px]">visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AS-Path Vector Visualizer */}
          <div className="p-4 rounded-xl bg-[#141c27] border border-[#2d3541] flex flex-col gap-3 font-mono">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">schema</span>
                <span className="font-['Geist'] text-xs font-semibold text-white">
                  AS-Path Topology & Next-Hop Verification
                </span>
                <span className="px-2 py-0.5 rounded bg-[#18202b] text-[#869397] text-[10px] border border-[#2d3541]">
                  Prefix: {selectedRoute.prefix}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#4edea3] text-[11px]">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>RPKI ROA VALID (MaxLen 24, AS13335)</span>
              </div>
            </div>

            {/* Diagram */}
            <div className="p-4 rounded-lg bg-[#070f19] border border-[#2d3541] flex flex-col lg:flex-row items-center justify-between gap-4 overflow-x-auto">
              {/* Origin */}
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className="w-10 h-10 rounded-lg bg-[#141c27] border border-[#2d3541] flex items-center justify-center text-[#4edea3]">
                  <span className="material-symbols-outlined text-[20px]">router</span>
                </div>
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-white">AS212450</span>
                  <span className="text-[#869397] text-[10px]">Your Node (Edge-GW01)</span>
                  <span className="text-[#4edea3] text-[10px]">IP: 195.228.240.15</span>
                </div>
              </div>

              {/* Interconnect 1 */}
              <div className="flex-1 flex flex-col items-center min-w-[130px] px-2 text-[10px]">
                <div className="flex justify-between w-full text-[#869397] mb-1">
                  <span>10G Direct IX</span>
                  <span className="text-[#4edea3] font-bold">1.12ms</span>
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-[#4edea3] to-[#4cd7f6] rounded-full animate-pulse" />
                <span className="text-[#869397] mt-1">Interface: eth0 (VLAN 100)</span>
              </div>

              {/* Peer */}
              <div className="flex items-center gap-3 min-w-[220px]">
                <div className="w-10 h-10 rounded-lg bg-[#06b6d4]/15 border border-[#4cd7f6]/40 flex items-center justify-center text-[#4cd7f6]">
                  <span className="material-symbols-outlined text-[20px]">hub</span>
                </div>
                <div className="flex flex-col text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#4cd7f6]">{selectedRoute.peerAsn}</span>
                    <span className="text-[9px] px-1 rounded bg-[#4cd7f6]/20 text-[#4cd7f6]">eBGP PEER</span>
                  </div>
                  <span className="text-white text-[11px]">{selectedRoute.peerName}</span>
                  <span className="text-[#869397] text-[10px]">NextHop: {selectedRoute.nextHop}</span>
                </div>
              </div>

              {/* Interconnect 2 */}
              <div className="flex-1 flex flex-col items-center min-w-[130px] px-2 text-[10px]">
                <div className="flex justify-between w-full text-[#869397] mb-1">
                  <span>Direct Peering</span>
                  <span className="text-[#4edea3] font-bold">0 AS-Hops</span>
                </div>
                <div className="w-full h-1 bg-[#4cd7f6]/60 rounded-full" />
                <span className="text-[#4cd7f6] mt-1">Shortest Path Tie-break</span>
              </div>

              {/* Target */}
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className="w-10 h-10 rounded-lg bg-[#141c27] border border-[#2d3541] flex items-center justify-center text-[#4cd7f6]">
                  <span className="material-symbols-outlined text-[20px]">cloud_done</span>
                </div>
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-white">Target Subnet</span>
                  <span className="text-[#869397] text-[10px]">{selectedRoute.prefix}</span>
                  <span className="text-[#4edea3] text-[10px]">FIB: In-Hardware ECMP</span>
                </div>
              </div>
            </div>

            {/* BFD Detection Bar */}
            <div className="px-3 py-1.5 rounded bg-[#18202b] border border-[#2d3541] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#bcc9cd]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
                <span>BFD Session: <strong className="text-[#4edea3]">UP</strong></span>
                <span className="text-[#869397]">|</span>
                <span>Interval: Tx 50ms / Rx 50ms</span>
                <span className="text-[#869397]">|</span>
                <span>Holddown: 150ms</span>
              </div>
              <div className="flex items-center gap-3">
                <span>Pkts Lost: <strong className="text-[#4edea3]">0</strong></span>
                <button
                  type="button"
                  onClick={() => alert('BFD Session 195.66.225.10 State: UP, Disc: 184201, Multiplier: 3')}
                  className="text-[#4cd7f6] hover:underline cursor-pointer"
                >
                  Dump BFD Log
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#18202b] border-t border-[#2d3541] flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 text-[#869397] text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
              <span className="text-white">BIRD2 Protocol Daemon: <strong className="text-[#4edea3]">Synced</strong> (Re-eval in 48s)</span>
              <span>•</span>
              <span>eBPF XDP FIB: <strong className="text-[#4cd7f6]">ACTIVE</strong></span>
              <span>•</span>
              <span>RPKI ROA: <strong className="text-[#4edea3]">100% VALID</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#bcc9cd]">
              <span className="text-[#4cd7f6] font-bold">$</span>
              <span>birdc show route for {selectedRoute.prefix} all</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={handleClearDampening}
              className="px-3.5 py-1.5 rounded-lg bg-[#232a36] text-[#ffb4ab] hover:bg-[#93000a]/20 border border-[#2d3541] transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">restart_alt</span>
              <span>{isDampeningCleared ? 'Dampening Cleared!' : 'Clear Dampening'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#232a36] hover:bg-[#323a46] text-[#bcc9cd] hover:text-white transition-colors"
            >
              Close Explorer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
