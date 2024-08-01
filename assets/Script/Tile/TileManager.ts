import { _decorator, Component, Sprite, SpriteFrame, UITransform } from 'cc';
import { TILE_TYPE_ENUM } from '../../Enums';

// 瓦片基础高度
export const TILE_BASE_HEIGHT = 120;
// 瓦片宽度
export const TILE_WIDTH = 55;
// 瓦片高度
export const TILE_HEIGHT = 55;
const { ccclass, property } = _decorator;

@ccclass('TileManager')
export class TileManager extends Component {
    type: TILE_TYPE_ENUM;
    moveable: boolean;
    turnable: boolean;
    init(type: TILE_TYPE_ENUM, spriteFrame: SpriteFrame, i: number, j: number) {
        this.type = type;
        if (
            this.type === TILE_TYPE_ENUM.WALL_ROW ||
            this.type === TILE_TYPE_ENUM.WALL_COLUMN ||
            this.type === TILE_TYPE_ENUM.WALL_LEFT_TOP ||
            this.type === TILE_TYPE_ENUM.WALL_RIGHT_TOP ||
            this.type === TILE_TYPE_ENUM.WALL_LEFT_BOTTOM ||
            this.type === TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM
        ) {
            this.moveable = false;
            this.turnable = false;
        } else if (this.type === TILE_TYPE_ENUM.CLIFF_CENTER || this.type === TILE_TYPE_ENUM.CLIFF_LEFT || this.type === TILE_TYPE_ENUM.CLIFF_RIGHT) {
            this.moveable = false;
            this.turnable = true;
        } else if (this.type === TILE_TYPE_ENUM.FLOOR) {
            this.moveable = true;
            this.turnable = true;
        }

        const sprit = this.addComponent(Sprite);
        sprit.spriteFrame = spriteFrame;

        const transform = this.getComponent(UITransform);
        // 设置宽高
        transform.setContentSize(TILE_WIDTH, TILE_HEIGHT);

        // 设置瓦片的坐标
        this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT);
    }
}
