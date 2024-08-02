import { _decorator, Component, Node } from 'cc';
import { TileMapManger } from 'db://assets/Script/Tile/TileMapManger';
import { createUINode } from '../../Utils';
import Levels, { ILevel } from 'db://assets/Levels/index';
import DataManger from '../../Runtime/DataManager';
import { TILE_BASE_HEIGHT, TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import EventManager from '../../Runtime/EventManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enums';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';
import { DoorManager } from '../Door/DoorManager';
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager';
import { BurstManager } from '../Burst/BurstManager';
import { SpikesManager } from '../Spikes/SpikesManager';
import { SmokeManager } from '../Smoke/SmokeManager';
import FaderManager from '../../Runtime/FaderManager';
import { ShakeManager } from '../UI/ShakeManager';

const { ccclass, property } = _decorator;

@ccclass('BatteManger')
export class BatteManger extends Component {
    level: ILevel;
    stage: Node;
    private smokeLayer: Node;

    start() {
        this.generateStage();
        this.initLevel();
        // input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        // input.on(Input.EventType.KEY_PRESSING, this.onKeyDown, this);
    }

    onLoad() {
        // 绑定进入下一关事件
        EventManager.instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
        EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this);
        EventManager.instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this);
    }

    onDestroy() {
        // 销毁进入下一关事件
        EventManager.instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel);
        EventManager.instance.off(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke);
    }

    // 初始化关卡
    async initLevel() {
        const level = Levels[`level${DataManger.instance.levelIndex}`];
        if (level) {
            await FaderManager.instance.fadeIn();
            this.clearLevel();
            this.level = level;
            // 存储数据
            DataManger.instance.mapInfo = this.level.mapInfo;
            DataManger.instance.mapRowCount = this.level.mapInfo.length || 0;
            DataManger.instance.mapColumnCount = this.level.mapInfo[0].length || 0;
            await Promise.all([
                this.generateTileMap(),
                this.generateBurst(),
                this.generateSpikes(),
                this.generateSmokeLayer(),
                this.generateDoor(),
                this.generateEnmies(),
                this.generatePlayer(),
            ]);
            await FaderManager.instance.fadeOut();
        }
    }

    nextLevel() {
        DataManger.instance.levelIndex++;
        this.initLevel();
    }

    clearLevel() {
        this.stage.destroyAllChildren();
        DataManger.instance.reset();
    }

    // 生成烟雾画板层
    async generateSmokeLayer() {
        this.smokeLayer = createUINode();
        this.smokeLayer.setParent(this.stage);
    }

    // 生成烟雾
    async generateSmoke(x: number, y: number, direction: DIRECTION_ENUM) {
        const item = DataManger.instance.smoke.find(smoke => smoke.state === ENTITY_STATE_ENUM.DEATH);
        if (item) {
            item.x = x;
            item.y = y;
            item.direction = direction;
            item.state = ENTITY_STATE_ENUM.IDLE;
            item.node.setPosition(x * TILE_WIDTH - TILE_WIDTH * 1.5, -y * TILE_HEIGHT + TILE_HEIGHT * 1.5);
        } else {
            const smoke = createUINode();
            smoke.setParent(this.smokeLayer);
            const smokeManager = smoke.addComponent(SmokeManager);
            await smokeManager.init({
                x,
                y,
                direction,
                state: ENTITY_STATE_ENUM.IDLE,
                type: ENTITY_TYPE_ENUM.SMOKE,
            });
            DataManger.instance.smoke.push(smokeManager);
        }
    }

    // 生成舞台
    generateStage() {
        this.stage = createUINode();
        this.stage.setParent(this.node);
        this.stage.addComponent(ShakeManager);
    }

    // 生成地图
    async generateTileMap() {
        const tileMap = createUINode();
        tileMap.setParent(this.stage);
        const tileMapManger = tileMap.addComponent(TileMapManger);
        await tileMapManger.init();
        this.adaptPos();
    }

    // 适应地图位置
    adaptPos() {
        const { mapRowCount } = DataManger.instance;
        const disX = (TILE_WIDTH * mapRowCount) / 2;
        const disY = (TILE_HEIGHT * mapRowCount) / 2 + TILE_BASE_HEIGHT;
        this.stage.getComponent(ShakeManager).stop();
        this.stage.setPosition(-disX, disY);
    }

    // 生成玩家
    async generatePlayer() {
        const player = createUINode();
        player.setParent(this.stage);
        const playerManager = player.addComponent(PlayerManager);
        await playerManager.init(this.level.player);
        DataManger.instance.player = playerManager;
        EventManager.instance.emit(EVENT_ENUM.PLAYER_BORN, true);
    }

    // 生成敌人
    async generateEnmies() {
        const promise = [];
        for (let i = 0; i < this.level.enemies.length; i++) {
            const enemy = this.level.enemies[i];
            const node = createUINode();
            node.setParent(this.stage);

            const Manager = enemy.type === ENTITY_TYPE_ENUM.WOODEN_SKELETON ? WoodenSkeletonManager : IronSkeletonManager;
            const manager = node.addComponent(Manager);
            promise.push(manager.init(enemy));
            DataManger.instance.enemies.push(manager);
        }
        await Promise.all(promise);
    }

    // 生成门
    async generateDoor() {
        const door = createUINode();
        door.setParent(this.stage);
        const doorManager = door.addComponent(DoorManager);
        await doorManager.init(this.level.door);
        DataManger.instance.door = doorManager;
    }

    async generateBurst() {
        const promise = [];
        for (let i = 0; i < this.level.bursts.length; i++) {
            const burst = this.level.bursts[i];
            const node = createUINode();
            node.setParent(this.stage);

            const burstManager = node.addComponent(BurstManager);
            promise.push(burstManager.init(burst));
            DataManger.instance.bursts.push(burstManager);
        }
        await Promise.all(promise);
    }

    async generateSpikes() {
        const promise = [];
        for (let i = 0; i < this.level.spikes.length; i++) {
            const spike = this.level.spikes[i];
            const node = createUINode();
            node.setParent(this.stage);

            const spikesManager = node.addComponent(SpikesManager);
            promise.push(spikesManager.init(spike));
            DataManger.instance.spikes.push(spikesManager);
        }
        await Promise.all(promise);
    }

    checkArrived() {
        if (!DataManger.instance.door || !DataManger.instance.player) {
            return;
        }
        const { x: playerX, y: playerY } = DataManger.instance.player;
        const { x: doorX, y: doorY, state: doorState } = DataManger.instance.door;
        if (doorState === ENTITY_STATE_ENUM.DEATH && playerX === doorX && playerY === doorY) {
            EventManager.instance.emit(EVENT_ENUM.NEXT_LEVEL, true);
        }
    }

    // onKeyDown(event: EventKeyboard) {
    //     console.log(event);
    //     switch (event.keyCode) {
    //         case KeyCode.KEY_A:
    //             console.log('turn down a');
    //             break;
    //         case KeyCode.KEY_S:
    //             console.log('turn down s');
    //             break;
    //     }
    // }
}
