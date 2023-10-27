// The Editor Field class is a generic container for a group of related items in an editor screen
import P5 from "p5";
import { CONSTANTS } from "./constants";

export default class EditorField {
    // Editor Field types:
    _x: number;
    _y: number;
    _height: number;
    _width: number;
    _label: string; // Temporary?
    _buttons: [];

    constructor(x: number, y: number, w: number, h: number, label?: string) {
        this._x = x;
        this._y = y;
        this._width = w;
        this._height = h;
        this._label = label || "Generic\nField";
        this._buttons = [];
    }

    render = (p5: P5) => {
        p5.fill("#0F0F0F");
        p5.stroke("green");
        p5.rect(this._x, this._y, this._width, this._height, 4, 4, 4, 4);
        p5.fill("red");
        p5.stroke(0);
        p5.textSize(48);
        p5.text(this._label, this._x + this._width / 2, this._y + 64);
    }
}