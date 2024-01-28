export type Kind<K extends string> = {
    __kind: K;
};

export type Trait<Payload, KindValue extends string> = Kind<KindValue> & {
    payload: Payload;
};

export type TraitsMap<Traits extends any[]> = Traits extends Trait<any, any>[]
    ? {
          [Key in Traits[number]['__kind']]: Extract<Traits[number], Trait<any, Key>>;
      }
    : never;

export type Dot<T extends Trait<any, any>[] | Kind<any>[] | TraitsMap<any>> =
    T extends Trait<any, any>[] ? TraitsMap<T> : T;

export type TraitCreator<T extends Trait<any, any>> = (
    value: T extends Trait<infer Payload, any> ? Payload : never,
) => T;
