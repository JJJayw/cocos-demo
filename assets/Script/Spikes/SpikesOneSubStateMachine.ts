import State from '../../Base/State';
import { StateMachine } from '../../Base/StateMachine';
import { PARAMS_NAME_ENUM, SPIKES_COUNT_ENUM, SPIKES_COUNT_MAP_NUMBER_ENUM } from '../../Enums';
import { SpikesStateMachine } from './SpikesStateMachine';
import SpikesSubStateMachine from './SpikesSubStateMachine';

const BASE_URL = 'texture/spikes/spikesone';

// 骷髅闲置子状态机
export default class SpikesOneSubStateMachine extends SpikesSubStateMachine {
    constructor(fsm: StateMachine) {
        super(fsm);
        this.stateMachines.set(SPIKES_COUNT_ENUM.ZERO, new State(fsm, `${BASE_URL}/zero`));
        this.stateMachines.set(SPIKES_COUNT_ENUM.ONE, new State(fsm, `${BASE_URL}/one`));
        this.stateMachines.set(SPIKES_COUNT_ENUM.TWO, new State(fsm, `${BASE_URL}/two`));
    }
}
