import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PartRead() {
    const [partData, setPartData] = useState([]);
    const [recommendationsData, setRecommendationsData] = useState([]);
    const [extendedPartData, setExtendedPartData] = useState([]);
    const { id } = useParams(); // get id from URL parameter

    useEffect(() => {
        fetch(`/getPart/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setPartData(data);
                return data;
            })
            .then((data) => {
                const type = data[0].tipas;
                return fetch(`/getPartSpec/${type}/${id}`)
                    .then((response) => response.json())
                    .then((extendedData) => {
                        setExtendedPartData(extendedData);
                        return type;
                    });
            })
            .then((type) => {
                fetch(`/recommendParts?type=${type}&id=${id}`)
                    .then((response) => response.json())
                    .then((data) => {
                        setRecommendationsData(data);
                    });
            });
    }, [id]);

    return (
        <div className='content'>
            <h1>Detalė</h1>
            {partData.map((data) => {
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
                                <b>Išleidimo data:</b> {(data.isleidimo_data).substring(0, 10)}
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
                            {Array.isArray(extendedPartData) && extendedPartData.map((extendedData) => {
                                switch (data.tipas){
                                    case "Motinine plokste":
                                        return (
                                            <div>
                                                <p>
                                                    <b>CPU lizdo standartas:</b> {extendedData.CPU_lizdo_standartas}
                                                </p>
                                                <p>
                                                    <b>CPU lizdų kiekis:</b> {extendedData.CPU_lizdu_kiekis}
                                                </p>
                                                <p>
                                                    <b>M2 kiekis:</b> {extendedData.M2_kiekis}
                                                </p>
                                                <p>
                                                    <b>SATA kiekis:</b> {extendedData.SATA_kiekis}
                                                </p>
                                                <p>
                                                    <b>PCIe lizdų kiekis:</b> {extendedData.PCIe_lizdu_kiekis}
                                                </p>
                                                <p>
                                                    <b>RAM karta:</b> {extendedData.RAM_karta}
                                                </p>
                                                <p>
                                                    <b>PCIe standartas:</b> {extendedData.PCIe_standartas}
                                                </p>
                                            </div>
                                        )
                                    case "Vaizdo plokste":
                                        return (
                                            <div>
                                                <p>
                                                    <b>VRAM kiekis:</b> {extendedData.VRAM_kiekis}
                                                </p>
                                                <p>
                                                    <b>VRAM dažnis:</b> {extendedData.VRAM_daznis}
                                                </p>
                                                <p>
                                                    <b>PCIe standartas:</b> {extendedData.PCIe_standartas}
                                                </p>
                                                <p>
                                                    <b>Jungtis:</b> {extendedData.jungtis}
                                                </p>
                                            </div>
                                        )
                                    case "Procesorius":
                                        return (
                                            <div>
                                                <p>
                                                    <b>CPU lizdo standartas:</b> {extendedData.CPU_lizdo_standartas}
                                                </p>
                                                <p>
                                                    <b>Dažnis:</b> {extendedData.daznis}
                                                </p>
                                                <p>
                                                    <b>Branduolių kiekis:</b> {extendedData.branduoliu_kiekis}
                                                </p>
                                            </div>
                                        )
                                    case "Monitorius":
                                        return (
                                            <div>
                                                <p>
                                                    <b>Atkūrimo dažnis:</b> {extendedData.atkurimo_daznis}
                                                </p>
                                                <p>
                                                    <b>Dydis:</b> {extendedData.dydis}
                                                </p>
                                                <p>
                                                    <b>Panelė:</b> {extendedData.panele}
                                                </p>
                                            </div>
                                        )
                                    case "Maitinimo blokas":
                                        return (
                                            <div>
                                                <p>
                                                    <b>Galia:</b> {extendedData.galia}
                                                </p>
                                                <p>
                                                    <b>Laidų kontrolė:</b> {extendedData.laidu_kontrole}
                                                </p>
                                                <p>
                                                    <b>Sertifikatas:</b> {extendedData.sertifikatas}
                                                </p>
                                            </div>
                                        )
                                    case "Klaviatura":
                                        return (
                                            <div>
                                                <p>
                                                    <b>Rūšis:</b> {extendedData.tipas}
                                                </p>
                                            </div>
                                        )
                                    case "Ausintuvas":
                                        return (
                                            <div>
                                                <p>
                                                    <b>Aukštis:</b> {extendedData.aukstis}
                                                </p>
                                                <p>
                                                    <b>Aušinimo vamzdžių kiekis:</b> {extendedData.ausinimo_vamzdziu_kiekis}
                                                </p>
                                            </div>
                                        )
                                    case "Atmintis":
                                        return (
                                            <div>
                                                <p>
                                                    <b>Talpa:</b> {extendedData.talpa}
                                                </p>
                                                <p>
                                                    <b>Dažnis:</b> {extendedData.daznis}
                                                </p>
                                                <p>
                                                    <b>RAM karta:</b> {extendedData.RAM_karta}
                                                </p>
                                            </div>
                                        )
                                    case "Kompiuterio pele":
                                        return (
                                            <div>
                                                <p>
                                                    <b>Ar laidinė?</b> {extendedData.laidine}
                                                </p>
                                            </div>
                                        )
                                    case "Kabelis":
                                        return (
                                            <div>
                                                <p>
                                                    <b>Ilgis:</b> {extendedData.ilgis}
                                                </p>
                                                <p>
                                                    <b>Rūšis:</b> {extendedData.tipas}
                                                </p>
                                            </div>
                                        )
                                    default:
                                        return null;
                                }
                            })}
                        </div>
                        <br/><br/><button className='atsiliepimai' onClick={() => {window.location.href = `/detales/${data.id_Detale}/atsiliepimai`}}>Atsiliepimai</button><br/><br/>
                    </div>
                );
            })}

            <div className='content'>
                <br/><br/><hr/><h2 style={{ marginTop: '10px', marginBottom: '10px' }}>Rekomendacijos</h2><hr/>
                <div className='rekomendacijos-div'>
                {recommendationsData.map((data) => {
                    return (
                        <div className='rekomendacijos'>
                            <div className='innerParts'>
                                <div className='rekomendacija-name'>
                                    <a className='rekomendacija-a' href={`/detales/${data.id_Detale}`}>
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
                            </div>
                        </div>
                    );
                })}
            </div>
            </div>
            <br/><button className='grizti' onClick={() => {window.location.href = '/detales?tipas=all'}}>Grįžti</button><br/><br/>
        </div>
    );
}