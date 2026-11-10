/**
 * Skill definitions. Level n is reached at `xpPerLevelSquared * n²` XP.
 * `bonusPerLevel` is the generic efficiency multiplier step consumed by other
 * modules through `skillMultiplier()`.
 */
export const SKILL_RULES = Object.freeze({ maxLevel: 10, xpPerLevelSquared: 20 });

export const SKILLS = {
  foraging:     { glyph: '♣', bonusPerLevel: 0.05 },
  medical:      { glyph: '✚', bonusPerLevel: 0.08 },
  engineering:  { glyph: '⚙', bonusPerLevel: 0.06 },
  marksmanship: { glyph: '⊹', bonusPerLevel: 0.5 },
};

