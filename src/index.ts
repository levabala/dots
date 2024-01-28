import { Dot } from './dot';
import {
    TraitPosition2d,
    TraitVelocity2d,
    applyVelocity2d,
    traitPosition2d,
    traitVelocity2d,
} from './applicators';
import { Draw2d } from './draw';
import { Loop } from './loop';
import { createSystem1 } from './system';

const draw2d = new Draw2d();
draw2d.init();

const loop = new Loop();

const dot1: Dot<[TraitPosition2d]> = {
    position_2d: traitPosition2d({
        x: 10,
        y: 15,
    }),
};

const dot2: Dot<[TraitPosition2d, TraitVelocity2d]> = {
    position_2d: traitPosition2d({
        x: 85,
        y: 88,
    }),
    velocity_2d: traitVelocity2d({
        x: 1,
        y: 0,
    }),
};

const systemMove = createSystem1({
    traitsRequired: ['position_2d', 'velocity_2d'],
    apply: applyVelocity2d,
});

loop.addDot(dot1);
loop.addDot(dot2);
loop.addSystem(systemMove);

draw2d.addLoop(loop);

loop.tick();

function tick() {
    loop.tick();
    requestAnimationFrame(tick);
}

tick();
