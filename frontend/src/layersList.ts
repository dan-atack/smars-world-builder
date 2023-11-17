// The Layers List is a sub-component of the ModuleBuilder class, and contains a dynamic list of a module's shapes (and their render order)
import P5 from "p5";
import EditorField from "./editorField";
import Button from "./button";
import { CONSTANTS } from "./constants";

export default class LayersList extends EditorField {
    // Layers List types:
    _buttonX: number;
    _buttonY: number;
    _buttonWidth: number;
    _buttonHeight: number;
    _currentSerial: number;     // Used for identifying buttons
    _buttonClicked: boolean;    // Used to prevent multiple buttons from firing from a single click

    constructor(x: number, y: number, w: number, h: number, label?: string) {
        super(x, y, w, h, label);
        this._buttonX = this._x + 8;
        this._buttonY = this._y + 8;
        this._buttonWidth = 48;
        this._buttonHeight = 48;
        this._currentSerial = 0;        // Start at zero
        this._buttonClicked = false;    // Resting value for this field should always be false
    }

    setup = () => {
        console.log("Setting up layers list.");
    }

    // Custom click handler: Stops responding after the first response to avoid multiple button calls when buttons are rearranged
    handleClick = (mouseX: number, mouseY: number) => {
        this._buttons.forEach((button) => {
            if (!this._buttonClicked) {
                button.handleClick(mouseX, mouseY);
            }
        })
        this._buttonClicked = false;    // Reset the click-blocker after every click
    }

    // Called by the parent class; passes a pair of strings corresponding to the name and colour of a shape and makes a new button
    addShape = (shape: string, colour: string) => {
        const id = String(this._currentSerial);    // Label the button with a serial number for identification
        this._currentSerial++;
        const y = this._buttons.length * this._buttonHeight + this._buttonY + (8 * this._buttons.length);
        const button = new Button(id, this._buttonX, y, () => this.deleteShape(id), this._buttonWidth, this._buttonHeight, colour, colour, 22, shape);
        this._buttons.push(button);
    }

    // Called by an individual shape button to remove it from the stack
    deleteShape = (id: string) =>{
        console.log(`Deleting shape # ${id}`);
        // Filter out the shape from the list
        this._buttons = this._buttons.filter((btn) => btn._label !== id);
        // Rearrange existing buttons' positions
        this._buttons.forEach((btn, idx) => {
            btn._y = idx * this._buttonHeight + this._buttonY + (8 * idx);
        });
        this._buttonClicked = true;     // Set the button-clicked flag to true, to prevent other buttons from also firing
    }

    render = (p5: P5) => {
        p5.fill("#0F0F0F");
        p5.textSize(32);
        p5.stroke("green");
        p5.rect(this._x, this._y, this._width, this._height, 4, 4, 4, 4);
        this._buttons.forEach((btn) => {
            p5.fill("white");
            p5.stroke(CONSTANTS.colors.GREEN_TERMINAL);
            p5.strokeWeight(2);
            p5.rect(btn._x - 2, btn._y - 2, btn._width + 4, btn._height + 4);
            btn.render(p5);
        })
    }

}