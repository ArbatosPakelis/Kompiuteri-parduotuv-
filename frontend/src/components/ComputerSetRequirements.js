import React, { useState } from 'react';
import ComputerSetApi from '../Apis/ComputerSetApi';
import { useNavigate } from 'react-router-dom';

function SelectionPage() {
  const [generatedSetData, setGeneratedSetData] = useState([]);
  const [computerSetId, setComputerSetId] = useState(null);
  const [error, setError] = useState(null); // add error state
  let navigate = useNavigate();

  const generateSet = async (type) => {
    try {
      const setApi = new ComputerSetApi();
      const response = await setApi.generateSet(type);     
      setGeneratedSetData(response.data);

      // Create a unique name for the new computer set
      const computerSetName = 'Generated_' + type + '_' + Math.floor(Math.random() * 900000 + 100000);


      // Create a new computer set with the unique name and get its ID
      const computerSetResponse = await setApi.addComputerSet(computerSetName);
      setComputerSetId(computerSetResponse.data.id);
      const componentPromises = response.data.map((item) =>
        setApi.generateSetToForm(item.details.id_Detale, computerSetResponse.data.id)
      );

      // Wait for all promises to resolve
      try {
          await Promise.all(componentPromises);
      } catch (error) {
          console.error('Failed to add some components: ', error);
      }

      // href()
      navigate(`/rinkiniai/${computerSetResponse.data.id}`);

      console.log(response.data);
      setError(null);
    } catch (err) {
      setGeneratedSetData(null);
      setError(err.response.data.message);
        return;
    }
  };


  return (
    <div className='content'>
      <h1>Pasirinkite, kokia Jūsų kompiuterio naudojimo paskirtis:</h1>
      <button className='tipas' onClick={() => generateSet('browsing')}>
        Naršymui
      </button>
      <button className='tipas' onClick={() => generateSet('studying')}>
        Mokslams
      </button>
      <button className='tipas' onClick={() => generateSet('gaming')}>
        Žaidimams
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* render error message */}
    </div>
  );
}

export default SelectionPage;