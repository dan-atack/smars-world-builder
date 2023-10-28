// The Main Menu is the first screen that the user sees upon loading the World Builder Suite, and controls access to the other editor screens
import P5 from "p5";
import Screen from "./screen";
import Button from "./button";
import { CONSTANTS } from "./constants";

export default class Menu extends Screen {
    // Define types for the Menu class:
    _buttonWidth: number;
    _buttonHeight: number;
    _buttonX: number;
    _buttonY: number;
    _buttonText: string;
    _buttonBG: string;
    switchScreen: (switchTo: string) => void;

    constructor(switchScreen: (screen: string) => void) {
        super(switchScreen);
        this._buttonWidth = 384;
        this._buttonHeight = 112;
        this._buttonX = CONSTANTS.SCREEN_WIDTH / 2 - this._buttonWidth / 2;
        this._buttonY = CONSTANTS.SCREEN_HEIGHT / 3;
        this._buttonText = CONSTANTS.colors.GREEN_TERMINAL;
        this._buttonBG = CONSTANTS.colors.GREEN_BACKGROUND;
        this.switchScreen = switchScreen;
    }

    setup = () => {
        this.currentScreen = true;
        const moduleBuilder = new Button(
            "Module Builder",
            this._buttonX,
            this._buttonY,
            this.handleModuleBuilder,
            this._buttonWidth,
            this._buttonHeight,
            this._buttonText,
            this._buttonBG
        );
        this._buttons.push(moduleBuilder);
    }

    handleClick = (mouseX: number, mouseY: number) => {
        this._buttons.forEach((button) => {
            button.handleClick(mouseX, mouseY);
        })
    }

    handleModuleBuilder = () => {
        this.handleClose();
        this.switchScreen("moduleBuilder");
    }

    render = (p5: P5) => {
        p5.background(0);
        p5.textSize(48);
        p5.fill("white");
        p5.textStyle(p5.BOLD);
        p5.textAlign(p5.CENTER, p5.TOP);
        p5.text("Welcome to the SMARS World Builder Suite", CONSTANTS.SCREEN_WIDTH / 2, 80);
        p5.textSize(36);
        p5.text("Select an editor screen to get started:", CONSTANTS.SCREEN_WIDTH / 2, 160);
        this._buttons.forEach((button) => {
            button.render(p5);
        })
    }

    handleClose = () => {
        this.currentScreen = false;
    }

}