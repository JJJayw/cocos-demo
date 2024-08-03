import { _decorator, Component, Node, director } from 'cc';
import { SCREEN_ENUM } from '../../Enums';
import FaderManager from '../../Runtime/FaderManager';

const { ccclass, property } = _decorator;

@ccclass('StartManager')
export class StartManager extends Component {
    onLoad() {
        FaderManager.instance.fadeOut(1000);
        this.node.once(Node.EventType.TOUCH_END, this.handleStart, this);
    }
    async handleStart() {
        await FaderManager.instance.fadeIn(300);
        director.loadScene(SCREEN_ENUM.Battle);
    }
}
