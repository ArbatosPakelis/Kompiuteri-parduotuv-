import React, { useEffect, useState } from 'react';

export default function PartsShow() {
    const [APIData, setAPIData] = useState([]);
    const [message, setMessage] = useState('');
    const [editMessage, setEditMessage] = useState('');

    useEffect(() => {
        fetch('/getAllParts')
            .then((response) => response.json())
            .then((data) => {
                setAPIData(data);
                if (editMessage) {
                    setMessage(editMessage);
                    setMessage('Sėkmingai sukurta detalė!');
                    setTimeout(() => setMessage(''), 2000);
                }
            })
            .catch((error) => {
                setMessage(`Klaida: ${error.message}`);
            });
    }, []);

    const onDelete = (id) => {
        fetch(`/removePart/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    setMessage('Sėkmingai pašalinta detalė!');
                    setAPIData(APIData.filter((data) => data.id_Detale !== id));
                    setTimeout(() => setMessage(''), 2000); // reset message state after 5 seconds
                } else {
                    throw new Error('Nepavyko pašalinti detalės.');
                }
            })
            .catch((error) => {
                setMessage(`Klaida: ${error.message}`);
            });
    };

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