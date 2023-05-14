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

}