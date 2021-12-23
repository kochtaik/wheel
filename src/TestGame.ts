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

    this.app.ticker.add(() => {});
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
    const input = document.querySelector("#winning-value") as HTMLInputElement;

    input.addEventListener("input", (e) => {
      const value = parseInt(input.value);
      if (value <= 0 || value > 25 || value % 5 !== 0) return;
      this.setWinningValue(value);
    });
  }

  private setWinningValue(value: number) {
    this.winningValue = value;
  }

  addFace() {
    const radius = 170;
    this.sectors = [];
    const container = new PIXI.Container();
    container.pivot.set(350, 10);

    for (let i = 0; i < 6; i += 1) {
      const content = String((i + 1) * 5);
      const number = new PIXI.Text(content);
      number.name = content;
      number.position.set(
        radius / 0.9 + (Math.cos((i / 6) * Math.PI * 2) * radius) / 1.5,
        radius / 0.9 + (Math.sin((i / 6) * Math.PI * 2) * radius) / 1.5
      );
      number.angle = 90;
      this.sectors.push(number);
      container.addChild(number);
    }
    container.angle = -90;
    this.wheel.addChild(container);
  }

  protected addInteractions() {
    this.button.interactive = true;
    this.button.buttonMode = true;

    this.button.on("pointerdown", () => {
      this.button.scale.x = 0.9;
      this.button.scale.y = 0.9;
      const duration = 2;
      gsap.to(this.wheel, {
        duration: duration,
        rotation: getRandomInRange(6.283, 18.849),
      });

      setTimeout(this.alignWheel.bind(this), duration * 1000);
      // this.checkIfWon();
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

    // this.checkIfWon();
  }

  checkIfWon() {}

  rotate(delta: number) {
    const rotation = this.easeOutCubic(delta);
    this.wheel.rotation += rotation;
  }

  easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
  }
}
