// A sub-component of the Module Builder class, the Inputs Area holds the text fields for controlling all of the module's non-visual data
import P5 from "p5";
import { CONSTANTS, ModuleInfo } from "./constants";
import EditorField from "./editorField";
import Button from "./button";

export default class InputsArea extends EditorField {
    _data: ModuleInfo;                      // The data object for the module being designed
    // Input fields:
    _inputs: P5.Element[];                  // Top-level input list; used to efficiently track changes to any text input field
    _labels: string[];                      // Top-level list of the labels for input fields, to be mapped next to the input boxes
    _name: P5.Element | null;               // Inputs will be null when constructed and then get input fields created by the setup method
    _type: P5.Element | null;
    _modWidth: P5.Element | null;
    _modHeight: P5.Element | null;
    _columnStrength: P5.Element | null;
    _durability: P5.Element | null;
    _cost: P5.Element | null;               // This one will take a number and convert it into a resource (e.g. ["money", 500])
    _pressurized: Button;                   // Boolean value inputs will have custom-made buttons instead
    setModuleData: (data: ModuleInfo) => void;  // Updater function passed down by the parent (ModuleBuilder) class

    constructor(x: number, y: number, w: number, h: number, setModuleData: (data: ModuleInfo) => void) {
        super(x, y, w, h);
        this._data = {          // Basic empty module data template
            name: "",
            width: 1,
            height: 1,
            type: "Test",
            pressurized: false,
            columnStrength: 0,
            durability: 100,
            buildCosts: [["money", 100]],
            maintenanceCosts: [],
            productionInputs: [],
            productionOutputs: [],
            storageCapacity: [],
            crewCapacity: 0,
            shapes: []
        };
        this._inputs = [];      // Inputs will be created by the setup method to avoid using P5 in the constructor
        this._labels = [
            "Name.................",
            "Type.................",
            "Width(#).............",
            "Height(#)............",
            "Col. Strength........",
            "Durability...........",
            "Cost (x $0.01)......."
        ];
        this._name = null;
        this._type = null;
        this._modWidth = null;
        this._modHeight = null;
        this._columnStrength = null;
        this._durability = null;
        this._cost = null;
        this._pressurized = new Button("P", this._x + 8, 400, this.handlePressurized, 32, 32, CONSTANTS.colors.GREEN_TERMINAL, CONSTANTS.colors.GREEN_DARK, 20, "ellipse");
        this.setModuleData = setModuleData;
    }

    setup = (p5: P5) => {
        this._name = p5.createInput("New module");
        this._inputs.push(this._name);
        this._type = p5.createInput("Test");
        this._inputs.push(this._type);
        this._modWidth = p5.createInput("1", "number");
        this._inputs.push(this._modWidth);
        this._modHeight = p5.createInput("1", "number");
        this._inputs.push(this._modHeight);
        this._columnStrength = p5.createInput("0", "number");
        this._inputs.push(this._columnStrength);
        this._durability = p5.createInput("100", "number");
        this._inputs.push(this._durability);
        this._cost = p5.createInput("100", "number");
        this._inputs.push(this._cost);
        // Add the inputs to the page, and style them
        this._inputs.forEach((input) => {
            input.parent("app");
            input.class("module-input");
            //@ts-ignore
            input.input(this.handleUpdates);
        });
        console.log(this._data);
    }

    // SECTION 1: GENERAL UPDATER METHOD (Runs on any change to any input field)
    handleUpdates = () => {
        // Check each input field and use it to update the module's data for the corresponding value
        if (this._name?.value()) this._data.name = this._name.value() as string;
        if (this._type?.value()) this._data.type = this._type.value() as string;
        if (this._modWidth?.value()) this._data.width = Number(this._modWidth.value() as string);
        if (this._modHeight?.value()) this._data.height = Number(this._modHeight.value() as string);
        if (this._columnStrength?.value()) this._data.columnStrength = Number(this._columnStrength.value() as string);
        if (this._durability?.value()) this._data.durability = Number(this._durability.value() as string);
        if (this._cost?.value()) this._data.buildCosts = [["money", Number(this._cost.value() as string)]];
        this.setModuleData(this._data); // Pass updated value to the module builder screen
    }

    // SECTION 2: BUTTON HANDLER METHODS

    handlePressurized = () => {
        console.log("Pressurized");
    }

    render = (p5: P5) => {
        p5.fill("#0F0F0F");
        p5.textSize(32);
        p5.stroke("green");
        p5.rect(this._x, this._y, this._width, this._height, 4, 4, 4, 4);
        p5.fill(CONSTANTS.colors.GREEN_TERMINAL);
        p5.text("Module Parameters", this._x + this._width / 2, this._y + 36);
        p5.textSize(16);
        // Render input field labels alongside the fields
        p5.textAlign(p5.LEFT);
        this._labels.forEach((label, idx) => {
            p5.text(label, this._x + 4, this._y + 100 + idx * 38);
        })
        p5.stroke(0);
        this._buttons.forEach((button) => {
            button.render(p5);
        });
        p5.textAlign(p5.CENTER);
        p5.textSize(20);
        p5.text("Maintenance", this._x + this._width / 2, 360);
        p5.text("Storage", this._x + this._width / 2, 460);
        p5.text("Inputs", this._x + this._width / 2, 560);
        p5.text("Outputs", this._x + this._width / 2, 660);
    }

}