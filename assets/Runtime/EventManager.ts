import Singleton from '../Base/Singleton';

interface IItem {
    func: Function;
    ctx: unknown;
}

export default class EventManager extends Singleton {
    static get instance() {
        return super.getInstance<EventManager>();
    }

    private eventDir: Map<string, Array<IItem>> = new Map();

    // 绑定事件
    on(eventName: string, func: Function, ctx?: unknown) {
        if (this.eventDir.has(eventName)) {
            this.eventDir.get(eventName).push({ func, ctx });
        } else {
            this.eventDir.set(eventName, [{ func, ctx }]);
        }
    }

    // 解除绑定事件
    off(eventName: string, func: Function) {
        if (this.eventDir.has(eventName)) {
            const index = this.eventDir.get(eventName).findIndex(i => i.func === func);
            index > -1 && this.eventDir.get(eventName).splice(index, 1);
        }
    }

    // 触发事件
    emit(eventName: string, ...params: unknown[]) {
        if (this.eventDir.has(eventName)) {
            this.eventDir.get(eventName).forEach(({ func, ctx }) => {
                ctx ? func.apply(ctx, params) : func(...params);
            });
        }
    }

    // 清除所有事件
    clear() {
        this.eventDir.clear();
    }
}
