import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PartRead() {
    const [APIData, setAPIData] = useState([]);
    const { id } = useParams(); // get id from URL parameter

    useEffect(() => {
        fetch(`/getPart/${id}`).then((response) => response.json()).then((data) => {
            setAPIData(data);
        });
    }, [id]);

    return (
        <div className='content'>
            <h1>Detalė</h1>
            {APIData.map((data) => {
                return (
                    <div>
                        <div className='innerParts'>
                            <p>
                                <b>Pavadinimas:</b> {data.pavadinimas}
                            </p>
                            <p>
                                <b>Gamintojas:</b> {data.gamintojas}
                            </p>
                            <p>
                                <b>Kaina:</b> {data.kaina}
                            </p>
                            <p>
                                <b>Aprašymas:</b> {data.aprasymas}
                            </p>
                            <p>
                                <b>Išleidimo data:</b> {data.isleidimodata}
                            </p>
                            <p>
                                <b>Kiekis:</b> {data.kiekis}
                            </p>
                            <p>
                                <b>Spalva:</b> {data.spalva}
                            </p>
                            <p>
                                <b>Tipas:</b> {data.tipas}
                            </p>
                        </div>
                    </div>
                );
            })}
            <br/><a className='grizti' href='/detales'>Grįžti</a>
        </div>
    );
}