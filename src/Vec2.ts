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

