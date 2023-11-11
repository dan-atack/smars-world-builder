// The module builder is the first component of the World Builder Suite: A screen on which new modules can be designed and saved to the database
import P5 from "p5";
import Screen from "./screen";
import Navbar from "./navbar";
import ColourPalette from "./colourPalette";
import InputsArea from "./inputsArea";
import LayersList from "./layersList";
import ModuleCanvas from "./moduleCanvas";
import ShapeSelector from "./shapeSelector";
import ShapeOptions from "./shapeOptions";
import { CONSTANTS, ModuleInfo, Resource, Shape } from "./constants";
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
    _shapeOptions: ShapeOptions;
    _currentColour: string;
    _currentShape: string;
    _mouseContext: string;  // Used to keep track of which shape (if any) is being created
    _mouseClicks: number;   // Used to keep track of the number of clicks that have occurred in a shape placement sequence
    _circleMode: boolean;   // Used to tell the module canvas to paint only perfect circles (true) or to allow ellipses (false)
    _arcMode: string;       // For arcs; either 'CHORD', 'OPEN', or 'PIE'
    _gridSnap: number;      // How many pixels to 'snap to' when creating new shapes
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
        this._inputsArea = new InputsArea(CONSTANTS.NAVBAR_X + CONSTANTS.NAVBAR_WIDTH, 0, CONSTANTS.NAVBAR_X, CONSTANTS.SCREEN_HEIGHT, this.setModuleData, this.addResource);
        this._layersList = new LayersList(CONSTANTS.SCREEN_WIDTH - CONSTANTS.NAVBAR_X * 2, CONSTANTS.NAVBAR_HEIGHT, CONSTANTS.NAVBAR_X, CONSTANTS.SCREEN_HEIGHT - CONSTANTS.NAVBAR_HEIGHT * 2, "LAYERS");
        this._moduleCanvas = new ModuleCanvas(CONSTANTS.NAVBAR_X, CONSTANTS.NAVBAR_HEIGHT, CONSTANTS.NAVBAR_WIDTH - CONSTANTS.NAVBAR_X, CONSTANTS.SCREEN_HEIGHT - CONSTANTS.NAVBAR_HEIGHT * 2, "CANVAS");
        this._shapeSelector = new ShapeSelector(CONSTANTS.NAVBAR_X, CONSTANTS.SCREEN_HEIGHT - CONSTANTS.NAVBAR_HEIGHT, CONSTANTS.NAVBAR_WIDTH - CONSTANTS.NAVBAR_X, CONSTANTS.NAVBAR_HEIGHT, this.setShape);
        this._shapeOptions = new ShapeOptions(CONSTANTS.NAVBAR_X + CONSTANTS.NAVBAR_WIDTH - CONSTANTS.NAVBAR_X, CONSTANTS.SCREEN_HEIGHT - CONSTANTS.NAVBAR_HEIGHT, CONSTANTS.NAVBAR_X, CONSTANTS.NAVBAR_HEIGHT, this.setCircleMode, this.setArcMode, this.setGridSnap);
        this._currentColour = "#000000";        // Black by default
        this._currentShape = "";                // No shape by default
        this._mouseContext = "default";         // Default to regular mouse context (no shape placement)
        this._mouseClicks = 0;                  // Only keep track of mouse clicks during shape placement
        this._circleMode = false;               // By default, the ellipse button will produce an ellipse
        this._arcMode = "CHORD";                // All arcs are 'chord' style by default
        this._gridSnap = 1;                     // 1 pixel (no snap) is default
        this.modulesFromDatabase = [];
        this.loadedModule = null;               // By default no module is loaded
        this.getModules = getModules;
        this.getOneModule = getOneModule;
        this.addNewModule = addNewModule;
    }

    // STILL TODO:
    // - Resource inputs
    // - Layers display? Very quickly, maybe?

    // SECTION 1: Basic Setup

    setup = (p5: P5) => {
        this.currentScreen = true;
        this._navbar.setup();
        this._colourPalette.setup();
        this._inputsArea.setup(p5);
        this._layersList.setup();
        this._moduleCanvas.setup();
        this._shapeSelector.setup();
        this._shapeOptions.setup(p5);
        this.getModules(this.setModules);
    }

    // SECTION 2: Setter Methods (Passed down to subcomponents)

    // Updates the module data whenever a change is detected from any of the editor's sub-components
    setModuleData = (data: ModuleInfo) => {
        this._data = data;
        // Propagate change to the canvas if width or height are affected
        this._moduleCanvas.updateCanvasSize(data.width, data.height);
    }

    // Passed to the Inputs area; adds a Resource to the new module's storage/maintenance/inputs/outputs field when a value is given
    addResource = (category: string, resource: Resource) => {
        switch (category) {
            case "storage":
                // Filter out any previous entries for the resource (based on its name) then replace with the new value
                this._data.storageCapacity = this._data.storageCapacity.filter((res) => res[0] !== resource[0]);
                if (resource[1] > 0) this._data.storageCapacity.push(resource);     // Only add the resource if its quantity is > 0
                break;
            case "maintenance":
                this._data.maintenanceCosts = this._data.maintenanceCosts.filter((res) => res[0] !== resource[0]);
                if (resource[1] > 0) this._data.maintenanceCosts.push(resource);
                break;
            case "input":
                if (this._data.productionInputs) {
                    this._data.productionInputs = this._data.productionInputs.filter((res) => res[0] !== resource[0]);
                    if (resource[1] > 0) this._data.productionInputs.push(resource);
                }
                break;
            case "output":
                if (this._data.productionOutputs) {
                    this._data.productionOutputs = this._data.productionOutputs.filter((res) => res[0] !== resource[0]);
                    if (resource[1] > 0) this._data.productionOutputs.push(resource);
                }
                break;
            default:
                console.log(`WARNING: Unrecognized resource category ${category} detected.`);
        }
        // If a resource's quantity is zero, remove that resource from the category in question
        
    }   

    // Takes the current colour from the colour palette component
    setColour = (colour: string) => {
        this._currentColour = colour;
    }

    // Sets the shape about to be rendered in the canvas area, and sets mouse context
    setShape = (shape: string) => {
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

    // Toggles the status of the perfect circle mode (activated by a button in the Shape Options component)
    setCircleMode = () => {
        if (this._circleMode) {
            this._circleMode = false;
            this._shapeOptions._buttons[0].setSelected(false);
        } else {
            this._circleMode = true;
            this._shapeOptions._buttons[0].setSelected(true);
        }
        this._moduleCanvas.setPerfectCircleMode(this._circleMode);  // Pass on the message to the canvas component
    }

    setArcMode = (mode: string) => {
        if (mode === "PIE" || mode === "CHORD" || mode === "OPEN") {
            this._arcMode = mode;
        } else {
            console.log(`WARNING: Unrecognized arc mode requested: ${mode}. Overriding with 'CHORD'`)
            this._arcMode = "CHORD";
        }
        this._moduleCanvas.setArcMode(this._arcMode);       // Pass on the message to the canvas component!
    }

    setGridSnap = (pixels: number) => {
        this._gridSnap = pixels;
        this._moduleCanvas.setGridSnap(this._gridSnap);       // Pass on the message to the canvas component!
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
        this._shapeOptions.handleClick(x, y);
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
                shape = this._moduleCanvas.handleEllipse(this._mouseClicks, x, y);
                break;
            case "place-arc":
                shape = this._moduleCanvas.handleArc(this._mouseClicks, x, y, this._arcMode);
                break;
            case "default":
                // No shape selected
                break;
            default:
                console.log(`ERROR: Unrecognized mouse context: ${this._mouseContext}`);
                this._mouseContext = "default";
        }
        if (shape) {
            console.log(`${shape.shape} completed. Adding to shapes stack`);
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
        this._shapeOptions.render(p5);
        // Render the Module Canvas with additional arguments if a new shape is being placed right now
        if (this._currentShape) {
            this._moduleCanvas.render(p5, p5.mouseX, p5.mouseY, this._mouseClicks);
        } else {
            this._moduleCanvas.render(p5);
        }
        this._shapeSelector.render(p5);
    }

}