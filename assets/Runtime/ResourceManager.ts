import { resources, SpriteFrame } from 'cc';
import Singleton from '../Base/Singleton';

export default class ResourceManager extends Singleton {
    static get instance() {
        return super.getInstance<ResourceManager>();
    }

    // 加载静态资源
    loadResource(path: string, type: typeof SpriteFrame = SpriteFrame) {
        return new Promise<SpriteFrame[]>((resolve, reject) => {
            resources.loadDir(path, type, function (err, assets) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(assets);
            });
        });
    }
}
