import { _decorator, Component, random, Sprite, UITransform } from 'cc';
import { IEntity } from '../Levels';
import { PlayerStateMachine } from '../Script/Player/PlayerStateMachine';
import { TILE_HEIGHT, TILE_WIDTH } from '../Script/Tile/TileManager';
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enums';
import { randomByLen } from '../Utils';

const { ccclass, property } = _decorator;

@ccclass('EntityManager')
export class EntityManager extends Component {
    id: string = randomByLen(12);
    x: number = 0;

    y: number = 0;

    fsm: PlayerStateMachine;

    private _direction: DIRECTION_ENUM;

    private _state: ENTITY_STATE_ENUM;

    private type: ENTITY_TYPE_ENUM;

    get direction() {
        return this._direction;
    }

    set direction(value: DIRECTION_ENUM) {
        this._direction = value;
        this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[this._direction]);
    }

    get state() {
        return this._state;
    }

    set state(value: ENTITY_STATE_ENUM) {
        this._state = value;
        this.fsm.setParams(this._state, true);
    }

    async init(parms: IEntity) {
        const sprite = this.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        const transform = this.getComponent(UITransform);
        transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);

        this.x = parms.x;
        this.y = parms.y;
        this.type = parms.type;
        this.direction = parms.direction;
        this.state = parms.state;
    }

    update() {
        this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5);
    }

    onDestroy() {}
}
