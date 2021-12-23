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
  }

  protected loadResources(): void {
    const wheelTexture: PIXI.Texture = PIXI.Texture.from("resources/wheel.png");
    this.wheel = new PIXI.Sprite(wheelTexture);
    this.wheel.pivot.set(190, 190);
    this.wheel.x = 400;
    this.wheel.y = 300;
    this.container.addChild(this.wheel);

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

  addFace() {
    const radius = 170;
    this.sectors = [];
    const container = new PIXI.Container();
    container.pivot.set(350, 10);

    for (let i = 0; i < 6; i += 1) {
      const number = new PIXI.Text(String((i + 1) * 5));
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

  addInteractions() {
    this.button.interactive = true;
    this.button.buttonMode = true;
    this.button.on("pointerdown", () => {
      console.log("wah!");
      this.button.scale.x = 0.9;
      this.button.scale.y = 0.9;
      const duration = 5;
      gsap.to(this.wheel, {
        duration: duration,
        rotation: getRandomInRange(10, 20),
      });

      setTimeout(() => {
        const tongueBounds = this.wheelTongue.getBounds();
        const nearest = this.sectors.reduce((acc, value) => {
          const valueDistance = {
            x: Math.abs(tongueBounds.x - value.getBounds().x),
            y: Math.abs(tongueBounds.y - value.getBounds().y),
          };
          if (!acc) acc = value;

          if (valueDistance.x < acc.x && valueDistance.y < acc.y) acc = value;
          return acc;
        }, null);

        const degrees = this.sectors.indexOf(nearest) * 60;
        gsap.to(this.wheel, {
          duration: 1,
          rotation: (degrees * Math.PI) / 180,
        });
      }, duration * 1000);
    });

    this.button.on("pointerup", () => {
      this.button.scale.x = 1;
      this.button.scale.y = 1;
    });
  }

  rotate(delta: number) {
    const rotation = this.easeOutCubic(delta);
    this.wheel.rotation += rotation;
  }

  easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
  }
}
