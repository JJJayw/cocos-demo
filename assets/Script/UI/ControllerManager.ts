import { _decorator, Component, Node, Event } from 'cc';
import EventManger from '../../Runtime/EventManager';
import { CONTROLLER_ENUM, EVENT_ENUM } from '../../Enums';

const { ccclass, property } = _decorator;

@ccclass('ControllerManger')
export class ControllerManger extends Component {
    hanleCtrl(event: Event, type: string) {
        EventManger.instance.emit(EVENT_ENUM.PLAYER_CTRL, type as CONTROLLER_ENUM);
    }
}
