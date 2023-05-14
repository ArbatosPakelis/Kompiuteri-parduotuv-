import React, { useEffect, useState } from 'react';
import ComputerSetApi from '../Apis/ComputerSetApi';
import {useLocation} from "react-router-dom";
import {Button, Form} from "semantic-ui-react";
import { TextField } from '@mui/material';
import { red } from '@mui/material/colors';
export default function ComputerSetNewForm() {
    const [pavadinimas, setPavadinimas] = useState('');
    const [klaida, setKlaida] = useState('');

    const onClick = (e) => {
        e.preventDefault()

        const getData = async () => {
            try {
                const setApi = new ComputerSetApi();
                const response = await setApi.checkComputerSetDuplication(pavadinimas);
                if(pavadinimas !== ''){
                    if(response.data.ans < 1){
                        const response1 = await setApi.addComputerSet(pavadinimas);
                        window.location.href = 'http://localhost:3000/rinkiniai/'+ response1.data.id;
                    }
                    else{
                        setKlaida("Rinkinys su tokio pavadinimu jau egzistuoja")
                    }
                }
                else
                {
                    setKlaida("Įrašykite kažkokį pavadinimą")
                }
            } catch (err) {
                console.log(err.response.data.message)
            }
        };

        getData();
    }

    return (
    <form onSubmit={onClick}>
        <h2 style={{marginLeft:150, paddingTop:50}}> Rinkinio kūrimas </h2>
            <div style={{paddingLeft:150, paddingTop:10, paddingBottom:10}}>
                <TextField
                    sx={{
                        input: { color: 'white' },
                        "& .MuiInputLabel-root": {color: 'white'},//styles the label
                        "& .MuiOutlinedInput-root": {
                        "& > fieldset": { borderColor: "white" },
                        },
                    }}
                    label="Pavadinimas"
                    onChange={(e) => setPavadinimas(e.target.value)}
                />
            </div>

            <Button style={{marginLeft:150, marginTop:10}}>
                sukurti
            </Button>

            <p style={{color:'red', marginLeft:150, marginTop:50}}>{klaida}</p>
        </form>
    );
}