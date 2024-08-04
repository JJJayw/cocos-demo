import { _decorator, Component, director, resources, ProgressBar } from 'cc';
import { SCREEN_ENUM } from '../../Enums';

const { ccclass, property } = _decorator;

@ccclass('LoadingManager')
export class LoadingManager extends Component {
    @property(ProgressBar)
    bar: ProgressBar;
    onLoad() {
        resources.preloadDir(
            'texture',
            (cur, total) => {
                this.bar.progress = cur / total;
            },
            () => {
                director.loadScene(SCREEN_ENUM.Start);
            },
        );
    }
}
