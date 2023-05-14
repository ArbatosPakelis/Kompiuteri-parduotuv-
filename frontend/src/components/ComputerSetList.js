import React, { useEffect, useState } from 'react';
import ComputerSetApi from '../Apis/ComputerSetApi';
import {useLocation} from "react-router-dom";
import {Form} from "semantic-ui-react";

export default function ComputerSetList() {
    const [computerSetData, setComputerSet] = useState([]);
    const [message, setMessage] = useState('');
    const location              = useLocation();

    useEffect(() => {
        const getData = async () => {
            try {
                const setApi = new ComputerSetApi();
                const response = await setApi.getComputerSets();
                setComputerSet(response.data);
            } catch (err) {
                console.log(err.response.data.message)
                setComputerSet(null);
            }
        };

        getData();
    }, []);

    const onDelete = (id) => {

    }


    return (
        <div className='content'>
            <h1>Rinkiniai</h1>
            {/*Cookies.get('sessionType') === 'Admin' && (*/
            <><button className='prideti' onClick={() => { window.location.href = '/rinkiniai/new'; } }>Pridėti rinkinį</button>
            <button className='generuoti' onClick={() => { window.location.href = '/rinkiniai/generuoti'; } }>Sugeneruoti rinkinį</button></>
            /*)*/}
            <br />
            <br />
            {/* {message && <div style={{ color: message.includes('mingai') ? 'green' : 'red' }}>{message}</div>} */}
            {computerSetData.map((data) => {
                return (
                    <div className='dalis' key={data.id_Detale}>
                        <div className='innerParts'>
                            <div className='dalis-name'>
                                <a className='dalis-a' href={`/rinkiniai/${data.id_Kompiuterio_rinkinys}`}>
                                    {data.pavadinimas}
                                </a>
                            </div>
                        </div>
                        <div className='outerParts'>
                            <button className='red-sal' onClick={() => {window.location.href = `/`}}>Redaguoti</button>
                            <button className='red-sal' onClick={() => onDelete(data.id_Detale)}>Šalinti</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}