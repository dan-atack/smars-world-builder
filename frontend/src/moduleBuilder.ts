// The module builder is the first component of the World Builder Suite: A screen on which new modules can be designed and saved to the database
import P5 from "p5";
import Screen from "./screen";
import Navbar from "./navbar";
import ColourPalette from "./colourPalette";
import InputsArea from "./inputsArea";
import LayersList from "./layersList";
import ModuleCanvas from "./moduleCanvas";
import ShapeSelector from "./shapeSelector";
import { CONSTANTS, ModuleInfo, Shape } from "./constants";
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
    _mouseContext: string;  // Used to keep track of which shape (if any) is being created
    _mouseClicks: number;   // Used to keep track of the number of clicks that have occurred in a shape placement sequence
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
        this._moduleCanvas = new ModuleCanvas(CONSTANTS.NAVBAR_X, CONSTANTS.NAVBAR_HEIGHT, CONSTANTS.NAVBAR_WIDTH - CONSTANTS.NAVBAR_X, CONSTANTS.SCREEN_HEIGHT - CONSTANTS.NAVBAR_HEIGHT * 2, "CANVAS");
        this._shapeSelector = new ShapeSelector(CONSTANTS.NAVBAR_X, CONSTANTS.SCREEN_HEIGHT - CONSTANTS.NAVBAR_HEIGHT, CONSTANTS.NAVBAR_WIDTH - CONSTANTS.NAVBAR_X, CONSTANTS.NAVBAR_HEIGHT, this.setShape);
        this._currentColour = "#000000";        // Black by default
        this._currentShape = "";                // No shape by default
        this._mouseContext = "default";         // Default to regular mouse context (no shape placement)
        this._mouseClicks = 0;                  // Only keep track of mouse clicks during shape placement
        this.modulesFromDatabase = [];
        this.loadedModule = null;               // By default no module is loaded
        this.getModules = getModules;
        this.getOneModule = getOneModule;
        this.addNewModule = addNewModule;
    }

    // SECTION 1: Basic Setup

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

    // SECTION 2: Setter Methods (Passed down to subcomponents)

    // Updates the module data whenever a change is detected from any of the editor's sub-components
    setModuleData = (data: ModuleInfo) => {
        this._data = data;
        // Propagate change to the canvas if width or height are affected
        this._moduleCanvas.updateCanvasSize(data.width, data.height);
    }

    // Takes the current colour from the colour palette component
    setColour = (colour: string) => {
        this._currentColour = colour;
        console.log(this._currentColour);
    }

    // Sets the shape about to be rendered in the canvas area, and sets mouse context
    setShape = (shape: string) => {
        console.log(`Setting shape: ${shape}`);
        this._currentShape = shape;
        const context: string = `place-${shape}`;
        this.setMouseContext(context);
        this._moduleCanvas.setCurrentShape(this._currentShape, this._colourPalette.currentColour);  // Pass the shape and colour to the module canvas component
    }

    // Cancels the current shape selection
    resetShape = () => {
        this._currentShape = "";
        this._mouseContext = "default";
        this._mouseClicks = 0;
    }

    // SECTION 3: Click Handlers & Mouse Context

    handleClick = (x: number, y: number) => {
        // If mouse context is for shape placement, run shape placement method
        const onCanvas = x > this._moduleCanvas._x && x < this._moduleCanvas._x + this._moduleCanvas._width && y > this._moduleCanvas._y && y < this._moduleCanvas._y + this._moduleCanvas._height;
        if (onCanvas) {
            this.handleShapePlacement(x, y);
        }
        // Next, check if any of the side panels have been clicked, and activate their button handlers
        this._shapeSelector.handleClick(x, y);
        this._navbar.handleClick(x, y);
        this._colourPalette.handleClick(x, y);
        // Finally, log the entire data object to the console for maximum data visibility
        console.log(this._data);
    }

    // Sets the context and resets the click counter
    setMouseContext = (context: string) => {
        this._mouseContext = context;
        this._mouseClicks = 0;      // Reset
    }

    // SECTION 4: Shape placement method (top-level - the deep functionality is in the canvas element)

    // Passes mouse coords to the canvas element; it returns the data for finished shapes (or a null if the shape isn't ready)

    handleShapePlacement = (x: number, y: number) => {
        let shape: Shape | null = null;
        switch (this._mouseContext) {
            case "place-rect":
                shape = this._moduleCanvas.handleRect(this._mouseClicks, x, y);
                break;
            case "place-quad":
                shape = this._moduleCanvas.handleQuad(this._mouseClicks, x, y);
                break;
            case "place-triangle":
                shape = this._moduleCanvas.handleTriangle(this._mouseClicks, x, y);
                break;
            case "place-ellipse":
                this._moduleCanvas.handleEllipse(this._mouseClicks, x, y);
                break;
            case "place-arc":
                this._moduleCanvas.handleArc(this._mouseClicks, x, y);
                break;
            case "default":
                // No shape selected
                break;
            default:
                console.log(`ERROR: Unrecognized mouse context: ${this._mouseContext}`);
                this._mouseContext = "default";
        }
        if (shape) {
            console.log("Shape completed. Adding to shapes stack");
            this._data.shapes.push(shape);
            this.resetShape();
        } else {
            this._mouseClicks ++;   // If the shape isn't returned, augment mouse click counter
        }
    }

    // SECTION 5: Module Data Loading methods

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
        // Render the Module Canvas with additional arguments if a new shape is being placed right now
        if (this._currentShape) {
            this._moduleCanvas.render(p5, p5.mouseX, p5.mouseY, this._mouseClicks);
        } else {
            this._moduleCanvas.render(p5);
        }
        this._shapeSelector.render(p5);
    }

}