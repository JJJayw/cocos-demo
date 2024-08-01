import { _decorator } from 'cc';
import { ENTITY_STATE_ENUM, EVENT_ENUM } from '../../Enums';
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine';
import EventManager from '../../Runtime/EventManager';
import DataManager from '../../Runtime/DataManager';
import { EnemyManager } from '../../Base/EnemyMagner';
import { IEntity } from '../../Levels';

const { ccclass, property } = _decorator;

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EnemyManager {
    async init(params: IEntity) {
        this.fsm = this.addComponent(WoodenSkeletonStateMachine);
        await this.fsm.init();
        super.init(params);

        EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this);
    }

    onDestroy() {
        super.onDestroy();
        EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack);
    }

    // 攻击判定
    onAttack() {
        if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.instance.player) {
            return;
        }

        const { targetX: playerX, targetY: playerY, state: playerState } = DataManager.instance.player;

        // 攻击判定条件：如果玩家和实体的X坐标相同，并且Y坐标相差不超过1，或者Y坐标相同，并且X坐标相差不超过1，则表示实体与玩家在水平或垂直方向上相邻。
        if (
            ((playerX === this.x && Math.abs(playerY - this.y) <= 1) || (playerY === this.y && Math.abs(playerX - this.x) <= 1)) &&
            playerState !== ENTITY_STATE_ENUM.DEATH &&
            playerState !== ENTITY_STATE_ENUM.AIRDEATH
        ) {
            this.state = ENTITY_STATE_ENUM.ATTACK;
            EventManager.instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH);
        } else {
            this.state = ENTITY_STATE_ENUM.IDLE;
        }
    }
}
