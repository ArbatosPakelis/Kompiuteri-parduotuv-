import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';

export default function PartsCreate() {
    const [gamintojas, setGamintojas]   = useState('');
    const [pavadinimas, setPavadinimas] = useState('');
    const [kaina, setKaina]             = useState('');
    const [aprasymas, setAprasymas]     = useState('');
    const [data, setData]               = useState('');
    const [kiekis, setKiekis]           = useState('');
    const [spalva, setSpalva]           = useState('');
    const [tipas, setTipas]             = useState('');

    const postData = () => {
        console.log(gamintojas);
    }

    return (
        <div className='content'>
            <h1>Dalies kūrimas</h1>
            <Form className="create-form">
                <Form.Field>
                    <label>Gamintojas</label>
                    <input placeholder='Gamintojas' onChange={(e) => setGamintojas(e.target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>Pavadinimas</label>
                    <input placeholder='Pavadinimas' onChange={(e) => setPavadinimas(e.target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>Kaina</label>
                    <input type='number' placeholder='Kaina' onChange={(e) => setKaina(e.target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>Aprašymas</label>
                    <input placeholder='Aprašymas' onChange={(e) => setAprasymas(e.target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>Išleidimo data</label>
                    <input type='date' placeholder='Data' onChange={(e) => setData(e.target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>Kiekis</label>
                    <input type='number' placeholder='Kiekis' onChange={(e) => setKiekis(e.target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>Spalva</label>
                    <input type='text' placeholder='Spalva' onChange={(e) => setSpalva(e.target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>Tipas</label>
                    <input type='text' placeholder='Tipas' onChange={(e) => setTipas(e.target.value)}/>
                </Form.Field>
                <Form.Field>
                    <label>Kiekis</label>
                    <input type='number' placeholder='Kiekis' onChange={(e) => setKiekis(e.target.value)}/>
                </Form.Field>
                <Button onClick={postData} type='submit'>Sukurti</Button>
            </Form>
        </div>
    )
}