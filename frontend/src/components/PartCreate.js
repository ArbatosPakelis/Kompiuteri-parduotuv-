import React, { useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Button, Form } from 'semantic-ui-react';
import Cookies from "js-cookie";

export default function PartsCreate() {
    const [gamintojas, setGamintojas] = useState('');
    const [pavadinimas, setPavadinimas] = useState('');
    const [kaina, setKaina] = useState('');
    const [aprasymas, setAprasymas] = useState('');
    const [data, setData] = useState('');
    const [kiekis, setKiekis] = useState('');
    const [spalva, setSpalva] = useState('');
    const [tipas, setTipas] = useState('');

    const [additionalField1, setAdditionalField1] = useState('');
    const [additionalField2, setAdditionalField2] = useState('');
    const [additionalField3, setAdditionalField3] = useState('');
    const [additionalField4, setAdditionalField4] = useState('');
    const [additionalField5, setAdditionalField5] = useState('');
    const [additionalField6, setAdditionalField6] = useState('');
    const [additionalField7, setAdditionalField7] = useState('');

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

            fetch(`/checkDuplication?${params.toString()}`, {
                method: 'GET'
            })
            .then((response) => {
                if (response.ok) { // check if response is ok
                    response.json().then((data) => { // parse the response body as JSON
                        if (data.status === 'success') {
                            Cookies.set('partMessage', 'errorCreate', { expires: 3/86400 });
                            window.location.href = '/detales?tipas=all';
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
                } else {
                    const assignedValues = [additionalField1, additionalField2, additionalField3, additionalField4, additionalField5, additionalField6, additionalField7]
                        .filter(value => value !== '');

                    const params2 = new URLSearchParams({});
                    assignedValues.forEach((value, index) => params2.set(`additionalField${index + 1}`, value));

                    fetch(`/addPart?${params.toString()}`, {
                        method: 'POST'
                    }).then(response => response.json()).then(data => {
                        const {id} = data;
                        fetch(`/addSpecPart?iranga=${tipas}&${params2.toString()}&id=${id}`, {
                            method: 'POST'
                        })
                        window.location.href = '/detales?tipas=all';
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            });
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
                        options={[{ key: 'juoda', text: 'Juoda', value: 'Juoda' },{ key: 'balta', text: 'Balta', value: 'Balta' },{ key: 'raudona', text: 'Raudona', value: 'Raudona' },{ key: 'ivairiaspalve', text: 'Įvairiaspalvė', value: 'Ivairiaspalve' },{ key: 'melyna', text: 'Mėlyna', value: 'Melyna' },{ key: 'zalia', text: 'Žalia', value: 'Zalia' }]}
                        placeholder='Pasirinkite spalvą'
                        onChange={(e, { value }) => setSpalva(value)}
                    />
                    {errors.spalva && <div className="ui pointing red basic label">{errors.spalva}</div>}
                </Form.Field>
                <Form.Field error={!!errors.tipas}>
                    <Form.Select compact label='Tipas' placeholder='Pasirinkite tipą' options={[
                        { key: 'Motinine_plokste', text: 'Motininė plokštė', value: 'Motinine plokste' },
                        { key: 'Vaizdo_plokste', text: 'Vaizdo plokštė', value: 'Vaizdo plokste' },
                        { key: 'Procesorius', text: 'Procesorius', value: 'Procesorius' },
                        { key: 'Maitinimo_blokas', text: 'Maitinimo blokas', value: 'Maitinimo blokas' },
                        { key: 'Kompiuterio_Pele', text: 'Pelytė', value: 'Kompiuterio pele' },
                        { key: 'Atmintis', text: 'Atmintis', value: 'Atmintis' },
                        { key: 'Klaviatura', text: 'Klaviatūra', value: 'Klaviatura' },
                        { key: 'Monitorius', text: 'Monitorius', value: 'Monitorius' },
                        { key: 'Ausintuvas', text: 'Aušintuvas', value: 'Ausintuvas' },
                        { key: 'Isorine_atmintis', text: 'Išorinė atmintis', value: 'Isorine atmintis' },
                        { key: 'Kabelis', text: 'Kabelis', value: 'Kabelis' }
                    ]} onChange={(e, { value }) => setTipas(value)} />
                    {errors.tipas && <div className="ui pointing red basic label">{errors.tipas}</div>}
                </Form.Field>
                {tipas === 'Motinine plokste' && (
                    <div>
                        <Form.Field>
                            <label>CPU lizdo standartas</label>
                            <input type='text' placeholder='Standartas' onChange={(e) => setAdditionalField1(e.target.value)}/>
                        </Form.Field>
                        <Form.Field>
                            <label>CPU lizdų kiekis</label>
                            <input type='text' placeholder='Kiekis' onChange={(e) => setAdditionalField2(e.target.value)}/>
                        </Form.Field>
                        <Form.Field>
                            <label>M2 kiekis</label>
                            <input type='text' placeholder='Kiekis' onChange={(e) => setAdditionalField3(e.target.value)}/>
                        </Form.Field>
                        <Form.Field>
                            <label>SATA kiekis</label>
                            <input type='text' placeholder='Kiekis' onChange={(e) => setAdditionalField4(e.target.value)}/>
                        </Form.Field>
                        <Form.Field>
                            <label>PCIe lizdų kiekis</label>
                            <input type='text' placeholder='Kiekis' onChange={(e) => setAdditionalField5(e.target.value)}/>
                        </Form.Field>
                        <Form.Field error={!!errors.tipas}>
                            <Form.Select compact label='RAM karta' placeholder='Pasirinkite kartą' options={[
                                { key: 'DDR3', text: 'DDR3', value: 'DDR3' },
                                { key: 'DDR4', text: 'DDR4', value: 'DDR4' },
                                { key: 'DDR5', text: 'DDR5', value: 'DDR5' }
                            ]} onChange={(e, { value }) => setAdditionalField6(value)} />
                        </Form.Field>
                        <Form.Field error={!!errors.tipas}>
                            <Form.Select compact label='PCIe standartas' placeholder='Pasirinkite standartą' options={[
                                { key: 'PCIe 3.0', text: 'PCIe 3.0', value: 'PCIe 3.0' },
                                { key: 'PCIe 4.0', text: 'PCIe 4.0', value: 'PCIe 4.0' },
                                { key: 'PCIe 5.0', text: 'PCIe 5.0', value: 'PCIe 5.0' }
                            ]} onChange={(e, { value }) => setAdditionalField7(value)} />
                        </Form.Field>
                    </div>
                )}
                {tipas === 'Vaizdo plokste' && (
                    <div>
                        <Form.Field>
                            <label>VRAM kiekis</label>
                            <input type='text' placeholder='Kiekis' onChange={(e) => setAdditionalField1(e.target.value)}/>
                        </Form.Field>
                        <Form.Field>
                            <label>VRAM dažnis</label>
                            <input type='text' placeholder='Dažnis' onChange={(e) => setAdditionalField2(e.target.value)}/>
                        </Form.Field>
                        <Form.Field error={!!errors.tipas}>
                            <Form.Select compact label='PCIe standartas' placeholder='Pasirinkite standartą' options={[
                                { key: 'PCIe 3.0', text: 'PCIe 3.0', value: 'PCIe 3.0' },
                                { key: 'PCIe 4.0', text: 'PCIe 4.0', value: 'PCIe 4.0' },
                                { key: 'PCIe 5.0', text: 'PCIe 5.0', value: 'PCIe 5.0' }
                            ]} onChange={(e, { value }) => setAdditionalField3(value)} />
                        </Form.Field>
                        <Form.Field error={!!errors.tipas}>
                            <Form.Select compact label='Jungtis' placeholder='Pasirinkite kartą' options={[
                                { key: 'DDR3', text: 'DDR3', value: 'DDR3' },
                                { key: 'DDR4', text: 'DDR4', value: 'DDR4' },
                                { key: 'DDR5', text: 'DDR5', value: 'DDR5' }
                            ]} onChange={(e, { value }) => setAdditionalField4(value)} />
                        </Form.Field>
                    </div>
                )}
                {tipas === 'Procesorius' && (
                    <div>
                        <Form.Field>
                            <label>CPU lizdo standartas</label>
                            <input type='text' placeholder='Standartas' onChange={(e) => setAdditionalField1(e.target.value)}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Dažnis</label>
                            <input type='text' placeholder='Dažnis' onChange={(e) => setAdditionalField2(e.target.value)}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Branduolių kiekis</label>
                            <input type='text' placeholder='Kiekis' onChange={(e) => setAdditionalField3(e.target.value)}/>
                        </Form.Field>
                    </div>
                )}
                {tipas === 'Maitinimo blokas' && (
                    <div>
                        <Form.Field>
                            <label>Galia</label>
                            <input type='text' placeholder='Galia' onChange={(e) => setAdditionalField1(e.target.value)}/>
                        </Form.Field>
                        <Form.Field error={!!errors.tipas}>
                            <Form.Select compact label='Laidų kontrolė' placeholder='Pasirinkite' options={[
                                { key: 'Yra', text: 'Yra', value: '0' },
                                { key: 'Nėra', text: 'Nėra', value: '1' }
                            ]} onChange={(e, { value }) => setAdditionalField2(value)} />
                        </Form.Field>
                        <Form.Field error={!!errors.tipas}>
                            <Form.Select compact label='Sertifikatas' placeholder='Pasirinkite' options={[
                                { key: 'Yra', text: 'Yra', value: '0' },
                                { key: 'Nėra', text: 'Nėra', value: '1' }
                            ]} onChange={(e, { value }) => setAdditionalField3(value)} />
                        </Form.Field>
                    </div>
                )}
                {tipas === 'Kompiuterio pele' && (
                    <div>
                        <Form.Field error={!!errors.tipas}>
                            <Form.Select compact label='Laidinė' placeholder='Pasirinkite' options={[
                                { key: 'Taip', text: 'Taip', value: '0' },
                                { key: 'Ne', text: 'Ne', value: '1' }
                            ]} onChange={(e, { value }) => setAdditionalField1(value)} />
                        </Form.Field>
                    </div>
                )}
                {tipas === 'Atmintis' && (
                    <div>
                        <Form.Field>
                            <label>Talpa</label>
                            <input type='text' placeholder='Talpa' onChange={(e) => setAdditionalField1(e.target.value)}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Dažnis</label>
                            <input type='text' placeholder='Dažnis' onChange={(e) => setAdditionalField2(e.target.value)}/>
                        </Form.Field>
                        <Form.Field error={!!errors.tipas}>
                            <Form.Select compact label='RAM karta' placeholder='Pasirinkite kartą' options={[
                                { key: 'DDR3', text: 'DDR3', value: 'DDR3' },
                                { key: 'DDR4', text: 'DDR4', value: 'DDR4' },
                                { key: 'DDR5', text: 'DDR5', value: 'DDR5' }
                            ]} onChange={(e, { value }) => setAdditionalField3(value)} />
                        </Form.Field>
                    </div>
                )}
                {tipas === 'Klaviatura' && (
                    <div>
                        <Form.Field error={!!errors.tipas}>
                            <Form.Select compact label='Tipas' placeholder='Pasirinkite tipą' options={[
                                { key: 'Zaidimams', text: 'Žaidimams', value: 'Zaidimams' },
                                { key: 'Ofisui', text: 'Ofisui', value: 'Ofisui' },
                                { key: 'Pusine', text: 'Pusinė', value: 'Pusine' }
                            ]} onChange={(e, { value }) => setAdditionalField1(value)} />
                        </Form.Field>
                    </div>
                )}
                {tipas === 'Monitorius' && (
                    <div>
                        <Form.Field>
                            <label>Atkūrimo dažnis</label>
                            <input type='text' placeholder='Dažnis' onChange={(e) => setAdditionalField1(e.target.value)}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Dydis</label>
                            <input type='text' placeholder='Dydis' onChange={(e) => setAdditionalField2(e.target.value)}/>
                        </Form.Field>
                        <Form.Field error={!!errors.tipas}>
                            <Form.Select compact label='Panelė' placeholder='Pasirinkite panelę' options={[
                                { key: 'IPS', text: 'IPS', value: 'IPS' },
                                { key: 'TN', text: 'TN', value: 'TN' },
                                { key: 'VA', text: 'VA', value: 'VA' }
                            ]} onChange={(e, { value }) => setAdditionalField3(value)} />
                        </Form.Field>
                    </div>
                )}
                {tipas === 'Ausintuvas' && (
                    <div>
                        <Form.Field>
                            <label>Aukštis</label>
                            <input type='number' placeholder='Aukštis' onChange={(e) => setAdditionalField1(e.target.value)}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Aušinimo vamzdžių kiekis</label>
                            <input type='number' placeholder='Kiekis' onChange={(e) => setAdditionalField2(e.target.value)}/>
                        </Form.Field>
                    </div>
                )}
                {tipas === 'Isorine atmintis' && (
                    <div>
                        <Form.Field>
                            <label>Jungties tipas</label>
                            <input type='text' placeholder='Tipas' onChange={(e) => setAdditionalField1(e.target.value)}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Skaitymo greitis</label>
                            <input type='number' placeholder='Greitis' onChange={(e) => setAdditionalField2(e.target.value)}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Rašymo greitis</label>
                            <input type='number' placeholder='Greitis' onChange={(e) => setAdditionalField3(e.target.value)}/>
                        </Form.Field>
                    </div>
                )}
                {tipas === 'Kabelis' && (
                    <div>
                        <Form.Field>
                            <label>Ilgis</label>
                            <input type='text' placeholder='Ilgis' onChange={(e) => setAdditionalField1(e.target.value)}/>
                        </Form.Field>
                        <Form.Field error={!!errors.tipas}>
                            <Form.Select compact label='Tipas' placeholder='Pasirinkite tipą' options={[
                                { key: 'USB', text: 'USB', value: 'USB' },
                                { key: 'Maitinimui', text: 'Maitinimui', value: 'Maitinimui' },
                                { key: 'Prailgintuvai', text: 'Prailgintuvai', value: 'Prailgintuvai' }
                            ]} onChange={(e, { value }) => setAdditionalField2(value)} />
                        </Form.Field>
                    </div>
                )}
                <br/><Button onClick={postData} type='submit'>Sukurti</Button>
            </Form>
            <br/><br/><button className='grizti' onClick={() => {window.location.href = '/detales?tipas=all'}}>Grįžti</button><br/><br/>
        </div>
    )
}