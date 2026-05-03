// Castles & Crusades — Item Sheet Forms
// Four sheets: Ability · Equipment · Spell · Weapon
// Reuses the Tabletop Hybrid skin from Character Sheet:
//   wood mat title bar · parchment paper card with tape strip + folded corner ·
//   masking-tape stamp fields · Crimson Text italic headlines · red ink accent.

// ─────────────────────────────────────────────────────────────
// Tokens — shared with Character Sheet
const IT = {
  outerBg: '#3a2a1a',
  text: '#2a2418',
  muted: '#7a6b56',
  accent: '#a02a2a',
  accentSoft: '#5a8a6a',
  bodyFont: '"IBM Plex Sans", system-ui, sans-serif',
  headFont: '"Crimson Text", "Crimson Pro", Georgia, serif',
  monoFont: 'ui-monospace, "SF Mono", Menlo, monospace',
  titleBarBg: 'linear-gradient(#2a1f12,#1f160a)',
  titleBarText: '#e0d0a8',
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

// Sheet sizing — these are item dialogs, so they're shorter than the full sheet
const FORM_W = 560;

// ─────────────────────────────────────────────────────────────
// Shell — title bar, paper card, sidebar-less compact form
function FormShell({ name, type, glyph, height = 540, parchment, children }) {
  return (
    <div style={{
      width: FORM_W, height,
      display: 'flex', flexDirection: 'column',
      background: IT.outerBg,
      backgroundImage: `
        radial-gradient(ellipse at 20% 30%, rgba(120,90,60,0.4), transparent 70%),
        repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0 2px, transparent 2px 6px)
      `,
      fontFamily: IT.bodyFont, color: IT.text, position: 'relative',
    }}>
      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px',
        background: IT.titleBarBg,
        borderBottom: '1px solid #4a3a22',
        color: IT.titleBarText,
        fontSize: 12, letterSpacing: 0.5,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: IT.headFont, fontSize: 13, letterSpacing: 1 }}>{name.toUpperCase()}</span>
          <span style={{ opacity: 0.5 }}>◆</span>
          <span style={{ opacity: 0.65, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>{type}</span>
        </div>
        <div style={{ display: 'flex', gap: 16, opacity: 0.85 }}>
          <span>⚙ Sheet</span>
          <span>✕ Close</span>
        </div>
      </div>

      {/* Body — paper card */}
      <div style={{ flex: 1, padding: 14, minHeight: 0, position: 'relative' }}>
        <PaperCard parchment={parchment}>
          {children}
        </PaperCard>
      </div>
    </div>
  );
}

function PaperCard({ parchment, children }) {
  return (
    <div style={{
      position: 'relative',
      height: '100%',
      background: parchment ? IT.parchmentBg : IT.plainBg,
      backgroundImage: parchment ? IT.parchmentImg : 'none',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.5) inset',
      padding: '20px 22px 20px',
      clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column', gap: 14,
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

// ─────────────────────────────────────────────────────────────
// Header — icon + name + type stamp
function FormHeader({ icon, name, type, typeColor = IT.accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexShrink: 0 }}>
      <ItemIcon icon={icon} />
      <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
        <div style={{
          fontFamily: IT.headFont, fontSize: 26, color: IT.accent,
          fontStyle: 'italic', lineHeight: 1.05,
          borderBottom: `2px solid ${IT.accent}`,
          paddingBottom: 2, transform: 'rotate(-0.3deg)',
          display: 'inline-block',
          maxWidth: '100%',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{name}</div>
        <div style={{ marginTop: 6 }}>
          <TypeStamp label={type} color={typeColor} />
        </div>
      </div>
    </div>
  );
}

function ItemIcon({ icon }) {
  return (
    <div style={{
      width: 60, height: 60, position: 'relative',
      flexShrink: 0,
      background: '#ede0bf',
      backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 6px, rgba(120,90,60,0.06) 6px 7px)',
      border: `2px solid ${IT.muted}`,
      borderRadius: 4,
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 30, color: IT.muted, fontFamily: IT.headFont,
    }}>
      {icon}
      <div style={{
        position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%) rotate(-2deg)',
        width: 32, height: 11, background: 'rgba(220,200,150,0.8)',
        boxShadow: '0 2px 3px rgba(0,0,0,0.15)',
      }}/>
    </div>
  );
}

function TypeStamp({ label, color }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      border: `1.5px solid ${color}`,
      color: color,
      fontFamily: IT.bodyFont,
      fontSize: 9, letterSpacing: 2, textTransform: 'uppercase',
      fontWeight: 600,
      background: 'rgba(255,255,255,0.4)',
      transform: 'rotate(-0.6deg)',
    }}>{label}</span>
  );
}

// ─────────────────────────────────────────────────────────────
// Form primitives — labelled tape-stamp fields + sectioned regions
function StampInput({ label, value, mono, width, multiline, rows = 3, hint, suffix }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: width || 'auto', flex: width ? '0 0 auto' : '1 1 0',
      minWidth: 0,
    }}>
      <div style={{
        fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase',
        color: IT.muted, fontFamily: IT.bodyFont,
        marginBottom: 3, display: 'flex', justifyContent: 'space-between',
      }}>
        <span>{label}</span>
        {hint && <span style={{ fontStyle: 'italic', textTransform: 'none', letterSpacing: 0 }}>{hint}</span>}
      </div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'stretch' }}>
        {multiline ? (
          <textarea
            defaultValue={value}
            rows={rows}
            style={{
              width: '100%', boxSizing: 'border-box', resize: 'none',
              border: `1px dashed ${IT.muted}`,
              background: 'rgba(255,255,255,0.55)',
              padding: '6px 8px',
              fontFamily: mono ? IT.monoFont : IT.headFont,
              fontSize: mono ? 12 : 14,
              color: IT.text, lineHeight: 1.5, fontStyle: mono ? 'normal' : 'italic',
              outline: 'none',
            }}
          />
        ) : (
          <input
            defaultValue={value}
            style={{
              width: '100%', boxSizing: 'border-box',
              border: `1px dashed ${IT.muted}`,
              background: 'rgba(255,255,255,0.55)',
              padding: '5px 8px',
              fontFamily: mono ? IT.monoFont : IT.headFont,
              fontSize: mono ? 13 : 15,
              color: IT.text, lineHeight: 1.2,
              fontStyle: mono ? 'normal' : 'italic',
              outline: 'none',
              fontWeight: 600,
            }}
          />
        )}
        {suffix && (
          <span style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            fontSize: 10, color: IT.muted, letterSpacing: 1, textTransform: 'uppercase',
            pointerEvents: 'none',
          }}>{suffix}</span>
        )}
      </div>
    </div>
  );
}

function StampSelect({ label, value, options, width }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: width || 'auto', flex: width ? '0 0 auto' : '1 1 0',
      minWidth: 0,
    }}>
      <div style={{
        fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase',
        color: IT.muted, fontFamily: IT.bodyFont, marginBottom: 3,
      }}>{label}</div>
      <select defaultValue={value} style={{
        width: '100%', boxSizing: 'border-box',
        border: `1px dashed ${IT.muted}`,
        background: 'rgba(255,255,255,0.55)',
        padding: '5px 8px',
        fontFamily: IT.headFont, fontSize: 14, fontStyle: 'italic',
        color: IT.text, outline: 'none',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6'><path d='M0 0 L5 6 L10 0' fill='%237a6b56'/></svg>")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 8px center',
      }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function StampPip({ label, value, onIncrement }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
    }}>
      <div style={{
        fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase',
        color: IT.muted, fontFamily: IT.bodyFont, marginBottom: 3,
      }}>{label}</div>
      <div style={{
        border: `1px dashed ${IT.muted}`,
        background: 'rgba(255,255,255,0.55)',
        padding: '5px 10px',
        fontFamily: IT.headFont, fontSize: 18, fontWeight: 600,
        color: IT.text, lineHeight: 1, minWidth: 56, textAlign: 'center',
      }}>{value}</div>
    </div>
  );
}

// Section divider with italic header — like the cards on the character sheet
function FormSection({ title, action, children, pinned, scroll, flex }) {
  return (
    <div style={{
      position: 'relative',
      background: '#fbf6e8',
      border: `1px solid ${IT.muted}`,
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
        borderBottom: `1px solid ${IT.muted}`,
        background: 'rgba(0,0,0,0.03)',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: IT.headFont, fontSize: 13, fontStyle: 'italic',
          color: IT.text, letterSpacing: 0.5, fontWeight: 600,
        }}>{title}</div>
        {action}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: scroll ? 'auto' : 'visible' }}>{children}</div>
    </div>
  );
}

// "Ruled" textarea — looks like a notebook page
function RuledArea({ value, rows = 5, italic = true }) {
  return (
    <textarea
      defaultValue={value}
      rows={rows}
      style={{
        width: '100%', boxSizing: 'border-box', resize: 'none',
        border: 'none', outline: 'none',
        background: 'transparent',
        backgroundImage: `repeating-linear-gradient(transparent 0 22px, ${IT.cardLine} 22px 23px)`,
        backgroundPosition: '0 6px',
        padding: '6px 14px 10px',
        fontFamily: IT.headFont,
        fontStyle: italic ? 'italic' : 'normal',
        fontSize: 14, lineHeight: '23px',
        color: IT.text,
      }}
    />
  );
}

function FormFooter({ children }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'flex-end', gap: 8,
      paddingTop: 6, marginTop: 'auto',
      flexShrink: 0,
    }}>
      {children}
    </div>
  );
}

function FooterBtn({ children, primary }) {
  return (
    <button style={{
      fontFamily: IT.bodyFont, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase',
      padding: '6px 14px',
      border: primary ? `1.5px solid ${IT.accent}` : `1px dashed ${IT.muted}`,
      background: primary ? IT.accent : 'rgba(255,255,255,0.4)',
      color: primary ? '#fff8e1' : IT.text,
      fontWeight: 600, cursor: 'pointer',
      boxShadow: primary ? '0 2px 0 rgba(160,42,42,0.2)' : 'none',
    }}>{children}</button>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. ABILITY FORM — fields from source: name, roll formula, hover text.
function AbilityForm({ parchment }) {
  return (
    <FormShell name="Cool Stuff I Can Do" type="Ability" glyph="✦" height={460} parchment={parchment}>
      <FormHeader icon="✦" name="Cool Stuff I Can Do" type="Ability" />

      <div style={{ display: 'flex', gap: 10 }}>
        <StampInput label="Roll Formula" value="d100" mono width={180} />
      </div>

      <StampInput label="Feature Hover Text" value="" />

      <div style={{ flex: 1 }} />
    </FormShell>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. EQUIPMENT FORM — fields from source: name, quantity, price, weight, EV.
function EquipmentForm({ parchment }) {
  return (
    <FormShell name="Thing" type="Equipment" glyph="⚒" height={460} parchment={parchment}>
      <FormHeader icon="⚒" name="Thing" type="Equipment" />

      <div style={{ display: 'flex', gap: 10 }}>
        <StampInput label="Quantity" value="1" mono width={110} />
        <StampInput label="Price" value="" mono width={110} />
        <StampInput label="Weight" value="1" mono width={110} />
        <StampInput label="EV" value="1" mono width={110} />
      </div>

      <div style={{ flex: 1 }} />
    </FormShell>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. SPELL FORM — fields from source: name, cast time, range, duration, level,
// SV, SR, comp, damage, prepared, components, class, summary, description.
function SpellForm({ parchment }) {
  return (
    <FormShell name="Mega Death Kill" type="Spell" glyph="✶" height={620} parchment={parchment}>
      <FormHeader icon="✶" name="Mega Death Kill" type="Spell" />

      <div style={{ display: 'flex', gap: 10 }}>
        <StampInput label="Cast Time" value="" mono width={100} />
        <StampInput label="Range" value="" mono width={90} />
        <StampInput label="Duration" value="" mono width={130} />
        <StampInput label="Level" value="" mono width={70} />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <StampInput label="SV" value="" mono width={80} />
        <StampInput label="SR" value="" mono width={80} />
        <StampInput label="Comp" value="" mono width={100} />
        <StampInput label="Damage" value="" mono width={120} />
        <StampInput label="Prepared" value="0" mono width={80} />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <StampInput label="Components" value="" />
        <StampInput label="Class" value="" width={180} />
      </div>

      <StampInput label="Spell Summary" value="" />

      <FormSection title="Spell Description — Hover for important alert" flex="1 1 auto" scroll>
        <RuledArea rows={6} value="" />
      </FormSection>
    </FormShell>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. WEAPON FORM — fields from source: name, price, weight, EV, damage,
// bonus AB, range.
function WeaponForm({ parchment }) {
  return (
    <FormShell name="Stabby" type="Weapon" glyph="⚔" height={460} parchment={parchment}>
      <FormHeader icon="⚔" name="Stabby" type="Weapon" />

      <div style={{ display: 'flex', gap: 10 }}>
        <StampInput label="Price" value="" mono width={120} />
        <StampInput label="Weight" value="1" mono width={120} />
        <StampInput label="EV" value="1" mono width={120} />
        <StampInput label="Damage" value="1d6" mono width={130} />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <StampInput label="Bonus AB" value="0" mono width={120} />
        <StampInput label="Range" value="Melee" mono width={150} />
      </div>

      <div style={{ flex: 1 }} />
    </FormShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Mount on canvas — four artboards side by side
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "parchment": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const wrap = (Comp, w, h) => (
    <div style={{ width: w, height: h, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
      <Comp parchment={tweaks.parchment} />
    </div>
  );
  return (
    <DesignCanvas title="Castles & Crusades · Item Sheets" subtitle="Ability · Equipment · Spell · Weapon — Tabletop Hybrid skin">
      <DCSection id="forms" title="Item Sheet Forms" subtitle="Each opens as its own dialog from the character sheet">
        <DCArtboard id="ability"   label="Ability"   width={FORM_W} height={460}>{wrap(AbilityForm,   FORM_W, 460)}</DCArtboard>
        <DCArtboard id="equipment" label="Equipment" width={FORM_W} height={460}>{wrap(EquipmentForm, FORM_W, 460)}</DCArtboard>
        <DCArtboard id="spell"     label="Spell"     width={FORM_W} height={620}>{wrap(SpellForm,     FORM_W, 620)}</DCArtboard>
        <DCArtboard id="weapon"    label="Weapon"    width={FORM_W} height={460}>{wrap(WeaponForm,    FORM_W, 460)}</DCArtboard>
      </DCSection>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Background">
          <TweakToggle
            label="Parchment texture"
            value={tweaks.parchment}
            onChange={(v) => setTweak('parchment', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
