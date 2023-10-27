// The module builder is the first component of the World Builder Suite: A screen on which new modules can be designed and saved to the database
import P5 from "p5";
import Screen from "./screen";
import { CONSTANTS, ModuleInfo } from "./constants";
import { getModules, getOneModule, addNewModule } from "./server_functions";

export default class ModuleBuilder extends Screen {
    // Module Builder class types:
    modulesFromDatabase: [string, string][];
    loadedModule: ModuleInfo | null;
    getModules: (setter: (data?: []) => void) => void;
    getOneModule: (id: string, setter: (data?: ModuleInfo) => void) => void;
    addNewModule: (data: ModuleInfo) => void;

    constructor(switchScreen: (screen: string) => void) {
        super(switchScreen);
        this.modulesFromDatabase = [];
        this.loadedModule = null;           // By default no module is loaded
        this.getModules = getModules;
        this.getOneModule = getOneModule;
        this.addNewModule = addNewModule;
    }

    setup = () => {
        this.currentScreen = true;
        this.getModules(this.setModules);
        this.getOneModule("6505d7b4fa92111e5e312e22", this.setOneModule);
    }

    setModules = (data?: [string, string][]) => {
        if (data) {
            this.modulesFromDatabase = data;
        } else {
            console.log("ERROR: Unable to retrieve modules data from database.");
        }
    }

    setOneModule = (data?: ModuleInfo) => {
        if (data) {
            this.loadedModule = data;
        } else {
            console.log("ERROR: Failed to import module data from database.");
        }
    }

    render = (p5: P5) => {
        p5.background(0);
        p5.fill("red");
        p5.rect(200, 200, 100, 100);
    }

}