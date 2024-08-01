import { _decorator, Component } from 'cc';
import { TileManager } from './TileManager';
import { createUINode, randomByRange } from '../../Utils';
import DataManger from '../../Runtime/DataManager';
import ResourceManger from '../../Runtime/ResourceManager';

const { ccclass, property } = _decorator;

@ccclass('TileMapManger')
export class TileMapManger extends Component {
    async init() {
        // 加载地图资源
        const spritFrames = await ResourceManger.instance.loadResource('texture/tile/tile');

        const { mapInfo } = DataManger.instance;
        DataManger.instance.tileInfo = [];
        // 瓦片
        for (let i = 0; i < mapInfo.length; i++) {
            const column = mapInfo[i];
            DataManger.instance.tileInfo[i] = [];
            for (let j = 0; j < column.length; j++) {
                const item = column[j];
                //  遇到空信息
                if (item.src == null || item.type == null) {
                    continue;
                }
                // 获取图片路径
                let randomNumber = item.src;
                if ((randomNumber === 1 || randomNumber === 5 || randomNumber === 9) && i % 2 === 0 && j % 2 === 0) {
                    randomNumber += randomByRange(0, 4);
                }
                const imgSrc = `tile (${randomNumber})`;
                const node = createUINode();

                const spriteFrame = spritFrames.find(v => v.name === imgSrc) || spritFrames[0];

                const tileManger = node.addComponent(TileManager);
                const type = item.type;
                tileManger.init(type, spriteFrame, i, j);
                DataManger.instance.tileInfo[i][j] = tileManger;
                node.setParent(this.node);
            }
        }
    }
}
