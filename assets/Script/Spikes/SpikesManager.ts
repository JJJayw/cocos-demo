import { _decorator, Component, Sprite, UITransform } from 'cc';
import { ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM } from '../../Enums';
import { randomByLen } from '../../Utils';
import { ISpikes } from '../../Levels';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import { SpikesStateMachine } from './SpikesStateMachine';
import EventManager from '../../Runtime/EventManager';
import DataManager from '../../Runtime/DataManager';
import { StateMachine } from '../../Base/StateMachine';

const { ccclass, property } = _decorator;

@ccclass('SpikesManager')
export class SpikesManager extends Component {
    id: string = randomByLen(12);
    _totalCount: number;
    _count = 0;
    x: number;
    y: number;
    type: ENTITY_TYPE_ENUM;
    fsm: StateMachine;

    get count() {
        return this._count;
    }

    set count(newCount) {
        this._count = newCount;
        this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, newCount);
    }

    get totalCount() {
        return this._totalCount;
    }

    set totalCount(newCount) {
        this._totalCount = newCount;
        this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, newCount);
    }

    async init(params: ISpikes) {
        const sprite = this.node.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        const transform = this.getComponent(UITransform);
        transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);

        this.fsm = this.node.addComponent(SpikesStateMachine);
        await this.fsm.init();
        this.x = params.x;
        this.y = params.y;
        const type = params.type;
        this.totalCount = SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[type as 'SPIKES_ONE' | 'SPIKES_TWO' | 'SPIKES_THREE' | 'SPIKES_FOUR'];
        this.count = params.count;

        EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop, this);
    }

    onDestroy() {
        EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop);
    }

    /***
     * 更新位置，把虚拟坐标（1,1）转为屏幕实际位置
     */
    update() {
        this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5);
    }

    onLoop() {
        //达到最大值会在动画回调置0，当最大值时还没归零但人又触发移动，就让他变成1就好了
        if (this.count == this.totalCount) {
            this.count = 1;
        } else {
            this.count++;
        }
        this.onAttack();
    }

    backZero() {
        this.count = 0;
    }

    onAttack() {
        const { x: playerX, y: playerY } = DataManager.instance.player;
        if (playerX === this.x && playerY === this.y && this.count === this.totalCount) {
            EventManager.instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH);
        }
    }
}
