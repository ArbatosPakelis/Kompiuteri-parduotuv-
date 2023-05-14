import React, { useState } from 'react';
import ComputerSetApi from '../Apis/ComputerSetApi';

function SelectionPage() {
  const [generatedSetData, setGeneratedSetData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const generateSet = async (type) => {
    try {
      const setApi = new ComputerSetApi();
      const response = await setApi.generateSet(type);
      setGeneratedSetData(response.data);
      
      // Calculate total price
      let sum = 0;
      response.data.forEach(item => sum += item.details.kaina);
      setTotalPrice(sum);

      console.log(response.data)
    } catch (err) {
      console.log(err.response.data.message)
      setGeneratedSetData(null);
    }
  };

  const renderSetData = () => {
    if (!generatedSetData) return null;
  
    return generatedSetData.map((item, index) => (
      <div className='dalis' key={item.details.id_Detale}>
        <div className='innerParts'>
          <div className='dalis-name'>
            <a className='dalis-a' href={`/detales/${item.details.id_Detale}`}>
              {item.details.pavadinimas}
            </a>
          </div>
          <p>
            <b>Gamintojas:</b> {item.details.gamintojas}
          </p>
          <p>
            <b>Kaina:</b> {item.details.kaina}
          </p>
          <p>
            <b>Spalva:</b> {item.details.spalva}
          </p>
          <p>
            <b>Tipas:</b> {item.details.tipas}
          </p>  
        </div>
      </div>
    ));
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
      <div className='total-price'>
        <b>Viso rinkinio kaina: </b> {totalPrice}
      </div>
      <div>
        {renderSetData()}
      </div>
    </div>
  );
}

export default SelectionPage;
