// The module builder is the first component of the World Builder Suite: A screen on which new modules can be designed and saved to the database
import P5 from "p5";
import Screen from "./screen";
import Navbar from "./navbar";
import ColourPalette from "./colourPalette";
import InputsArea from "./inputsArea";
import LayersList from "./layersList";
import ModuleCanvas from "./moduleCanvas";
import ShapeSelector from "./shapeSelector";
import { CONSTANTS, ModuleInfo } from "./constants";
import { getModules, getOneModule, addNewModule } from "./server_functions";

export default class ModuleBuilder extends Screen {
    // Module Builder class types:
    _data: ModuleInfo;                      // The data object for the module being designed
    _navbar: Navbar;
    _colourPalette: ColourPalette;
    _inputsArea: InputsArea;
    _layersList: LayersList;
    _moduleCanvas: ModuleCanvas;
    _shapeSelector: ShapeSelector;
    _currentColour: string;
    _currentShape: string;
    modulesFromDatabase: [string, string][];
    loadedModule: ModuleInfo | null;
    getModules: (setter: (data?: []) => void) => void;
    getOneModule: (id: string, setter: (data?: ModuleInfo) => void) => void;
    addNewModule: (data: ModuleInfo) => void;

    constructor(switchScreen: (screen: string) => void) {
        super(switchScreen);
        this._data = {          // Basic empty module data template
            name: "",
            width: 1,
            height: 1,
            type: "Test",
            pressurized: false,
            columnStrength: 0,
            durability: 100,
            buildCosts: [["money", 100]],
            maintenanceCosts: [],
            productionInputs: [],
            productionOutputs: [],
            storageCapacity: [],
            crewCapacity: 0,
            shapes: []
        };
        this._navbar = new Navbar(CONSTANTS.NAVBAR_X, 0, CONSTANTS.NAVBAR_WIDTH, CONSTANTS.NAVBAR_HEIGHT, switchScreen);
        this._colourPalette = new ColourPalette(0, 0, CONSTANTS.NAVBAR_X, CONSTANTS.SCREEN_HEIGHT, this.setColour);
        this._inputsArea = new InputsArea(CONSTANTS.NAVBAR_X + CONSTANTS.NAVBAR_WIDTH, 0, CONSTANTS.NAVBAR_X, CONSTANTS.SCREEN_HEIGHT, this.setModuleData);
        this._layersList = new LayersList(CONSTANTS.SCREEN_WIDTH - CONSTANTS.NAVBAR_X * 2, CONSTANTS.NAVBAR_HEIGHT, CONSTANTS.NAVBAR_X, CONSTANTS.SCREEN_HEIGHT - CONSTANTS.NAVBAR_HEIGHT, "LAYERS");
        this._moduleCanvas = new ModuleCanvas(CONSTANTS.NAVBAR_X, CONSTANTS.NAVBAR_HEIGHT, CONSTANTS.NAVBAR_WIDTH - CONSTANTS.NAVBAR_X, CONSTANTS.SCREEN_HEIGHT - CONSTANTS.NAVBAR_HEIGHT, "CANVAS");
        this._shapeSelector = new ShapeSelector(CONSTANTS.NAVBAR_X, CONSTANTS.SCREEN_HEIGHT - CONSTANTS.NAVBAR_HEIGHT, CONSTANTS.NAVBAR_WIDTH - CONSTANTS.NAVBAR_X, CONSTANTS.NAVBAR_HEIGHT, this.setShape);
        this._currentColour = "#000000";        // Black by default
        this._currentShape = "";                // No shape by default
        this.modulesFromDatabase = [];
        this.loadedModule = null;               // By default no module is loaded
        this.getModules = getModules;
        this.getOneModule = getOneModule;
        this.addNewModule = addNewModule;
    }

    // SECTION 1: Basic Setup and updater methods

    setup = (p5: P5) => {
        this.currentScreen = true;
        this._navbar.setup();
        this._colourPalette.setup();
        this._inputsArea.setup(p5);
        this._layersList.setup();
        this._moduleCanvas.setup();
        this._shapeSelector.setup();
        this.getModules(this.setModules);
    }

    // Updates the module data whenever a change is detected from any of the editor's sub-components
    setModuleData = (data: ModuleInfo) => {
        this._data = data;
        // Propagate change to the canvas if width or height are affected
        this._moduleCanvas.updateCanvas(data.width, data.height);
    }

    // Takes the current colour from the colour palette component
    setColour = (colour: string) => {
        this._currentColour = colour;
        console.log(this._currentColour);
    }

    // Sets the shape about to be rendered in the canvas area
    setShape = (shape: string) => {
        console.log(shape);
    }

    // SECTION 2: Click Handlers

    handleClick = (x: number, y: number) => {
        // Send click data to subcomponents to activate their button handlers
        this._navbar.handleClick(x, y);
        this._colourPalette.handleClick(x, y);
        this._shapeSelector.handleClick(x, y);
    }

    // SECTION 3: Module Data Loading methods

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
        this._shapeSelector.render(p5);
    }

}