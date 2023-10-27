import P5 from "p5";
import ModuleBuilder from "./moduleBuilder";
import { CONSTANTS } from "./constants";
import { getModules, getOneModule } from "./server_functions";

const sketch = (p5: P5) => {

    const switchScreen = (screen: string) => {
        switch (screen) {
            case "ModuleBuilder":
                moduleBuilder.setup();
        }
    }

    // Create editor sub-components prior to P5 setup routine
    const moduleBuilder = new ModuleBuilder(switchScreen);

    p5.setup = () => {
        const canvas = p5.createCanvas(CONSTANTS.SCREEN_WIDTH, CONSTANTS.SCREEN_HEIGHT);
        canvas.parent("app");
        p5.background(0);
        // Setup ModuleBuilder screen by default for now, since it's the only component we have
        // TODO: Make a general 'main menu' screen and open that first; let the user choose to open the module editor (or other screens as they are integrated)
        moduleBuilder.setup(); 
    }

    p5.mouseClicked = () => {
        if (moduleBuilder.currentScreen) moduleBuilder.handleClick(p5.mouseX, p5.mouseY);
    }

    p5.draw = () => {
        p5.fill(255, 0, 0);
        p5.rect(100, 100, 100, 100);
        if (moduleBuilder.currentScreen) moduleBuilder.render(p5);
    }

}

new P5(sketch);