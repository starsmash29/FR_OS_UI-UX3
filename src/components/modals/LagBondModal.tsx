import React, { useState } from 'react';

interface LagBondModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LagBondModal: React.FC<LagBondModalProps> = ({ isOpen, onClose }) => {
  const [bondName, setBondName] = useState('bond0');
  const [aliasTag, setAliasTag] = useState('CORE_UPLINK_TO_AGGREGATION_SW01');
  const [bondMode, setBondMode] = useState<'802.3ad' | 'active-backup' | 'balance-xor'>('802.3ad');
  const [hashPolicy, setHashPolicy] = useState<'layer2+3' | 'layer3+4' | 'layer2'>('layer2+3');
  const [lacpRate, setLacpRate] = useState<'fast' | 'slow'>('fast');
  const [miimon, setMiimon] = useState(100);
  const [updelay, setUpdelay] = useState(200);
  const [minLinks, setMinLinks] = useState(1);
  const [mtu, setMtu] = useState('9000');
  const [xdpSteering, setXdpSteering] = useState(true);
  const [vlanFiltering, setVlanFiltering] = useState(true);

  // Selected slave interfaces
  const [slaves, setSlaves] = useState<Record<string, boolean>>({
    eth0: false,
    eth1: false,
    eth2: true,
    eth3: true,
    eth4: false,
    eth5: false,
  });

  const [dryRunStatus, setDryRunStatus] = useState<string | null>(null);
  const [commitStatus, setCommitStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleSlave = (port: string) => {
    setSlaves((prev) => ({ ...prev, [port]: !prev[port] }));
  };

  const selectedSlavesList = Object.keys(slaves).filter((k) => slaves[k]);
  const totalBandwidth = selectedSlavesList.reduce((acc, port) => {
    if (port === 'eth5') return acc + 25;
    if (port === 'eth2' || port === 'eth3' || port === 'eth4') return acc + 10;
    return acc + 1;
  }, 0);

  const handleDryRun = () => {
    setDryRunStatus('testing');
    setTimeout(() => {
      setDryRunStatus('verified');
      setTimeout(() => setDryRunStatus(null), 3000);
    }, 1200);
  };

  const handleCommit = () => {
    setCommitStatus('committing');
    setTimeout(() => {
      setCommitStatus('committed');
      setTimeout(() => {
        setCommitStatus(null);
        onClose();
      }, 1500);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 top-14 left-0 lg:left-64 z-50 bg-[#070f19]/85 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-5xl my-4 bg-[#141c27] border border-[#2d3541] rounded-xl shadow-[0_24px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-[#dbe3f2]">
        {/* Top Modal Header */}
        <div className="bg-[#18202b] px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#2d3541]">
          <div className="flex items-center gap-4">
            {/* Hex Vault Snowflake Emblem */}
            <div className="w-9 h-9 rounded bg-[#232a36] flex items-center justify-center text-[#4cd7f6] shadow-inner border border-[#2d3541]">
              <svg className="w-6 h-6 text-[#4cd7f6]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 40 40">
                <polygon points="20 3, 35 11, 35 29, 20 37, 5 29, 5 11" strokeWidth="1.5" className="stroke-[#4cd7f6]/40" fill="none" />
                <line x1="20" y1="3" x2="20" y2="12" />
                <line x1="35" y1="11" x2="27" y2="15.5" />
                <line x1="35" y1="29" x2="27" y2="24.5" />
                <line x1="20" y1="37" x2="20" y2="28" />
                <line x1="5" y1="29" x2="13" y2="24.5" />
                <line x1="5" y1="11" x2="13" y2="15.5" />
                <polygon points="20 15, 25 18, 25 22, 20 25, 15 22, 15 18" fill="currentColor" fillOpacity="0.2" className="stroke-[#4cd7f6]" />
                <circle cx="20" cy="20" r="1.5" fill="currentColor" className="text-[#06b6d4]" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-['Geist'] text-base md:text-lg font-bold text-[#dbe3f2]">
                  Provision Link Aggregation Group (LAG / Bond)
                </span>
                <span className="font-mono text-[10px] text-[#869397] px-1.5 py-0.5 rounded bg-[#232a36] border border-[#2d3541]">
                  IEEE 802.3ad
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#bcc9cd] font-mono text-[11px] mt-0.5">
                <span className="flex items-center gap-1 text-[#4edea3]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-ping" />
                  eBPF XDP BOND OFFLOAD READY
                </span>
                <span className="text-[#869397]">·</span>
                <span className="text-[#869397]">DRIVER: bonding (mode 4 / 802.3ad)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#232a36] text-[#dbe3f2] font-mono text-xs border border-[#2d3541]">
              <span className="material-symbols-outlined text-[15px] text-[#4cd7f6]">
                terminal
              </span>
              <span>CLI SYNC: ENABLED</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded bg-[#232a36] hover:bg-[#323a46] flex items-center justify-center text-[#869397] hover:text-white transition-colors"
              title="Close Modal"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 flex flex-col gap-6 max-h-[calc(85vh-130px)] overflow-y-auto">
          {/* SECTION 01: BOND IDENTIFICATION & ARCHITECTURE */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#2d3541]/60 pb-1.5">
              <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-widest font-bold">
                01 // BOND IDENTIFICATION & ARCHITECTURE
              </span>
              <span className="font-mono text-[11px] text-[#869397]">
                SYSFS: /sys/class/net/bonding_masters
              </span>
            </div>

            <div className="grid grid-cols-12 gap-3">
              {/* Bond Name */}
              <div className="col-span-12 md:col-span-4 bg-[#18202b] p-3 rounded-lg border border-[#2d3541] flex flex-col gap-1.5">
                <label className="font-mono text-xs text-[#bcc9cd] flex items-center justify-between">
                  <span>INTERFACE NAME</span>
                  <span className="text-[#4edea3] font-mono">[VALIDATED]</span>
                </label>
                <div className="flex items-center rounded bg-[#070f19] px-2.5 py-1.5 border border-[#2d3541]">
                  <span className="font-mono text-xs text-[#4cd7f6] font-bold mr-1">#</span>
                  <input
                    type="text"
                    value={bondName}
                    onChange={(e) => setBondName(e.target.value)}
                    className="w-full bg-transparent font-mono text-xs text-[#dbe3f2] focus:outline-none"
                    spellCheck="false"
                  />
                  <span className="material-symbols-outlined text-[#4edea3] text-[16px]">verified</span>
                </div>
                <span className="font-mono text-[10px] text-[#869397]">
                  POSIX naming format (e.g. bond0, bond-core)
                </span>
              </div>

              {/* Description / Alias */}
              <div className="col-span-12 md:col-span-8 bg-[#18202b] p-3 rounded-lg border border-[#2d3541] flex flex-col gap-1.5">
                <label className="font-mono text-xs text-[#bcc9cd] flex items-center justify-between">
                  <span>ALIAS / DESCRIPTION TAG</span>
                  <span className="text-[#869397]">SNMP IF-MIB ifAlias</span>
                </label>
                <div className="flex items-center rounded bg-[#070f19] px-2.5 py-1.5 border border-[#2d3541]">
                  <input
                    type="text"
                    value={aliasTag}
                    onChange={(e) => setAliasTag(e.target.value)}
                    className="w-full bg-transparent font-mono text-xs text-[#dbe3f2] focus:outline-none"
                    spellCheck="false"
                  />
                  <span className="material-symbols-outlined text-[#869397] text-[16px]">tag</span>
                </div>
                <span className="font-mono text-[10px] text-[#869397]">
                  Rack designation: TOR-A1-SW01 // Ports Eth1/47-Eth1/48
                </span>
              </div>
            </div>

            {/* Bond Operational Mode Cards */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="font-mono text-xs text-[#bcc9cd] uppercase">
                BOND OPERATIONAL MODE
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Mode 4 */}
                <div
                  onClick={() => setBondMode('802.3ad')}
                  className={`p-3 rounded-lg border cursor-pointer flex flex-col gap-1 transition-all ${
                    bondMode === '802.3ad'
                      ? 'bg-[#232a36] border-[#4cd7f6] shadow-md'
                      : 'bg-[#18202b] border-[#2d3541] hover:border-[#869397]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#4cd7f6]">
                      <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_rgba(76,215,246,0.6)]" />
                      <span>802.3ad Dynamic LACP</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#003640] bg-[#06b6d4] px-1.5 py-0.5 rounded font-bold">
                      MODE 4
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-[#dbe3f2] mt-1 leading-snug">
                    IEEE 802.3ad dynamic aggregation trunking with peer protocol negotiation & multi-path failover.
                  </p>
                  <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-[#4edea3]">
                    <span>✓ Switch LACP Required</span>
                    <span>✓ Max Bandwidth</span>
                  </div>
                </div>

                {/* Mode 1 */}
                <div
                  onClick={() => setBondMode('active-backup')}
                  className={`p-3 rounded-lg border cursor-pointer flex flex-col gap-1 transition-all ${
                    bondMode === 'active-backup'
                      ? 'bg-[#232a36] border-[#4cd7f6] shadow-md'
                      : 'bg-[#18202b] border-[#2d3541] hover:border-[#869397]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-[#dbe3f2]">
                      <span className="w-2 h-2 rounded-full bg-[#869397]" />
                      <span>Active-Backup</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#869397] bg-[#141c27] px-1.5 py-0.5 rounded border border-[#2d3541]">
                      MODE 1
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-[#bcc9cd] mt-1 leading-snug">
                    Pure active/standby fault tolerance. Single port active at a time; zero switch config needed.
                  </p>
                  <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-[#869397]">
                    <span>Unmanaged Switch Compatible</span>
                  </div>
                </div>

                {/* Mode 2 */}
                <div
                  onClick={() => setBondMode('balance-xor')}
                  className={`p-3 rounded-lg border cursor-pointer flex flex-col gap-1 transition-all ${
                    bondMode === 'balance-xor'
                      ? 'bg-[#232a36] border-[#4cd7f6] shadow-md'
                      : 'bg-[#18202b] border-[#2d3541] hover:border-[#869397]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-[#dbe3f2]">
                      <span className="w-2 h-2 rounded-full bg-[#869397]" />
                      <span>Balance-XOR</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#869397] bg-[#141c27] px-1.5 py-0.5 rounded border border-[#2d3541]">
                      MODE 2
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-[#bcc9cd] mt-1 leading-snug">
                    Static link trunking based on hash policy without LACP state machine exchanges.
                  </p>
                  <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-[#869397]">
                    <span>Static Trunk / EtherChannel</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 02: SLAVE PORT SELECTION & LINK STATUS MATRIX */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#2d3541]/60 pb-1.5">
              <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-widest font-bold">
                02 // SLAVE PORT SELECTION & LINK STATUS MATRIX
              </span>
              <span className="font-mono text-xs text-[#4edea3] font-bold">
                {selectedSlavesList.length} OF 6 PHYSICAL SLAVES ASSIGNED
              </span>
            </div>

            <div className="bg-[#18202b] rounded-xl p-4 border border-[#2d3541] flex flex-col gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {/* eth0 */}
                <div
                  onClick={() => toggleSlave('eth0')}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col gap-1 ${
                    slaves.eth0
                      ? 'bg-[#232a36] border-[#4cd7f6]'
                      : 'bg-[#141c27] border-[#2d3541] opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[#2d3541] flex items-center justify-center text-xs">
                        {slaves.eth0 ? '✓' : '◻'}
                      </div>
                      <span className="font-mono text-xs font-bold text-[#dbe3f2]">eth0</span>
                    </div>
                    <span className="font-mono text-[9px] text-[#869397] px-1 rounded bg-[#232a36]">
                      MGMT / RESERVED
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#869397]">
                    <span>1 Gbps RJ45 (I210-AT)</span>
                    <span className="text-[#4edea3]">CARRIER UP</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#869397]">MAC: 52:54:00:8a:11:c0 · In use by br0</span>
                </div>

                {/* eth1 */}
                <div
                  onClick={() => toggleSlave('eth1')}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col gap-1 ${
                    slaves.eth1
                      ? 'bg-[#232a36] border-[#4cd7f6]'
                      : 'bg-[#141c27] border-[#2d3541] opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[#2d3541] flex items-center justify-center text-xs">
                        {slaves.eth1 ? '✓' : '◻'}
                      </div>
                      <span className="font-mono text-xs font-bold text-[#dbe3f2]">eth1</span>
                    </div>
                    <span className="font-mono text-[9px] text-[#ffb4ab] bg-[#93000a]/30 px-1 rounded">
                      NO CARRIER
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#869397]">
                    <span>1 Gbps RJ45 (I210-AT)</span>
                    <span className="text-[#869397]">LINK DOWN</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#869397]">MAC: 52:54:00:8a:11:c1 · Standby</span>
                </div>

                {/* eth2 */}
                <div
                  onClick={() => toggleSlave('eth2')}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col gap-1 ${
                    slaves.eth2
                      ? 'bg-[#232a36] border-[#4cd7f6] shadow-sm'
                      : 'bg-[#141c27] border-[#2d3541]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[#06b6d4] flex items-center justify-center text-[#003640] font-bold text-[10px]">
                        ✓
                      </div>
                      <span className="font-mono text-xs font-bold text-[#4cd7f6]">eth2</span>
                      <span className="font-mono text-[9px] text-[#4cd7f6] bg-[#4cd7f6]/10 px-1 rounded">
                        SLAVE 0
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-[#4edea3] bg-[#4edea3]/10 px-1 rounded font-bold">
                      10G SFP+ UP
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#dbe3f2]">
                    <span>Intel 82599ES 10G-Optic</span>
                    <span className="text-[#4edea3]">Full Duplex</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#bcc9cd]">
                    MAC: 90:e2:ba:4d:92:10 · Transceiver: LR 1310nm
                  </span>
                </div>

                {/* eth3 */}
                <div
                  onClick={() => toggleSlave('eth3')}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col gap-1 ${
                    slaves.eth3
                      ? 'bg-[#232a36] border-[#4cd7f6] shadow-sm'
                      : 'bg-[#141c27] border-[#2d3541]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[#06b6d4] flex items-center justify-center text-[#003640] font-bold text-[10px]">
                        ✓
                      </div>
                      <span className="font-mono text-xs font-bold text-[#4cd7f6]">eth3</span>
                      <span className="font-mono text-[9px] text-[#4cd7f6] bg-[#4cd7f6]/10 px-1 rounded">
                        SLAVE 1
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-[#4edea3] bg-[#4edea3]/10 px-1 rounded font-bold">
                      10G SFP+ UP
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#dbe3f2]">
                    <span>Intel 82599ES 10G-Optic</span>
                    <span className="text-[#4edea3]">Full Duplex</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#bcc9cd]">
                    MAC: 90:e2:ba:4d:92:11 · Transceiver: LR 1310nm
                  </span>
                </div>

                {/* eth4 */}
                <div
                  onClick={() => toggleSlave('eth4')}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col gap-1 ${
                    slaves.eth4
                      ? 'bg-[#232a36] border-[#4cd7f6]'
                      : 'bg-[#141c27] border-[#2d3541] hover:border-[#869397]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[#2d3541] flex items-center justify-center text-xs">
                        {slaves.eth4 ? '✓' : '◻'}
                      </div>
                      <span className="font-mono text-xs font-bold text-[#dbe3f2]">eth4</span>
                    </div>
                    <span className="font-mono text-[9px] text-[#4edea3] bg-[#4edea3]/10 px-1 rounded">
                      10G BASE-T UP
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#869397]">
                    <span>Intel X550-T2 10GbE</span>
                    <span>{slaves.eth4 ? 'Assigned' : 'Unassigned'}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#869397]">MAC: a0:36:9f:01:42:0a · Available</span>
                </div>

                {/* eth5 */}
                <div
                  onClick={() => toggleSlave('eth5')}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col gap-1 ${
                    slaves.eth5
                      ? 'bg-[#232a36] border-[#4cd7f6]'
                      : 'bg-[#141c27] border-[#2d3541] hover:border-[#869397]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[#2d3541] flex items-center justify-center text-xs">
                        {slaves.eth5 ? '✓' : '◻'}
                      </div>
                      <span className="font-mono text-xs font-bold text-[#dbe3f2]">eth5</span>
                    </div>
                    <span className="font-mono text-[9px] text-[#d0bcff] bg-[#d0bcff]/10 px-1 rounded">
                      25G SFP28 READY
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#869397]">
                    <span>Mellanox ConnectX-5</span>
                    <span>{slaves.eth5 ? 'Assigned' : 'Unassigned'}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#869397]">MAC: 00:02:c9:80:fe:12 · High Capacity</span>
                </div>
              </div>

              {/* Bandwidth banner */}
              <div className="px-4 py-2 rounded-lg bg-[#070f19] border border-[#2d3541] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
                    speed
                  </span>
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-[#869397]">TOTAL AGGREGATED PIPELINE CAPACITY</span>
                    <span className="font-mono text-xs font-bold text-[#dbe3f2]">
                      {totalBandwidth}.0 Gbps (Symmetric Full Duplex — {totalBandwidth * 2} Gbps Bisectional Bandwidth)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-[#bcc9cd]">SLAVES: [{selectedSlavesList.join(', ')}]</span>
                  <span className="px-2 py-0.5 rounded bg-[#06b6d4] text-[#00424f] font-bold text-[10px]">
                    eBPF RING STEERED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 03: LACP PROTOCOL TUNING & HASH POLICY */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#2d3541]/60 pb-1.5">
              <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-widest font-bold">
                03 // LACP PROTOCOL TUNING & HASH POLICY
              </span>
              <span className="font-mono text-[11px] text-[#869397]">
                MODULE: net/bonding/bond_main.c
              </span>
            </div>

            <div className="bg-[#18202b] rounded-xl p-4 border border-[#2d3541] grid grid-cols-12 gap-4">
              {/* Transmit Hash Policy */}
              <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
                <label className="font-mono text-xs text-[#bcc9cd] flex items-center justify-between">
                  <span>TRANSMIT HASH POLICY (xmit_hash_policy)</span>
                  <span className="text-[#4cd7f6] font-bold text-[10px]">RECOMMENDED</span>
                </label>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setHashPolicy('layer2+3')}
                    className={`w-full p-2.5 rounded-lg text-left flex items-center justify-between border transition-all ${
                      hashPolicy === 'layer2+3'
                        ? 'bg-[#232a36] border-[#4cd7f6]'
                        : 'bg-[#141c27] border-[#2d3541] opacity-80'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-[#4cd7f6] font-bold">
                        layer2+3 (Default, L2 MAC + L3 IP Addresses)
                      </span>
                      <span className="font-mono text-[10px] text-[#bcc9cd]">
                        Highly balanced traffic distribution across IP peers. RFC compliant.
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">
                      {hashPolicy === 'layer2+3' ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </button>

                  <button
                    onClick={() => setHashPolicy('layer3+4')}
                    className={`w-full p-2.5 rounded-lg text-left flex items-center justify-between border transition-all ${
                      hashPolicy === 'layer3+4'
                        ? 'bg-[#232a36] border-[#4cd7f6]'
                        : 'bg-[#141c27] border-[#2d3541] opacity-80'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-[#dbe3f2]">
                        layer3+4 (TCP/UDP Port + IP Addresses)
                      </span>
                      <span className="font-mono text-[10px] text-[#869397]">
                        Maximum entropy for high-concurrency microservice / proxy clusters.
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-[#869397] text-[18px]">
                      {hashPolicy === 'layer3+4' ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </button>

                  <button
                    onClick={() => setHashPolicy('layer2')}
                    className={`w-full p-2.5 rounded-lg text-left flex items-center justify-between border transition-all ${
                      hashPolicy === 'layer2'
                        ? 'bg-[#232a36] border-[#4cd7f6]'
                        : 'bg-[#141c27] border-[#2d3541] opacity-80'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-[#dbe3f2]">
                        layer2 (Source & Destination MAC Only)
                      </span>
                      <span className="font-mono text-[10px] text-[#869397]">
                        Traditional pure Layer-2 switching (single gateway prone to polarization).
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-[#869397] text-[18px]">
                      {hashPolicy === 'layer2' ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Protocol Timing Controls */}
              <div className="col-span-12 md:col-span-6 flex flex-col justify-between gap-3">
                {/* LACP Rate */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs text-[#bcc9cd] flex items-center justify-between">
                    <span>LACP PDU TRANSMISSION RATE (lacp_rate)</span>
                    <span className="text-[#4edea3] font-mono text-[10px]">FAILOVER &lt; 3s</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1 bg-[#070f19] p-1 rounded-lg border border-[#2d3541]">
                    <button
                      onClick={() => setLacpRate('fast')}
                      className={`py-1.5 px-3 rounded font-mono text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                        lacpRate === 'fast'
                          ? 'bg-[#06b6d4] text-[#00424f] shadow-sm'
                          : 'text-[#869397] hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">bolt</span>
                      <span>Fast (1s PDUs)</span>
                    </button>
                    <button
                      onClick={() => setLacpRate('slow')}
                      className={`py-1.5 px-3 rounded font-mono text-xs flex items-center justify-center gap-1 transition-all ${
                        lacpRate === 'slow'
                          ? 'bg-[#06b6d4] text-[#00424f] shadow-sm font-bold'
                          : 'text-[#869397] hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">schedule</span>
                      <span>Slow (30s PDUs)</span>
                    </button>
                  </div>
                </div>

                {/* Delays grid */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded bg-[#141c27] border border-[#2d3541] flex flex-col gap-1">
                    <span className="font-mono text-[10px] text-[#869397]">MIIMON FREQ</span>
                    <div className="flex items-center rounded bg-[#070f19] px-2 py-1 border border-[#2d3541]">
                      <input
                        type="number"
                        value={miimon}
                        onChange={(e) => setMiimon(Number(e.target.value))}
                        className="w-full bg-transparent font-mono text-xs text-[#dbe3f2] focus:outline-none"
                      />
                      <span className="font-mono text-[10px] text-[#869397]">ms</span>
                    </div>
                    <span className="font-mono text-[9px] text-[#869397]">Carrier Poll</span>
                  </div>

                  <div className="p-2 rounded bg-[#141c27] border border-[#2d3541] flex flex-col gap-1">
                    <span className="font-mono text-[10px] text-[#869397]">UPDELAY</span>
                    <div className="flex items-center rounded bg-[#070f19] px-2 py-1 border border-[#2d3541]">
                      <input
                        type="number"
                        value={updelay}
                        onChange={(e) => setUpdelay(Number(e.target.value))}
                        className="w-full bg-transparent font-mono text-xs text-[#dbe3f2] focus:outline-none"
                      />
                      <span className="font-mono text-[10px] text-[#869397]">ms</span>
                    </div>
                    <span className="font-mono text-[9px] text-[#869397]">Debounce In</span>
                  </div>

                  <div className="p-2 rounded bg-[#141c27] border border-[#2d3541] flex flex-col gap-1">
                    <span className="font-mono text-[10px] text-[#869397]">MIN LINKS</span>
                    <div className="flex items-center rounded bg-[#070f19] px-2 py-1 border border-[#2d3541]">
                      <input
                        type="number"
                        value={minLinks}
                        onChange={(e) => setMinLinks(Number(e.target.value))}
                        className="w-full bg-transparent font-mono text-xs text-[#dbe3f2] focus:outline-none"
                      />
                      <span className="font-mono text-[10px] text-[#869397]">min</span>
                    </div>
                    <span className="font-mono text-[9px] text-[#869397]">Threshold</span>
                  </div>
                </div>

                <div className="p-2 rounded bg-[#232a36] flex items-center justify-between font-mono text-xs border border-[#2d3541]">
                  <span className="text-[#bcc9cd]">
                    LACP System Priority: <strong className="text-[#dbe3f2]">65535</strong>
                  </span>
                  <span className="text-[#4edea3]">Partner Actor Key: AUTO (0x0011)</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 04: LAYER 3 ADDRESSING & HARDWARE OFFLOAD */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#2d3541]/60 pb-1.5">
              <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-widest font-bold">
                04 // LAYER 3 ADDRESSING & HARDWARE OFFLOAD
              </span>
              <span className="font-mono text-[11px] text-[#869397]">802.1Q TRUNK MASTER</span>
            </div>

            <div className="bg-[#18202b] rounded-xl p-4 border border-[#2d3541] grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-7 flex flex-col gap-2">
                <span className="font-mono text-xs text-[#bcc9cd]">LOGICAL IP ADDRESSING MODE</span>
                <div className="grid grid-cols-3 gap-2">
                  <button className="p-2 rounded bg-[#141c27] border border-[#2d3541] text-left opacity-80 hover:opacity-100 transition-opacity">
                    <span className="font-mono text-xs text-[#869397] block">Static IPv4/v6</span>
                    <span className="font-mono text-[10px] text-[#bcc9cd]">Manual Subnet</span>
                  </button>
                  <button className="p-2 rounded bg-[#141c27] border border-[#2d3541] text-left opacity-80 hover:opacity-100 transition-opacity">
                    <span className="font-mono text-xs text-[#869397] block">DHCP Client</span>
                    <span className="font-mono text-[10px] text-[#bcc9cd]">Dynamic Host</span>
                  </button>
                  <button className="p-2 rounded bg-[#232a36] border border-[#4cd7f6] text-left shadow-sm">
                    <span className="font-mono text-xs text-[#4cd7f6] font-bold block">VLAN Trunk Master</span>
                    <span className="font-mono text-[10px] text-[#4edea3]">802.1Q Parent Only</span>
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono text-xs text-[#bcc9cd]">INTERFACE MTU:</span>
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    {['1500', '9000', '9216'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setMtu(val)}
                        className={`px-2.5 py-1 rounded transition-colors ${
                          mtu === val
                            ? 'bg-[#06b6d4] text-[#00424f] font-bold'
                            : 'bg-[#141c27] text-[#869397] border border-[#2d3541] hover:text-white'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hardware Offload Toggles */}
              <div className="col-span-12 md:col-span-5 flex flex-col justify-center gap-2 bg-[#141c27] p-3 rounded-lg border border-[#2d3541]">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={xdpSteering}
                    onChange={(e) => setXdpSteering(e.target.checked)}
                    className="mt-0.5 accent-[#4cd7f6] w-4 h-4 rounded cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-[#dbe3f2] font-bold">
                      Native XDP Queue Steering (AF_XDP)
                    </span>
                    <span className="font-mono text-[10px] text-[#869397]">
                      Bypasses Linux sk_buff overhead for line-rate hashing.
                    </span>
                  </div>
                </label>

                <div className="h-px bg-[#2d3541]" />

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={vlanFiltering}
                    onChange={(e) => setVlanFiltering(e.target.checked)}
                    className="mt-0.5 accent-[#4cd7f6] w-4 h-4 rounded cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-[#dbe3f2] font-bold">
                      Hardware 802.1Q Tag Filtering
                    </span>
                    <span className="font-mono text-[10px] text-[#869397]">
                      NIC ASIC handles VLAN tag strip/insert at wire speed.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 05: LINUX COMMAND PREVIEW & NETLINK RUNTIME */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-[#2d3541]/60 pb-1.5">
              <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-widest font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">code</span>
                05 // LINUX COMMAND PREVIEW & NETLINK RUNTIME
              </span>
              <span className="font-mono text-[10px] text-[#4edea3] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
                Kernel Driver v6.6-rt JIT Validated
              </span>
            </div>

            <div className="rounded-lg bg-[#070f19] p-3.5 font-mono text-xs leading-relaxed text-[#bcc9cd] border border-[#2d3541] overflow-x-auto shadow-inner space-y-1">
              <div className="flex items-center justify-between text-[#869397] pb-1 text-[10px] border-b border-[#2d3541]/40">
                <span>UNIX NETLINK SYNTHESIS // RTNETLINK ATOMIC TRANSACTION</span>
                <span className="text-[#4cd7f6] font-bold">DRY-RUN SYNTAX OK</span>
              </div>
              <p className="text-[#dbe3f2]">
                <span className="text-[#4cd7f6] font-bold">#</span> ip link add name{' '}
                <span className="text-[#4edea3] font-bold">{bondName}</span> type bond mode{' '}
                <span className="text-[#4cd7f6] font-bold">{bondMode}</span> miimon {miimon} lacp_rate {lacpRate} xmit_hash_policy {hashPolicy}
              </p>
              {selectedSlavesList.map((slave) => (
                <p key={slave} className="text-[#dbe3f2]">
                  <span className="text-[#4cd7f6] font-bold">#</span> ip link set dev{' '}
                  <span className="text-[#4edea3]">{slave}</span> down && ip link set dev{' '}
                  <span className="text-[#4edea3]">{slave}</span> master {bondName} && ip link set dev{' '}
                  <span className="text-[#4edea3]">{slave}</span> up
                </p>
              ))}
              <p className="text-[#dbe3f2]">
                <span className="text-[#4cd7f6] font-bold">#</span> ip link set dev {bondName} mtu{' '}
                <span className="text-[#4cd7f6]">{mtu}</span> up
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Toolbar */}
        <div className="bg-[#18202b] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 border-t border-[#2d3541] shadow-lg">
          <div className="flex items-center gap-2 font-mono text-xs text-[#bcc9cd]">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
            <span>eBPF zero-packet-loss slave hotload injection enabled</span>
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
              className="px-4 py-1.5 rounded bg-[#141c27] hover:bg-[#18202b] text-[#dbe3f2] border border-[#2d3541] font-mono text-xs flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">
                science
              </span>
              <span>
                {dryRunStatus === 'testing'
                  ? 'Testing LACP Partner...'
                  : dryRunStatus === 'verified'
                  ? 'Carrier Partner OK!'
                  : 'Dry-Run LACP Partner'}
              </span>
            </button>
            <button
              onClick={handleCommit}
              className="px-5 py-1.5 rounded bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_16px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">
                {commitStatus === 'committing' ? 'sync' : 'add_circle'}
              </span>
              <span>
                {commitStatus === 'committing'
                  ? 'Committing RTNL Netlink...'
                  : commitStatus === 'committed'
                  ? 'Bond Active & Synchronized!'
                  : '+ Create Bond & Commit Slaves'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
