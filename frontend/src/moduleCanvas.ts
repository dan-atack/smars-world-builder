// The Module Canvas is the sub-component of the ModuleBuilder class on which the user 'paints' the shapes for a new module
import P5 from "p5";
import { CONSTANTS, ModuleInfo, Shape } from "./constants";
import EditorField from "./editorField";

export default class ModuleCanvas extends EditorField {
    // Module Canvas types:
    _topMargin: number;     // Margins are in terms of pixels
    _leftMargin: number;
    _moduleWidth: number;   // Width is in terms of grid spaces in the actual game
    _moduleHeight: number;
    _scale: number;         // Ratio of pixels in the canvas to the real size of the module being painted (> 1 = canvas is blown up)
    _smarsModuleWidth;      // From SMARS' frontend constants; used to translate module w/h values to editor screen pixels
    _currentlyDrawing: Shape | null;

    constructor(x: number, y: number, w: number, h: number, label?: string) {
        super(x, y, w, h, label);
        this._topMargin = 24;
        this._leftMargin = 24;
        this._moduleWidth = 1;
        this._moduleHeight = 1;
        this._scale = 3;                    // Scale starts at 3x magnification, but will decrease if the user requests a very large module
        this._smarsModuleWidth = 20;        // Taken from SMARS repo: frontend/src/constants.ts
        this._currentlyDrawing = null;      // By default, no shapes are being drawn
    }

    setup = () => {
        this._buttons = [];
    }

    // SECTION 1: Canvas dimensions updater

    // Increases/decreases the canvas in either vertical or horizontal direction
    updateCanvasSize = (w: number, h: number) => {
        this._moduleWidth = w;
        this._moduleHeight = h;
        if (this._moduleWidth > 10 || this._moduleHeight > 10) {      // TODO: Complete the thought here by making a switch case and setting limits
            this._scale = 2;
        } else {
            this._scale = 3;
        }
    }

    // SECTION 2: Click Handlers for shape creation
    handleClick = (mouseX: number, mouseY: number) => {
        if (this._currentlyDrawing !== null) {
            switch (this._currentlyDrawing.shape) {
                case
                 "rect":
                    console.log("Drawing rect");
                    break;
                case "quad":
                    console.log("Drawing quad");
                    break;
                case "triangle":
                    console.log("Drawing triangle");
                    break;
                case "ellipse":
                    console.log("Drawing ellipse");
                    break;
                case "arc":
                    console.log("Drawing arc");
                    break;
                default:
                    console.log(`ERROR: Unrecognized shape requested: ${this._currentlyDrawing.shape}`);
            }
        }
    }

    handleRect = (click: number, mouseX: number, mouseY: number) => {
        switch (click) {
            case 0:
                // TODO: Convert pixel location to grid location
                console.log(`(${mouseX}, ${mouseY})`);
                return null;        // If the shape isn't ready yet, return a null
            case 1:
                console.log(`(${mouseX}, ${mouseY})`);
                return this._currentlyDrawing;
            default:
                console.log("ERROR: Too many clicks... Or were you trying to round the corners?");
                return null;        // If the click number is invalid return null
        }
    }

    // SECTION 3: Shape Creation methods

    // Called by the ModuleBuilder class when the user selects a shape from the (aptly named) shape selector panel; creates a new shape template
    setCurrentShape = (shape: string, color: string) => {
        this._currentlyDrawing = {      // Create a new shape object, and give it the name and shape from the parent class
            shape: shape,
            color: color,
            params: []
        }
    }

    renderRectPlacement = (p5: P5, mouseX: number, mouseY: number, clickNumber: number) => {
        switch (clickNumber) {
            case 0:
                break;
        }
        // Follow the mouse cursor with a green circle
        p5.fill(CONSTANTS.colors.GREEN_TERMINAL);
        p5.ellipse(mouseX, mouseY, 8);
    }

    render = (p5: P5) => {
        p5.fill("#0F0F0F");
        p5.stroke("green");
        p5.rect(this._x, this._y, this._width, this._height, 4, 4, 4, 4);
        p5.fill(CONSTANTS.colors.GREEN_DARK);
        p5.rect(this._x + this._topMargin, this._y + this._leftMargin, this._moduleWidth * this._smarsModuleWidth * this._scale, this._moduleHeight * this._smarsModuleWidth * this._scale);
    }

}