import * as PIXI from "pixi.js";
import gsap from "gsap";
import { getRandomInRange } from "../utils/getRandomInRange";

export class TestGame {
  private app: PIXI.Application;
  private container: PIXI.Container;
  private wheel: PIXI.Sprite;
  private wheelTongue: PIXI.Sprite;
  private button: PIXI.Sprite;
  private sectors: Array<PIXI.Container>;
  private winningValue: Number;
  private messageContainer: PIXI.Text;

  public initialize(): void {
    const appOptions: any = {
      width: 800,
      height: 700,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1,
    };
    this.app = new PIXI.Application(appOptions);
    document.body.appendChild(this.app.view);

    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);

    this.loadResources();
    this.addFace();
    this.addInteractions();
    this.addListeners();
  }

  protected loadResources(): void {
    const wheelTexture: PIXI.Texture = PIXI.Texture.from("resources/wheel.png");
    this.wheel = new PIXI.Sprite(wheelTexture);
    this.wheel.pivot.set(190, 190);
    this.wheel.x = 400;
    this.wheel.y = 300;
    this.container.addChild(this.wheel);
    // this.wheel.rotation = 0.523;

    const tongueTexture: PIXI.Texture = PIXI.Texture.from(
      "resources/wheel_tongue.png"
    );
    this.wheelTongue = new PIXI.Sprite(tongueTexture);
    this.wheelTongue.pivot.set(27, 20);
    this.wheelTongue.x = 400;
    this.wheelTongue.y = 100;
    this.container.addChild(this.wheelTongue);

    const buttonTexture: PIXI.Texture = PIXI.Texture.from(
      "resources/button.png"
    );
    this.button = new PIXI.Sprite(buttonTexture);
    this.button.pivot.set(113, 55);
    this.button.x = 400;
    this.button.y = 550;
    this.container.addChild(this.button);
  }

  private addListeners() {
    if (!this.winningValue) {
      const randomValue = Math.round(getRandomInRange(5, 25) / 5) * 5;
      this.setWinningValue(randomValue);
    }

    const input = document.querySelector("#winning-value") as HTMLInputElement;
    const form = document.querySelector("#winning-form");
    const errorMsg = document.querySelector(".error");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = parseInt(input.value);
      if (value <= 0 || value > 25 || value % 5 !== 0) {
        return errorMsg.classList.add("show-error");
      }
      errorMsg.classList.remove("show-error");
      this.setWinningValue(value);
    });
  }

  private setWinningValue(value: number) {
    const outputValue = document.querySelector("#output");
    outputValue.textContent = String(value);
    this.winningValue = value;
  }

  addFace() {
    const radius = 180;
    this.sectors = [];
    const container = new PIXI.Container();
    container.pivot.set(400, 20);

    for (let i = 0; i < 6; i += 1) {
      const content = String((i + 1) * 5);
      const number = new PIXI.Text(content);
      number.name = content;
      number.position.set(
        radius / 1 + (Math.cos((i / 6) * Math.PI * 2) * radius) / 1.5,
        radius / 0.9 + (Math.sin((i / 6) * Math.PI * 2) * radius) / 1.5
      );
      number.angle = 90 + i * 60;
      this.sectors.push(number);
      container.addChild(number);
    }
    container.angle = -95;
    this.wheel.addChild(container);
  }

  protected addInteractions() {
    this.button.interactive = true;
    this.button.buttonMode = true;

    this.button.on("pointerdown", () => {
      this.resetState();
      this.button.scale.x = 0.9;
      this.button.scale.y = 0.9;
      const duration = 2;
      gsap.to(this.wheel, {
        duration: duration,
        rotation: getRandomInRange(12.5664, 18.849),
      });

      setTimeout(this.alignWheel.bind(this), duration * 1000);
    });

    this.button.on("pointerup", () => {
      this.button.scale.x = 1;
      this.button.scale.y = 1;
    });
  }

  protected alignWheel() {
    const currentAngle = this.wheel.angle;

    const nearest = Math.round(currentAngle / 60) * 60;

    gsap.to(this.wheel, {
      duration: 1,
      angle: nearest,
    });

    this.checkIfWon();
  }

  checkIfWon() {
    const tongueBounds = this.wheelTongue.getBounds();
    const sorted = [...this.sectors].sort((a, b) => {
      const aDistance = Math.abs(tongueBounds.y - a.getBounds().y);
      const bDistance = Math.abs(tongueBounds.y - b.getBounds().y);
      if (aDistance > bDistance) return 1;
      if (aDistance < bDistance) return -1;
      return 0;
    });

    const nearest = sorted[0];
    // @ts-ignore
    const droppedValue = parseInt(nearest.text);
    if (droppedValue === this.winningValue) {
      this.showMessage("you've won!");
      console.log("you've won!");
    } else {
      this.showMessage("you've lost!");
      console.log("you've lost!");
    }
    console.log(droppedValue, this.winningValue);
  }

  showMessage(message: string) {
    const style = new PIXI.TextStyle({
      align: "center",
      fontFamily: "Comic Sans MS",
      fontSize: 28,
      fontWeight: "bold",
      lineJoin: "round",
      stroke: "white",
      wordWrap: true,
    });

    this.messageContainer = new PIXI.Text(message, style);
    console.log(this.container.position);
    this.messageContainer.x = 350;
    this.container.addChild(this.messageContainer);
  }

  resetState() {
    this.messageContainer?.destroy();
  }
}
