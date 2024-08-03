import { _decorator, Component, Node, Event } from 'cc';
import EventManger from '../../Runtime/EventManager';
import { CONTROLLER_ENUM, EVENT_ENUM } from '../../Enums';

const { ccclass, property } = _decorator;

@ccclass('MenuManger')
export class MenuManger extends Component {
    handleUndo() {
        EventManger.instance.emit(EVENT_ENUM.REVOKE_STEP);
    }

    handleRestart() {
        EventManger.instance.emit(EVENT_ENUM.RESTART_LEVEL);
    }

    handleOut() {
        EventManger.instance.emit(EVENT_ENUM.OUT_BATTLE);
    }
}
