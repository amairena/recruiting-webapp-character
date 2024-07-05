// helpers.test.js

import { calculateModifier, calculateTotalAttributes, performSkillCheck } from './helpers';

describe('calculateModifier', () => {
  test('should return correct modifier for given attribute value', () => {
    expect(calculateModifier(7)).toBe(-2);
    expect(calculateModifier(9)).toBe(-1);
    expect(calculateModifier(10)).toBe(0);
    expect(calculateModifier(11)).toBe(0);
    expect(calculateModifier(12)).toBe(1);
    expect(calculateModifier(14)).toBe(2);
    expect(calculateModifier(20)).toBe(5);
  });
});

describe('calculateTotalAttributes', () => {
  test('should return correct total of attributes', () => {
    const attributes = {
      Strength: 10,
      Dexterity: 12,
      Constitution: 14,
      Intelligence: 8,
      Wisdom: 13,
      Charisma: 15,
    };
    expect(calculateTotalAttributes(attributes)).toBe(72);
  });
});

describe('performSkillCheck', () => {
  test('should return correct skill check result', () => {
    const character = {
      attributes: {
        Strength: 10,
        Dexterity: 12,
        Constitution: 14,
        Intelligence: 8,
        Wisdom: 13,
        Charisma: 15,
      },
      skills: {
        Acrobatics: 5,
        Arcana: 3,
      },
    };
    const skillName = 'Acrobatics';
    const dc = 15;
    const result = performSkillCheck(character, skillName, dc);
    expect(result).toHaveProperty('roll');
    expect(result).toHaveProperty('skillTotal', 6); // Dexterity modifier (1) + skill points (5)
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('success');
  });
});
