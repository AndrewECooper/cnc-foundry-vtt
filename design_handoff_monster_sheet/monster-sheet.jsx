// Castles & Crusades Monster Sheet — Tabletop Hybrid skin
// Three tabs: Combat · Spells · Description
// Same visual language as the Character Sheet: paper card on wood mat,
// vertical sidebar tabs, dashed-stamp fields, ruled paper for prose,
// pin/tape decorations, italic Crimson Text headings.

const SHEET_W = 880;
const SHEET_H = 760;

const MONSTER = {
  name: 'Ralf',
  level: 1, hd: 'd8', hpBonus: 0,
  hp: { cur: 10, max: 10 },
  saves: 'Physical',
  number: '1d4',
  int: 'Average',
  treasure: 'None',
  xp: 25,
  disposition: 'Neutral',
  size: 'Medium',
  type: 'Beast',
  attacks: '2 claws / 1 bite',
  biome: 'Forest, Hill',
  climate: 'Temperate',
  description: 'A stout, mottled-fur predator that hunts in small packs at dusk and dawn. Ralfs are wary of fire and rarely approach lit camps but will trail a wounded traveler for miles. Adults stand four feet at the shoulder; their muzzles are short and powerful, and a pale ridge of bristled hair runs along the spine.',
  tactics: 'Ralfs herd a single foe away from companions, then close in with claws while a second leaps for the throat. They retreat if half their number falls.',
  ecology: 'Mated pairs den in shallow caves; cubs disperse at six months. Hunters prize the pelt; druids consider them sacred to the forest courts.',
};

const SAVING = [
  { key: 'STR', value: 14 },
  { key: 'DEX', value: 13 },
  { key: 'CON', value: 14 },
  { key: 'INT', value: 4  },
  { key: 'WIS', value: 12 },
  { key: 'CHA', value: 7  },
];

const TABS = [
  { key: 'combat', label: 'Combat',      glyph: '⚔' },
  { key: 'spells', label: 'Spells',      glyph: '✶' },
  { key: 'desc',   label: 'Description', glyph: '☙' },
];

const WEAPONS = [
  { name: 'Claw',  atk: '+3', dmg: '1d4+1', notes: 'Slashing'   },
  { name: 'Bite',  atk: '+2', dmg: '1d6+1', notes: 'Piercing'   },
];
const ARMORS = [
  { name: 'Tough Hide', ac: '+11', notes: 'Natural armor' },
];
const FEATURES = [
  { name: 'Pack Tactics', formula: '—',   desc: 'Advantage on attacks if an ally is adjacent to the target.' },
  { name: 'Keen Scent',   formula: 'd20', desc: 'Detect creatures by scent within 60 ft.' },
];

const SPELL_SLOTS = [
  { lvl: 0, total: 0, used: 0 },
  { lvl: 1, total: 0, used: 0 },
  { lvl: 2, total: 0, used: 0 },
  { lvl: 3, total: 0, used: 0 },
  { lvl: 4, total: 0, used: 0 },
  { lvl: 5, total: 0, used: 0 },
  { lvl: 6, total: 0, used: 0 },
  { lvl: 7, total: 0, used: 0 },
  { lvl: 8, total: 0, used: 0 },
  { lvl: 9, total: 0, used: 0 },
];

// Tokens — identical to character sheet
const T = {
  outerBg: '#3a2a1a',
  text: '#2a2418',
  muted: '#7a6b56',
  accent: '#a02a2a',
  accentSoft: '#5a8a6a',
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

function MonsterSheet({ parchment }) {
  const [activeTab, setActiveTab] = React.useState('combat');
  const TabContent = { combat: CombatTab, spells: SpellsTab, desc: DescriptionTab }[activeTab];
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
    }}>
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
          <span style={{ fontFamily: T.headFont, fontSize: 14, letterSpacing: 1 }}>{MONSTER.name.toUpperCase()}</span>
          <span style={{ opacity: 0.5 }}>◆</span>
          <span style={{
            marginLeft: 6, padding: '1px 7px',
            background: 'rgba(160,42,42,0.4)', color: '#f0d8c0',
            border: '1px solid rgba(255,200,180,0.3)',
            fontSize: 9, letterSpacing: 1.5, fontFamily: T.bodyFont,
          }}>BESTIARY</span>
        </div>
        <div style={{ display: 'flex', gap: 16, opacity: 0.85 }}>
          <span>⚙ Sheet</span>
          <span>◐ Token</span>
          <span>✕ Close</span>
        </div>
      </div>

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
      padding: '14px 0', gap: 2,
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
              textAlign: 'left', cursor: 'pointer',
              fontWeight: active ? 600 : 400,
              fontStyle: active ? 'italic' : 'normal',
              boxShadow: active ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
            }}>
            <span style={{ fontSize: 16, width: 18, textAlign: 'center', color: active ? T.accent : T.tabText, opacity: active ? 1 : 0.7 }}>{t.glyph}</span>
            <span>{t.label}</span>
          </button>
        );
      })}
      <div style={{ flex: 1 }} />
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid rgba(0,0,0,0.3)',
        fontSize: 10, lineHeight: 1.6, color: '#b8a888',
      }}>
        <div style={{ fontFamily: T.headFont, fontSize: 13, color: '#f0e0c0', marginBottom: 4, fontStyle: 'italic' }}>{MONSTER.name}</div>
        <div>{MONSTER.size} {MONSTER.type}</div>
        <div>HD {MONSTER.level}{MONSTER.hd} · {MONSTER.disposition}</div>
      </div>
    </div>
  );
}

function PaperCard({ parchment, children }) {
  return (
    <div style={{
      position: 'relative', height: '100%',
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
      {/* Bestiary corner stamp */}
      <div style={{
        position: 'absolute', top: 16, right: 30,
        transform: 'rotate(8deg)',
        border: `2px solid ${T.accent}`,
        color: T.accent,
        padding: '3px 10px',
        fontFamily: T.headFont, fontSize: 11, fontStyle: 'italic',
        letterSpacing: 1.5, textTransform: 'uppercase',
        background: 'rgba(255,250,235,0.4)',
        opacity: 0.55,
      }}>Bestiary · No. 037</div>
      {children}
    </div>
  );
}

function SheetHeader() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexShrink: 0 }}>
      <Portrait />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <div style={{
            fontFamily: T.headFont, fontSize: 30, color: T.accent,
            fontStyle: 'italic', lineHeight: 1,
            borderBottom: `2px solid ${T.accent}`,
            paddingBottom: 2, transform: 'rotate(-0.3deg)',
            display: 'inline-block',
          }}>{MONSTER.name}</div>
          <div style={{
            fontFamily: T.bodyFont, fontSize: 10, color: T.muted,
            letterSpacing: 1, textTransform: 'uppercase',
          }}>{MONSTER.size} · {MONSTER.type}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
          <StampField label="HD" value={`${MONSTER.level}${MONSTER.hd}`} />
          <StampField label="HP" value={`${MONSTER.hp.cur}/${MONSTER.hp.max}`} />
          <StampField label="SAVES" value={MONSTER.saves} />
          <StampField label="NUMBER" value={MONSTER.number} />
          <StampField label="INT" value={MONSTER.int} />
          <StampField label="DISPOSITION" value={MONSTER.disposition} />
          <StampField label="TREASURE" value={MONSTER.treasure} />
          <StampField label="XP" value={MONSTER.xp} />
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
          boxShadow: '0 2px 3px rgba(0,0,0,0.3)', zIndex: 1,
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

function AddBtn() {
  return (
    <button style={{
      fontSize: 10, background: 'transparent', border: `1px dashed ${T.muted}`,
      color: T.accent, cursor: 'pointer', padding: '1px 6px',
      fontFamily: T.bodyFont,
    }}>+ Add</button>
  );
}

function RowActions() {
  return (
    <span style={{ display: 'inline-flex', gap: 6, color: T.muted }}>
      <span style={{ cursor: 'pointer' }}>✎</span>
      <span style={{ cursor: 'pointer' }}>🗑</span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// COMBAT TAB
function CombatTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
      {/* Stats strip — saving throws */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
        {SAVING.map(s => (
          <button key={s.key} style={{
            background: '#fbf6e8',
            border: `1px dashed ${T.muted}`,
            padding: '6px 4px',
            cursor: 'pointer', textAlign: 'center',
            transform: 'rotate(0.2deg)',
          }}>
            <div style={{ fontSize: 9, letterSpacing: 1.5, color: T.muted, textTransform: 'uppercase' }}>{s.key}</div>
            <div style={{ fontFamily: T.headFont, fontSize: 22, color: T.text, fontWeight: 600, lineHeight: 1.05 }}>{s.value}</div>
            <div style={{ fontSize: 9, color: T.muted, letterSpacing: 1, textTransform: 'uppercase' }}>roll</div>
          </button>
        ))}
      </div>

      {/* Core combat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
        {[
          { label: 'AC', value: 13 },
          { label: 'Base to Hit', value: '+1' },
          { label: 'Move', value: '40 ft' },
          { label: 'Attacks', value: MONSTER.attacks, big: false },
        ].map(it => (
          <div key={it.label} style={{
            background: '#fbf6e8',
            border: `1px dashed ${T.muted}`,
            padding: '7px 10px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: T.muted }}>{it.label}</div>
            <div style={{
              fontFamily: T.headFont, fontSize: it.big === false ? 14 : 22,
              color: T.text, fontWeight: 600, lineHeight: 1.15,
            }}>{it.value}</div>
          </div>
        ))}
      </div>

      <Section title="Weapons & Natural Attacks" action={<AddBtn />}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ color: T.muted, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' }}>
              <th style={{ textAlign: 'left', padding: '4px 10px', fontWeight: 500 }}>Attack</th>
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
      </Section>

      <Section title="Armor" action={<AddBtn />}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ color: T.muted, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' }}>
              <th style={{ textAlign: 'left', padding: '4px 10px', fontWeight: 500 }}>Armor</th>
              <th style={{ width: 60, textAlign: 'center', fontWeight: 500 }}>AC</th>
              <th style={{ textAlign: 'left', padding: '4px 10px', fontWeight: 500 }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {ARMORS.map((a, i) => (
              <tr key={i} style={{ borderTop: `1px dotted ${T.cardLine}` }}>
                <td style={{ padding: '5px 10px', fontFamily: T.headFont, fontSize: 13 }}>{a.name}</td>
                <td style={{ textAlign: 'center', color: T.accent, fontWeight: 600 }}>{a.ac}</td>
                <td style={{ padding: '5px 10px', color: T.muted, fontSize: 11 }}>{a.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Special Abilities" action={<AddBtn />} flex="1 1 auto" pinned>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ color: T.muted, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' }}>
              <th style={{ textAlign: 'left', padding: '6px 10px', fontWeight: 500, width: '24%' }}>Feature</th>
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
// SPELLS TAB
function SpellsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
      <div style={{
        background: '#fbf6e8', border: `1px dashed ${T.muted}`,
        padding: '8px 12px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div style={{ fontFamily: T.headFont, fontSize: 14, fontStyle: 'italic', color: T.text, fontWeight: 600 }}>Spell Slots</div>
          <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1, textTransform: 'uppercase' }}>Filled = used · Open = available</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6 }}>
          {SPELL_SLOTS.map(s => (
            <div key={s.lvl} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: T.headFont, fontSize: 16, color: s.total ? T.text : T.muted, fontWeight: 600, lineHeight: 1 }}>{s.lvl}</div>
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
        <div style={{
          padding: '40px 24px', textAlign: 'center',
          color: T.muted, fontFamily: T.headFont, fontStyle: 'italic',
        }}>
          <div style={{ fontSize: 18, marginBottom: 6 }}>No spells known.</div>
          <div style={{ fontSize: 12, color: T.muted, fontStyle: 'normal', fontFamily: T.bodyFont }}>
            Spellcasting monsters list known spells grouped by level here, with prepared toggles and Cast affordances.
          </div>
        </div>
      </Section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESCRIPTION TAB
function DescriptionTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {[
          { label: 'Biome', value: MONSTER.biome },
          { label: 'Climate', value: MONSTER.climate },
          { label: 'Type', value: MONSTER.type },
          { label: 'Size', value: MONSTER.size },
        ].map(f => (
          <div key={f.label} style={{
            background: '#fbf6e8',
            border: `1px dashed ${T.muted}`,
            padding: '6px 10px',
          }}>
            <div style={{ fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: T.muted }}>{f.label}</div>
            <div style={{ fontFamily: T.headFont, fontSize: 14, color: T.text, fontStyle: 'italic', lineHeight: 1.2 }}>{f.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, flex: 1, minHeight: 0 }}>
        <Section title="Description" flex="1 1 auto">
          <RuledProse>{MONSTER.description}</RuledProse>
        </Section>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
          <Section title="Tactics" flex="1 1 auto" pinned>
            <RuledProse>{MONSTER.tactics}</RuledProse>
          </Section>
          <Section title="Ecology & Lore" flex="1 1 auto">
            <RuledProse>{MONSTER.ecology}</RuledProse>
          </Section>
        </div>
      </div>
    </div>
  );
}

function RuledProse({ children }) {
  return (
    <div style={{
      padding: '10px 14px',
      fontFamily: T.headFont,
      fontSize: 14, lineHeight: 1.55, color: T.text, fontStyle: 'italic',
      backgroundImage: `repeating-linear-gradient(transparent 0 22px, ${T.cardLine} 22px 23px)`,
      backgroundPosition: '0 6px',
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────
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
        <MonsterSheet parchment={tweaks.parchment} />
      </div>
      <TweaksPanel title="Tweaks">
        <TweakSection title="Background">
          <TweakToggle label="Parchment texture" value={tweaks.parchment} onChange={(v) => setTweak('parchment', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
