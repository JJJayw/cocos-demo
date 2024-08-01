import { _decorator } from 'cc';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enums';

import { EntityManager } from '../../Base/EntityManager';
import EventManager from '../../Runtime/EventManager';
import { DoorStateMachine } from './DoorStateMachine';
import DataManager from '../../Runtime/DataManager';
import { IEntity } from '../../Levels';

const { ccclass, property } = _decorator;

@ccclass('DoorManager')
export class DoorManager extends EntityManager {
    async init(params: IEntity) {
        this.fsm = this.addComponent(DoorStateMachine);
        await this.fsm.init();
        super.init(params);

        EventManager.instance.on(EVENT_ENUM.DOOR_OPEN, this.onOpen, this);
    }

    onDestroy() {
        super.onDestroy();
        EventManager.instance.off(EVENT_ENUM.DOOR_OPEN, this.onOpen);
    }

    onOpen() {
        if (
            DataManager.instance.enemies.every((enemy: EntityManager) => enemy.state === ENTITY_STATE_ENUM.DEATH) &&
            this.state !== ENTITY_STATE_ENUM.DEATH
        ) {
            this.state = ENTITY_STATE_ENUM.DEATH;
        }
    }
}
