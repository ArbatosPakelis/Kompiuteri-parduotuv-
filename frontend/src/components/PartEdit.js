import React, { useEffect, useState } from 'react';
import { Button, Form } from "semantic-ui-react";
import { useParams } from "react-router-dom";

export default function PartsEdit() {
    const [gamintojas, setGamintojas] = useState("");
    const [pavadinimas, setPavadinimas] = useState("");
    const [kaina, setKaina] = useState('');
    const [aprasymas, setAprasymas] = useState("");
    const [data, setData] = useState("");
    const [kiekis, setKiekis] = useState('');
    const [spalva, setSpalva] = useState("");
    const [tipas, setTipas] = useState("");

    const [APIData, setAPIData] = useState([]);
    const { id } = useParams(); // get id from URL parameter

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/getPart/${id}`);
            const data = await response.json();
            const dateInfo = new Date(data[0].isleidimo_data);
            setGamintojas(data[0].gamintojas);
            setPavadinimas(data[0].pavadinimas);
            setKaina(data[0].kaina);
            setAprasymas(data[0].aprasymas);
            setData(dateInfo.toLocaleString("default", { year: "numeric" }) + "-" + dateInfo.toLocaleString("default", { month: "2-digit" }) + "-" + dateInfo.toLocaleString("default", { day: "2-digit" }));
            setKiekis(data[0].kiekis);
            setSpalva(data[0].spalva);
            setTipas(data[0].tipas);
        };

        fetchData();
    }, [id]);

    const setNewData = () => {
        console.log(gamintojas);
    }

    return (
        <div className='content'>
            <h1>Detalės redagavimas</h1>
            <Form className="edit-form">
                <Form.Field>
                    <label>Gamintojas</label>
                    <input value={gamintojas} onChange={(e) => setGamintojas(e.target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>Pavadinimas</label>
                    <input value={pavadinimas} onChange={(e) => setPavadinimas(e.target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>Kaina</label>
                    <input type='number' value={kaina} onChange={(e) => setKaina(e.target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>Aprašymas</label>
                    <input value={aprasymas} onChange={(e) => setAprasymas(e.target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>Išleidimo data</label>
                    <input type='date' value={data} onChange={(e) => setData(e.target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>Kiekis</label>
                    <input type='number' value={kiekis} onChange={(e) => setKiekis(e.target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>Spalva</label>
                    <input type='text' value={spalva} onChange={(e) => setSpalva(e.target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>Tipas</label>
                    <input type='text' value={tipas} onChange={(e) => setTipas(e.target.value)}/>
                </Form.Field>
                <Button onClick={setNewData} type='submit'>Atnaujinti</Button>
            </Form>
            <br/><a className='grizti' href='/detales'>Grįžti</a>
        </div>
    )
}