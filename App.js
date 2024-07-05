import React, { useState, useEffect } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts';
import { calculateModifier, calculateTotalAttributes, performSkillCheck } from './helpers';


// Replace '{your_github_username}' with your actual GitHub username
const API_URL = 'https://recruiting.verylongdomaintotestwith.ca/api/{{amairena}}/character';

function App() {
  const [characters, setCharacters] = useState([
    {
      name: 'Character 1',
      attributes: {
        Strength: 10,
        Dexterity: 10,
        Constitution: 10,
        Intelligence: 10,
        Wisdom: 10,
        Charisma: 10,
      },
      skills: SKILL_LIST.reduce((acc, skill) => ({ ...acc, [skill.name]: 0 }), {}),
      selectedClass: null,
      skillCheckResult: null,
    },
  ]);

  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(0);
  const selectedCharacter = characters[selectedCharacterIndex] || {};

  const [selectedSkill, setSelectedSkill] = useState(SKILL_LIST[0].name);
  const [dc, setDc] = useState(10);

  const updateCharacter = (index, newCharacter) => {
    setCharacters((prevCharacters) => {
      const newCharacters = [...prevCharacters];
      newCharacters[index] = newCharacter;
      return newCharacters;
    });
  };

  const incrementAttribute = (index, attribute) => {
    const character = characters[index];
    const totalAttributes = calculateTotalAttributes(character.attributes);
    if (totalAttributes < 70) {
      const newAttributes = {
        ...character.attributes,
        [attribute]: character.attributes[attribute] + 1,
      };
      updateCharacter(index, { ...character, attributes: newAttributes });
    } else {
      alert('Total attribute points cannot exceed 70.');
    }
  };

  const decrementAttribute = (index, attribute) => {
    const character = characters[index];
    const newAttributes = {
      ...character.attributes,
      [attribute]: character.attributes[attribute] - 1,
    };
    updateCharacter(index, { ...character, attributes: newAttributes });
  };

  const incrementSkill = (index, skillName) => {
    const character = characters[index];
    const newSkills = {
      ...character.skills,
      [skillName]: character.skills[skillName] + 1,
    };
    updateCharacter(index, { ...character, skills: newSkills });
  };

  const decrementSkill = (index, skillName) => {
    const character = characters[index];
    const newSkills = {
      ...character.skills,
      [skillName]: character.skills[skillName] - 1,
    };
    updateCharacter(index, { ...character, skills: newSkills });
  };

  const selectClass = (index, className) => {
    const character = characters[index];
    updateCharacter(index, { ...character, selectedClass: CLASS_LIST[className] });
  };

  const saveCharacters = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(characters),
      });

      if (!response.ok) {
        throw new Error(`Failed to save character data: ${response.statusText}`);
      }

      alert('Character data saved successfully!');
    } catch (error) {
      console.error('Error saving character data:', error);
      alert('Error saving character data. Please check the console for details.');
    }
  };

  const loadCharacters = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load character data: ${response.statusText}`);
      }

      const data = await response.json();
      const characters = data.body || [];

      if (Array.isArray(characters)) {
        setCharacters(characters);
      } else {
        console.error('Data from API is not an array:', characters);
        alert('Data from API is not an array. Please check the console for details.');
      }
    } catch (error) {
      console.error('Error loading character data:', error);
      alert('Error loading character data. Please check the console for details.');
    }
  };

  const handleSkillCheck = (index, skillName, dc) => {
    const character = characters[index];
    const result = performSkillCheck(character, skillName, dc);
    updateCharacter(index, { ...character, skillCheckResult: result });
  };

  useEffect(() => {
    loadCharacters();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section">
        <div>
          <h2>Characters</h2>
          <button onClick={() => setCharacters([...characters, {
            name: `Character ${characters.length + 1}`,
            attributes: {
              Strength: 10,
              Dexterity: 10,
              Constitution: 10,
              Intelligence: 10,
              Wisdom: 10,
              Charisma: 10,
            },
            skills: SKILL_LIST.reduce((acc, skill) => ({ ...acc, [skill.name]: 0 }), {}),
            selectedClass: null,
            skillCheckResult: null,
          }])}>
            Add Character
          </button>
          {Array.isArray(characters) && characters.map((character, index) => (
            <button key={index} onClick={() => setSelectedCharacterIndex(index)}>
              {character.name}
            </button>
          ))}
        </div>

        <div>
          <h2>Attributes</h2>
          {ATTRIBUTE_LIST.map((attribute) => (
            <div key={attribute} className="attribute-row">
              <span>{attribute}: {selectedCharacter.attributes?.[attribute]}</span>
              <button className="btn" onClick={() => incrementAttribute(selectedCharacterIndex, attribute)}>+</button>
              <button className="btn" onClick={() => decrementAttribute(selectedCharacterIndex, attribute)}>-</button>
              <span> Modifier: {calculateModifier(selectedCharacter.attributes?.[attribute])}</span>
            </div>
          ))}
        </div>

        <div>
          <h2>Classes</h2>
          {Object.keys(CLASS_LIST).map((className) => (
            <button key={className} className="btn" onClick={() => selectClass(selectedCharacterIndex, className)}>
              {className}
            </button>
          ))}
        </div>

        {selectedCharacter.selectedClass && (
          <div>
            <h3>Selected Class: {Object.keys(CLASS_LIST).find(key => CLASS_LIST[key] === selectedCharacter.selectedClass)}</h3>
            <ul>
              {Object.entries(selectedCharacter.selectedClass).map(([attr, minVal]) => (
                <li key={attr}>{attr}: {minVal}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2>Skills</h2>
          {SKILL_LIST.map((skill) => {
            const attributeModifier = calculateModifier(selectedCharacter.attributes?.[skill.attributeModifier]);
            const totalSkill = selectedCharacter.skills?.[skill.name] + attributeModifier;
            return (
              <div key={skill.name} className="skill-row">
                <span>{skill.name} - points: {selectedCharacter.skills?.[skill.name]}</span>
                <button className="btn" onClick={() => incrementSkill(selectedCharacterIndex, skill.name)}>+</button>
                <button className="btn" onClick={() => decrementSkill(selectedCharacterIndex, skill.name)}>-</button>
                <span> modifier ({skill.attributeModifier}): {attributeModifier}</span>
                <span> total: {totalSkill}</span>
              </div>
            );
          })}
        </div>

        <div>
          <h2>Skill Check</h2>
          <label>
            Skill:
            <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
              {SKILL_LIST.map((skill) => (
                <option key={skill.name} value={skill.name}>
                  {skill.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            DC:
            <input type="number" value={dc} onChange={(e) => setDc(Number(e.target.value))} />
          </label>
          <button className="btn" onClick={() => handleSkillCheck(selectedCharacterIndex, selectedSkill, dc)}>Roll</button>
          {selectedCharacter.skillCheckResult && (
            <div>
              <p>Roll: {selectedCharacter.skillCheckResult.roll}</p>
              <p>Skill Total: {selectedCharacter.skillCheckResult.skillTotal}</p>
              <p>Total: {selectedCharacter.skillCheckResult.total}</p>
              <p>{selectedCharacter.skillCheckResult.success ? 'Success' : 'Failure'}</p>
            </div>
          )}
        </div>

        <div>
          <button className="btn" onClick={saveCharacters}>Save Characters</button>
          <button className="btn" onClick={loadCharacters}>Load Characters</button>
        </div>
      </section>
    </div>
  );
}

export default App;