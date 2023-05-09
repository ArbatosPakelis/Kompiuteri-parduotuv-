import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {useLocation} from "react-router-dom";

export default function PartsShow() {
    const [APIData, setAPIData] = useState([]);
    const [message, setMessage] = useState('');
    const location              = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tipas  = params.get('tipas');
        const url    = `/getAllParts?tipas=${tipas}`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setAPIData(data);
                const partMessage = Cookies.get('partMessage');

                if (partMessage === 'successADD') {
                    setMessage('Sėkmingai sukurta detalė!');
                    setTimeout(() => {
                        setMessage('');
                    }, 2000);
                } else if (partMessage === 'successEDIT') {
                    setMessage('Sėkmingai redaguota detalė!');
                    setTimeout(() => {
                        setMessage('');
                    }, 2000);
                }
            })
            .catch((error) => {
                setMessage(`Klaida: ${error.message}`);
            });
    }, [location.search]);

    const onDelete = (id) => {
        fetch(`/removePart/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) { // check if response is ok
                    response.text().then((text) => { // wait for the Promise to resolve before comparing the text content with a string
                        if (text === 'success.') {
                            setMessage('Sėkmingai pašalinta detalė!');
                            setAPIData(APIData.filter((data) => data.id_Detale !== id));
                            setTimeout(() => setMessage(''), 2000); // reset message state after 5 seconds
                        } else {
                            setMessage('Nepavyko pašalinti detalės!');
                            setTimeout(() => setMessage(''), 2000); // reset message state after 5 seconds
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
                } else {
                    throw new Error('Nepavyko pašalinti detalės.');
                }
            })
    }

    return (
        <div className='content'>
            <h1>Detalės</h1>
            <a className='prideti' onClick={() => {window.location.href = '/detales/prideti'}}>Pridėti detalę</a>
            <br />
            <br />
            {message && <div style={{ color: message.includes('mingai') ? 'green' : 'red' }}>{message}</div>}
            {APIData.map((data) => {
                return (
                    <div className='dalis' key={data.id_Detale}>
                        <div className='innerParts'>
                            <p>
                                <a className='dalis-a' href={`/detales/${data.id_Detale}`}>
                                    {data.pavadinimas}
                                </a>
                            </p>
                            <p>
                                <b>Gamintojas:</b> {data.gamintojas}
                            </p>
                            <p>
                                <b>Kaina:</b> {data.kaina}
                            </p>
                            <p>
                                <b>Spalva:</b> {data.spalva}
                            </p>
                            <p>
                                <b>Tipas:</b> {data.tipas}
                            </p>
                        </div>
                        <div className='outerParts'>
                            <a onClick={() => {window.location.href = `/detales/${data.id_Detale}/redaguoti`}}>Redaguoti</a>
                            <a onClick={() => onDelete(data.id_Detale)}>Šalinti</a>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}