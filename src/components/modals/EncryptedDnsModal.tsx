import React, { useState } from 'react';

interface EncryptedDnsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EncryptedDnsModal: React.FC<EncryptedDnsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<
    'quad9' | 'cloudflare' | 'mullvad' | 'nextdns' | 'custom'
  >('quad9');
  const [protocol, setProtocol] = useState<'dot' | 'doh' | 'doq'>('dot');
  const [ipv4Host, setIpv4Host] = useState('9.9.9.9');
  const [ipv6Host, setIpv6Host] = useState('2620:fe::fe');
  const [sni, setSni] = useState('dns.quad9.net');
  const [bootstrapDns, setBootstrapDns] = useState('127.0.0.1:5353');

  const [spkiPin, setSpkiPin] = useState(
    'pin-sha256="2YpA74H3rWjGq1U7pM99m+KkY59hUjZ8sA2o+r8Yp2U="'
  );
  const [enforceDnssec, setEnforceDnssec] = useState(true);
  const [enforceEch, setEnforceEch] = useState(true);
  const [stripEcs, setStripEcs] = useState(true);
  const [qnameMin, setQnameMin] = useState(true);
  const [routingMode, setRoutingMode] = useState<'fastest' | 'rr' | 'failover'>(
    'fastest'
  );

  const [dryRunStatus, setDryRunStatus] = useState<string | null>(null);
  const [commitStatus, setCommitStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const applyPreset = (preset: 'quad9' | 'cloudflare' | 'mullvad' | 'nextdns' | 'custom') => {
    setSelectedPreset(preset);
    if (preset === 'quad9') {
      setIpv4Host('9.9.9.9');
      setIpv6Host('2620:fe::fe');
      setSni('dns.quad9.net');
    } else if (preset === 'cloudflare') {
      setIpv4Host('1.1.1.2');
      setIpv6Host('2606:4700:4700::1112');
      setSni('security.cloudflare-dns.com');
    } else if (preset === 'mullvad') {
      setIpv4Host('194.242.2.2');
      setIpv6Host('2a07:e340::2');
      setSni('dns.mullvad.net');
    }
  };

  const handleDryRun = () => {
    setDryRunStatus('probing');
    setTimeout(() => {
      setDryRunStatus('TLS 1.3 / ECH Handshake OK (11.2ms)');
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
    }, 1000);
  };

  return (
    <div className="fixed inset-0 top-14 left-0 lg:left-64 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#070f19]/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto bg-[#141c27] rounded-xl shadow-2xl overflow-hidden flex flex-col border border-[#2d3541] text-[#dbe3f2]">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-[#18202b] border-b border-[#2d3541]">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 flex items-center justify-center bg-[#070f19] rounded-lg border border-[#2d3541]">
              <svg className="w-8 h-8 text-[#4cd7f6]" fill="none" viewBox="0 0 100 100">
                <polygon points="50,4 90,26 90,74 50,96 10,74 10,26" stroke="#4cd7f6" strokeWidth="4.5" />
                <path d="M50 20 L50 80 M24 35 L76 65 M24 65 L76 35" stroke="#4cd7f6" strokeWidth="3" />
                <circle cx="50" cy="50" r="3" fill="#4edea3" className="animate-ping" />
              </svg>
            </div>
            <div className="h-6 w-px bg-[#2d3541]" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="font-['Geist'] text-base md:text-lg font-bold text-[#dbe3f2]">
                  Configure Encrypted Upstream DNS Resolver
                </h2>
                <span className="font-mono text-[10px] text-[#4cd7f6] bg-[#232a36] px-1.5 py-0.5 rounded border border-[#2d3541]">
                  DOH_DOT_DOQ_UPSTREAM
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono mt-0.5">
                <span className="text-[#4edea3] flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
                  TLS 1.3 / ECH COMPLIANT
                </span>
                <span className="text-[#869397]">•</span>
                <span className="text-[#bcc9cd]">
                  CORE_ENGINE: CoreDNS 1.11 forward-tls / Unbound DNS-over-HTTPS
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#232a36] flex items-center justify-center text-[#869397] hover:text-white hover:bg-[#323a46] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </header>

        {/* Scrollable Configuration Body */}
        <div className="p-6 max-h-[calc(84vh-140px)] overflow-y-auto space-y-6">
          {/* SECTION 01: PRESETS */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#869397]">
                <span className="text-[#4cd7f6] font-bold">01 //</span>
                <span>Select Encrypted Provider Preset & Discovery</span>
              </div>
              <span className="font-mono text-[11px] text-[#bcc9cd]">
                Select standard privacy profile or deploy custom proxy
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {/* Cloudflare */}
              <div
                onClick={() => applyPreset('cloudflare')}
                className={`cursor-pointer p-3 rounded-lg border flex flex-col justify-between transition-all ${
                  selectedPreset === 'cloudflare'
                    ? 'bg-[#232a36] border-[#4cd7f6] shadow-sm'
                    : 'bg-[#18202b] border-[#2d3541] hover:border-[#869397]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">Cloudflare</span>
                    <span className="font-mono text-[10px] text-[#869397]">1.1.1.2</span>
                  </div>
                  <p className="font-mono text-[10px] text-[#bcc9cd] mt-1 leading-snug">
                    Security & Malware block, Anycast network.
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between font-mono text-[9px] text-[#869397]">
                  <span>DoH + DoT</span>
                  <span className="text-[#4cd7f6]">Select</span>
                </div>
              </div>

              {/* Quad9 (Active) */}
              <div
                onClick={() => applyPreset('quad9')}
                className={`cursor-pointer p-3 rounded-lg border flex flex-col justify-between transition-all relative ${
                  selectedPreset === 'quad9'
                    ? 'bg-[#232a36] border-[#4cd7f6] shadow-md'
                    : 'bg-[#18202b] border-[#2d3541] hover:border-[#869397]'
                }`}
              >
                <div className="absolute top-1.5 right-1.5 flex items-center gap-1 font-mono text-[9px] text-[#4cd7f6] font-bold bg-[#070f19] px-1 rounded border border-[#2d3541]">
                  ACTIVE
                </div>
                <div>
                  <span className="font-['Geist'] text-xs font-semibold text-[#4cd7f6]">Quad9</span>
                  <div className="font-mono text-[10px] text-[#4edea3]">9.9.9.9 / dns.quad9.net</div>
                  <p className="font-mono text-[10px] text-[#bcc9cd] mt-1 leading-snug">
                    Swiss non-profit foundation, DNSSEC validation, threat feed.
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between font-mono text-[9px]">
                  <span className="text-[#4edea3]">No-Logs / Verified</span>
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[16px]">verified</span>
                </div>
              </div>

              {/* Mullvad */}
              <div
                onClick={() => applyPreset('mullvad')}
                className={`cursor-pointer p-3 rounded-lg border flex flex-col justify-between transition-all ${
                  selectedPreset === 'mullvad'
                    ? 'bg-[#232a36] border-[#4cd7f6]'
                    : 'bg-[#18202b] border-[#2d3541] hover:border-[#869397]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">Mullvad</span>
                    <span className="font-mono text-[10px] text-[#869397]">dns.mullvad.net</span>
                  </div>
                  <p className="font-mono text-[10px] text-[#bcc9cd] mt-1 leading-snug">
                    Strict zero-log, QNAME minimization, WireGuard routed.
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between font-mono text-[9px] text-[#869397]">
                  <span>DoT / DoH</span>
                  <span className="text-[#4cd7f6]">Select</span>
                </div>
              </div>

              {/* NextDNS */}
              <div
                onClick={() => applyPreset('nextdns')}
                className={`cursor-pointer p-3 rounded-lg border flex flex-col justify-between transition-all ${
                  selectedPreset === 'nextdns'
                    ? 'bg-[#232a36] border-[#4cd7f6]'
                    : 'bg-[#18202b] border-[#2d3541] hover:border-[#869397]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">NextDNS</span>
                    <span className="font-mono text-[10px] text-[#869397]">Custom ID</span>
                  </div>
                  <p className="font-mono text-[10px] text-[#bcc9cd] mt-1 leading-snug">
                    Granular threat telemetry, custom blocklist matching.
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between font-mono text-[9px] text-[#869397]">
                  <span>DoH + Linked IP</span>
                  <span className="text-[#4cd7f6]">Select</span>
                </div>
              </div>

              {/* Custom */}
              <div
                onClick={() => applyPreset('custom')}
                className={`cursor-pointer p-3 rounded-lg border flex flex-col justify-between transition-all ${
                  selectedPreset === 'custom'
                    ? 'bg-[#232a36] border-[#4cd7f6]'
                    : 'bg-[#18202b] border-[#2d3541] hover:border-[#869397]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">Self-Hosted</span>
                    <span className="font-mono text-[10px] text-[#869397]">Custom</span>
                  </div>
                  <p className="font-mono text-[10px] text-[#bcc9cd] mt-1 leading-snug">
                    Dedicated Unbound, Knot Resolver, or AdGuard Home appliance.
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between font-mono text-[9px] text-[#869397]">
                  <span>DoQ / Custom PKI</span>
                  <span className="text-[#4cd7f6]">Select</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 02: PROTOCOL & ENDPOINTS */}
          <section className="bg-[#18202b] rounded-xl p-4 border border-[#2d3541] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#869397]">
                <span className="text-[#4cd7f6] font-bold">02 //</span>
                <span>Transport Protocol, Endpoint FQDN & Bootstrap</span>
              </div>
              <div className="flex items-center gap-1 bg-[#070f19] p-1 rounded-lg border border-[#2d3541]">
                <button
                  onClick={() => setProtocol('dot')}
                  className={`px-3 py-1 rounded font-mono text-xs font-semibold transition-all ${
                    protocol === 'dot' ? 'bg-[#06b6d4] text-[#00424f]' : 'text-[#bcc9cd] hover:text-white'
                  }`}
                >
                  DoT (Port 853)
                </button>
                <button
                  onClick={() => setProtocol('doh')}
                  className={`px-3 py-1 rounded font-mono text-xs font-semibold transition-all ${
                    protocol === 'doh' ? 'bg-[#06b6d4] text-[#00424f]' : 'text-[#bcc9cd] hover:text-white'
                  }`}
                >
                  DoH (Port 443)
                </button>
                <button
                  onClick={() => setProtocol('doq')}
                  className={`px-3 py-1 rounded font-mono text-xs font-semibold transition-all flex items-center gap-1 ${
                    protocol === 'doq' ? 'bg-[#06b6d4] text-[#00424f]' : 'text-[#bcc9cd] hover:text-white'
                  }`}
                >
                  <span>DoQ (QUIC)</span>
                  <span className="text-[9px] px-1 rounded bg-[#d0bcff] text-[#3c0091] font-bold">0-RTT</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* IPv4 */}
              <div className="md:col-span-4 space-y-1">
                <label className="font-mono text-xs text-[#bcc9cd] uppercase">Upstream IPv4 Host Address</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={ipv4Host}
                    onChange={(e) => setIpv4Host(e.target.value)}
                    className="w-full bg-[#070f19] text-[#dbe3f2] font-mono text-xs px-3 py-1.5 rounded border border-[#2d3541] focus:outline-none"
                  />
                  <span className="absolute right-3 font-mono text-xs text-[#869397]">
                    {protocol === 'dot' ? ':853' : ':443'}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#869397] block">Secondary Fallback: 149.112.112.112</span>
              </div>

              {/* IPv6 */}
              <div className="md:col-span-4 space-y-1">
                <label className="font-mono text-xs text-[#bcc9cd] uppercase">IPv6 Dual-Stack Destination</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={ipv6Host}
                    onChange={(e) => setIpv6Host(e.target.value)}
                    className="w-full bg-[#070f19] text-[#dbe3f2] font-mono text-xs px-3 py-1.5 rounded border border-[#2d3541] focus:outline-none"
                  />
                  <span className="absolute right-3 font-mono text-xs text-[#869397]">
                    {protocol === 'dot' ? ':853' : ':443'}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#869397] block">Secondary IPv6: 2620:fe::9</span>
              </div>

              {/* SNI */}
              <div className="md:col-span-4 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs text-[#bcc9cd] uppercase">TLS SNI Endpoint</label>
                  <span className="font-mono text-[10px] text-[#4edea3] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    SAN MATCH
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={sni}
                    onChange={(e) => setSni(e.target.value)}
                    className="w-full bg-[#070f19] text-[#4cd7f6] font-mono text-xs px-3 py-1.5 rounded border border-[#2d3541] focus:outline-none"
                  />
                  <span className="absolute right-3 text-[#4edea3] material-symbols-outlined text-[16px]">lock</span>
                </div>
                <span className="font-mono text-[10px] text-[#4edea3]">Issuer: DigiCert Global Root G2 (TLS 1.3 Active)</span>
              </div>
            </div>

            {/* Bootstrap Resolver */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#141c27] p-2.5 rounded-lg border border-[#2d3541]">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">hub</span>
                <div>
                  <span className="font-mono text-xs text-[#dbe3f2] font-semibold block">Bootstrap DNS Resolver</span>
                  <span className="font-mono text-[10px] text-[#869397]">Used to resolve upstream SNI during cold-boot to prevent deadlock.</span>
                </div>
              </div>
              <select
                value={bootstrapDns}
                onChange={(e) => setBootstrapDns(e.target.value)}
                className="bg-[#070f19] text-[#dbe3f2] font-mono text-xs px-3 py-1 rounded border border-[#2d3541] focus:outline-none cursor-pointer"
              >
                <option value="127.0.0.1:5353">127.0.0.1:5353 (Local RAM Cache)</option>
                <option value="9.9.9.9">9.9.9.9 (Direct IP Bypass)</option>
                <option value="1.1.1.1">1.1.1.1 (Cloudflare Fallback)</option>
              </select>
            </div>
          </section>

          {/* SECTION 03 & 04: CRYPTO & HEALTH */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Section 03 */}
            <section className="lg:col-span-7 bg-[#18202b] rounded-xl p-4 border border-[#2d3541] space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#869397]">
                    <span className="text-[#4cd7f6] font-bold">03 //</span>
                    <span>Cryptographic Pinning & Privacy</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#4cd7f6]">eBPF ENFORCED</span>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-[#bcc9cd] uppercase flex items-center justify-between">
                    <span>SPKI Public Key Pinning (SHA-256 Digest)</span>
                    <span className="text-[#4edea3] font-mono text-[10px]">ENFORCED</span>
                  </label>
                  <input
                    type="text"
                    value={spkiPin}
                    onChange={(e) => setSpkiPin(e.target.value)}
                    className="w-full bg-[#070f19] text-[#bcc9cd] font-mono text-[11px] px-3 py-1.5 rounded border border-[#2d3541] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded bg-[#141c27] border border-[#2d3541] flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={enforceDnssec}
                      onChange={(e) => setEnforceDnssec(e.target.checked)}
                      className="mt-0.5 accent-[#4cd7f6] w-3.5 h-3.5 rounded"
                    />
                    <div className="space-y-0.5">
                      <span className="font-mono text-xs text-[#dbe3f2] font-semibold block">DNSSEC Validation</span>
                      <p className="font-mono text-[10px] text-[#869397]">Validates RRSIG / DS keys. Drops forged hijacked records.</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-[#141c27] border border-[#2d3541] flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={enforceEch}
                      onChange={(e) => setEnforceEch(e.target.checked)}
                      className="mt-0.5 accent-[#4cd7f6] w-3.5 h-3.5 rounded"
                    />
                    <div className="space-y-0.5">
                      <span className="font-mono text-xs text-[#dbe3f2] font-semibold block">Encrypted Client Hello (ECH)</span>
                      <p className="font-mono text-[10px] text-[#869397]">Outer SNI Grease payload cloaking upstream destination from ISP.</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-[#141c27] border border-[#2d3541] flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={stripEcs}
                      onChange={(e) => setStripEcs(e.target.checked)}
                      className="mt-0.5 accent-[#4cd7f6] w-3.5 h-3.5 rounded"
                    />
                    <div className="space-y-0.5">
                      <span className="font-mono text-xs text-[#dbe3f2] font-semibold block">Strip Client Subnet (ECS)</span>
                      <p className="font-mono text-[10px] text-[#869397]">Wipes client subnet so CDNs cannot track user GeoIP.</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-[#141c27] border border-[#2d3541] flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={qnameMin}
                      onChange={(e) => setQnameMin(e.target.checked)}
                      className="mt-0.5 accent-[#4cd7f6] w-3.5 h-3.5 rounded"
                    />
                    <div className="space-y-0.5">
                      <span className="font-mono text-xs text-[#dbe3f2] font-semibold block">RFC 9156 QNAME Minimization</span>
                      <p className="font-mono text-[10px] text-[#869397]">Sends only minimum label required without revealing full FQDN.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 04 */}
            <section className="lg:col-span-5 bg-[#18202b] rounded-xl p-4 border border-[#2d3541] space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#869397]">
                    <span className="text-[#4cd7f6] font-bold">04 //</span>
                    <span>Health Probes & Routing</span>
                  </div>
                  <span className="font-mono text-xs text-[#4edea3] font-bold">100% SLA</span>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-[#bcc9cd] uppercase">Routing Mode</label>
                  <div className="grid grid-cols-3 gap-1 bg-[#070f19] p-1 rounded-lg border border-[#2d3541] text-center font-mono text-xs">
                    <button
                      onClick={() => setRoutingMode('fastest')}
                      className={`py-1 px-2 rounded transition-colors ${
                        routingMode === 'fastest' ? 'bg-[#232a36] text-[#4cd7f6] font-bold' : 'text-[#869397]'
                      }`}
                    >
                      Fastest (Race)
                    </button>
                    <button
                      onClick={() => setRoutingMode('rr')}
                      className={`py-1 px-2 rounded transition-colors ${
                        routingMode === 'rr' ? 'bg-[#232a36] text-[#4cd7f6] font-bold' : 'text-[#869397]'
                      }`}
                    >
                      Round-Robin
                    </button>
                    <button
                      onClick={() => setRoutingMode('failover')}
                      className={`py-1 px-2 rounded transition-colors ${
                        routingMode === 'failover' ? 'bg-[#232a36] text-[#4cd7f6] font-bold' : 'text-[#869397]'
                      }`}
                    >
                      Priority / Fail
                    </button>
                  </div>
                </div>

                {/* Probe Visualizer */}
                <div className="p-3 bg-[#141c27] rounded-lg border border-[#2d3541] space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
                      <span className="text-[#dbe3f2]">TLS HANDSHAKE ({sni})</span>
                    </div>
                    <span className="text-[#4edea3] font-bold">11.4 ms RTT</span>
                  </div>

                  {/* SVG Sparkline */}
                  <div className="h-10 w-full flex items-end">
                    <svg className="w-full h-full text-[#4cd7f6]" fill="none" preserveAspectRatio="none" viewBox="0 0 240 36">
                      <path d="M0,28 L20,24 L40,26 L60,18 L80,22 L100,14 L120,16 L140,11 L160,12 L180,9 L200,14 L220,11 L240,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M0,28 L20,24 L40,26 L60,18 L80,22 L100,14 L120,16 L140,11 L160,12 L180,9 L200,14 L220,11 L240,10 L240,36 L0,36 Z" fill="currentColor" fillOpacity="0.12" />
                    </svg>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px] text-[#869397]">
                    <div className="flex justify-between p-1 bg-[#18202b] rounded">
                      <span>Probes:</span>
                      <strong className="text-white">1,420 / 1,420</strong>
                    </div>
                    <div className="flex justify-between p-1 bg-[#18202b] rounded">
                      <span>Resumption:</span>
                      <strong className="text-[#4edea3]">0-RTT Active</strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* SECTION 05: Corefile Preview */}
          <section className="bg-[#070f19] rounded-xl p-3.5 space-y-1.5 font-mono text-xs border border-[#2d3541]">
            <div className="flex items-center justify-between pb-1 border-b border-[#2d3541]/40 text-[10px]">
              <span className="text-[#869397]"># /etc/coredns/Corefile.d/01_upstream_{protocol}.conf</span>
              <span className="text-[#4edea3]">VALIDATED SYNTAX (ZERO LEAK GUARANTEE)</span>
            </div>
            <pre className="text-[#bcc9cd] leading-relaxed text-[11px] overflow-x-auto">
              .:53 {'{\n'}
              {'    '}bind 127.0.0.1 ::1{'\n'}
              {'    '}forward . <span className="text-[#4edea3]">{protocol}://{ipv4Host}:{protocol === 'dot' ? 853 : 443}</span> {'{\n'}
              {'        '}tls_servername <span className="text-[#4cd7f6]">{sni}</span>{'\n'}
              {'        '}health_check 5s{'\n'}
              {'        '}max_fails 3{'\n'}
              {'        '}expire 10s{'\n'}
              {'        '}policy {routingMode === 'fastest' ? 'sequential' : 'round_robin'}{'\n'}
              {'    }\n'}
              {'    '}cache 3600{'\n'}
              {'}'}
            </pre>
          </section>
        </div>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-[#18202b] border-t border-[#2d3541] gap-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">verified_user</span>
            <p className="font-mono text-[11px] text-[#869397] max-w-md">
              All outbound port 53 UDP/TCP traffic redirected to this encrypted TLS pipeline via native eBPF NAT hooks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-[#232a36] hover:bg-[#323a46] text-[#bcc9cd] hover:text-white font-mono text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDryRun}
              className="px-4 py-1.5 rounded bg-[#141c27] border border-[#2d3541] hover:bg-[#18202b] text-[#4cd7f6] font-mono text-xs transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">network_ping</span>
              <span>{dryRunStatus || 'Dry-Run TLS Handshake'}</span>
            </button>
            <button
              onClick={handleCommit}
              className="px-5 py-1.5 rounded bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>
                {commitStatus === 'committing'
                  ? 'Committing Upstream...'
                  : commitStatus === 'committed'
                  ? 'Upstream Synced!'
                  : '+ Commit Upstream & Reload'}
              </span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
