import { Dot } from './dot';
import { System1Any } from './system';

export type LoopEvent = {
    name: 'dotCreated';
    payload: { dot: Dot<any> };
};

export type LoopEventHandler<N extends LoopEventName> = (
    payload: Extract<LoopEvent, { name: N }>['payload'],
) => void;

export type LoopEventName = LoopEvent['name'];

export class Loop {
    dotMap = new Set<Dot<any>>();
    eventListeners = new Map<
        LoopEventName,
        Array<LoopEventHandler<LoopEventName>>
    >();
    systemMap = new Set<System1Any>();

    addDot(dot: Dot<any>) {
        this.dotMap.add(dot);
    }

    addSystem(system: System1Any) {
        this.systemMap.add(system);
    }

    addEventListener<N extends LoopEventName>(
        eventName: N,
        listener: (payload: Extract<LoopEvent, { name: N }>['payload']) => void,
    ) {
        let listeners = this.eventListeners.get(eventName);

        if (!listeners) {
            listeners = [];
            this.eventListeners.set(eventName, listeners);
        }

        listeners.push(listener);
    }

    tick() {
        for (const dot of this.dotMap.values()) {
            for (const system of this.systemMap.values()) {
                let matches = true;
                for (const traitRequired of system.traitsRequired) {
                    if (!(traitRequired in dot)) {
                        matches = false;
                        break;
                    }
                }

                if (!matches) {
                    continue;
                }

                const dotNew = system.apply(dot);
                Object.assign(dot, dotNew);
            }
        }
    }
}
