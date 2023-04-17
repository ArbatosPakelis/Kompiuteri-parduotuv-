import React, { useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Button, Form } from 'semantic-ui-react';

export default function PartsCreate() {
    const [gamintojas, setGamintojas] = useState('');
    const [pavadinimas, setPavadinimas] = useState('');
    const [kaina, setKaina] = useState('');
    const [aprasymas, setAprasymas] = useState('');
    const [data, setData] = useState('');
    const [kiekis, setKiekis] = useState('');
    const [spalva, setSpalva] = useState('');
    const [tipas, setTipas] = useState('');

    const [errors, setErrors] = useState({});

    const validate = () => {
        let errors = {};
        if (!gamintojas) {
            errors.gamintojas = 'Gamintojas negali būti tuščias';
        }
        if (!pavadinimas) {
            errors.pavadinimas = 'Pavadinimas negali būti tuščias';
        }
        if (!kaina) {
            errors.kaina = 'Kaina negali būti tuščia';
        }
        if (!aprasymas) {
            errors.aprasymas = 'Aprašymas negali būti tuščias';
        }
        if (!data) {
            errors.data = 'Data negali būti tuščia';
        }
        if (!kiekis) {
            errors.kiekis = 'Kiekis negali būti tuščias';
        }
        if (!spalva) {
            errors.spalva = 'Spalva negali būti tuščia';
        }
        if (!tipas) {
            errors.tipas = 'Tipas negali būti tuščias';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const postData = () => {
        if (validate()) {
            const params = new URLSearchParams({
                gamintojas: gamintojas,
                pavadinimas: pavadinimas,
                kaina: kaina,
                aprasymas: aprasymas,
                isleidimo_data: data,
                kiekis: kiekis,
                spalva: spalva,
                tipas: tipas,
            });

            fetch(`/addPart?${params.toString()}`, {
                method: 'POST'
            })

            window.location.href = '/detales';
        }
    }

    return (
        <div className='content'>
            <h1>Detalės kūrimas</h1>
            <Form className="create-form">
                <Form.Field error={!!errors.gamintojas}>
                    <label>Gamintojas</label>
                    <input placeholder='Gamintojas' onChange={(e) => setGamintojas(e.target.value)}/>
                    {errors.gamintojas && <div className="ui pointing red basic label">{errors.gamintojas}</div>}
                </Form.Field>
                <Form.Field error={!!errors.pavadinimas}>
                    <label>Pavadinimas</label>
                    <input placeholder='Pavadinimas' onChange={(e) => setPavadinimas(e.target.value)}/>
                    {errors.pavadinimas && <div className="ui pointing red basic label">{errors.pavadinimas}</div>}
                </Form.Field>
                <Form.Field error={!!errors.kaina}>
                    <label>Kaina</label>
                    <input type='number' placeholder='Kaina' onChange={(e) => setKaina(e.target.value)}/>
                    {errors.kaina && <div className="ui pointing red basic label">{errors.kaina}</div>}
                </Form.Field>
                <Form.Field error={!!errors.aprasymas}>
                    <label>Aprašymas</label>
                    <input placeholder='Aprašymas' onChange={(e) => setAprasymas(e.target.value)}/>
                    {errors.aprasymas && <div className="ui pointing red basic label">{errors.aprasymas}</div>}
                </Form.Field>
                <Form.Field error={!!errors.data}>
                    <label>Išleidimo data</label>
                    <input type='date' placeholder='Data' onChange={(e) => setData(e.target.value)}/>
                    {errors.data && <div className="ui pointing red basic label">{errors.data}</div>}
                </Form.Field>
                <Form.Field error={!!errors.kiekis}>
                    <label>Kiekis</label>
                    <input type='number' placeholder='Kiekis' onChange={(e) => setKiekis(e.target.value)}/>
                    {errors.kiekis && <div className="ui pointing red basic label">{errors.kiekis}</div>}
                </Form.Field>
                <Form.Field error={!!errors.spalva}>
                    <Form.Select
                        label='Spalva'
                        options={[{ key: 'juoda', text: 'Juoda', value: 'juoda' },{ key: 'balta', text: 'Balta', value: 'balta' },{ key: 'raudona', text: 'Raudona', value: 'raudona' },{ key: 'ivairiaspalve', text: 'Įvairiaspalvė', value: 'ivairiaspalve' },{ key: 'melyna', text: 'Mėlyna', value: 'melyna' },{ key: 'zalia', text: 'Žalia', value: 'zalia' }]}
                        placeholder='Pasirinkite spalvą'
                        onChange={(e, { value }) => setSpalva(value)}
                    />
                    {errors.spalva && <div className="ui pointing red basic label">{errors.spalva}</div>}
                </Form.Field>
                <Form.Field error={!!errors.tipas}>
                    <Form.Select compact label='Tipas' placeholder='Pasirinkite tipą' options={[
                        { key: 'Motinine plokste', text: 'Motininė plokštė', value: 'Motinine plokste' },
                        { key: 'Vaizdo plokste', text: 'Vaizdo plokštė', value: 'Vaizdo plokste' },
                        { key: 'Procesorius', text: 'Procesorius', value: 'Procesorius' },
                        { key: 'Maitinimo blokas', text: 'Maitinimo blokas', value: 'Maitinimo blokas' },
                        { key: 'Pelyte', text: 'Pelė', value: 'Pelyte' },
                        { key: 'Atmintis', text: 'Atmintis', value: 'Atmintis' },
                        { key: 'Klaviatura', text: 'Klaviatūra', value: 'Klaviatura' },
                        { key: 'Monitorius', text: 'Monitorius', value: 'Monitorius' },
                        { key: 'Ausintuvas', text: 'Aušintuvas', value: 'Ausintuvas' },
                        { key: 'Isorine atmintis', text: 'Išorinė atmintis', value: 'Isorine atmintis' }
                    ]} onChange={(e, { value }) => setTipas(value)} />
                    {errors.tipas && <div className="ui pointing red basic label">{errors.tipas}</div>}
                </Form.Field>
                <Button onClick={postData} type='submit'>Sukurti</Button>
            </Form>
            <br/><br/><a className='grizti' href='/detales'>Grįžti</a>
        </div>
    )
}