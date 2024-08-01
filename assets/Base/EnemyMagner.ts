import { _decorator } from 'cc';
import { IEntity } from '../Levels';
import { EntityManager } from './EntityManager';
import EventManager from '../Runtime/EventManager';
import DataManager from '../Runtime/DataManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from '../Enums';

const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends EntityManager {
    async init(params: IEntity) {
        super.init(params);
        EventManager.instance.on(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection, this);
        EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this);
        EventManager.instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDead, this);

        this.onChangeDirection(true);
    }

    onDestroy() {
        super.onDestroy();
        EventManager.instance.off(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection);
        EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection);
        EventManager.instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDead);
    }

    onChangeDirection(isInit: boolean = false) {
        if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.instance.player) {
            return;
        }

        const { x: playerX, y: playerY } = DataManager.instance.player;

        const disX = Math.abs(this.x - playerX);
        const disY = Math.abs(this.y - playerY);
        if (disX === disY && !isInit) {
            return;
        }

        if (playerX >= this.x && playerY <= this.y) {
            this.direction = disX < disY ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.RIGHT;
        } else if (playerX <= this.x && playerY <= this.y) {
            this.direction = disX < disY ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.LEFT;
        } else if (playerX <= this.x && playerY >= this.y) {
            this.direction = disX < disY ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.LEFT;
        } else if (playerX >= this.x && playerY >= this.y) {
            this.direction = disX < disY ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.RIGHT;
        }
    }

    onDead(id: string) {
        if (this.state === ENTITY_STATE_ENUM.DEATH) {
            return;
        }

        if (id === this.id) {
            this.state = ENTITY_STATE_ENUM.DEATH;
        }
    }
}
