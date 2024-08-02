import { _decorator, Component, game } from 'cc';
import EventManger from '../../Runtime/EventManager';
import { EVENT_ENUM, SHAKE_TYPE_ENUM } from '../../Enums';

const { ccclass, property } = _decorator;

@ccclass('ShakeManager')
export class ShakeManager extends Component {
    private isShaking = false;
    private oldTime: number = 0;
    private oldPos: { x: number; y: number } = { x: 0, y: 0 };
    private type: SHAKE_TYPE_ENUM;

    onLoad() {
        EventManger.instance.on(EVENT_ENUM.SCREEN_SHAKE, this.onshake, this);
    }

    onDestroy() {
        EventManger.instance.off(EVENT_ENUM.SCREEN_SHAKE, this.onshake);
    }

    stop() {
        this.isShaking = false;
    }

    onshake(type: SHAKE_TYPE_ENUM) {
        if (this.isShaking) {
            return;
        }
        this.type = type;
        this.oldTime = game.totalTime;
        this.isShaking = true;
        this.oldPos.x = this.node.position.x;
        this.oldPos.y = this.node.position.y;
    }

    update() {
        this.onShakeUpdate();
    }

    onShakeUpdate() {
        if (this.isShaking) {
            //振幅
            const shakeAmount = 1.6;
            //持续时间
            const duration = 200;
            //频率
            const frequency = 12;
            //当前时间
            const curSecond = (game.totalTime - this.oldTime) / 1000;
            //总时间
            const totalSecond = duration / 1000;
            const offset = shakeAmount * Math.sin(frequency * Math.PI * curSecond);
            if (this.type === SHAKE_TYPE_ENUM.TOP) {
                this.node.setPosition(this.oldPos.x, this.oldPos.y - offset);
            } else if (this.type === SHAKE_TYPE_ENUM.BOTTOM) {
                this.node.setPosition(this.oldPos.x, this.oldPos.y + offset);
            } else if (this.type === SHAKE_TYPE_ENUM.LEFT) {
                this.node.setPosition(this.oldPos.x - offset, this.oldPos.y);
            } else if (this.type === SHAKE_TYPE_ENUM.RIGHT) {
                this.node.setPosition(this.oldPos.x + offset, this.oldPos.y);
            }
            if (curSecond > totalSecond) {
                this.isShaking = false;
                this.node.setPosition(this.oldPos.x, this.oldPos.y);
            }
        }
    }
}
