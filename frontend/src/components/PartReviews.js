import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PartReviews() {
    const [reviews, setReviews] = useState([]);
    const { id } = useParams(); // get id from URL parameter

    useEffect(() => {
        fetch(`/getReviews/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setReviews(data);
                return data;
            })
    }, [id]);


    return (
        <div className='content'>
            <h1>Atsiliepimai</h1>
            <br />
            {reviews.length === 0 ? (
                <p>Nėra atsiliepimų.</p>
            ) : (
                reviews.map((data) => (
                    <div className='atsiliepimas'>
                        <div className='innerParts'>
                            <p>
                                <b>Autorius:</b> {data.autorius}
                            </p>
                            <p>
                                <b>Data:</b> {data.data}
                            </p>
                            <p>
                                <b>Įvertinimas:</b> {data.ivertinimas}
                            </p>
                            <p>
                                <b>Tekstas:</b> {data.tekstas}
                            </p>
                        </div>
                    </div>
                ))
            )}
            <br/><br/><a className='grizti' onClick={() => {window.location.href = `/detales/${id}`}}>Grįžti</a><br/><br/>
        </div>
    );
}