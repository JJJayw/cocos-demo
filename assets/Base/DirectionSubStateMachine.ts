import { DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from '../Enums';
import { SubStateMachine } from './SubStateMachine';

export default class DirectionSubStateMachine extends SubStateMachine {
    run(): void {
        const value = this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION);
        this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number]);
    }
}
