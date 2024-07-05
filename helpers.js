import { SKILL_LIST } from './consts';

// Function to calculate ability modifier
export const calculateModifier = (value) => {
  return Math.floor((value - 10) / 2);
};

// Function to calculate the total of all attributes
export const calculateTotalAttributes = (attributes) => {
  return Object.values(attributes).reduce((total, value) => total + value, 0);
};

// Function to perform a skill check
export const performSkillCheck = (character, skillName, dc) => {
  const roll = Math.floor(Math.random() * 20) + 1;
  const attributeModifier = calculateModifier(character.attributes[SKILL_LIST.find(skill => skill.name === skillName).attributeModifier]);
  const skillTotal = character.skills[skillName] + attributeModifier;
  const total = roll + skillTotal;
  const skillCheckResult = {
    roll,
    skillTotal,
    total,
    success: total >= dc,
  };
  return skillCheckResult;
};
