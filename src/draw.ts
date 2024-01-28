import { Application, Graphics } from 'pixi.js';
import { Loop } from './loop';
import { Dot } from './dot';
import { TraitPosition2d } from './applicators';

export class Draw2d {
    private app: Application = new Application();

    init() {
        document.body.appendChild(this.app.view as unknown as Node);
    }

    addLoop(loop: Loop) {
        const dots: Array<[Dot<[TraitPosition2d]>, Graphics]> = [];

        for (const dot of loop.dotMap.values()) {
            dots.push([dot, this.renderDot(dot)]);
        }

        loop.addEventListener('dotCreated', ({ dot }) => {
            dots.push([dot, this.renderDot(dot)]);
        });

        this.app.ticker.add(() => {
            for (const [dot, graphics] of dots) {
                graphics.x = dot.position_2d.payload.x;
                graphics.y = dot.position_2d.payload.y;
            }
        });
    }

    renderDot(dot: Dot<[TraitPosition2d]>) {
        const rect = new Graphics();
        rect.beginFill(0xffffff);
        rect.drawRect(0, 0, 30, 30);
        rect.endFill();

        rect.x = dot.position_2d.payload.x;
        rect.y = dot.position_2d.payload.y;

        this.app.stage.addChild(rect);

        return rect;
    }
}
