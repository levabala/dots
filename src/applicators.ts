import { Vec2 } from './Vec2';
import { Trait, TraitCreator, TraitsMap } from './dot';
import { Mutator1, Mutator2 } from './system';

export type TraitPosition2d = Trait<Vec2, 'position_2d'>;
export const traitPosition2d: TraitCreator<TraitPosition2d> = (payload) => {
    return { __kind: 'position_2d', payload };
};

export type TraitVelocity2d = Trait<Vec2, 'velocity_2d'>;
export const traitVelocity2d: TraitCreator<TraitVelocity2d> = (payload) => {
    return { __kind: 'velocity_2d', payload };
};

export type TraitAcceleration2d = Trait<Vec2, 'acceleration_2d'>;
export const traitAcceleration2d: TraitCreator<TraitAcceleration2d> = (
    payload,
) => {
    return { __kind: 'acceleration_2d', payload };
};

export type TraitMass = Trait<
    {
        value: number;
    },
    'mass'
>;
export const traitMass: TraitCreator<TraitMass> = (payload) => {
    return { __kind: 'mass', payload };
};

export const applyVelocity2d: Mutator1<
    TraitsMap<[TraitPosition2d, TraitVelocity2d]>
> = (dot) => {
    return {
        ...dot,
        position_2d: {
            ...dot.position_2d,
            payload: {
                x: dot.position_2d.payload.x + dot.velocity_2d.payload.x,
                y: dot.position_2d.payload.y + dot.velocity_2d.payload.y,
            },
        },
    };
};

export const applyAcceleration2d: Mutator1<
    TraitsMap<[TraitAcceleration2d, TraitVelocity2d]>
> = (dot) => {
    return {
        ...dot,
        velocity_2d: {
            ...dot.velocity_2d,
            payload: {
                x: dot.velocity_2d.payload.x + dot.acceleration_2d.payload.x,
                y: dot.velocity_2d.payload.y + dot.acceleration_2d.payload.y,
            },
        },
        acceleration_2d: {
            ...dot.acceleration_2d,
            payload: {
                x: 0,
                y: 0,
            },
        },
    };
};
const GRAVITY_CONSTANT = 6.67e-11;
export const applyGravity2d: Mutator2<
    TraitsMap<[TraitMass, TraitPosition2d, TraitAcceleration2d]>
> = (dot1, dot2) => {
    const between = Vec2.between(
        dot1.position_2d.payload,
        dot2.position_2d.payload,
    );
    const distance = Vec2.length(between);
    const force =
        (GRAVITY_CONSTANT * dot1.mass.payload.value * dot2.mass.payload.value) /
        distance;

    const betweenNormalized = Vec2.normalize(between);
    const force1 = Vec2.multiply(betweenNormalized, force);
    const force2 = Vec2.invert(force1);

    const acc1 = Vec2.divide(force1, dot1.mass.payload.value);
    const acc2 = Vec2.divide(force2, dot2.mass.payload.value);

    return [
        {
            ...dot1,
            acceleration_2d: {
                ...dot1.acceleration_2d,
                payload: Vec2.sum(dot1.acceleration_2d.payload, acc1),
            },
        },
        {
            ...dot2,
            acceleration_2d: {
                ...dot1.acceleration_2d,
                payload: Vec2.sum(dot2.acceleration_2d.payload, acc2),
            },
        },
    ];
};
