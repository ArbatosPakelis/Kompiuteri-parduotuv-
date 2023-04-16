import React, {useEffect, useState} from 'react';

export default function PartsShow() {
    const [APIData, setAPIData] = useState([]);

    useEffect(() => {
        fetch("/getAll").then(
            response => response.json()
        ).then(
            data => {
                setAPIData(data)
            }
        )
    }, []);

    const onDelete = (id) => {
        fetch(`/delete/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete item');
                }
            })
            .catch(error => {
                console.error(error);
                // handle error here
            });
    };

    return (
        <div className='content'>
            <h1>Dalys</h1>
            <p>Redagavimas: <b>/dalys/id/redaguoti</b></p>
            <p>Peržiūra: <b>/dalys/id</b></p>
            <p>Sukurti: <b>/dalys/sukurti</b></p>
            {APIData.map((data) => {
                return (
                    <div>
                        <div className='innerParts'>
                            <p><a href={`/${data.id}`}><b>Pavadinimas:</b> {data.pavadinimas}</a></p>
                            <p><b>Gamintojas:</b> {data.gamintojas}</p>
                            <p><b>Kaina:</b> {data.kaina}</p>
                            <p><b>Aprašymas:</b> {data.aprasymas}</p>
                            <p><b>Išleidimo data:</b> {data.isleidimodata}</p>
                            <p><b>Kiekis:</b> {data.kiekis}</p>
                            <p><b>Spalva:</b> {data.spalva}</p>
                            <p><b>Tipas:</b> {data.tipas}</p>
                        </div>
                        <div className='outerParts'>
                            <a href={`/${data.id}/edit`}>Redaguoti</a>
                            <a onClick={() => onDelete(data.id)}>Šalinti</a>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}