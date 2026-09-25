import React, { useState } from 'react';

interface GeoIpPerimeterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeoIpPerimeterModal: React.FC<GeoIpPerimeterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [policyMode, setPolicyMode] = useState<'whitelist' | 'blacklist' | 'isolation'>('whitelist');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [searchQuery, setSearchQuery] = useState('HU, DE, AT, CH, US, RU, CN, KP, IR');

  const [countries, setCountries] = useState([
    { code: 'HU', name: 'Hungary', flag: '🇭🇺', action: 'ALLOW' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', action: 'ALLOW' },
    { code: 'AT', name: 'Austria', flag: '🇦🇹', action: 'ALLOW' },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭', action: 'ALLOW' },
    { code: 'US', name: 'United States', flag: '🇺🇸', action: 'ALLOW (CDN ONLY)' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺', action: 'BLOCKED' },
    { code: 'CN', name: 'China', flag: '🇨🇳', action: 'BLOCKED' },
    { code: 'KP', name: 'North Korea', flag: '🇰🇵', action: 'BLOCKED' },
    { code: 'IR', name: 'Iran', flag: '🇮🇷', action: 'BLOCKED' },
  ]);

  const [bypassCloudflare, setBypassCloudflare] = useState(true);
  const [bypassGithub, setBypassGithub] = useState(true);
  const [customCidr, setCustomCidr] = useState('');
  const [dryRunStatus, setDryRunStatus] = useState<string | null>(null);
  const [commitStatus, setCommitStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const removeCountry = (code: string) => {
    setCountries((prev) => prev.filter((c) => c.code !== code));
  };

  const handleDryRun = () => {
    setDryRunStatus('simulating');
    setTimeout(() => {
      setDryRunStatus('0 False Positives (142k routes OK)');
      setTimeout(() => setDryRunStatus(null), 3000);
    }, 900);
  };

  const handleCommit = () => {
    setCommitStatus('committing');
    setTimeout(() => {
      setCommitStatus('committed');
      setTimeout(() => {
        setCommitStatus(null);
        onClose();
      }, 1400);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070f19]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-6xl my-auto bg-[#141c27] rounded-xl shadow-[0_24px_64px_rgba(0,0,0,0.85)] flex flex-col max-h-[92vh] overflow-hidden border border-[#2d3541] text-[#dbe3f2]">
        {/* Top Neon Decorative Strip */}
        <div className="h-0.5 w-full bg-gradient-to-r from-[#06b6d4] via-[#4cd7f6] to-[#4edea3]" />

        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#18202b] flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2d3541]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-['Geist'] text-lg font-bold text-[#dbe3f2]">FR_OS</span>
              <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-['Geist'] text-base md:text-lg text-[#dbe3f2] font-semibold">
                  Geo-IP Country Filter & Perimeter Policy
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#232a36] text-[#4cd7f6] border border-[#2d3541]">
                  // EBPF_LPM_TRIE_MAP
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" /> MAXMIND GEOIP2 ENTERPRISE READY
                </span>
                <span className="px-2 py-0.5 rounded bg-[#232a36] text-[#bcc9cd] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[12px]">bolt</span> KERNEL ACCELERATION: XDP_DROP 0.001ms
                </span>
                <span className="px-2 py-0.5 rounded bg-[#232a36] text-[#869397]">
                  NAMESPACE: filter.geoip.ingress_egress
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#232a36] flex items-center justify-center text-[#bcc9cd] hover:text-white transition-all self-start md:self-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 bg-[#0c141f]">
          {/* SECTION 01: Policy Mode */}
          <section className="space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[#4cd7f6] font-bold">01 //</span>
                <h3 className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">
                  Policy Action & Directional Enforcement
                </h3>
              </div>
              <span className="text-[#869397] uppercase text-[10px]">Hardware Offload: Enabled</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Whitelist */}
              <div
                onClick={() => setPolicyMode('whitelist')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  policyMode === 'whitelist'
                    ? 'bg-[#18202b] border-[#4cd7f6] shadow-md'
                    : 'bg-[#141c27] border-[#2d3541] hover:border-[#869397]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">verified_user</span>
                    <span className="font-mono text-xs text-[#4cd7f6] font-bold uppercase">Whitelist Only</span>
                  </div>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#4cd7f6]/10 text-[#4cd7f6] uppercase">
                    Strict Allow
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#bcc9cd] leading-relaxed">
                  Block all ingress packets by default unless origins match explicitly authorized geographic CIDR blocks. Recommended hardened posture.
                </p>
                <div className="mt-3 pt-2 border-t border-[#2d3541]/40 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#4edea3] flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" /> ACTIVE MODE
                  </span>
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">
                    {policyMode === 'whitelist' ? 'radio_button_checked' : 'radio_button_unchecked'}
                  </span>
                </div>
              </div>

              {/* Blacklist */}
              <div
                onClick={() => setPolicyMode('blacklist')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  policyMode === 'blacklist'
                    ? 'bg-[#18202b] border-[#4cd7f6] shadow-md'
                    : 'bg-[#141c27] border-[#2d3541] hover:border-[#869397]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#ffb4ab] text-[20px]">gpp_bad</span>
                    <span className="font-mono text-xs text-[#dbe3f2] font-semibold uppercase">Blacklist Only</span>
                  </div>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#232a36] text-[#bcc9cd] uppercase">
                    Targeted Deny
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#bcc9cd] leading-relaxed">
                  Pass global internet transit transparently, dropping packets from selected threat clusters, OFAC embargo lists, and scan engines.
                </p>
                <div className="mt-3 pt-2 border-t border-[#2d3541]/40 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#869397]">STANDBY MODE</span>
                  <span className="material-symbols-outlined text-[#869397] text-[18px]">
                    {policyMode === 'blacklist' ? 'radio_button_checked' : 'radio_button_unchecked'}
                  </span>
                </div>
              </div>

              {/* Isolation Tag */}
              <div
                onClick={() => setPolicyMode('isolation')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  policyMode === 'isolation'
                    ? 'bg-[#18202b] border-[#4cd7f6] shadow-md'
                    : 'bg-[#141c27] border-[#2d3541] hover:border-[#869397]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#d0bcff] text-[20px]">tag</span>
                    <span className="font-mono text-xs text-[#dbe3f2] font-semibold uppercase">Isolation Bypass</span>
                  </div>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#232a36] text-[#d0bcff] uppercase">
                    Audit & Tag
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#bcc9cd] leading-relaxed">
                  Kernel marks SKB socket buffers with geo-tags for upstream Suricata IPS inspection and QoS rate limiters without immediate hard drops.
                </p>
                <div className="mt-3 pt-2 border-t border-[#2d3541]/40 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#869397]">OBSERVE ONLY</span>
                  <span className="material-symbols-outlined text-[#869397] text-[18px]">
                    {policyMode === 'isolation' ? 'radio_button_checked' : 'radio_button_unchecked'}
                  </span>
                </div>
              </div>
            </div>

            {/* Vectors */}
            <div className="p-3 rounded-lg bg-[#141c27] border border-[#2d3541] flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs">
              <span className="font-semibold uppercase text-[#dbe3f2]">Target Traffic Flow Vectors:</span>
              <div className="flex flex-wrap items-center gap-2">
                <div className="px-3 py-1 rounded bg-[#18202b] border border-[#2d3541] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#4edea3]" />
                  <span className="font-bold text-[#dbe3f2]">WAN Ingress</span>
                  <span className="text-[#4edea3] text-[10px]">(Enforced)</span>
                </div>
                <div className="px-3 py-1 rounded bg-[#18202b] border border-[#2d3541] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#4cd7f6]" />
                  <span className="font-bold text-[#dbe3f2]">LAN Egress</span>
                  <span className="text-[#4cd7f6] text-[10px]">(C2 Quarantine)</span>
                </div>
                <div className="px-3 py-1 rounded bg-[#18202b] border border-[#2d3541] flex items-center gap-2 opacity-60">
                  <div className="w-2 h-2 rounded-full bg-[#869397]" />
                  <span className="font-bold text-[#869397]">Inter-VLAN</span>
                  <span className="text-[#869397] text-[10px]">(Bypassed)</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 02: Quick Presets */}
          <section className="space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[#4cd7f6] font-bold">02 //</span>
                <h3 className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">
                  Quick Presets & High-Risk Threat Packs
                </h3>
              </div>
              <span className="text-[#869397] text-[10px]">Click to batch select / sync</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
              <div className="p-3 rounded-lg bg-[#141c27] border border-[#2d3541] flex flex-col justify-between gap-1 hover:border-[#4cd7f6] cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[#4cd7f6] font-bold">CEE Cluster</span>
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[14px]">add_circle</span>
                </div>
                <span className="text-[#dbe3f2] text-[11px] leading-tight font-medium">Domestic & CEE (HU + 7 Borders)</span>
                <span className="text-[#869397] text-[10px]">1,842 CIDRs</span>
              </div>

              <div className="p-3 rounded-lg bg-[#141c27] border border-[#2d3541] flex flex-col justify-between gap-1 hover:border-[#4edea3] cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[#4edea3] font-bold">EU / EEA Pack</span>
                  <span className="material-symbols-outlined text-[#4edea3] text-[14px]">check_circle</span>
                </div>
                <span className="text-[#dbe3f2] text-[11px] leading-tight font-medium">EU States (30 Nations)</span>
                <span className="text-[#869397] text-[10px]">48,290 CIDRs</span>
              </div>

              <div className="p-3 rounded-lg bg-[#141c27] border border-[#2d3541] flex flex-col justify-between gap-1 hover:border-[#869397] cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[#dbe3f2] font-bold">NATO Transit</span>
                  <span className="material-symbols-outlined text-[#869397] text-[14px]">add_circle</span>
                </div>
                <span className="text-[#dbe3f2] text-[11px] leading-tight font-medium">NATO Allied Zones</span>
                <span className="text-[#869397] text-[10px]">62,110 CIDRs</span>
              </div>

              <div className="p-3 rounded-lg bg-[#141c27] border border-[#2d3541] flex flex-col justify-between gap-1 hover:border-[#ffb4ab] cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[#ffb4ab] font-bold">Tor & Anon</span>
                  <span className="material-symbols-outlined text-[#ffb4ab] text-[14px]">block</span>
                </div>
                <span className="text-[#dbe3f2] text-[11px] leading-tight font-medium">Tor Relays & VPNs</span>
                <span className="text-[#ffb4ab] text-[10px]">2,410 IPs Auto</span>
              </div>

              <div className="p-3 rounded-lg bg-[#141c27] border border-[#2d3541] flex flex-col justify-between gap-1 hover:border-[#ffb4ab] cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[#ffb4ab] font-bold">OFAC Embargo</span>
                  <span className="material-symbols-outlined text-[#ffb4ab] text-[14px]">block</span>
                </div>
                <span className="text-[#dbe3f2] text-[11px] leading-tight font-medium">OFAC Jurisdictions</span>
                <span className="text-[#ffb4ab] text-[10px]">12 Regions</span>
              </div>

              <div className="p-3 rounded-lg bg-[#141c27] border border-[#2d3541] flex flex-col justify-between gap-1 hover:border-[#ffb4ab] cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[#ffb4ab] font-bold">Hostile Scanners</span>
                  <span className="material-symbols-outlined text-[#ffb4ab] text-[14px]">warning</span>
                </div>
                <span className="text-[#dbe3f2] text-[11px] leading-tight font-medium">RU/CN/KP/IR/BY</span>
                <span className="text-[#ffb4ab] text-[10px]">XDP Pre-drop</span>
              </div>
            </div>
          </section>

          {/* SECTION 03: Country Matrix */}
          <section className="space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[#4cd7f6] font-bold">03 //</span>
                <h3 className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">
                  Interactive Country Matrix & LPM Prefix Allocations
                </h3>
              </div>
              <div className="text-[11px] text-[#bcc9cd] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">memory</span>
                <span>Prefixes: 171,330 | RAM: 14.2 MB</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141c27] border border-[#2d3541] space-y-3">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#869397] text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-1.5 bg-[#070f19] border border-[#2d3541] rounded-lg text-xs text-[#dbe3f2] focus:outline-none"
                    placeholder="Search country or ISO code..."
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto text-[10px]">
                  {['All', 'Europe', 'North America', 'Asia', 'South America', 'Africa'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedContinent(c)}
                      className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                        selectedContinent === c
                          ? 'bg-[#06b6d4] text-[#00424f] font-bold'
                          : 'bg-[#18202b] text-[#bcc9cd] hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Country Chips */}
              <div className="flex flex-wrap items-center gap-2">
                {countries.map((c) => {
                  const isAllow = c.action.includes('ALLOW');
                  return (
                    <div
                      key={c.code}
                      className={`px-2.5 py-1 rounded-md border flex items-center gap-2 text-xs font-mono font-medium ${
                        isAllow
                          ? 'bg-[#4edea3]/10 border-[#4edea3]/30 text-[#4edea3]'
                          : 'bg-[#93000a]/20 border-[#ffb4ab]/30 text-[#ffb4ab]'
                      }`}
                    >
                      <span>{c.flag} {c.name} ({c.code})</span>
                      <span className={`text-[9px] px-1 rounded font-bold ${
                        isAllow ? 'bg-[#4edea3]/20 text-[#4edea3]' : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                      }`}>
                        {c.action}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeCountry(c.code)}
                        className="hover:opacity-100 opacity-60 text-xs flex items-center cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[13px]">cancel</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Memory stats */}
              <div className="p-2.5 rounded-lg bg-[#070f19] border border-[#2d3541] flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs font-mono text-[#bcc9cd]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#4cd7f6]" /> 148,920 IPv4 subnets</span>
                  <span>/</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#4edea3]" /> 22,410 IPv6 prefixes</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#869397]">Structure: BPF_MAP_TYPE_LPM_TRIE</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#232a36] text-[#4cd7f6] font-bold">14.2 MB RAM</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 04: Exceptions & Overrides */}
          <section className="space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[#4cd7f6] font-bold">04 //</span>
                <h3 className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">
                  Exceptions, CDN Bypasses & Custom CIDR Overrides
                </h3>
              </div>
              <span className="text-[#4edea3] text-[10px]">Anti-False Positive Protection</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#141c27] border border-[#2d3541] flex flex-col justify-between gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">Bypass Cloudflare Anycast</span>
                    <button
                      onClick={() => setBypassCloudflare(!bypassCloudflare)}
                      className={`w-7 h-4 rounded-full p-0.5 flex transition-colors ${
                        bypassCloudflare ? 'bg-[#4cd7f6] justify-end' : 'bg-[#2d3541] justify-start'
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full bg-[#070f19]" />
                    </button>
                  </div>
                  <p className="text-[10px] text-[#bcc9cd]">
                    Permit verified Cloudflare ASN 13335 reverse proxy edge IPs regardless of origin country.
                  </p>
                </div>
                <span className="text-[10px] text-[#4cd7f6]">14 IPv4 / 7 IPv6 Ranges Loaded</span>
              </div>

              <div className="p-3 rounded-xl bg-[#141c27] border border-[#2d3541] flex flex-col justify-between gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">GitHub Webhooks & API</span>
                    <button
                      onClick={() => setBypassGithub(!bypassGithub)}
                      className={`w-7 h-4 rounded-full p-0.5 flex transition-colors ${
                        bypassGithub ? 'bg-[#4cd7f6] justify-end' : 'bg-[#2d3541] justify-start'
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full bg-[#070f19]" />
                    </button>
                  </div>
                  <p className="text-[10px] text-[#bcc9cd]">
                    Allow automated CI/CD webhooks and actions runners globally without geo-quarantine blocks.
                  </p>
                </div>
                <span className="text-[10px] text-[#4edea3]">Auto-Synced via GitHub API meta</span>
              </div>

              <div className="p-3 rounded-xl bg-[#141c27] border border-[#2d3541] flex flex-col justify-between gap-2 opacity-90">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">RFC 1918 / CGNAT Bypass</span>
                    <span className="material-symbols-outlined text-[#4edea3] text-[16px]">lock</span>
                  </div>
                  <p className="text-[10px] text-[#bcc9cd]">
                    10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 and 100.64.0.0/10 routing is perpetually bypassed.
                  </p>
                </div>
                <span className="text-[10px] text-[#869397]">Immutable Kernel Rule</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#141c27] border border-[#2d3541] space-y-1.5">
              <label className="text-xs text-[#dbe3f2] font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[16px]">add_moderator</span>
                Custom IP / CIDR Override Whitelist (Static Remote Workers & Partner VPNs)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customCidr}
                  onChange={(e) => setCustomCidr(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-[#070f19] border border-[#2d3541] rounded-lg text-xs text-[#dbe3f2] placeholder:text-[#869397] focus:outline-none"
                  placeholder="e.g. 198.51.100.0/24 (Remote worker static IP in denied zone), 203.0.113.50/32"
                />
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-[#232a36] hover:bg-[#323a46] text-[#dbe3f2] text-xs transition-colors"
                >
                  Add Exemption
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 05: nftables CLI Preview */}
          <section className="space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[#4cd7f6] font-bold">05 //</span>
                <h3 className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">
                  Real-Time Linux nftables & eBPF LPM-Trie CLI Preview
                </h3>
              </div>
              <span className="text-[#4cd7f6] flex items-center gap-1 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse" /> Live Kernel Synced
              </span>
            </div>

            <div className="rounded-xl bg-[#070f19] border border-[#2d3541] overflow-hidden text-xs">
              <div className="p-3 space-y-1 text-[#bcc9cd]">
                <div className="text-[#869397]"># Generated dynamically by FR_OS Security Engine</div>
                <div><span className="text-[#4cd7f6] font-semibold">nft</span> add table inet geoip_perimeter</div>
                <div><span className="text-[#4cd7f6] font-semibold">nft</span> add set inet geoip_perimeter allowed_countries {'{ type ipv4_addr; flags interval; }'}</div>
                <div>
                  <span className="text-[#4cd7f6] font-semibold">nft</span> add rule inet geoip_perimeter prerouting{' '}
                  <span className="text-[#4edea3]">ip saddr != @allowed_countries</span> iifname <span className="text-[#06b6d4]">"eth0"</span>{' '}
                  <span className="text-[#ffb4ab] font-semibold">counter drop</span>
                </div>
                <div className="text-[#4edea3]">bpftool map update name geoip_lpm_trie key hex 0a 00 00 00 value hex 01 00 00 00</div>
              </div>
              <div className="px-3 py-1.5 bg-[#141c27] text-[#869397] text-[10px] flex items-center justify-between border-t border-[#2d3541]">
                <span>Lookup latency: <strong className="text-[#4edea3]">12ns</strong> per packet</span>
                <span>NIC Hardware Offload: Intel X520-DA2 SFP28 (xdpdrv mode)</span>
              </div>
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#18202b] border-t border-[#2d3541] flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-[#869397]">
            <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">sync</span>
            <span>Database: <strong className="text-white">MaxMind GeoLite2-Country</strong> (Synced 03:00 UTC)</span>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#232a36] hover:bg-[#323a46] text-[#bcc9cd] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDryRun}
              className="px-4 py-1.5 rounded-lg bg-[#141c27] border border-[#2d3541] hover:bg-[#18202b] text-white flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">play_circle</span>
              <span>{dryRunStatus || 'Dry-Run Simulation'}</span>
            </button>
            <button
              onClick={handleCommit}
              className="px-5 py-1.5 rounded-lg bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-bold shadow-[0_0_16px_rgba(6,182,212,0.4)] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">verified</span>
              <span>
                {commitStatus === 'committing'
                  ? 'Updating eBPF Trie...'
                  : commitStatus === 'committed'
                  ? 'Policy Active!'
                  : 'Commit Geo-IP Policy & Update eBPF Trie'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
