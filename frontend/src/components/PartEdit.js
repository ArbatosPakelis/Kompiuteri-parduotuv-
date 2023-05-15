import React, { useEffect, useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Button, Form } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

export default function PartsEdit() {
    const [gamintojas, setGamintojas] = useState("");
    const [pavadinimas, setPavadinimas] = useState("");
    const [kaina, setKaina] = useState('');
    const [aprasymas, setAprasymas] = useState("");
    const [data, setData] = useState("");
    const [kiekis, setKiekis] = useState('');
    const [spalva, setSpalva] = useState("");
    const [tipas, setTipas] = useState("");
    const [id_Detale, setIdDetale] = useState("");
    const { id } = useParams(); // get id from URL parameter
    const [errors, setErrors] = useState({});

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
            setIdDetale(data[0].id_Detale);
        };

        fetchData();
    }, [id]);

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

    const setNewData = async () => {
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
                id_Detale: id_Detale
            });

            fetch(`/checkDuplication?${params.toString()}`, {
                method: 'GET'
            })
            .then((response) => {
                if (response.ok) { // check if response is ok
                    response.json().then((data) => { // parse the response body as JSON
                        if (data.ans === true) {
                            Cookies.set('partMessage', 'errorCreate', { expires: 3/86400 });
                            window.location.href = '/detales?tipas=all';
                        } else {
                            fetch(`/setPart?${params.toString()}`, {
                                method: "PUT",
                            });
                            window.location.href = "/detales?tipas=all";
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
        }
    };

    return (
        <div className='content'>
            <h1>Detalės redagavimas</h1>
            <Form className="create-form">
                <Form.Field error={!!errors.gamintojas}>
                    <label>Gamintojas</label>
                    <input value={gamintojas} onChange={(e) => setGamintojas(e.target.value)}/>
                    {errors.gamintojas && <div className="ui pointing red basic label">{errors.gamintojas}</div>}
                </Form.Field>
                <Form.Field error={!!errors.pavadinimas}>
                    <label>Pavadinimas</label>
                    <input value={pavadinimas} onChange={(e) => setPavadinimas(e.target.value)}/>
                    {errors.pavadinimas && <div className="ui pointing red basic label">{errors.pavadinimas}</div>}
                </Form.Field>
                <Form.Field error={!!errors.kaina}>
                    <label>Kaina</label>
                    <input type='number' value={kaina} onChange={(e) => setKaina(e.target.value)}/>
                    {errors.kaina && <div className="ui pointing red basic label">{errors.kaina}</div>}
                </Form.Field>
                <Form.Field error={!!errors.aprasymas}>
                    <label>Aprašymas</label>
                    <input value={aprasymas} onChange={(e) => setAprasymas(e.target.value)}/>
                    {errors.aprasymas && <div className="ui pointing red basic label">{errors.aprasymas}</div>}
                </Form.Field>
                <Form.Field error={!!errors.data}>
                    <label>Išleidimo data</label>
                    <input type='date' value={data} onChange={(e) => setData(e.target.value)}/>
                    {errors.data && <div className="ui pointing red basic label">{errors.data}</div>}
                </Form.Field>
                <Form.Field error={!!errors.kiekis}>
                    <label>Kiekis</label>
                    <input type='number' value={kiekis} onChange={(e) => setKiekis(e.target.value)}/>
                    {errors.kiekis && <div className="ui pointing red basic label">{errors.kiekis}</div>}
                </Form.Field>
                <Form.Field error={!!errors.spalva}>
                    <Form.Select
                        label='Spalva'
                        options={[{ key: 'juoda', text: 'Juoda', value: 'juoda' },{ key: 'balta', text: 'Balta', value: 'balta' },{ key: 'raudona', text: 'Raudona', value: 'raudona' },{ key: 'ivairiaspalve', text: 'Įvairiaspalvė', value: 'ivairiaspalve' },{ key: 'melyna', text: 'Mėlyna', value: 'melyna' },{ key: 'zalia', text: 'Žalia', value: 'zalia' }]}
                        placeholder='Pasirinkite spalvą'
                        value={spalva}
                        onChange={(e, { value }) => setSpalva(value)}
                    />
                    {errors.spalva && <div className="ui pointing red basic label">{errors.spalva}</div>}
                </Form.Field>
                <Form.Field error={!!errors.tipas}>
                    <Form.Select compact label='Tipas' placeholder='Pasirinkite tipą' value={tipas} options={[
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
                <Button onClick={setNewData} type='submit'>Atnaujinti</Button>
            </Form>
            <br/><br/><button className='grizti' onClick={() => {window.location.href = '/detales?tipas=all'}}>Grįžti</button><br/><br/>
        </div>
    )
}