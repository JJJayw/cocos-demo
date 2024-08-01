import { _decorator, Component, SpriteFrame, Animation } from 'cc';
import { FSM_PARAMS_TYPE_ENUM } from '../Enums';
import State from './State';
import { SubStateMachine } from './SubStateMachine';

const { ccclass, property } = _decorator;

type ParamsValueType = number | boolean;

export interface IParamsValue {
    type: FSM_PARAMS_TYPE_ENUM;
    value: ParamsValueType;
}

export const getInitParamsTrigger = () => {
    return {
        type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
        value: false,
    };
};

export const getInitParamsNumber = () => {
    return {
        type: FSM_PARAMS_TYPE_ENUM.NUMBER,
        value: 0,
    };
};

@ccclass('StateMachine')
export abstract class StateMachine extends Component {
    private _currentState: State | SubStateMachine = null;

    params: Map<string, IParamsValue> = new Map();

    stateMachines: Map<string, State | SubStateMachine> = new Map();

    animationComponent: Animation;

    waitingList: Array<Promise<SpriteFrame[]>> = [];

    get currentState() {
        return this._currentState;
    }

    set currentState(newState) {
        this._currentState = newState;
        this._currentState.run();
    }

    getParams(paramsName: string) {
        if (this.params.has(paramsName)) {
            return this.params.get(paramsName).value;
        }
    }

    setParams(paramsName: string, value: ParamsValueType) {
        if (this.params.has(paramsName)) {
            this.params.get(paramsName).value = value;
            this.run();
            this.resetTrigger();
        }
    }

    resetTrigger() {
        for (const [_, value] of this.params) {
            if (value.type === FSM_PARAMS_TYPE_ENUM.TRIGGER) {
                value.value = false;
            }
        }
    }

    abstract init(): void;
    abstract run(): void;
}