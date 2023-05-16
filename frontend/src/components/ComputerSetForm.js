import React, { useEffect, useState } from 'react';
import ComputerSetApi from '../Apis/ComputerSetApi';
import {useLocation, useParams} from "react-router-dom";
import {Button, Form} from "semantic-ui-react";
import { TextField } from '@mui/material';
import Cookies from "js-cookie";
export default function ComputerSetForm() {
    const { id } = useParams(); // take id from page URL
    const [computerSetData, setComputerSet] = useState(null);
    const [partsData, setpartsData] = useState(null);
    const [motherboard, setMotherboard] = useState(null);
    const [cpu, setCpu] = useState(null);
    const [ram, setRam] = useState(null);
    const [gpu, setGpu] = useState(null);
    const [dataDisk, setDataDisk] = useState(null);
    const [powerSuply, setPowerSupply] = useState(null);
    const [cooler, setCooler] = useState(null);
    const [monitor, setMonitor] = useState(null);
    const [mouse, setMouse] = useState(null);
    const [keyboard, setKeyboard] = useState(null);
    const [loading, setLoading] = useState(true); // New loading state
    const [problems, setProblems] = useState(null);
    const [success, setSuccess] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [Detale, setIDDetale] = useState('');
    const [message, setMessage] = useState('');

    const magic = async () => {
        const setApi = new ComputerSetApi();
        const response = await setApi.compatibility(id);
        setSuccess(response.data.status);
        if(!response.data.status){
            setProblems(response.data.ans);
        }

    }

    // Update total price whenever the components change
    useEffect(() => {
      const parts = [motherboard, cpu, ram, gpu, dataDisk, powerSuply, cooler, monitor, mouse, keyboard];
      const price = parts.reduce((sum, part) => sum + (part ? part.kaina : 0), 0);
      setTotalPrice(price);
    }, [motherboard, cpu, ram, gpu, dataDisk, powerSuply, cooler]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setIDDetale(params.get('id_Detale'));

        const partMessage = Cookies.get('partMessage');
        if(partMessage === 'partsHREF') {
            fetch(`/computerSet/updateComputerSet?kiekis=1&fk_Kompiuterio_rinkinysid_Kompiuterio_rinkinys=${id}&fk_Detaleid_Detale=${params.get('id_Detale')}`, {
                method: 'POST'
            })
                .then((response) => {
                    response.json().then((data) => { // parse the response body as JSON
                        const partMessage = Cookies.get('partMessage');
                        if(partMessage === 'successADD')
                        {
                            setMessage('Sėkmingai pridėta detalė!');
                            setTimeout(() => {
                                setMessage('');
                            }, 2000);
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        }

    const fetchData = async () => {
      try {
        const setApi = new ComputerSetApi();
        const response = await setApi.getComputerSet(id);
        const { ans, rows } = response.data;
        setComputerSet(ans);
        setpartsData(rows);

        // Move the logic of setting individual part states here
        setMotherboard(rows.find((part) => part.tipas === 'Motinine plokste'));
        setCpu(rows.find((part) => part.tipas === 'Procesorius'));
        setRam(rows.find((part) => part.tipas === 'Atmintis'));
        setGpu(rows.find((part) => part.tipas === 'Vaizdo plokste'));
        setDataDisk(rows.find((part) => part.tipas === 'Isorine atmintis'));
        setPowerSupply(rows.find((part) => part.tipas === 'Maitinimo blokas'));
        setCooler(rows.find((part) => part.tipas === 'Ausintuvas'));
        setMonitor(rows.find((part) => part.tipas === 'Monitorius'));
        setMouse(rows.find((part) => part.tipas === 'Kompiuterio pele'));
        setKeyboard(rows.find((part) => part.tipas === 'Klaviatura'))

        setLoading(false);
      } catch (err) {
        console.log(err.response.data.message);
        setComputerSet(null);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

    async function unlink(someID, otherID) {
        const setApi = new ComputerSetApi();
        if(typeof someID == 'number' || typeof otherID == 'number'){
            const response = await setApi.unlinkPartFromBuild(someID, otherID);
            console.log(response)
            console.log(response.data.ans)
            if(response.data.ans !== undefined){
                setProblems(response.data.ans)
            }
            else{
                // eslint-disable-next-line no-restricted-globals
                location.reload();
            }
        }
    }

    if (loading) {
        return <div>Loading...</div>; // Render a loading state while data is being fetched
    }
    
    return (
            <div style={{ alignContent:'center', paddingLeft:100}}>
                    <center>
                        <h2 style={{paddingBottom:0, paddingTop:20}}>
                            {computerSetData ? computerSetData[0].pavadinimas : 'Loading...'}
                        </h2>
                        <h4 style={{marginTop:-10}}>Viso rinkinio kaina: {totalPrice.toFixed(2)}</h4>
                        {message && <div style={{ textAlign: "center", color: message.includes('mingai') ? 'green' : 'red' }}>{message}</div>}
                    </center>
                <div style={{textAlign:"center"}}>
                    <div style={{display:'inline-block', width:'60%', textAlign: "left"}}>
                        <ul>
                            <li style={{marginTop:30, display:'flex'}}>
                                <p style={{ marginRight:50, width:150, display:'inline-block'}}>Procesorius</p>
                                {cpu ? (
                                <div style={{display:'flex', width:'60%'}}>
                                    <p>
                                        {cpu.pavadinimas}
                                    </p>
                                    <button onClick={() => (unlink(computerSetData[0].id_Kompiuterio_rinkinys, cpu.id_Detale))} style={{fontSize:20, marginLeft:'auto'}}>&#10005;</button>
                                </div>)
                                 : (<button onClick={() => {window.location.href = `/detales?tipas=procesorius&rinkinys=${computerSetData[0].id_Kompiuterio_rinkinys}`}} >Pridėti</button>)}
                            </li>
                            <hr/>
                            <li style={{marginTop:30, display:'flex'}}>
                                <p style={{ marginRight:50, width:150, display:'inline-block'}}>Aušintuvas</p>
                                {cooler ? (
                                <div style={{display:'flex', width:'60%'}}>
                                    <p>
                                        {cooler.pavadinimas}
                                    </p>
                                    <button onClick={() => (unlink(computerSetData[0].id_Kompiuterio_rinkinys, cooler.id_Detale))}  style={{fontSize:20, marginLeft:'auto'}}>&#10005;</button>
                                </div>)
                                 : (<button onClick={() => {window.location.href = `/detales?tipas=ausintuvas&rinkinys=${computerSetData[0].id_Kompiuterio_rinkinys}`}} >Pridėti</button>)}
                            </li>
                            <hr/>
                            <li style={{marginTop:30, display:'flex'}}>
                                <p style={{ marginRight:50, width:150, display:'inline-block'}}>Motininė plokštė</p>
                                {motherboard ? (
                                <div style={{display:'flex', width:'60%'}}>
                                    <p>
                                        {motherboard.pavadinimas}
                                    </p>
                                    <button onClick={() => (unlink(computerSetData[0].id_Kompiuterio_rinkinys, motherboard.id_Detale))}  style={{fontSize:20, marginLeft:'auto'}}>&#10005;</button>
                                </div>)
                                 : (<button onClick={() => {window.location.href = `/detales?tipas=motinine_plokste&rinkinys=${computerSetData[0].id_Kompiuterio_rinkinys}`}} >Pridėti</button>)}
                            </li>
                            <hr/>
                            <li style={{marginTop:30, display:'flex'}}>
                                <p style={{ marginRight:50, width:150, display:'inline-block'}}>Atmintis (Ram)</p>
                                {ram ? (
                                <div style={{display:'flex', width:'60%'}}>
                                    <p>
                                        {ram.pavadinimas}
                                    </p>
                                    <button onClick={() => (unlink(computerSetData[0].id_Kompiuterio_rinkinys, ram.id_Detale))}  style={{fontSize:20, marginLeft:'auto'}}>&#10005;</button>
                                </div>)
                                 : (<button onClick={() => {window.location.href = `/detales?tipas=atmintis&rinkinys=${computerSetData[0].id_Kompiuterio_rinkinys}`}} >Pridėti</button>)}
                            </li>
                            <hr/>
                            <li style={{marginTop:30, display:'flex'}}>
                                <p style={{ marginRight:50, width:150, display:'inline-block'}}>Išorinė atmintis</p>
                                {dataDisk ? (
                                <div style={{display:'flex', width:'60%'}}>
                                    <p>
                                        {dataDisk.pavadinimas}
                                    </p>
                                    <button onClick={() => (unlink(computerSetData[0].id_Kompiuterio_rinkinys, dataDisk.id_Detale))}  style={{fontSize:20, marginLeft:'auto'}}>&#10005;</button>
                                </div>)
                                 : (<button onClick={() => {window.location.href = `/detales?tipas=isorine_atmintis&rinkinys=${computerSetData[0].id_Kompiuterio_rinkinys}`}} >Pridėti</button>)}
                            </li>
                            <hr/>
                            <li style={{marginTop:30, display:'flex'}}>
                                <p style={{ marginRight:50, width:150, display:'inline-block'}}>Vaizdo plokštė</p>
                                {gpu ? (
                                <div style={{display:'flex', width:'60%'}}>
                                    <p>
                                        {gpu.pavadinimas}
                                    </p>
                                    <button onClick={() => (unlink(computerSetData[0].id_Kompiuterio_rinkinys, gpu.id_Detale))}  style={{fontSize:20, marginLeft:'auto'}}>&#10005;</button>
                                </div>)
                                 : (<button onClick={() => {window.location.href = `/detales?tipas=vaizdo_plokste&rinkinys=${computerSetData[0].id_Kompiuterio_rinkinys}`}} >Pridėti</button>)}
                            </li>
                            <hr/>
                            <li style={{marginTop:30, display:'flex'}}>
                                <p style={{ marginRight:50, width:150, display:'inline-block'}}>Maitinimo blokas</p>
                                {powerSuply ? (
                                <div style={{display:'flex', width:'60%'}}>
                                    <p>
                                        {powerSuply.pavadinimas}
                                    </p>
                                    <button onClick={() => (unlink(computerSetData[0].id_Kompiuterio_rinkinys, powerSuply.id_Detale))}  style={{fontSize:20, marginLeft:'auto'}}>&#10005;</button>
                                </div>)
                                 : (<button onClick={() => {window.location.href = `/detales?tipas=maitinimo_blokas&rinkinys=${computerSetData[0].id_Kompiuterio_rinkinys}`}} >Pridėti</button>)}
                            </li>
                            <hr/>
                            <li style={{marginTop:30, display:'flex'}}>
                                <p style={{ marginRight:50, width:150, display:'inline-block'}}>Monitorius</p>
                                {monitor ? (
                                <div style={{display:'flex', width:'60%'}}>
                                    <p>
                                        {monitor.pavadinimas}
                                    </p>
                                    <button onClick={() => (unlink(computerSetData[0].id_Kompiuterio_rinkinys, monitor.id_Detale))}  style={{fontSize:20, marginLeft:'auto'}}>&#10005;</button>
                                </div>)
                                 : (<button onClick={() => {window.location.href = `/detales?tipas=monitorius&rinkinys=${computerSetData[0].id_Kompiuterio_rinkinys}`}} >Pridėti</button>)}
                            </li>
                            <hr/>
                            <li style={{marginTop:30, display:'flex'}}>
                                <p style={{ marginRight:50, width:150, display:'inline-block'}}>Kompiuterio pelė</p>
                                {mouse ? (
                                <div style={{display:'flex', width:'60%'}}>
                                    <p>
                                        {mouse.pavadinimas}
                                    </p>
                                    <button onClick={() => (unlink(computerSetData[0].id_Kompiuterio_rinkinys, mouse.id_Detale))}  style={{fontSize:20, marginLeft:'auto'}}>&#10005;</button>
                                </div>)
                                 : (<button onClick={() => {window.location.href = `/detales?tipas=kompiuterio_pele&rinkinys=${computerSetData[0].id_Kompiuterio_rinkinys}`}} >Pridėti</button>)}
                            </li>
                            <hr/>
                            <li style={{marginTop:30, display:'flex'}}>
                                <p style={{ marginRight:50, width:150, display:'inline-block'}}>Klaviatūra</p>
                                {keyboard ? (
                                <div style={{display:'flex', width:'60%'}}>
                                    <p>
                                        {keyboard.pavadinimas}
                                    </p>
                                    <button onClick={() => (unlink(computerSetData[0].id_Kompiuterio_rinkinys, keyboard.id_Detale))} style={{fontSize:20, marginLeft:'auto'}}>&#10005;</button>
                                </div>)
                                 : (<button  onClick={() => {window.location.href = `/detales?tipas=klaviatura&rinkinys=${computerSetData[0].id_Kompiuterio_rinkinys}`}} >Pridėti</button>)}
                            </li>
                            <hr/>
                        </ul>
                    </div>
                </div>
                <div style={{textAlign:"center"}}>
                    <p style={{color:'green', marginLeft:0, marginTop:0}}>{success === true ? "Rinkinys yra suderinamas": ""}</p>
                    <p style={{color:'red', marginLeft:0, marginTop:50}}>{problems}</p>
                    <button  className='red-sal' onClick={magic} style={{marginBottom:20}}>Tikrinti suderinamumą</button>
                </div>
        </div>
    );
}