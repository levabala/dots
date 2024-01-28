import { TraitPosition2d, TraitVelocity2d } from './applicators';
import { Trait, TraitsMap, Dot, Kind } from './dot';

export type Mutator1<TBase extends TraitsMap<any>> = <T extends TBase>(
    dot: Dot<T>,
) => Dot<T>;
export type Mutator2<TBase extends TraitsMap<any>> = <
    T1 extends TBase,
    T2 extends TBase,
>(
    dot1: Dot<T1>,
    dot2: Dot<T2>,
) => [Dot<T1>, Dot<T2>];

export const createSystem1 = <const T extends string[]>(obj: {
    traitsRequired: T;
    apply: Mutator1<
        TraitsMap<{ [key in T[number]]: Trait<any, key> }[T[number]][]>
    >;
}) => obj;

export type System1Any = ReturnType<typeof createSystem1>;

export const m1 = {} as unknown as Mutator1<
    TraitsMap<[TraitVelocity2d, TraitPosition2d]>
>;

export const s1 = createSystem1({
    traitsRequired: ['position_2d', 'velocity_2d'],
    apply: m1,
});

export type System2<Traits extends Array<Trait<any, any>>> = {
    traitsRequired: Traits[number]['__kind'][];
    apply: Mutator2<Traits>;
};
