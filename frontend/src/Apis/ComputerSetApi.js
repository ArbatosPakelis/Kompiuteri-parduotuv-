import Api from "./api";

export default class ComputerSetApi extends Api {
    getComputerSets = () => {
        return super.init().get(`/computerSet/getComputerSets`);
    };
    getComputerSet = (id_Kompiuterio_rinkinys) => {
        return super.init().get(`/computerSet/getComputerSet?id_Kompiuterio_rinkinys=${id_Kompiuterio_rinkinys}`);
    };
    addComputerSet = (pavadinimas) => {
        return super.init().post(`/computerSet/addComputerSet?pavadinimas=${pavadinimas}&fk_Naudotojasid_Naudotojas=1`);
    };
    checkComputerSetDuplication = (pavadinimas) => {
        return super.init().get(`/computerSet/checkComputerSetDuplication?pavadinimas=${pavadinimas}`);
    };
    compatibility = (id_Kompiuterio_rinkinys) => {
        return super.init().get(`/computerSet/compatibility?id=${id_Kompiuterio_rinkinys}`);
    };
    generateSet = (tipas) => {
        return super.init().get(`/computerSet/generateComputer?type=${tipas}`);
    };
    generateSetToForm = (id_Detale, id_Kompiuterio_rinkinys) => {
        return super.init().get(`/computerSet/generateToComputerSetForm?kiekis=1&id_Rinkinio_detale=${id_Detale}&fk_Kompiuterio_rinkinysid_Kompiuterio_rinkinys=${id_Kompiuterio_rinkinys}&fk_Detaleid_Detale=${id_Detale}`);
    };
    updateComputerSet = (id_Detale, id_Kompiuterio_rinkinys) => {
        return super.init().get(`/computerSet/updateComputerSet?kiekis=1&fk_Kompiuterio_rinkinysid_Kompiuterio_rinkinys=${id_Kompiuterio_rinkinys}&fk_Detaleid_Detale=${id_Detale}`);
    };


    //computerSet/updateComputerSet?kiekis=5&id_Rinkinio_detale=92&fk_Kompiuterio_rinkinysid_Kompiuterio_rinkinys=4&fk_Detaleid_Detale=87
}