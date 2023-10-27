// The module builder is the first component of the World Builder Suite: A screen on which new modules can be designed and saved to the database
import P5 from "p5";
import Screen from "./screen";
import Navbar from "./navbar";
import ColourPalette from "./colourPalette";
import InputsArea from "./inputsArea";
import LayersList from "./layersList";
import ModuleCanvas from "./moduleCanvas";
import { CONSTANTS, ModuleInfo } from "./constants";
import { getModules, getOneModule, addNewModule } from "./server_functions";

export default class ModuleBuilder extends Screen {
    // Module Builder class types:
    _navbar: Navbar;
    _colourPalette: ColourPalette;
    _inputsArea: InputsArea;
    _layersList: LayersList;
    _moduleCanvas: ModuleCanvas;
    modulesFromDatabase: [string, string][];
    loadedModule: ModuleInfo | null;
    getModules: (setter: (data?: []) => void) => void;
    getOneModule: (id: string, setter: (data?: ModuleInfo) => void) => void;
    addNewModule: (data: ModuleInfo) => void;

    constructor(switchScreen: (screen: string) => void) {
        super(switchScreen);
        this._navbar = new Navbar(CONSTANTS.NAVBAR_X, 0, CONSTANTS.NAVBAR_WIDTH, CONSTANTS.NAVBAR_HEIGHT, "NAVBAR");
        this._colourPalette = new ColourPalette(0, 0, CONSTANTS.NAVBAR_X, CONSTANTS.SCREEN_HEIGHT, "PALETTE");
        this._inputsArea = new InputsArea(CONSTANTS.NAVBAR_X + CONSTANTS.NAVBAR_WIDTH, 0, CONSTANTS.NAVBAR_X, CONSTANTS.SCREEN_HEIGHT, "INPUTS");
        this._layersList = new LayersList(CONSTANTS.SCREEN_WIDTH - CONSTANTS.NAVBAR_X * 2, CONSTANTS.NAVBAR_HEIGHT, CONSTANTS.NAVBAR_X, CONSTANTS.SCREEN_HEIGHT - CONSTANTS.NAVBAR_HEIGHT, "LAYERS");
        this._moduleCanvas = new ModuleCanvas(CONSTANTS.NAVBAR_X, CONSTANTS.NAVBAR_HEIGHT, CONSTANTS.NAVBAR_WIDTH - CONSTANTS.NAVBAR_X, CONSTANTS.SCREEN_HEIGHT - CONSTANTS.NAVBAR_HEIGHT, "CANVAS");
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
        this._navbar.render(p5);
        this._colourPalette.render(p5);
        this._inputsArea.render(p5);
        this._layersList.render(p5);
        this._moduleCanvas.render(p5);
    }

}