import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {useLocation} from "react-router-dom";
import {Form} from "semantic-ui-react";

export default function PartsShow() {
    const [partsData, setPartsData] = useState([]);
    const [message, setMessage] = useState('');
    const location              = useLocation();
    const [rinkinys, setRinkinys] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tipas  = params.get('tipas');
        const url    = `/getAllParts?tipas=${tipas}`;
        setRinkinys(params.get('rinkinys'));

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setPartsData(data);

                fetch(`/getRecommendations`)
                    .then((response) => response.json())
                    .then((data2) => {
                        const updatedPartsData = data.map((part) => {
                            const recommendation = data2.find((rec) => rec.fk_Detaleid_Detale === part.id_Detale);
                            const priority = recommendation ? recommendation.prioritetas : null;
                            return { ...part, priority };
                        });
                        setPartsData(updatedPartsData);
                    })

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
                } else if (partMessage === 'errorCreate') {
                    setMessage('Tokia detalė jau egzistuoja!');
                    setTimeout(() => {
                        setMessage('');
                    }, 2000);
                } else if (partMessage === 'partBeingBought') {
                    setMessage('Nepavyko atnaujinti detalės. Ji yra perkama.');
                    setTimeout(() => {
                        setMessage('');
                    }, 2000);
                } else if (partMessage === 'partSetBeingBought') {
                    setMessage('Nepavyko atnaujinti detalės. Ji yra priskirta rinkiniui, kuris yra perkamas.');
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
                            setPartsData(partsData.filter((data) => data.id_Detale !== id));
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

    const selectRecommendationLevel = (selectedPartID, selectedPriority) => {
        fetch(`/applyRecommendation?id_Detale=${selectedPartID}&priority=${selectedPriority}`, {
            method: 'PUT',
        })
            .then((response) => {
                if (response.ok) {
                    response.text().then((text) => {
                        if (text === 'success') {
                            setMessage('Sėkmingai nustatytas prioritetas!');
                            setTimeout(() => {
                                setMessage('');
                                window.location.reload(); // Reload the page
                            }, 2000);
                        } else {
                            setMessage('Nepavyko nustatyti prioriteto!');
                            setTimeout(() => setMessage(''), 2000);
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
                } else {
                    throw new Error('Nepavyko nustatyti prioriteto!');
                }
            })
    };

    return (
        <div className='content'>
            <h1>Detalės</h1>
            {/*Cookies.get('sessionType') === 'Admin' && (*/
            <button className='prideti' onClick={() => {window.location.href = '/detales/prideti'}}>Pridėti detalę</button>
            /*)*/}
            <br />
            <br />
            {message && <div style={{ color: message.includes('mingai') ? 'green' : 'red' }}>{message}</div>}
            {partsData.map((data) => {
                return (
                    <div className='dalis' key={data.id_Detale}>
                        <div className='innerParts'>
                            <div className='dalis-name'>
                                <a className='dalis-a' href={`/detales/${data.id_Detale}`}>
                                    {data.pavadinimas}
                                </a>
                            </div>
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
                            {/*Cookies.get('sessionType') === 'Admin' && (*/}
                            <Form className="create-form">
                                <Form.Field>
                                    <Form.Select
                                        compact
                                        label='Prioritetas'
                                        placeholder='Pasirinkite prioritetą'
                                        options={[
                                            { key: 'Didelis', text: 'Didelis', value: 'Didelis' },
                                            { key: 'Vidutinis', text: 'Vidutinis', value: 'Vidutinis' },
                                            { key: 'Mazas', text: 'Mažas', value: 'Mazas' }
                                        ]}
                                        value={data.priority}
                                        onChange={(e, { value }) => selectRecommendationLevel(data.id_Detale, value)}
                                    />
                                </Form.Field>
                            </Form>
                            {/*)*/}
                            { rinkinys !== null &&
                            <p>
                                <button onClick={() => {Cookies.set('partMessage', 'partsHREF', { expires: 3/86400 }); window.location.href = `/rinkiniai/${rinkinys}?id_Detale=${data.id_Detale}`}}>Pridėti į rinkinį</button>
                            </p>
                            }
                        </div>
                        {/*Cookies.get('sessionType') === 'Admin' && (*/}
                        <div className='outerParts'>
                            <button className='red-sal' onClick={() => {window.location.href = `/detales/${data.id_Detale}/redaguoti`}}>Redaguoti</button>
                            <button className='red-sal' onClick={() => onDelete(data.id_Detale)}>Šalinti</button>
                        </div>
                        {/*)*/}
                    </div>
                );
            })}
        </div>
    );
}