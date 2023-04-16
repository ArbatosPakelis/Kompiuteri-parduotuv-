import React, {useEffect, useState} from 'react';

export default function PartsShow() {
    const [APIData, setAPIData] = useState([]);

    useEffect(() => {
        fetch("/getAllParts").then(
            response => response.json()
        ).then(
            data => {
                setAPIData(data)
            }
        )
    }, []);

    const onDelete = (id) => {
        fetch(`/removePart/${id}`, {
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
            <h1>Detalės</h1>
            <a className='prideti' href={`/detales/prideti`}>Pridėti detalę</a><br/><br/>
            {APIData.map((data) => {
                return (
                    <div className='dalis'>
                        <div className='innerParts'>
                            <p><a className='dalis-a' href={`/detales/${data.id_Detale}`}>{data.pavadinimas}</a></p>
                            <p><b>Gamintojas:</b> {data.gamintojas}</p>
                            <p><b>Kaina:</b> {data.kaina}</p>
                            <p><b>Spalva:</b> {data.spalva}</p>
                            <p><b>Tipas:</b> {data.tipas}</p>
                        </div>
                        <div className='outerParts'>
                            <a href={`/detales/${data.id_Detale}/redaguoti`}>Redaguoti</a>
                            <a onClick={() => onDelete(data.id_Detale)}>Šalinti</a>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}