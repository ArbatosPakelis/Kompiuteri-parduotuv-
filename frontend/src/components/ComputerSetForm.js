import React, { useEffect, useState } from 'react';
import ComputerSetApi from '../Apis/ComputerSetApi';
import {useLocation, useParams} from "react-router-dom";
import {Button, Form} from "semantic-ui-react";
import { TextField } from '@mui/material';
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
    const [loading, setLoading] = useState(true); // New loading state
    const [problems, setProblems] = useState(null);
    const [success, setSuccess] = useState(false);
    // useEffect(() => {
    //     const getData = async () => {
    //         try {
    //             const setApi = new ComputerSetApi();
    //             const response = await setApi.getComputerSet(id);
    //             setComputerSet(response.data.ans);
    //             setpartsData(response.data.rows);
    //             setMotherboard(partsData.find(a => a.tipas === 'Motinine plokste'));
    //             setCpu(partsData.find(b => b.tipas === 'Procesorius'));
    //             setRam(partsData.find(c => c.tipas === 'Atmintis'));
    //             setGpu(partsData.find(d => d.tipas === 'Vaizdo plokste'));
    //             setDataDisk(partsData.find(e => e.tipas === 'Isorine atmintis'));
    //             setPowerSupply(partsData.find(f => f.tipas === 'Maitinimo blokas'));
    //             setCooler(partsData.find(f => f.tipas === 'Ausintuvas'));
    //             setLoading(false); // Set loading to false once data is fetched
    //         } catch (err) {
    //             console.log(err.response.data.message)
    //             setComputerSet(null);
    //             setpartsData(null);
    //             setLoading(false); // Set loading to false in case of an error
    //         }
    //     };

    //     getData();
    // }, []);
    const magic = async () => {
        const setApi = new ComputerSetApi();
        const response = await setApi.compatibility(id);
        setSuccess(response.data.status);
        if(!response.data.status){
            setProblems(response.data.ans);
        }

    }

    useEffect(() => {
        const fetchData = async () => {
          try {
            const setApi = new ComputerSetApi();
            const response = await setApi.getComputerSet(id);
            const { ans, rows } = response.data;
            setComputerSet(ans);
            setpartsData(rows);
            setLoading(false);
          } catch (err) {
            console.log(err.response.data.message);
            setComputerSet(null);
            setLoading(false);
          }
        };
    
        fetchData();
      }, [id]);
    
      useEffect(() => {
        if (partsData) {
          setMotherboard(partsData.find((part) => part.tipas === 'Motinine plokste'));
          setCpu(partsData.find((part) => part.tipas === 'Procesorius'));
          setRam(partsData.find((part) => part.tipas === 'Atmintis'));
          setGpu(partsData.find((part) => part.tipas === 'Vaizdo plokste'));
          setDataDisk(partsData.find((part) => part.tipas === 'Isorine atmintis'));
          setPowerSupply(partsData.find((part) => part.tipas === 'Maitinimo blokas'));
          setCooler(partsData.find((part) => part.tipas === 'Ausintuvas'));
        }
      }, [partsData]);

    if (loading) {
        return <div>Loading...</div>; // Render a loading state while data is being fetched
    }
    
    return (
            <div style={{ alignContent:'center', paddingLeft:100}}>
                    <center><h2 style={{paddingBottom:50, paddingTop:50}}> {computerSetData ? computerSetData[0].pavadinimas : 'Loading...'}</h2></center>
                
                    <div style={{display:'inline-block', width:'60%'}}>
                        <ul>
                            <li style={{marginTop:30, display:'flex'}}>
                                <p style={{ marginRight:50, width:150, display:'inline-block'}}>Procesorius</p>
                                {cpu ? (
                                <div style={{display:'flex', width:'60%'}}>
                                    <p>
                                        {cpu.pavadinimas}
                                    </p>
                                    <button href=""  style={{fontSize:20, marginLeft:'auto'}}>&#10005;</button>
                                </div>)
                                 : (<button href="" >Pridėti</button>)}
                            </li>
                            <hr/>
                            <li style={{marginTop:30, display:'flex'}}>
                                <p style={{ marginRight:50, width:150, display:'inline-block'}}>Aušintuvas</p>
                                {cooler ? (
                                <div style={{display:'flex', width:'60%'}}>
                                    <p>
                                        {cooler.pavadinimas}
                                    </p>
                                    <button href=""  style={{fontSize:20, marginLeft:'auto'}}>&#10005;</button>
                                </div>)
                                 : (<button href="" >Pridėti</button>)}
                            </li>
                            <hr/>
                            <li style={{marginTop:30, display:'flex'}}>
                                <p style={{ marginRight:50, width:150, display:'inline-block'}}>Motinine plokste</p>
                                {motherboard ? (
                                <div style={{display:'flex', width:'60%'}}>
                                    <p>
                                        {motherboard.pavadinimas}
                                    </p>
                                    <button href=""  style={{fontSize:20, marginLeft:'auto'}}>&#10005;</button>
                                </div>)
                                 : (<button href="" >Pridėti</button>)}
                            </li>
                            <hr/>
                            <li style={{marginTop:30, display:'flex'}}>
                                <p style={{ marginRight:50, width:150, display:'inline-block'}}>Atmintis (Ram)</p>
                                {ram ? (
                                <div style={{display:'flex', width:'60%'}}>
                                    <p>
                                        {ram.pavadinimas}
                                    </p>
                                    <button href=""  style={{fontSize:20, marginLeft:'auto'}}>&#10005;</button>
                                </div>)
                                 : (<button href="" >Pridėti</button>)}
                            </li>
                            <hr/>
                            <li style={{marginTop:30, display:'flex'}}>
                                <p style={{ marginRight:50, width:150, display:'inline-block'}}>Išorinė atmintis</p>
                                {dataDisk ? (
                                <div style={{display:'flex', width:'60%'}}>
                                    <p>
                                        {dataDisk.pavadinimas}
                                    </p>
                                    <button href=""  style={{fontSize:20, marginLeft:'auto'}}>&#10005;</button>
                                </div>)
                                 : (<button href="" >Pridėti</button>)}
                            </li>
                            <hr/>
                            <li style={{marginTop:30, display:'flex'}}>
                                <p style={{ marginRight:50, width:150, display:'inline-block'}}>Vaizdo plokste</p>
                                {gpu ? (
                                <div style={{display:'flex', width:'60%'}}>
                                    <p>
                                        {gpu.pavadinimas}
                                    </p>
                                    <button href=""  style={{fontSize:20, marginLeft:'auto'}}>&#10005;</button>
                                </div>)
                                 : (<button href="" >Pridėti</button>)}
                            </li>
                            <hr/>
                            <li style={{marginTop:30, display:'flex'}}>
                                <p style={{ marginRight:50, width:150, display:'inline-block'}}>Maitinimo blokas</p>
                                {powerSuply ? (
                                <div style={{display:'flex', width:'60%'}}>
                                    <p>
                                        {powerSuply.pavadinimas}
                                    </p>
                                    <button href=""  style={{fontSize:20, marginLeft:'auto'}}>&#10005;</button>
                                </div>)
                                 : (<button href="" >Pridėti</button>)}
                            </li>
                        </ul>
                    </div>
                    <p style={{color:'green', marginLeft:150, marginTop:50}}>{success === true ? "Rinkinys yra suderinamas": ""}</p>
                    <p style={{color:'red', marginLeft:150, marginTop:50}}>{problems}</p>
                    <button onClick={magic} >Tikrinti suderinamumą</button>
        </div>
    );
}