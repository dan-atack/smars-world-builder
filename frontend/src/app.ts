import P5 from "p5";
import ModuleBuilder from "./moduleBuilder";
import Menu from "./menu";
import { CONSTANTS } from "./constants";

const sketch = (p5: P5) => {

    const switchScreen = (screen: string) => {
        switch (screen) {
            case "moduleBuilder":
                moduleBuilder.setup();
                break;
        }
    }

    // Create editor sub-components prior to P5 setup routine
    const mainMenu = new Menu(switchScreen);
    const moduleBuilder = new ModuleBuilder(switchScreen);

    p5.setup = () => {
        const canvas = p5.createCanvas(CONSTANTS.SCREEN_WIDTH, CONSTANTS.SCREEN_HEIGHT);
        canvas.parent("app");
        p5.background(0);
        // Open the Main Menu screen first
        mainMenu.setup(); 
    }

    p5.mouseClicked = () => {
        if (mainMenu.currentScreen) mainMenu.handleClick(p5.mouseX, p5.mouseY);
        if (moduleBuilder.currentScreen) moduleBuilder.handleClick(p5.mouseX, p5.mouseY);
    }

    p5.draw = () => {
        p5.textAlign(p5.CENTER);
        if (mainMenu.currentScreen) mainMenu.render(p5);
        if (moduleBuilder.currentScreen) moduleBuilder.render(p5);
    }

}

new P5(sketch);