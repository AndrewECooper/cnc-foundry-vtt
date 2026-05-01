// Castles & Crusades Character Sheet — Tabletop Hybrid skin
// All five tabs: Combat · Character Abilities · Equipment · Spells · Description
// Click sidebar tabs to switch. Prime-stat emphasis, click-to-roll affordances,
// pip trackers, masking-tape and pinned-paper details.

const SHEET_W = 880;
const SHEET_H = 760;

// ─────────────────────────────────────────────────────────────
// Sample data
const CHAR = {
  name: 'Bob',
  hp: { cur: 10, max: 10 },
  level: 1, xp: 0, xpNext: 2000,
  class: 'Cleric', race: 'Human',
  deity: 'Ulaa', title: 'Acolyte', disposition: 'Lawful Good',
  size: 'Medium', height: '5\'10"', gender: 'M', weight: '170 lb', age: 28,
  languages: 'Common, Dwarven',
  hometown: 'Stormhold',
  appearance: 'Broad-shouldered with a salt-and-pepper beard. A faded scar runs along the left cheek. Wears a dented mail hauberk over road-stained linens; a small holy symbol dangles at the throat.',
  biography: 'Born to a stonemason in Stormhold. Took up arms after raiders sacked the family quarry. A wandering cleric of Ulaa took him in; he has served the temple for six years, but his oaths now point him outward into the wider world.',
};

const STATS = [
  { key: 'STR', value: 14, mod: '+1', prime: true  },
  { key: 'DEX', value: 11, mod: '+0', prime: false },
  { key: 'CON', value: 13, mod: '+1', prime: false },
  { key: 'INT', value: 10, mod: '+0', prime: false },
  { key: 'WIS', value: 16, mod: '+2', prime: true  },
  { key: 'CHA', value: 12, mod: '+0', prime: false },
];

const RESOURCES = [
  { name: 'Turn Undead',   used: 1, max: 3 },
  { name: 'Lay on Hands',  used: 0, max: 2 },
  { name: 'Channel Holy',  used: 2, max: 5 },
  { name: 'Inspiration',   used: 1, max: 1 },
];

const TABS = [
  { key: 'combat',    label: 'Combat',    glyph: '⚔' },
  { key: 'abilities', label: 'Abilities', glyph: '✦' },
  { key: 'equipment', label: 'Equipment', glyph: '⚒' },
  { key: 'spells',    label: 'Spells',    glyph: '✶' },
  { key: 'desc',      label: 'Description', glyph: '☙' },
];

const WEAPONS = [
  { name: 'Mace',       atk: '+2', dmg: '1d6+1', notes: 'Bludgeoning' },
  { name: 'Light Crossbow', atk: '+0', dmg: '1d6', notes: '80 ft.' },
  { name: 'Dagger',     atk: '+1', dmg: '1d4', notes: 'Thrown 20 ft.' },
];
const ARMOR = [
  { name: 'Chain Mail',   ac: 16, notes: 'Med. armor' },
  { name: 'Heater Shield', ac: '+1', notes: '' },
];

const FEATURES = [
  { name: 'Spontaneous Cure',    formula: '—',   desc: 'May convert prepared spell into Cure Wounds of equal level.' },
  { name: 'Turn Undead',         formula: 'd20', desc: 'Turn or destroy undead within 60 ft.' },
  { name: 'Heavy Armor Training', formula: '—',  desc: 'Proficient in all forms of armor.' },
  { name: 'Holy Symbol',         formula: '—',   desc: 'Acts as a divine focus when casting cleric spells.' },
];

const SPELL_SLOTS = [
  { lvl: 0, total: 4, used: 1 },
  { lvl: 1, total: 3, used: 2 },
  { lvl: 2, total: 2, used: 0 },
  { lvl: 3, total: 0, used: 0 },
  { lvl: 4, total: 0, used: 0 },
  { lvl: 5, total: 0, used: 0 },
  { lvl: 6, total: 0, used: 0 },
  { lvl: 7, total: 0, used: 0 },
  { lvl: 8, total: 0, used: 0 },
  { lvl: 9, total: 0, used: 0 },
];

const SPELLS_BY_LEVEL = {
  0: [
    { name: 'Light',          prepared: true,  desc: 'Object sheds bright light, 20 ft.' },
    { name: 'Purify Food & Drink', prepared: false, desc: 'Removes poison, rot from rations.' },
    { name: 'Guidance',       prepared: true,  desc: '+1 to one ability check.' },
  ],
  1: [
    { name: 'Cure Light Wounds', prepared: true,  desc: 'Heal 1d8+1 hp on touch.' },
    { name: 'Bless',          prepared: true,  desc: '+1 attack rolls for allies, 6 rounds.' },
    { name: 'Sanctuary',      prepared: false, desc: 'Foes must save to attack you.' },
  ],
  2: [
    { name: 'Hold Person',    prepared: false, desc: 'Paralyze humanoid, save negates.' },
    { name: 'Spiritual Weapon', prepared: false, desc: 'Force weapon attacks at range.' },
  ],
};

const EQUIPMENT = [
  { qty: 1, name: 'Mace',          weight: 4 },
  { qty: 1, name: 'Light Crossbow', weight: 4 },
  { qty: 20, name: 'Crossbow Bolts', weight: 1.5 },
  { qty: 1, name: 'Chain Mail',    weight: 30 },
  { qty: 1, name: 'Heater Shield', weight: 6 },
  { qty: 1, name: 'Holy Symbol',   weight: 0 },
  { qty: 1, name: 'Backpack',      weight: 2 },
  { qty: 5, name: 'Rations, day',  weight: 2.5 },
  { qty: 1, name: 'Bedroll',       weight: 5 },
  { qty: 1, name: 'Flint & Steel', weight: 0 },
  { qty: 4, name: 'Torch',         weight: 4 },
  { qty: 1, name: 'Waterskin',     weight: 4 },
];
const COIN = { pp: 2, gp: 47, sp: 13, cp: 60 };
const VALUABLES = 'Silver locket (10 gp), polished agate';

// ─────────────────────────────────────────────────────────────
// Tokens — Tabletop Hybrid
const T = {
  outerBg: '#3a2a1a',         // wood mat
  text: '#2a2418',
  muted: '#7a6b56',
  accent: '#a02a2a',          // ink red
  accentSoft: '#5a8a6a',      // sage
  bodyFont: '"IBM Plex Sans", system-ui, sans-serif',
  headFont: '"Crimson Text", "Crimson Pro", Georgia, serif',
  titleBarBg: 'linear-gradient(#2a1f12,#1f160a)',
  titleBarText: '#e0d0a8',
  sidebarBg: 'linear-gradient(180deg, #4a3826 0%, #3a2a1a 100%)',
  sidebarBorder: '1px solid #2a1c10',
  tabActiveBg: 'rgba(255,250,235,0.95)',
  tabActiveText: '#2a2418',
  tabText: '#d8c8a8',
  parchmentBg: '#f7efde',
  parchmentImg: `
    radial-gradient(ellipse at 30% 20%, rgba(255,255,240,0.9), transparent 60%),
    radial-gradient(ellipse at 70% 80%, rgba(170,130,80,0.12), transparent 50%)
  `,
  plainBg: '#fbf6e8',
  cardBg: '#fbf6e8',
  cardBorder: '#d4c5a0',
  cardLine: '#c8b890',
};

// ─────────────────────────────────────────────────────────────
// Pip tracker
function Pips({ used, max, fill = T.accent, empty = 'transparent', border = T.muted, size = 11 }) {
  if (max === 0) return <span style={{ fontSize: 11, color: T.muted, fontStyle: 'italic' }}>—</span>;
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} style={{
          width: size, height: size, borderRadius: '50%',
          background: i < (max - used) ? fill : empty,
          border: `1.5px solid ${border}`,
          boxShadow: i < (max - used) ? 'inset 0 1px 2px rgba(0,0,0,.3)' : 'none',
        }} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sheet shell
function CharacterSheet({ parchment }) {
  const [activeTab, setActiveTab] = React.useState('combat');

  const TabContent = {
    combat:    CombatTab,
    abilities: AbilitiesTab,
    equipment: EquipmentTab,
    spells:    SpellsTab,
    desc:      DescriptionTab,
  }[activeTab];

  return (
    <div style={{
      width: SHEET_W, height: SHEET_H,
      display: 'flex', flexDirection: 'column',
      background: T.outerBg,
      backgroundImage: `
        radial-gradient(ellipse at 20% 30%, rgba(120,90,60,0.4), transparent 70%),
        repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0 2px, transparent 2px 6px)
      `,
      fontFamily: T.bodyFont, color: T.text,
      position: 'relative',
    }}>
      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px',
        background: T.titleBarBg,
        borderBottom: '1px solid #4a3a22',
        color: T.titleBarText,
        fontSize: 12, letterSpacing: 0.5,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: T.headFont, fontSize: 14, letterSpacing: 1 }}>{CHAR.name.toUpperCase()}</span>
          <span style={{ opacity: 0.5 }}>◆</span>
        </div>
        <div style={{ display: 'flex', gap: 16, opacity: 0.85 }}>
          <span>⚙ Sheet</span>
          <span>◐ Token</span>
          <span>✕ Close</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar activeTab={activeTab} onTab={setActiveTab} />
        <div style={{ flex: 1, position: 'relative', padding: 14, minWidth: 0 }}>
          <PaperCard parchment={parchment}>
            <SheetHeader />
            <TabContent />
          </PaperCard>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ activeTab, onTab }) {
  return (
    <div style={{
      width: 140, flexShrink: 0,
      background: T.sidebarBg,
      borderRight: T.sidebarBorder,
      display: 'flex', flexDirection: 'column',
      padding: '14px 0',
      gap: 2,
      boxShadow: 'inset -2px 0 6px rgba(0,0,0,0.3)',
    }}>
      {TABS.map(t => {
        const active = t.key === activeTab;
        return (
          <button key={t.key} onClick={() => onTab(t.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px',
              background: active ? T.tabActiveBg : 'transparent',
              border: 'none',
              borderLeft: active ? `3px solid ${T.accent}` : '3px solid transparent',
              color: active ? T.tabActiveText : T.tabText,
              fontFamily: T.headFont,
              fontSize: 14, letterSpacing: 0.6,
              textAlign: 'left',
              cursor: 'pointer',
              fontWeight: active ? 600 : 400,
              fontStyle: active ? 'italic' : 'normal',
              boxShadow: active ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
            }}>
            <span style={{
              fontSize: 16, width: 18, textAlign: 'center',
              color: active ? T.accent : T.tabText, opacity: active ? 1 : 0.7,
            }}>{t.glyph}</span>
            <span>{t.label}</span>
          </button>
        );
      })}
      <div style={{ flex: 1 }} />
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid rgba(0,0,0,0.3)',
        fontSize: 10, lineHeight: 1.6,
        color: '#b8a888',
      }}>
        <div style={{ fontFamily: T.headFont, fontSize: 13, color: '#f0e0c0', marginBottom: 4 }}>{CHAR.name}</div>
        <div>Lvl {CHAR.level} · {CHAR.class}</div>
        <div>{CHAR.race}</div>
      </div>
    </div>
  );
}

// Paper card with tape strip + folded corner
function PaperCard({ parchment, children }) {
  return (
    <div style={{
      position: 'relative',
      height: '100%',
      background: parchment ? T.parchmentBg : T.plainBg,
      backgroundImage: parchment ? T.parchmentImg : 'none',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.5) inset',
      padding: '18px 22px 20px',
      clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{
        position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%) rotate(-1.2deg)',
        width: 110, height: 18, background: 'rgba(220,200,150,0.7)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.3) 0 4px, transparent 4px 8px)',
        zIndex: 2,
      }}/>
      {children}
    </div>
  );
}

// Header — character identity. Same on every tab.
function SheetHeader() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexShrink: 0 }}>
      <Portrait />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: T.headFont, fontSize: 30, color: T.accent,
          fontStyle: 'italic', lineHeight: 1,
          borderBottom: `2px solid ${T.accent}`,
          paddingBottom: 2, transform: 'rotate(-0.3deg)',
          display: 'inline-block',
        }}>{CHAR.name}</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
          <StampField label="HP" value={`${CHAR.hp.cur}/${CHAR.hp.max}`} />
          <StampField label="LVL" value={CHAR.level} />
          <StampField label="CLASS" value={CHAR.class} />
          <StampField label="RACE" value={CHAR.race} />
          <StampField label="DEITY" value={CHAR.deity} />
          <StampField label="TITLE" value={CHAR.title} />
          <StampField label="DISPOSITION" value={CHAR.disposition} />
          <StampField label="XP" value={`${CHAR.xp} / ${CHAR.xpNext}`} />
        </div>
      </div>
    </div>
  );
}

function Portrait() {
  return (
    <div style={{
      width: 64, height: 64, position: 'relative',
      flexShrink: 0,
      background: '#ede0bf',
      backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 6px, rgba(120,90,60,0.06) 6px 7px)',
      border: `2px solid ${T.muted}`,
      borderRadius: 4,
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 28, color: T.muted,
    }}>
      ☻
      <div style={{
        position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%) rotate(-2deg)',
        width: 36, height: 12, background: 'rgba(220,200,150,0.8)',
        boxShadow: '0 2px 3px rgba(0,0,0,0.15)',
      }}/>
    </div>
  );
}

function StampField({ label, value }) {
  return (
    <div style={{
      display: 'inline-flex', flexDirection: 'column',
      padding: '2px 8px',
      border: `1px dashed ${T.muted}`,
      background: 'rgba(255,255,255,0.4)',
      minWidth: 40,
    }}>
      <span style={{ fontSize: 8, letterSpacing: 1, color: T.muted, fontFamily: T.bodyFont }}>{label}</span>
      <span style={{ fontFamily: T.headFont, fontSize: 13, color: T.text, lineHeight: 1.2 }}>{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Generic Section card
function Section({ title, action, pinned, children, flex }) {
  return (
    <div style={{
      position: 'relative',
      background: '#fbf6e8',
      border: `1px solid ${T.muted}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex', flexDirection: 'column',
      flex: flex || '0 0 auto',
      minHeight: 0,
    }}>
      {pinned && (
        <div style={{
          position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
          width: 14, height: 14, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #ff6868, #b02020)',
          boxShadow: '0 2px 3px rgba(0,0,0,0.3)',
          zIndex: 1,
        }}/>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 10px',
        borderBottom: `1px solid ${T.muted}`,
        background: 'rgba(0,0,0,0.03)',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: T.headFont, fontSize: 14, fontStyle: 'italic',
          color: T.text, letterSpacing: 0.5, fontWeight: 600,
        }}>{title}</div>
        {action}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>{children}</div>
    </div>
  );
}

function AddBtn({ children = '+ Add' }) {
  return (
    <button style={{
      fontSize: 10, background: 'transparent', border: `1px dashed ${T.muted}`,
      color: T.accent, cursor: 'pointer', padding: '1px 6px',
      fontFamily: T.bodyFont,
    }}>{children}</button>
  );
}

function RowActions() {
  return (
    <span style={{ display: 'inline-flex', gap: 6, color: T.muted }}>
      <span style={{ cursor: 'pointer' }} title="Edit">✎</span>
      <span style={{ cursor: 'pointer' }} title="Delete">🗑</span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Stat panels (slightly rotated, with PRIME stamp)
function StatPanel({ stat }) {
  return (
    <button style={{
      position: 'relative',
      background: stat.prime ? '#fff8e1' : '#fbf6e8',
      border: stat.prime ? `2px solid ${T.accent}` : `1px dashed ${T.muted}`,
      padding: '8px 4px 6px',
      cursor: 'pointer',
      textAlign: 'center',
      boxShadow: stat.prime ? '0 2px 0 rgba(160,42,42,0.15)' : 'none',
      transform: stat.prime ? 'rotate(-0.4deg)' : 'rotate(0.2deg)',
    }}>
      {stat.prime && (
        <div style={{
          position: 'absolute', top: -8, right: -6,
          background: T.accent, color: '#fff8e1',
          fontSize: 8, letterSpacing: 1, padding: '2px 5px',
          fontFamily: T.bodyFont, fontWeight: 600,
          transform: 'rotate(8deg)',
          border: '1px solid #fff',
        }}>PRIME</div>
      )}
      <div style={{ fontFamily: T.bodyFont, fontSize: 9, color: T.muted, letterSpacing: 1.5, textTransform: 'uppercase' }}>{stat.key}</div>
      <div style={{ fontFamily: T.headFont, fontSize: 26, lineHeight: 1, color: T.text, fontWeight: 600 }}>{stat.value}</div>
      <div style={{ marginTop: 2, fontSize: 11, color: T.accent, fontWeight: 600, fontFamily: 'ui-monospace, monospace' }}>{stat.mod}</div>
      <div style={{ marginTop: 3, fontSize: 9, letterSpacing: 1, color: T.muted, textTransform: 'uppercase' }}>roll</div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// COMBAT TAB
function CombatTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
        {STATS.map(s => <StatPanel key={s.key} stat={s} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          <CombatStatRow />
          <Section title="Weapons" action={<AddBtn />}>
            <WeaponTable />
          </Section>
          <Section title="Armor" action={<AddBtn />}>
            <ArmorTable />
          </Section>
        </div>
        <Section title="Trackable Resources" pinned action={<AddBtn />}>
          <ResourceList />
        </Section>
      </div>
    </div>
  );
}

function CombatStatRow() {
  const items = [
    { label: 'AC', value: 16 },
    { label: 'Base to Hit', value: '+1' },
    { label: 'Move', value: '30 ft' },
    { label: 'Class HD', value: '1d8' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
      {items.map(it => (
        <div key={it.label} style={{
          background: '#fbf6e8',
          border: `1px dashed ${T.muted}`,
          padding: '7px 10px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, fontFamily: T.bodyFont }}>{it.label}</div>
          <div style={{ fontFamily: T.headFont, fontSize: 22, color: T.text, fontWeight: 600, lineHeight: 1.1 }}>{it.value}</div>
        </div>
      ))}
    </div>
  );
}

function WeaponTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr style={{ color: T.muted, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' }}>
          <th style={{ textAlign: 'left', padding: '4px 10px', fontWeight: 500 }}>Weapon</th>
          <th style={{ width: 50, textAlign: 'center', fontWeight: 500 }}>Atk</th>
          <th style={{ width: 70, textAlign: 'center', fontWeight: 500 }}>Dmg</th>
          <th style={{ textAlign: 'left', padding: '4px 10px', fontWeight: 500 }}>Notes</th>
          <th style={{ width: 60, textAlign: 'center', fontWeight: 500 }}>Roll</th>
        </tr>
      </thead>
      <tbody>
        {WEAPONS.map((w, i) => (
          <tr key={i} style={{ borderTop: `1px dotted ${T.cardLine}` }}>
            <td style={{ padding: '5px 10px', fontFamily: T.headFont, fontSize: 13 }}>{w.name}</td>
            <td style={{ textAlign: 'center', color: T.accent, fontWeight: 600 }}>{w.atk}</td>
            <td style={{ textAlign: 'center', fontFamily: 'ui-monospace, monospace', fontSize: 11 }}>{w.dmg}</td>
            <td style={{ padding: '5px 10px', color: T.muted, fontSize: 11 }}>{w.notes}</td>
            <td style={{ textAlign: 'center', color: T.accent, cursor: 'pointer', fontSize: 14 }}>⚄</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ArmorTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr style={{ color: T.muted, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' }}>
          <th style={{ textAlign: 'left', padding: '4px 10px', fontWeight: 500 }}>Armor</th>
          <th style={{ width: 60, textAlign: 'center', fontWeight: 500 }}>AC</th>
          <th style={{ textAlign: 'left', padding: '4px 10px', fontWeight: 500 }}>Notes</th>
        </tr>
      </thead>
      <tbody>
        {ARMOR.map((a, i) => (
          <tr key={i} style={{ borderTop: `1px dotted ${T.cardLine}` }}>
            <td style={{ padding: '5px 10px', fontFamily: T.headFont, fontSize: 13 }}>{a.name}</td>
            <td style={{ textAlign: 'center', color: T.accent, fontWeight: 600 }}>{a.ac}</td>
            <td style={{ padding: '5px 10px', color: T.muted, fontSize: 11 }}>{a.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ResourceList() {
  return (
    <div style={{ padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {RESOURCES.map(r => (
        <div key={r.name} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 4px',
          borderBottom: `1px dotted ${T.cardLine}`,
        }}>
          <div style={{ fontFamily: T.headFont, fontSize: 13, fontStyle: 'italic' }}>{r.name}</div>
          <Pips used={r.used} max={r.max} />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHARACTER ABILITIES TAB
function AbilitiesTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
      <Section title="Special Abilities & Class Features" action={<AddBtn />} flex="1 1 auto">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ color: T.muted, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' }}>
              <th style={{ textAlign: 'left', padding: '6px 10px', fontWeight: 500, width: '22%' }}>Feature</th>
              <th style={{ textAlign: 'left', padding: '6px 10px', fontWeight: 500 }}>Description</th>
              <th style={{ width: 70, textAlign: 'center', fontWeight: 500 }}>Roll</th>
              <th style={{ width: 60, textAlign: 'center', fontWeight: 500 }}/>
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((f, i) => (
              <tr key={i} style={{ borderTop: `1px dotted ${T.cardLine}`, verticalAlign: 'top' }}>
                <td style={{ padding: '8px 10px', fontFamily: T.headFont, fontSize: 14, fontStyle: 'italic' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: T.accent }}>✦</span>{f.name}
                  </div>
                </td>
                <td style={{ padding: '8px 10px', color: T.text, fontSize: 12, lineHeight: 1.4 }}>{f.desc}</td>
                <td style={{ textAlign: 'center', fontFamily: 'ui-monospace, monospace', fontSize: 11, color: f.formula === '—' ? T.muted : T.accent }}>{f.formula}</td>
                <td style={{ textAlign: 'center', padding: '8px 6px' }}><RowActions /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// EQUIPMENT TAB
function EquipmentTab() {
  const totalWeight = EQUIPMENT.reduce((a, b) => a + b.weight, 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 80px) 1fr', gap: 10 }}>
        {[
          { label: 'Platinum', value: COIN.pp, color: '#a0a0b8' },
          { label: 'Gold',     value: COIN.gp, color: '#c8a13a' },
          { label: 'Silver',   value: COIN.sp, color: '#a8a8a0' },
          { label: 'Copper',   value: COIN.cp, color: '#b07050' },
        ].map(c => (
          <div key={c.label} style={{
            background: '#fbf6e8',
            border: `1px dashed ${T.muted}`,
            padding: '6px 8px', textAlign: 'center',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: 4, right: 4,
              width: 10, height: 10, borderRadius: '50%',
              background: c.color, opacity: 0.7,
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
            }}/>
            <div style={{ fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: T.muted }}>{c.label}</div>
            <div style={{ fontFamily: T.headFont, fontSize: 20, color: T.text, fontWeight: 600, lineHeight: 1.1 }}>{c.value}</div>
          </div>
        ))}
        <div style={{
          background: '#fbf6e8',
          border: `1px dashed ${T.muted}`,
          padding: '6px 10px', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: T.muted }}>Valuables</div>
          <div style={{ fontFamily: T.headFont, fontStyle: 'italic', fontSize: 13, color: T.text, lineHeight: 1.3 }}>{VALUABLES}</div>
        </div>
      </div>

      <Section
        title="Equipment"
        flex="1 1 auto"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, color: T.muted, fontFamily: T.bodyFont }}>
              Load: <strong style={{ color: T.text }}>{totalWeight.toFixed(1)} lbs</strong>
            </span>
            <AddBtn />
          </div>
        }
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ color: T.muted, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' }}>
              <th style={{ width: 50, textAlign: 'center', padding: '4px 6px', fontWeight: 500 }}>Qty</th>
              <th style={{ textAlign: 'left', padding: '4px 10px', fontWeight: 500 }}>Item</th>
              <th style={{ width: 70, textAlign: 'right', padding: '4px 10px', fontWeight: 500 }}>Weight</th>
              <th style={{ width: 60, textAlign: 'center', fontWeight: 500 }}/>
            </tr>
          </thead>
          <tbody>
            {EQUIPMENT.map((e, i) => (
              <tr key={i} style={{ borderTop: `1px dotted ${T.cardLine}` }}>
                <td style={{ textAlign: 'center', fontFamily: 'ui-monospace, monospace', fontSize: 11, color: T.muted }}>×{e.qty}</td>
                <td style={{ padding: '5px 10px', fontFamily: T.headFont, fontSize: 13 }}>{e.name}</td>
                <td style={{ textAlign: 'right', padding: '5px 10px', fontFamily: 'ui-monospace, monospace', fontSize: 11, color: T.muted }}>{e.weight} lb</td>
                <td style={{ textAlign: 'center' }}><RowActions /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SPELLS TAB
function SpellsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
      {/* Slots row: pip clusters per spell level */}
      <div style={{
        background: '#fbf6e8',
        border: `1px dashed ${T.muted}`,
        padding: '8px 12px',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 8,
        }}>
          <div style={{
            fontFamily: T.headFont, fontSize: 14, fontStyle: 'italic',
            color: T.text, fontWeight: 600,
          }}>Spell Slots</div>
          <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1, textTransform: 'uppercase' }}>
            Filled = used · Open = available
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6 }}>
          {SPELL_SLOTS.map(s => (
            <div key={s.lvl} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: T.headFont, fontSize: 16, color: s.total ? T.text : T.muted,
                fontWeight: 600, lineHeight: 1,
              }}>{s.lvl}</div>
              <div style={{ height: 18, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 4 }}>
                {s.total === 0 ? (
                  <span style={{ color: T.muted, fontStyle: 'italic', fontSize: 11 }}>—</span>
                ) : (
                  <Pips used={s.total - s.used} max={s.total} size={10} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Section title="Spells Known & Prepared" action={<AddBtn />} flex="1 1 auto">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {Object.entries(SPELLS_BY_LEVEL).map(([lvl, spells]) => (
            <div key={lvl}>
              <div style={{
                padding: '6px 12px',
                background: 'rgba(160,42,42,0.06)',
                borderTop: `1px solid ${T.cardLine}`,
                borderBottom: `1px dotted ${T.cardLine}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{
                  fontFamily: T.headFont, fontSize: 13, fontStyle: 'italic',
                  color: T.accent, fontWeight: 600, letterSpacing: 0.5,
                }}>Level {lvl}</div>
                <div style={{ fontSize: 9, color: T.muted, letterSpacing: 1, textTransform: 'uppercase' }}>Prepared</div>
              </div>
              {spells.map((sp, i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '24px 1fr auto auto',
                  alignItems: 'center', gap: 10,
                  padding: '6px 12px',
                  borderBottom: `1px dotted ${T.cardLine}`,
                }}>
                  <div style={{
                    width: 16, height: 16,
                    border: `2px solid ${sp.prepared ? T.accent : T.muted}`,
                    background: sp.prepared ? T.accent : 'transparent',
                    color: '#fff8e1', fontSize: 12, lineHeight: '12px',
                    textAlign: 'center', cursor: 'pointer',
                  }}>{sp.prepared ? '✓' : ''}</div>
                  <div>
                    <div style={{ fontFamily: T.headFont, fontSize: 14, fontStyle: 'italic', color: T.text }}>{sp.name}</div>
                    <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>{sp.desc}</div>
                  </div>
                  <button style={{
                    fontSize: 10, background: 'transparent', border: `1px dashed ${T.muted}`,
                    color: T.accent, cursor: 'pointer', padding: '2px 8px',
                    fontFamily: T.bodyFont, letterSpacing: 0.5,
                  }}>Cast</button>
                  <RowActions />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESCRIPTION TAB
function DescriptionTab() {
  const facts = [
    { label: 'Size',     value: CHAR.size },
    { label: 'Height',   value: CHAR.height },
    { label: 'Gender',   value: CHAR.gender },
    { label: 'Weight',   value: CHAR.weight },
    { label: 'Age',      value: `${CHAR.age} yrs` },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
        {facts.map(f => (
          <div key={f.label} style={{
            background: '#fbf6e8',
            border: `1px dashed ${T.muted}`,
            padding: '6px 10px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: T.muted }}>{f.label}</div>
            <div style={{ fontFamily: T.headFont, fontSize: 18, color: T.text, fontWeight: 600, lineHeight: 1.1 }}>{f.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{
          background: '#fbf6e8',
          border: `1px dashed ${T.muted}`,
          padding: '6px 10px',
        }}>
          <div style={{ fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: T.muted }}>Languages</div>
          <div style={{ fontFamily: T.headFont, fontSize: 14, color: T.text, fontStyle: 'italic' }}>{CHAR.languages}</div>
        </div>
        <div style={{
          background: '#fbf6e8',
          border: `1px dashed ${T.muted}`,
          padding: '6px 10px',
        }}>
          <div style={{ fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: T.muted }}>Hometown</div>
          <div style={{ fontFamily: T.headFont, fontSize: 14, color: T.text, fontStyle: 'italic' }}>{CHAR.hometown}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, flex: 1, minHeight: 0 }}>
        <Section title="Appearance" flex="1 1 auto">
          <div style={{
            padding: '10px 14px',
            fontFamily: T.headFont,
            fontSize: 14, lineHeight: 1.55, color: T.text,
            fontStyle: 'italic',
            backgroundImage: `repeating-linear-gradient(transparent 0 22px, ${T.cardLine} 22px 23px)`,
            backgroundPosition: '0 6px',
          }}>{CHAR.appearance}</div>
        </Section>
        <Section title="Biography & Notes" pinned flex="1 1 auto">
          <div style={{
            padding: '10px 14px',
            fontFamily: T.headFont,
            fontSize: 14, lineHeight: 1.55, color: T.text,
            fontStyle: 'italic',
            backgroundImage: `repeating-linear-gradient(transparent 0 22px, ${T.cardLine} 22px 23px)`,
            backgroundPosition: '0 6px',
          }}>{CHAR.biography}</div>
        </Section>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// App with Tweaks panel for parchment toggle
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "parchment": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#1a1410',
      backgroundImage: `radial-gradient(ellipse at center, #3a2a1a 0%, #0e0904 100%)`,
      overflow: 'auto',
    }}>
      <div style={{ flexShrink: 0, boxShadow: '0 20px 60px rgba(0,0,0,0.7)' }}>
        <CharacterSheet parchment={tweaks.parchment} />
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Background">
          <TweakToggle
            label="Parchment texture"
            value={tweaks.parchment}
            onChange={(v) => setTweak('parchment', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
