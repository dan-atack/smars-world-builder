// The Shape Options field holds buttons for setting custom parameters when placing shapes in the Module Canvas
import P5 from "p5";
import EditorField from "./editorField";
import Button from "./button";
import { CONSTANTS } from "./constants";

export default class ShapeOptions extends EditorField {
    // Shape Options class type definitions:
    _buttonX: number;
    _buttonY: number;
    _buttonMargin: number;
    _buttonWidth: number;
    setCircleMode: () => void;  // Setter method from the Module Builder class (works as a toggle switch)

    constructor (x: number, y: number, w: number, h: number, setCircleMode: () => void) {
        super(x, y, w, h);
        this._buttonX = this._x + 40;
        this._buttonY = this._y + 10;
        this._buttonMargin = 40;
        this._buttonWidth = 60;
        this.setCircleMode = setCircleMode;
    }

    setup = () => {
        const circleMode = new Button("P.\nCircle", this._buttonX, this._buttonY, this.handleCircleMode, this._buttonWidth, this._buttonWidth, CONSTANTS.colors.GREEN_TERMINAL, CONSTANTS.colors.GRAY_DARK, 24, "ellipse");
        this._buttons.push(circleMode);
    }

    // Toggle button; sends a signal to the ModuleBuilder class (button is agnostic about current value)
    handleCircleMode = () => {
        this.setCircleMode();
    }

    render = (p5: P5) => {
        p5.fill("#0F0F0F");
        p5.stroke("green");
        p5.rect(this._x, this._y, this._width, this._height, 4, 4, 4, 4);
        this._buttons.forEach((button) => {
            button.render(p5);
        });
    }

}