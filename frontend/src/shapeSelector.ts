// The Shape Selector is a small field in the Module Editor that holds the shape options used for painting a module's image
import P5 from "p5";
import EditorField from "./editorField";
import Button from "./button";
import { CONSTANTS } from "./constants";

export default class ShapeSelector extends EditorField {
    // Shape Selector type definitions:
    _currentShape: string;      // Can be an empty string, or "rect", "quad", "triangle", "ellipse" or "arc"
    _buttonX: number;
    _buttonY: number;
    _buttonMargin: number;
    _buttonWidth: number;
    _buttonColour: string;
    _setShape: (shape: string) => void; // Passed down from the Module Builder class

    constructor(x: number, y: number, w: number, h: number, setShape: (shape: string) => void) {
        super(x, y, w, h);
        this._currentShape = "";    // By default, no shape is selected
        this._buttonX = x + 50;
        this._buttonY = y + 10;
        this._buttonMargin = 60;
        this._buttonWidth = 60;
        this._buttonColour = CONSTANTS.colors.GREEN_LEAVES;
        this._setShape = setShape;
    }

    setup = () => {
        const rect = new Button("RECT", this._buttonX, this._buttonY, this.handleRect, this._buttonWidth, this._buttonWidth, "yellow", this._buttonColour, 16, "rect");
        this._buttons.push(rect);
        const quad = new Button("QUAD", this._buttonX + this._buttonWidth + this._buttonMargin, this._buttonY, this.handleQuad, this._buttonWidth, this._buttonWidth, "yellow", CONSTANTS.colors.PURPLE_LIGHT, 16, "quad");
        this._buttons.push(quad);
        const triangle = new Button("TRI", this._buttonX + this._buttonWidth * 2 + this._buttonMargin * 2, this._buttonY, this.handleTriangle, this._buttonWidth, this._buttonWidth, "yellow", CONSTANTS.colors.BLUE_SUNSET, 16, "triangle");
        this._buttons.push(triangle);
        const ellipse = new Button("ELLIPSE", this._buttonX + this._buttonWidth * 3 + this._buttonMargin * 3, this._buttonY, this.handleEllipse, this._buttonWidth, this._buttonWidth, "yellow", CONSTANTS.colors.RED_ROCK, 16, "ellipse");
        this._buttons.push(ellipse);
        const arc = new Button("ARC", this._buttonX + this._buttonWidth * 4 + this._buttonMargin * 4, this._buttonY - this._buttonWidth * 1 / 4, this.handleArc, this._buttonWidth, this._buttonWidth * 3 / 2, "yellow", CONSTANTS.colors.GRAY_DARK, 16, "arc");
        this._buttons.push(arc);
    }

    handleRect = () => {
        console.log("get rect scrub");
    }

    handleQuad = () => {
        console.log("quad errat demonstrandum, scrub");
    }

    handleTriangle = () => {
        console.log("it's a LOVE triangle");
    }

    handleEllipse = () => {
        console.log("it's come full circle");
    }

    handleArc = () => {
        console.log("the arc of history bends towards getting wrecked");
    }

    render = (p5: P5) => {
        p5.fill("#0F0F0F");
        p5.textSize(32);
        p5.stroke("green");
        p5.rect(this._x, this._y, this._width, this._height, 4, 4, 4, 4);
        this._buttons.forEach((btn) => {
            btn.render(p5);
        })
    }
}