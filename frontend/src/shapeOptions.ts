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
    _gridSnap: P5.Element | null;           // Grid-snap input field
    setCircleMode: () => void;              // Setter method from the Module Builder class (works as a toggle switch)
    setArcMode: (mode: string) => void;     // Setter method from the MB class to set arc mode (to PIE, OPEN or CHORD)
    setGridSnap: (pixels: number) => void;  // Setter method from the MB class to set grid snap resolution

    constructor (x: number, y: number, w: number, h: number, setCircleMode: () => void, setArcMode: (mode: string) => void, setGridSnap: (pixels: number) => void) {
        super(x, y, w, h);
        this._buttonX = this._x + 16;
        this._buttonY = this._y + 10;
        this._buttonMargin = 12;
        this._buttonWidth = 52;
        this._gridSnap = null;          // Created by setup method
        this.setCircleMode = setCircleMode;
        this.setArcMode = setArcMode;
        this.setGridSnap = setGridSnap
    }

    setup = (p5: P5) => {
        const circleMode = new Button("Circle\nMode", this._buttonX, this._buttonY, this.handleCircleMode, this._buttonWidth, this._buttonWidth, CONSTANTS.colors.GREEN_TERMINAL, CONSTANTS.colors.GREEN_DARK, 16, "ellipse");
        this._buttons.push(circleMode);
        const chord = new Button("CHORD", this._buttonX + this._buttonMargin + this._buttonWidth, this._buttonY, this.handleArcChord, this._buttonWidth, this._buttonWidth, CONSTANTS.colors.GREEN_TERMINAL, CONSTANTS.colors.RED_ROCK, 14, "arc");
        this._buttons.push(chord);
        const pie = new Button("PIE", this._buttonX + this._buttonMargin * 2 + this._buttonWidth * 2, this._buttonY + 12, this.handleArcPie, this._buttonWidth, this._buttonWidth, CONSTANTS.colors.GREEN_TERMINAL, CONSTANTS.colors.ORANGE_COPPER, 16, "arc-pie");
        this._buttons.push(pie);
        const open = new Button("OPEN", this._buttonX + this._buttonMargin * 3 + this._buttonWidth * 3, this._buttonY + 12, this.handleArcOpen, this._buttonWidth, this._buttonWidth, CONSTANTS.colors.GREEN_TERMINAL, CONSTANTS.colors.YELLOW_SKY, 14, "arc-open");
        this._buttons.push(open);
        this._buttons[1].setSelected(true);     // By default set the CHORD button to selected status, as it is the default value
        this._gridSnap = p5.createInput("1", "number");
        //@ts-ignore
        this._gridSnap.input(this.updateGridSnap);
        this._gridSnap.parent("app");
        this._gridSnap.class("grid-snap-input");
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

    // Called whenever the input to the grid snap field is changed
    updateGridSnap = () => {
        if (this._gridSnap) {
            this.setGridSnap(Number(this._gridSnap.value() as string));
        } else {
            console.log("ERROR: Grid snap input field not initialized properly.");
        } 
    }

    render = (p5: P5) => {
        p5.fill("#0F0F0F");
        p5.stroke("green");
        p5.rect(this._x, this._y, this._width, this._height, 4, 4, 4, 4);
        this._buttons.forEach((button) => {
            button.render(p5);
        });
        p5.text("GRID\nSNAP", this._x + this._width - 32, this._y + 20);
    }

}