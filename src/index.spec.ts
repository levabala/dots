import { expect, test } from 'bun:test';
import {
    Dot,
    TraitAcceleration2d,
    TraitMass,
    TraitPosition2d,
    TraitVelocity2d,
    applyAcceleration2d,
    applyGravity2d,
    applyVelocity2d,
    traitAcceleration2d,
    traitMass,
    traitPosition2d,
    traitVelocity2d,
} from '.';

test('applyVelocity2d', () => {
    const dot: Dot<[TraitPosition2d, TraitVelocity2d]> = {
        position_2d: traitPosition2d({ x: 1, y: 1 }),
        velocity_2d: traitVelocity2d({ x: 1, y: -4 }),
    };

    expect(applyVelocity2d(dot)).toEqual({
        position_2d: traitPosition2d({ x: 2, y: -3 }),
        velocity_2d: traitVelocity2d({ x: 1, y: -4 }),
    });
});

test('applyAcceleration2d', () => {
    const dot: Dot<[TraitPosition2d, TraitVelocity2d, TraitAcceleration2d]> = {
        position_2d: traitPosition2d({ x: 1, y: 1 }),
        velocity_2d: traitVelocity2d({ x: 1, y: -4 }),
        acceleration_2d: traitAcceleration2d({ x: -1, y: -1 }),
    };

    expect(applyAcceleration2d(dot)).toEqual({
        position_2d: traitPosition2d({ x: 1, y: 1 }),
        velocity_2d: traitVelocity2d({ x: 0, y: -5 }),
        acceleration_2d: traitAcceleration2d({ x: 0, y: 0 }),
    });
});

test('applyGravity2d', () => {
    const dot1: Dot<
        [TraitPosition2d, TraitVelocity2d, TraitAcceleration2d, TraitMass]
    > = {
        position_2d: traitPosition2d({ x: 1, y: 1 }),
        velocity_2d: traitVelocity2d({ x: 1, y: -4 }),
        acceleration_2d: traitAcceleration2d({ x: -1, y: -1 }),
        mass: traitMass({ value: 10e10 }),
    };

    const dot2: Dot<[TraitPosition2d, TraitAcceleration2d, TraitMass]> = {
        position_2d: traitPosition2d({ x: 3, y: 1 }),
        acceleration_2d: traitAcceleration2d({ x: -1, y: -1 }),
        mass: traitMass({ value: 10e12 }),
    };

    expect(applyGravity2d(dot1, dot2)).toEqual([
        {
            position_2d: traitPosition2d({ x: 1, y: 1 }),
            velocity_2d: traitVelocity2d({ x: 1, y: -4 }),
            // TODO: check if acc is correct
            acceleration_2d: traitAcceleration2d({ x: 332.5, y: -1 }),
            mass: traitMass({ value: 10e10 }),
        },
        {
            position_2d: traitPosition2d({ x: 3, y: 1 }),
            // TODO: check if acc is correct
            acceleration_2d: traitAcceleration2d({ x: -4.335, y: -1 }),
            mass: traitMass({ value: 10e12 }),
        },
    ]);
});
