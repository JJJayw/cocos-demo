import State from '../../Base/State';
import { StateMachine } from '../../Base/StateMachine';
import { DIRECTION_ENUM } from '../../Enums';
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine';

const BASE_URL = 'texture/player/attack';

// 骷髅攻击子状态机
export default class AttackSubStateMachine extends DirectionSubStateMachine {
    constructor(fsm: StateMachine) {
        super(fsm);
        this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}/top`));
        this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}/bottom`));
        this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}/left`));
        this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}/right`));
    }
}
