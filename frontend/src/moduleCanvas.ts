// The Module Canvas is the sub-component of the ModuleBuilder class on which the user 'paints' the shapes for a new module
import P5 from "p5";
import { CONSTANTS } from "./constants";
import EditorField from "./editorField";

export default class ModuleCanvas extends EditorField {
    // Module Canvas types:
    _topMargin: number;     // Margins are in terms of pixels
    _leftMargin: number;
    _moduleWidth: number;   // Width is in terms of grid spaces in the actual game
    _moduleHeight: number;
    _scale: number;         // Ratio of pixels in the canvas to the real size of the module being painted (> 1 = canvas is blown up)
    _smarsModuleWidth;      // From SMARS' frontend constants; used to translate module w/h values to editor screen pixels

    constructor(x: number, y: number, w: number, h: number, label?: string) {
        super(x, y, w, h, label);
        this._topMargin = 24;
        this._leftMargin = 24;
        this._moduleWidth = 1;
        this._moduleHeight = 1;
        this._scale = 3;                    // Scale starts at 3x magnification, but will decrease if the user requests a very large module
        this._smarsModuleWidth = 20;        // Taken from SMARS repo: frontend/src/constants.ts
    }

    setup = () => {
        this._buttons = [];
    }

    updateCanvas = (w: number, h: number) => {
        this._moduleWidth = w;
        this._moduleHeight = h;
        if (this._moduleWidth > 10 || this._moduleHeight > 10) {      // TODO: Complete the thought here by making a switch case and setting limits
            this._scale = 2;
        } else {
            this._scale = 3;
        }
    }

    render = (p5: P5) => {
        p5.fill("#0F0F0F");
        p5.stroke("green");
        p5.rect(this._x, this._y, this._width, this._height, 4, 4, 4, 4);
        p5.fill(CONSTANTS.colors.GREEN_DARK);
        p5.rect(this._x + this._topMargin, this._y + this._leftMargin, this._moduleWidth * this._smarsModuleWidth * this._scale, this._moduleHeight * this._smarsModuleWidth * this._scale);
    }

}