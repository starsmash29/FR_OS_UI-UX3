import React, { useState } from 'react';

interface VlanProvisionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VlanProvisionModal: React.FC<VlanProvisionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [vlanTag, setVlanTag] = useState<number>(40);
  const [zoneAlias, setZoneAlias] = useState('SEC_DMZ_ISOLATED');
  const [selectedZone, setSelectedZone] = useState<
    'isolated' | 'dmz' | 'trusted' | 'mgmt'
  >('dmz');
  const [parentTrunk, setParentTrunk] = useState('bond0');
  const [pcpPriority, setPcpPriority] = useState('3 - Critical Data (Business Essential)');
  const [mtu, setMtu] = useState('1500');
  const [ipMode, setIpMode] = useState<'static' | 'dhcp' | 'disabled'>('static');
  const [gatewayIpv4, setGatewayIpv4] = useState('192.168.40.1/24');
  const [ipv6Prefix, setIpv6Prefix] = useState('fd00:fr40::1/64');

  const [dhcpServer, setDhcpServer] = useState(true);
  const [dnsZone, setDnsZone] = useState('dmz.internal.lan');
  const [interVlanIsolation, setInterVlanIsolation] = useState(true);
  const [outboundNat, setOutboundNat] = useState(true);

  const [copiedCli, setCopiedCli] = useState(false);
  const [dryRunStatus, setDryRunStatus] = useState<string | null>(null);
  const [provisionStatus, setProvisionStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const interfaceIdentifier = `${parentTrunk}.${vlanTag}`;

  const handleCopyCli = () => {
    const text = `ip link add link ${parentTrunk} name ${interfaceIdentifier} type vlan id ${vlanTag} protocol 802.1q
ip addr add ${gatewayIpv4} brd + dev ${interfaceIdentifier}
ip addr add ${ipv6Prefix} dev ${interfaceIdentifier}
ip link set dev ${interfaceIdentifier} up mtu ${mtu}
xdp-loader load -m native ${interfaceIdentifier} /opt/fros/bpf/vlan_xdp_hook.o`;
    navigator.clipboard.writeText(text);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handleDryRun = () => {
    setDryRunStatus('validating');
    setTimeout(() => {
      setDryRunStatus('success');
      setTimeout(() => setDryRunStatus(null), 2500);
    }, 1200);
  };

  const handleProvision = () => {
    setProvisionStatus('committing');
    setTimeout(() => {
      setProvisionStatus('committed');
      setTimeout(() => {
        setProvisionStatus(null);
        onClose();
      }, 1500);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 top-14 left-0 lg:left-64 z-50 bg-[#070f19]/80 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-5xl rounded-xl bg-[#141c27] border border-[#2d3541] shadow-[0_12px_48px_rgba(0,0,0,0.85)] flex flex-col my-auto transition-all text-[#dbe3f2]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#18202b] rounded-t-xl flex flex-wrap items-center justify-between gap-4 border-b border-[#2d3541]">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 flex items-center justify-center bg-[#070f19] rounded-lg border border-[#2d3541] shadow-sm">
              <svg className="w-7 h-7 text-[#4cd7f6]" fill="none" viewBox="0 0 100 100">
                <polygon points="50,4 92,26 92,74 50,96 8,74 8,26" fill="rgba(6,182,212,0.12)" stroke="currentColor" strokeWidth="6" />
                <path d="M50,20 L50,80 M24,35 L76,65 M24,65 L76,35" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
                <circle cx="50" cy="50" r="8" fill="#acedff" className="animate-pulse" />
                <circle cx="50" cy="20" r="3" fill="#dbe3f2" />
                <circle cx="50" cy="80" r="3" fill="#dbe3f2" />
                <circle cx="24" cy="35" r="3" fill="#dbe3f2" />
                <circle cx="76" cy="65" r="3" fill="#dbe3f2" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-['Geist'] text-base md:text-lg font-bold tracking-tight text-[#dbe3f2]">
                  FR<span className="text-[#4cd7f6]">·</span>OS
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#232a36] font-mono text-[10px] text-[#869397] tracking-wider border border-[#2d3541]">
                  KERNEL v6.6-RT
                </span>
                <span className="font-['Geist'] text-base md:text-lg font-semibold text-[#dbe3f2] ml-1">
                  Provision New VLAN Interface // IEEE_8021Q_ENCAP
                </span>
              </div>
              <div className="flex items-center gap-3 pt-0.5 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-[#4edea3]">
                  <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping" />
                  <span className="font-bold">eBPF XDP HARDWARE OFFLOAD READY</span>
                </div>
                <span className="text-[#869397]">|</span>
                <div className="flex items-center gap-1.5 text-[#bcc9cd]">
                  <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">
                    router
                  </span>
                  <span className="text-[#4cd7f6]">PARENT TRUNK:</span>
                  <span className="text-[#dbe3f2] font-semibold">bond0 / br-core (25Gbps SFP28)</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#232a36] hover:bg-[#323a46] flex items-center justify-center text-[#bcc9cd] hover:text-white transition-colors"
            title="Close dialog (Esc)"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[calc(85vh-140px)]">
          {/* SECTION 01: VLAN Identification */}
          <div className="flex flex-col gap-3 bg-[#18202b] p-4 rounded-xl border border-[#2d3541]">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-[#4cd7f6] text-[#003640] font-mono text-[10px] font-bold">
                  01
                </span>
                <span className="font-['Geist'] text-sm font-semibold text-[#dbe3f2]">
                  VLAN Identification & IEEE 802.1Q Tagging
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#869397]">POSIX LINK NAMESPACE</span>
            </div>

            <div className="grid grid-cols-12 gap-3">
              {/* VLAN Tag ID */}
              <div className="col-span-12 md:col-span-3 flex flex-col gap-1.5">
                <label className="font-mono text-xs text-[#bcc9cd] flex items-center justify-between">
                  <span>VLAN TAG ID [2-4094]</span>
                  <span className="text-[#4edea3] font-mono text-[10px]">TAG OK</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min={2}
                    max={4094}
                    value={vlanTag}
                    onChange={(e) => setVlanTag(Number(e.target.value) || 2)}
                    className="w-full bg-[#070f19] px-3 py-2 rounded-lg font-mono text-lg text-[#4cd7f6] font-bold outline-none border border-[#2d3541] pr-9"
                  />
                  <span className="absolute right-3 material-symbols-outlined text-[#4edea3] text-[18px]">
                    check_circle
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px] text-[#4edea3]">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  <span>802.1Q Valid Tag (No Collision)</span>
                </div>
              </div>

              {/* Interface Identifier */}
              <div className="col-span-12 md:col-span-4 flex flex-col gap-1.5">
                <label className="font-mono text-xs text-[#bcc9cd] flex items-center justify-between">
                  <span>INTERFACE IDENTIFIER</span>
                  <span className="text-[#869397] font-mono text-[10px]">AUTO-NAMED</span>
                </label>
                <div className="relative flex items-center h-10">
                  <input
                    type="text"
                    readOnly
                    value={interfaceIdentifier}
                    className="w-full h-full bg-[#070f19] px-3 rounded-lg font-mono text-sm text-[#dbe3f2] border border-[#2d3541] outline-none"
                  />
                  <div className="absolute right-3 px-1.5 py-0.5 rounded bg-[#232a36] text-[#869397] font-mono text-[10px]">
                    UNIX
                  </div>
                </div>
                <span className="font-mono text-[10px] text-[#869397]">
                  Bound to /sys/class/net/{interfaceIdentifier}
                </span>
              </div>

              {/* Zone Alias */}
              <div className="col-span-12 md:col-span-5 flex flex-col gap-1.5">
                <label className="font-mono text-xs text-[#bcc9cd] flex items-center justify-between">
                  <span>ZONE ALIAS / DESCRIPTIVE TAG</span>
                  <span className="text-[#869397] font-mono text-[10px]">LABEL</span>
                </label>
                <div className="relative flex items-center h-10">
                  <input
                    type="text"
                    value={zoneAlias}
                    onChange={(e) => setZoneAlias(e.target.value)}
                    className="w-full h-full bg-[#070f19] px-3 rounded-lg font-mono text-sm text-[#dbe3f2] border border-[#2d3541] outline-none uppercase tracking-wider"
                  />
                  <span className="absolute right-3 material-symbols-outlined text-[#869397] text-[18px]">
                    sell
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#869397]">
                  Telemetry grouping key & Prometheus tag
                </span>
              </div>
            </div>

            {/* Security Zones */}
            <div className="flex flex-col gap-1.5 pt-1">
              <label className="font-mono text-xs text-[#bcc9cd]">SECURITY ZONE CLASSIFICATION</label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
                {/* Zone 1 */}
                <div
                  onClick={() => setSelectedZone('isolated')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col gap-1 ${
                    selectedZone === 'isolated'
                      ? 'bg-[#232a36] border-[#ffb4ab] shadow-md'
                      : 'bg-[#141c27] border-[#2d3541] hover:border-[#869397]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-[#ffb4ab] text-[18px]">security</span>
                    <span className={`w-2 h-2 rounded-full ${selectedZone === 'isolated' ? 'bg-[#ffb4ab]' : 'bg-[#869397]'}`} />
                  </div>
                  <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">ISOLATED SANDBOX</span>
                  <span className="font-mono text-[10px] text-[#bcc9cd]">Zero-Trust IoT / Untrusted Guest Segments</span>
                </div>

                {/* Zone 2: DMZ */}
                <div
                  onClick={() => setSelectedZone('dmz')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col gap-1 ${
                    selectedZone === 'dmz'
                      ? 'bg-[#232a36] border-[#4cd7f6] shadow-md'
                      : 'bg-[#141c27] border-[#2d3541] hover:border-[#869397]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">lan</span>
                    <span className={`w-2 h-2 rounded-full ${selectedZone === 'dmz' ? 'bg-[#4cd7f6] animate-pulse' : 'bg-[#869397]'}`} />
                  </div>
                  <span className="font-['Geist'] text-xs font-semibold text-[#4cd7f6]">RESTRICTED DMZ</span>
                  <span className="font-mono text-[10px] text-[#dbe3f2]">Ingress Public Services, Inverted Reverse Proxies</span>
                </div>

                {/* Zone 3: Trusted */}
                <div
                  onClick={() => setSelectedZone('trusted')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col gap-1 ${
                    selectedZone === 'trusted'
                      ? 'bg-[#232a36] border-[#4edea3] shadow-md'
                      : 'bg-[#141c27] border-[#2d3541] hover:border-[#869397]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-[#4edea3] text-[18px]">verified_user</span>
                    <span className={`w-2 h-2 rounded-full ${selectedZone === 'trusted' ? 'bg-[#4edea3]' : 'bg-[#869397]'}`} />
                  </div>
                  <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">INTERNAL TRUSTED</span>
                  <span className="font-mono text-[10px] text-[#bcc9cd]">Corporate Workstations, Active Directory, Core DB</span>
                </div>

                {/* Zone 4: OOB */}
                <div
                  onClick={() => setSelectedZone('mgmt')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col gap-1 ${
                    selectedZone === 'mgmt'
                      ? 'bg-[#232a36] border-[#d0bcff] shadow-md'
                      : 'bg-[#141c27] border-[#2d3541] hover:border-[#869397]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-[#d0bcff] text-[18px]">settings_ethernet</span>
                    <span className={`w-2 h-2 rounded-full ${selectedZone === 'mgmt' ? 'bg-[#d0bcff]' : 'bg-[#869397]'}`} />
                  </div>
                  <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">MANAGEMENT OOB</span>
                  <span className="font-mono text-[10px] text-[#bcc9cd]">Out-of-Band IPMI, Hypervisors, SAN Switches</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 02: Physical Trunk Binding & MTU */}
          <div className="flex flex-col gap-3 bg-[#18202b] p-4 rounded-xl border border-[#2d3541]">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-[#4cd7f6] text-[#003640] font-mono text-[10px] font-bold">
                  02
                </span>
                <span className="font-['Geist'] text-sm font-semibold text-[#dbe3f2]">
                  Physical Trunk Binding & MTU
                </span>
              </div>
              <span className="font-mono text-xs text-[#4edea3]">25G LACP LINK AGGREGATED</span>
            </div>

            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 md:col-span-5 flex flex-col gap-1.5">
                <label className="font-mono text-xs text-[#bcc9cd]">PARENT TRUNK INTERFACE</label>
                <div className="relative">
                  <select
                    value={parentTrunk}
                    onChange={(e) => setParentTrunk(e.target.value)}
                    className="w-full bg-[#070f19] px-3 py-2 rounded-lg font-mono text-xs text-[#dbe3f2] border border-[#2d3541] outline-none cursor-pointer"
                  >
                    <option value="bond0">bond0 (LACP eth1 + eth2 - 20G/25G Active)</option>
                    <option value="eth0">eth0 (WAN Fiber SFP28 - 25Gbps Line)</option>
                    <option value="eth3">eth3 (Internal SFP+ - 10Gbps Direct)</option>
                    <option value="br-core">br-core (Software Switch Fabric)</option>
                  </select>
                </div>
              </div>

              <div className="col-span-12 md:col-span-4 flex flex-col gap-1.5">
                <label className="font-mono text-xs text-[#bcc9cd]">802.1p PRIORITY (PCP / CoS)</label>
                <div className="relative">
                  <select
                    value={pcpPriority}
                    onChange={(e) => setPcpPriority(e.target.value)}
                    className="w-full bg-[#070f19] px-3 py-2 rounded-lg font-mono text-xs text-[#dbe3f2] border border-[#2d3541] outline-none cursor-pointer"
                  >
                    <option>0 - Best Effort (Standard Default)</option>
                    <option>3 - Critical Data (Business Essential)</option>
                    <option>5 - Voice Real-Time (&lt;10ms Strict Jitter)</option>
                    <option>6 - Network Control (OSPF / BGP Peering)</option>
                  </select>
                </div>
              </div>

              <div className="col-span-12 md:col-span-3 flex flex-col gap-1.5">
                <label className="font-mono text-xs text-[#bcc9cd]">MTU PAYLOAD (BYTES)</label>
                <div className="flex items-center gap-1">
                  {['1500', '9000', '1450'].map((val) => (
                    <button
                      key={val}
                      onClick={() => setMtu(val)}
                      className={`flex-1 py-1 rounded font-mono text-xs font-semibold transition-colors ${
                        mtu === val
                          ? 'bg-[#06b6d4] text-[#00424f]'
                          : 'bg-[#141c27] text-[#bcc9cd] hover:text-white border border-[#2d3541]'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <span className="font-mono text-[10px] text-[#869397]">Standard Ethernet Frame Payload</span>
              </div>
            </div>
          </div>

          {/* SECTION 03: Layer 3 Addressing */}
          <div className="flex flex-col gap-3 bg-[#18202b] p-4 rounded-xl border border-[#2d3541]">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-[#4cd7f6] text-[#003640] font-mono text-[10px] font-bold">
                  03
                </span>
                <span className="font-['Geist'] text-sm font-semibold text-[#dbe3f2]">
                  Layer 3 Addressing & IPv4 / IPv6 Subnet
                </span>
              </div>
              <span className="font-mono text-xs text-[#4cd7f6]">CIDR DUAL-STACK ENGINE</span>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#070f19] max-w-md border border-[#2d3541]">
              <button
                onClick={() => setIpMode('static')}
                className={`flex-1 py-1 px-3 rounded font-mono text-xs font-semibold transition-all ${
                  ipMode === 'static' ? 'bg-[#06b6d4] text-[#00424f]' : 'text-[#bcc9cd] hover:text-white'
                }`}
              >
                Static IPv4 (Gateway)
              </button>
              <button
                onClick={() => setIpMode('dhcp')}
                className={`flex-1 py-1 px-3 rounded font-mono text-xs transition-all ${
                  ipMode === 'dhcp' ? 'bg-[#06b6d4] text-[#00424f] font-semibold' : 'text-[#bcc9cd] hover:text-white'
                }`}
              >
                DHCP Client
              </button>
              <button
                onClick={() => setIpMode('disabled')}
                className={`flex-1 py-1 px-3 rounded font-mono text-xs transition-all ${
                  ipMode === 'disabled' ? 'bg-[#06b6d4] text-[#00424f] font-semibold' : 'text-[#bcc9cd] hover:text-white'
                }`}
              >
                Disabled (L2 Bridge)
              </button>
            </div>

            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 md:col-span-6 flex flex-col gap-1.5">
                <label className="font-mono text-xs text-[#bcc9cd]">GATEWAY IPv4 / CIDR MASK</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={gatewayIpv4}
                    onChange={(e) => setGatewayIpv4(e.target.value)}
                    className="w-full bg-[#070f19] px-3 py-2 rounded-lg font-mono text-sm text-[#4cd7f6] border border-[#2d3541] outline-none"
                  />
                  <span className="absolute right-3 font-mono text-[10px] text-[#869397]">
                    NETMASK 255.255.255.0
                  </span>
                </div>
                <div className="p-2 rounded bg-[#141c27] border border-[#2d3541] flex items-center justify-between font-mono text-[11px] text-[#bcc9cd]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-[#4edea3]">memory</span>
                    <span>Usable IPs: <strong className="text-white">192.168.40.2 – 192.168.40.254</strong></span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-[#232a36] text-[#4edea3] font-bold">253 Hosts</span>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 flex flex-col gap-1.5">
                <label className="font-mono text-xs text-[#bcc9cd]">IPv6 PREFIX / CONFIGURATION MODE</label>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="px-2 py-0.5 rounded bg-[#232a36] text-[#4cd7f6] font-mono text-[10px] font-semibold">Static IPv6</span>
                  <span className="px-2 py-0.5 rounded bg-[#141c27] text-[#869397] font-mono text-[10px]">SLAAC</span>
                  <span className="px-2 py-0.5 rounded bg-[#141c27] text-[#869397] font-mono text-[10px]">Track WAN</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={ipv6Prefix}
                    onChange={(e) => setIpv6Prefix(e.target.value)}
                    className="w-full bg-[#070f19] px-3 py-2 rounded-lg font-mono text-sm text-[#dbe3f2] border border-[#2d3541] outline-none"
                  />
                  <span className="absolute right-3 font-mono text-[10px] text-[#869397]">ULA PRIVATE</span>
                </div>
                <span className="font-mono text-[10px] text-[#869397]">
                  IPv6 Link-Local auto-derived: fe80::%{interfaceIdentifier}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 04: Subsystem Integration */}
          <div className="flex flex-col gap-3 bg-[#18202b] p-4 rounded-xl border border-[#2d3541]">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-[#4cd7f6] text-[#003640] font-mono text-[10px] font-bold">
                  04
                </span>
                <span className="font-['Geist'] text-sm font-semibold text-[#dbe3f2]">
                  Subsystem Integration & Services
                </span>
              </div>
              <span className="font-mono text-xs text-[#869397]">KERNEL DAEMONS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* DHCP Server */}
              <div className="p-3 rounded-lg bg-[#141c27] border border-[#2d3541] flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">
                      DHCPv4 Server (ISC-Kea Daemon)
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#00a572]/20 text-[#4edea3] font-mono text-[9px] font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#bcc9cd]">
                    Auto-provision dynamic pool on <strong className="text-[#4cd7f6]">192.168.40.100 - 192.168.40.220</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDhcpServer(!dhcpServer)}
                  className={`w-11 h-6 rounded-full p-0.5 flex transition-colors shrink-0 ${
                    dhcpServer ? 'bg-[#4edea3] justify-end' : 'bg-[#2d3541] justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-[#070f19] shadow-sm" />
                </button>
              </div>

              {/* CoreDNS Resolver */}
              <div className="p-3 rounded-lg bg-[#141c27] border border-[#2d3541] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">
                    CoreDNS Resolver & Zone
                  </span>
                  <span className="font-mono text-[10px] text-[#4edea3] font-bold">RECURSIVE ON</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={dnsZone}
                    onChange={(e) => setDnsZone(e.target.value)}
                    className="w-full bg-[#070f19] px-3 py-1.5 rounded-lg font-mono text-xs text-[#4cd7f6] border border-[#2d3541] outline-none"
                  />
                  <span className="absolute right-3 font-mono text-[10px] text-[#869397]">PTR ARPA</span>
                </div>
              </div>

              {/* Inter-VLAN Routing */}
              <div className="p-3 rounded-lg bg-[#141c27] border border-[#2d3541] flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">
                      Inter-VLAN Routing Isolation
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#93000a]/20 text-[#ffb4ab] font-mono text-[9px] font-bold">
                      STRICT
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#bcc9cd]">
                    Enforce zero-trust default DROP for lateral routing to other VLANs.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setInterVlanIsolation(!interVlanIsolation)}
                  className={`w-11 h-6 rounded-full p-0.5 flex transition-colors shrink-0 ${
                    interVlanIsolation ? 'bg-[#4edea3] justify-end' : 'bg-[#2d3541] justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-[#070f19] shadow-sm" />
                </button>
              </div>

              {/* Outbound Masquerade */}
              <div className="p-3 rounded-lg bg-[#141c27] border border-[#2d3541] flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">
                      Outbound Masquerade (eBPF NAT)
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#06b6d4]/20 text-[#4cd7f6] font-mono text-[9px] font-bold">
                      FASTPATH
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#bcc9cd]">
                    Hardware offload egress packet rewriting via kernel XDP maps directly to eth0.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOutboundNat(!outboundNat)}
                  className={`w-11 h-6 rounded-full p-0.5 flex transition-colors shrink-0 ${
                    outboundNat ? 'bg-[#4edea3] justify-end' : 'bg-[#2d3541] justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-[#070f19] shadow-sm" />
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 05: Linux CLI Preview */}
          <div className="flex flex-col gap-2 bg-[#070f19] p-4 rounded-xl border border-[#2d3541]">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-[#232a36] text-[#4cd7f6] font-mono text-[10px] font-bold">
                  05
                </span>
                <span className="font-['Geist'] text-xs font-semibold text-[#dbe3f2]">
                  Linux Kernel Netlink & nftables CLI Preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#18202b] text-[#4edea3] font-mono text-[10px]">
                  Driver: rtnl_link_vlan JIT validated (0.02ms)
                </span>
                <button
                  type="button"
                  onClick={handleCopyCli}
                  className="px-2 py-0.5 rounded bg-[#232a36] hover:bg-[#323a46] text-[#bcc9cd] hover:text-white font-mono text-[10px] flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {copiedCli ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedCli ? 'Copied!' : 'Copy Script'}</span>
                </button>
              </div>
            </div>

            <div className="bg-[#0c141f] p-3 rounded-lg font-mono text-xs leading-relaxed text-[#bcc9cd] overflow-x-auto space-y-1 select-all border border-[#2d3541]/40">
              <p className="text-[#4edea3]"># 1. Create 802.1Q tagged sub-interface</p>
              <p>
                <span className="text-[#4cd7f6] font-bold">ip</span> link add link {parentTrunk} name{' '}
                <span className="text-[#dbe3f2] font-bold">{interfaceIdentifier}</span> type vlan id{' '}
                <span className="text-[#4cd7f6] font-bold">{vlanTag}</span> protocol 802.1q
              </p>
              <p className="pt-1 text-[#4edea3]"># 2. Assign static gateway IPv4 & IPv6 CIDR</p>
              <p>
                <span className="text-[#4cd7f6] font-bold">ip</span> addr add{' '}
                <span className="text-[#4edea3] font-semibold">{gatewayIpv4}</span> brd + dev{' '}
                <span className="text-[#dbe3f2] font-bold">{interfaceIdentifier}</span>
              </p>
              <p>
                <span className="text-[#4cd7f6] font-bold">ip</span> addr add {ipv6Prefix} dev{' '}
                <span className="text-[#dbe3f2] font-bold">{interfaceIdentifier}</span>
              </p>
              <p className="pt-1 text-[#4edea3]"># 3. Bring carrier online and attach eBPF XDP ring filter</p>
              <p>
                <span className="text-[#4cd7f6] font-bold">ip</span> link set dev{' '}
                <span className="text-[#dbe3f2] font-bold">{interfaceIdentifier}</span> up mtu {mtu}
              </p>
              <p>
                <span className="text-[#4cd7f6] font-bold">xdp-loader</span> load -m native {interfaceIdentifier} /opt/fros/bpf/vlan_xdp_hook.o
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#18202b] rounded-b-xl flex flex-wrap items-center justify-between gap-4 border-t border-[#2d3541]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#4edea3] animate-pulse" />
            <div className="flex flex-col font-mono">
              <span className="text-xs font-semibold text-[#dbe3f2]">Hotload into Linux Kernel Netlink (RTNETLINK)</span>
              <span className="text-[10px] text-[#869397]">Zero link flap • Sub-second atomic switch-over</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#232a36] text-[#bcc9cd] hover:text-white font-mono text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDryRun}
              className="px-4 py-1.5 rounded-lg bg-[#141c27] border border-[#2d3541] hover:bg-[#18202b] text-[#dbe3f2] font-mono text-xs flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[15px] text-[#4cd7f6]">science</span>
              <span>
                {dryRunStatus === 'validating'
                  ? 'Validating Kernel Carrier...'
                  : dryRunStatus === 'success'
                  ? 'Carrier Verified (0 Dropped)'
                  : 'Test Carrier (Dry-Run)'}
              </span>
            </button>
            <button
              onClick={handleProvision}
              className="px-5 py-1.5 rounded-lg bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_16px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">
                {provisionStatus === 'committing' ? 'sync' : 'add_circle'}
              </span>
              <span>
                {provisionStatus === 'committing'
                  ? 'Committing Netlink RTNL...'
                  : provisionStatus === 'committed'
                  ? `Interface ${interfaceIdentifier} Active`
                  : '+ Provision VLAN & Attach eBPF Ring'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
