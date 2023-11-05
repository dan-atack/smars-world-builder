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
    setArcMode: (mode: string) => void; // Setter method from the MB class to set arc mode (to PIE, OPEN or CHORD)

    constructor (x: number, y: number, w: number, h: number, setCircleMode: () => void, setArcMode: (mode: string) => void) {
        super(x, y, w, h);
        this._buttonX = this._x + 16;
        this._buttonY = this._y + 10;
        this._buttonMargin = 16;
        this._buttonWidth = 52;
        this.setCircleMode = setCircleMode;
        this.setArcMode = setArcMode;
    }

    setup = () => {
        const circleMode = new Button("Circle\nMode", this._buttonX, this._buttonY, this.handleCircleMode, this._buttonWidth, this._buttonWidth, CONSTANTS.colors.GREEN_TERMINAL, CONSTANTS.colors.GREEN_DARK, 16, "ellipse");
        this._buttons.push(circleMode);
        const chord = new Button("CHORD", this._buttonX + this._buttonMargin + this._buttonWidth, this._buttonY, this.handleArcChord, this._buttonWidth, this._buttonWidth, CONSTANTS.colors.GREEN_TERMINAL, CONSTANTS.colors.RED_ROCK, 14, "arc");
        this._buttons.push(chord);
        const pie = new Button("PIE", this._buttonX + this._buttonMargin * 2 + this._buttonWidth * 2, this._buttonY, this.handleArcPie, this._buttonWidth, this._buttonWidth, CONSTANTS.colors.GREEN_TERMINAL, CONSTANTS.colors.ORANGE_COPPER, 16, "arc-pie");
        this._buttons.push(pie);
        const open = new Button("OPEN", this._buttonX + this._buttonMargin * 3 + this._buttonWidth * 3, this._buttonY, this.handleArcOpen, this._buttonWidth, this._buttonWidth, CONSTANTS.colors.GREEN_TERMINAL, CONSTANTS.colors.YELLOW_SKY, 14, "arc-open");
        this._buttons.push(open);
        this._buttons[1].setSelected(true);     // By default set the CHORD button to selected status, as it is the default value
        // TODO: Add grid-snap feature as numerical value input field?? (0 = no snap, 1 = snap to nearest pixel, 2 = nearest 2 pixels, etc...)
    }

    // Toggle button; sends a signal to the ModuleBuilder class (button is agnostic about current value)
    handleCircleMode = () => {
        this.setCircleMode();
    }

    // Sets arc style to 'CHORD' mode (AKA regular mode??)
    handleArcChord = () => {
        this._buttons[1].setSelected(true);
        this._buttons[2].setSelected(false);
        this._buttons[3].setSelected(false);
        this.setArcMode("CHORD");
    }

    // Sets arc style to 'PIE' mode (AKA Pakman mode)
    handleArcPie = () => {
        this._buttons[1].setSelected(false);
        this._buttons[2].setSelected(true);
        this._buttons[3].setSelected(false);
        this.setArcMode("PIE");
    }

    // Sets are style to 'OPEN' mode
    handleArcOpen = () => {
        this._buttons[1].setSelected(false);
        this._buttons[2].setSelected(false);
        this._buttons[3].setSelected(true);
        this.setArcMode("OPEN");
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