import type { StatusEffect } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/documents/token';

export const MINIMAL_STATUS_EFFECTS: StatusEffect[] = [
  {
    id: "dead",
    label: "EFFECT.StatusDead",
    icon: "icons/svg/skull.svg"
  },
  {
    id: "unconscious",
    label: "EFFECT.StatusUnconscious",
    icon: "icons/svg/unconscious.svg"
  }
];

export const DEFAULT_STATUS_EFFECTS: StatusEffect[] = [
  { id: 'dead', label: 'EFFECT.StatusDead', icon: 'icons/svg/skull.svg' },
  { id: 'blind', label: 'EFFECT.StatusBlind', icon: 'icons/svg/blind.svg' },
  { id: 'charm', label: 'EFFECT.StatusCharm', icon: 'icons/svg/charm.svg' },
  { id: 'deaf', label: 'EFFECT.StatusDeaf', icon: 'icons/svg/deaf.svg' },
  { id: 'disease', label: 'EFFECT.StatusDisease', icon: 'icons/svg/disease.svg' },
  { id: 'poison', label: 'EFFECT.StatusPoison', icon: 'icons/svg/poison.svg' },
  { id: 'sleep', label: 'EFFECT.StatusAsleep', icon: 'icons/svg/sleep.svg' },
  { id: 'stun', label: 'EFFECT.StatusStunned', icon: 'icons/svg/daze.svg' },
  { id: 'prone', label: 'EFFECT.StatusProne', icon: 'icons/svg/falling.svg' },
  { id: 'restrain', label: 'EFFECT.StatusRestrained', icon: 'icons/svg/net.svg' },
  { id: 'paralysis', label: 'EFFECT.StatusParalysis', icon: 'icons/svg/paralysis.svg' },
  { id: 'fly', label: 'EFFECT.StatusFlying', icon: 'icons/svg/wing.svg' },
  { id: 'elevateDamage', label: 'EFFECT.StatusElevateDamage', icon: 'icons/svg/upgrade.svg' },
  { id: 'reduceDamage', label: 'EFFECT.StatusReduceDamage', icon: 'icons/svg/downgrade.svg' },
  { id: 'invisible', label: 'EFFECT.StatusInvisible', icon: 'icons/svg/invisible.svg' },
  { id: 'target', label: 'EFFECT.StatusTarget', icon: 'icons/svg/target.svg' },
  { id: 'mark', label: 'EFFECT.StatusMarked', icon: 'icons/svg/combat.svg' }
];