// A sub-component of the ModuleBuilder class, the Colour Palette holds the buttons that change the current colour swatch
import P5 from "p5";
import EditorField from "./editorField";
import Button from "./button";
import { CONSTANTS } from "./constants";

export default class ColourPalette extends EditorField{
    // Colour palette types:
    currentColour: string;
    _optionWidth: number;       // Width of each colour option, in pixels
    _optionMargin: number;      // Distance between options, and from the sides of the box
    _optionsPerRow: number;     // Amount of options to show, per row

    constructor(x: number, y: number, w: number, h: number, label?: string) {
        super(x, y, w, h, label);
        this._optionWidth = 40;
        this._optionMargin = 30;
        this._optionsPerRow = 4;
        this.currentColour = "#000000";     // Black is selected by default
    }

    // Load colour options during setup
    setup = () => {
            this._buttons = [];     // Reset buttons list whenever setup function is initiated
        Object.values(CONSTANTS.colors).forEach((color, idx) => {
            const x = (this._x + this._optionMargin + this._optionWidth) * ((idx % this._optionsPerRow) + 0.5);
            const y = (this._y + this._optionMargin + this._optionWidth) * (Math.floor(idx / this._optionsPerRow) + 0.5);
            const button = new Button("", x, y, () => this.handleColourSelection(color), this._optionWidth, this._optionWidth, color, color, 20, "ellipse");
            this._buttons.push(button);
        })
        console.log("Colour your world.");
    }

    handleColourSelection = (colour: string) => {
        this.currentColour = colour;
    }

    render = (p5: P5) => {
        p5.fill("#0F0F0F");
        p5.stroke("green");
        p5.rect(this._x, this._y, this._width, this._height, 4, 4, 4, 4);
        this._buttons.forEach((button) => {
            button.render(p5);
        })
    }

}