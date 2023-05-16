import React, { useEffect, useState } from 'react';
import { Form } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

export default function CompareParts() {
  const [partsData, setPartsData] = useState([]);
  const [filteredParts, setFilteredParts] = useState([]);
  const [partTypes] = useState([
    'Motinine plokste',
    'Vaizdo plokste',
    'Procesorius',
    'Maitinimo blokas',
    'Kompiuterio pele',
    'Atmintis',
    'Monitorius',
    'Ausintuvas',
    'Isorine atmintis',
  ]);
  const [selectedPart1, setSelectedPart1] = useState(null);
  const [selectedPart2, setSelectedPart2] = useState(null);
  const [selectedType, setSelectedType] = useState(partTypes[0]);
  const [differences, setDifferences] = useState([]);
  const [showDifferences, setShowDifferences] = useState(false); // New state variable

  useEffect(() => {
    fetch('/getAllParts')
      .then((response) => response.json())
      .then((data) => {
        setPartsData(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    setFilteredParts(partsData.filter((part) => part.tipas === selectedType));
    setSelectedPart1(null);
    setSelectedPart2(null);
  }, [partsData, selectedType]);

  const compareParts = () => {
    if (selectedPart1 && selectedPart2 && selectedPart1 !== selectedPart2) {
      fetch(`/compareParts/${selectedPart1}/${selectedPart2}`)
        .then((response) => response.json())
        .then((data) => {
          setDifferences(data);
          setShowDifferences(true); // Show the differences section when comparing
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  return (
    <div className="partCompare">
      <h1>Detalių palyginimas</h1>

      <Form.Group>
        <Form.Field>
          <label className='labelCompareGroup'>Parink detalės tipą:</label>
          <Form.Select
            options={partTypes.map((type) => ({
              key: type,
              text: type,
              value: type,
            }))}
            value={selectedType}
            onChange={(_, { value }) => setSelectedType(value)}
          />
        </Form.Field>

        <Form.Field>
          <label className='labelCompareGroup'>Parink pirmą detalę:</label>
          <Form.Select
            options={filteredParts.map((part) => ({
              key: part.id_Detale,
              text: part.pavadinimas,
              value: part.id_Detale,
            }))}
            value={selectedPart1}
            onChange={(_, { value }) => setSelectedPart1(value)}
            placeholder="--Select--"
          />
        </Form.Field>

        <Form.Field>
          <label className='labelCompareGroup'>Parink antrą detalę:</label>
          <Form.Select
            options={filteredParts.map((part) => ({
              key: part.id_Detale,
              text: part.pavadinimas,
              value: part.id_Detale,
              disabled: selectedPart1 === part.id_Detale, // Disable options matching the selectedPart1 value
            }))}
            value={selectedPart2}
            onChange={(_, { value }) => setSelectedPart2(value)}
            placeholder="--Select--"
            />
            </Form.Field>
            </Form.Group>
            <button className="ui button palyginti" onClick={compareParts}>
    Palyginti
  </button>

  {showDifferences && (
    <div className="differences">
      {differences.length > 0 && <h2>Skirtumai:</h2>}
      <ul>
        {differences.map((difference, index) => (
          <li key={index}>
            <strong>Parametras: </strong> {difference.parameter}
            <br />
            {/^(id|kiekis)/.test(difference.part1Value) ? null : (
              <>
                <strong>Pirma detale: </strong>
                {difference.parameter === 'isleidimo_data'
                  ? new Date(difference.part1Value).toLocaleDateString()
                  : difference.part1Value}
                <br />
              </>
            )}
            <strong>Antra detale: </strong>
            {difference.parameter === 'isleidimo_data'
              ? new Date(difference.part2Value).toLocaleDateString()
              : difference.part2Value}
            <br />
            <span className="white-border"></span>
            <br />
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
);
}