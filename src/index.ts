// vec2 is cool!
export abstract class Vec2 {
    abstract x: number;
    abstract y: number;

    static normalize(v: Vec2): Vec2 {
        const length = Vec2.length(v);

        return { x: v.x / length, y: v.y / length };
    }

    static between(p1: Vec2, p2: Vec2): Vec2 {
        const x = p2.x - p1.x;
        const y = p2.y - p1.y;

        return { x, y };
    }

    static length(v: Vec2): number {
        return Math.sqrt(v.x ** 2 + v.y ** 2);
    }

    static multiply(v: Vec2, m: number): Vec2 {
        return { x: v.x * m, y: v.y * m };
    }

    static divide(v: Vec2, m: number): Vec2 {
        return { x: v.x / m, y: v.y / m };
    }

    static invert(v: Vec2): Vec2 {
        return { x: -v.x, y: -v.y };
    }

    static sum(v1: Vec2, v2: Vec2): Vec2 {
        return { x: v1.x + v2.x, y: v1.y + v2.y };
    }
}

// same base types
type Kind<K extends string> = {
    __kind: K;
};

type Trait<Payload, K extends Kind<string>> = K & Payload;

type TraitsMap<Traits extends any[]> = Traits extends Trait<any, any>[]
    ? {
          [Key in Traits[number]['__kind']]: Extract<Traits[number], Kind<Key>>;
      }
    : never;

export type Dot<T extends Trait<any, any>[] | TraitsMap<any>> = T extends Trait<
    any,
    any
>[]
    ? TraitsMap<T>
    : T;

export type TraitCreator<T extends Trait<any, any>> = (
    value: Omit<T, '__kind'>,
) => T;

// test traits
export type TraitPosition2d = Kind<'position_2d'> & Vec2;
export const traitPosition2d: TraitCreator<TraitPosition2d> = (value) => {
    return { __kind: 'position_2d', ...value };
};

export type TraitVelocity2d = Kind<'velocity_2d'> & Vec2;
export const traitVelocity2d: TraitCreator<TraitVelocity2d> = (value) => {
    return { __kind: 'velocity_2d', ...value };
};

export type TraitAcceleration2d = Kind<'acceleration_2d'> & Vec2;
export const traitAcceleration2d: TraitCreator<TraitAcceleration2d> = (
    value,
) => {
    return { __kind: 'acceleration_2d', ...value };
};

export type TraitMass = Kind<'mass'> & {
    value: number;
};
export const traitMass: TraitCreator<TraitMass> = (value) => {
    return { __kind: 'mass', ...value };
};

// type shortcuts
export type Mutator1<Traits extends Trait<any, any>[]> = <
    T extends TraitsMap<Traits>,
>(
    dot: Dot<T>,
) => Dot<T>;
export type Mutator2<Traits extends Trait<any, any>[]> = <
    T1 extends TraitsMap<Traits>,
    T2 extends TraitsMap<Traits>,
>(
    dot1: Dot<T1>,
    dot2: Dot<T2>,
) => [Dot<T1>, Dot<T2>];

// test applicators
export const applyVelocity2d: Mutator1<[TraitPosition2d, TraitVelocity2d]> = (
    dot,
) => {
    return {
        ...dot,
        position_2d: {
            ...dot.position_2d,
            x: dot.position_2d.x + dot.velocity_2d.x,
            y: dot.position_2d.y + dot.velocity_2d.y,
        },
    };
};

export const applyAcceleration2d: Mutator1<
    [TraitAcceleration2d, TraitVelocity2d]
> = (dot) => {
    return {
        ...dot,
        velocity_2d: {
            ...dot.velocity_2d,
            x: dot.velocity_2d.x + dot.acceleration_2d.x,
            y: dot.velocity_2d.y + dot.acceleration_2d.y,
        },
        acceleration_2d: {
            ...dot.acceleration_2d,
            x: 0,
            y: 0,
        },
    };
};

const GRAVITY_CONSTANT = 6.67e-11;
export const applyGravity2d: Mutator2<
    [TraitMass, TraitPosition2d, TraitAcceleration2d]
> = (dot1, dot2) => {
    const between = Vec2.between(dot1.position_2d, dot2.position_2d);
    const distance = Vec2.length(between);
    const force =
        (GRAVITY_CONSTANT * dot1.mass.value * dot2.mass.value) / distance;

    const betweenNormalized = Vec2.normalize(between);
    const force1 = Vec2.multiply(betweenNormalized, force);
    const force2 = Vec2.invert(force1);

    const acc1 = Vec2.divide(force1, dot1.mass.value);
    const acc2 = Vec2.divide(force2, dot2.mass.value);

    return [
        {
            ...dot1,
            acceleration_2d: {
                ...dot1.acceleration_2d,
                ...Vec2.sum(dot1.acceleration_2d, acc1),
            },
        },
        {
            ...dot2,
            acceleration_2d: {
                ...dot1.acceleration_2d,
                ...Vec2.sum(dot2.acceleration_2d, acc2),
            },
        },
    ];
};
