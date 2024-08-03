import { _decorator, UITransform } from 'cc';
import { ENTITY_STATE_ENUM, EVENT_ENUM, SHAKE_TYPE_ENUM } from '../../Enums';
import { BurstStateMachine } from './BurstStateMachine';
import EventManager from '../../Runtime/EventManager';
import DataManager from '../../Runtime/DataManager';
import { IEntity } from '../../Levels';
import { EntityManager } from '../../Base/EntityManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';

const { ccclass, property } = _decorator;

@ccclass('BurstManager')
export class BurstManager extends EntityManager {
    async init(params: IEntity) {
        this.fsm = this.addComponent(BurstStateMachine);
        await this.fsm.init();
        super.init(params);
        const transform = this.getComponent(UITransform);
        transform.setContentSize(TILE_WIDTH, TILE_HEIGHT);

        EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst, this);
    }

    onDestroy() {
        super.onDestroy();
        EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst);
    }

    onBurst() {
        //我都死了，别烦我了
        if (this.state === ENTITY_STATE_ENUM.DEATH) {
            return;
        }
        const { targetX: playerX, targetY: playerY } = DataManager.instance.player;
        if (this.x === playerX && this.y === playerY && this.state === ENTITY_STATE_ENUM.IDLE) {
            this.state = ENTITY_STATE_ENUM.ATTACK;
        } else if (this.state === ENTITY_STATE_ENUM.ATTACK) {
            this.state = ENTITY_STATE_ENUM.DEATH;
            //如果我裂开的时候你人在我上面，你直接狗带吧
            EventManager.instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.BOTTOM);
            if (this.x === playerX && this.y === playerY) {
                EventManager.instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.AIRDEATH);
            }
        }
    }

    update() {
        this.node.setPosition(this.x * TILE_WIDTH, -this.y * TILE_HEIGHT);
    }
}
