import P5 from "p5";
import { CONSTANTS } from "./constants";

export default class Button {
    // Define types for button attributes:
    _label: string;
    _shape: string;         // Corresponds to one of the 5 basic P5 shape types (rect, quad, triangle, ellipse or arc)
    _x: number;
    _y: number;
    _width: number;         // Optional aesthetic overrides
    _height: number;
    _color: string;
    _bgColor: string;
    _fontSize: number;
    _selected: boolean;     // Use to add an extra thick barrier
    handler: () => void;
 

    constructor(label: string, x: number, y: number, handler: () => void, w: number = 256, h: number = 128, color: string = "black", bgColor = "white", fontSize: number = 36, shape: string = "rect") {
        this._label = label;
        this._shape = shape
        this._x = x;
        this._y = y;
        this._width = w;
        this._height = h;
        this._color = color;
        this._bgColor = bgColor;
        this._fontSize = fontSize;
        // Use smaller font if label is longer than 32 characters
        if (this._label.length > 32) this._fontSize = this._fontSize * 3 / 4;
        this._selected = false; // Not set by the constructor
        this.handler = handler;
    }

    handleClick = (mouseX: number, mouseY: number) => {
        // Establish that click is within button's borders:
        const xMatch = mouseX >= this._x && mouseX < this._x + this._width;
        const yMatch = mouseY >= this._y && mouseY < this._y + this._height;
        if (xMatch && yMatch) {
            this.handler();
        }
    }

    setSelected = (selected: boolean) => {
        this._selected = selected;
    }

    render = (p5: P5) => {
        p5.strokeWeight(4);
        p5.stroke(0);
        // Render borders thicker and in font colour if button is 'selected':
        if (this._selected) {
            p5.strokeWeight(8);
            p5.stroke(this._color);
        }
        p5.fill(this._bgColor);    // Button BG color
        // TODO: Impement switch case to render buttons with different shapes
        p5.rect(this._x, this._y, this._width, this._height, 8, 8, 8, 8);
        p5.strokeWeight(2); // Reset stroke weight before button text is rendered
        p5.stroke(0);
        p5.textSize(this._fontSize);
        p5.textStyle(p5.BOLD);
        p5.fill(this._color);   // Text color
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(this._label, this._x + this._width / 2, this._y + this._height / 2);
    }

}