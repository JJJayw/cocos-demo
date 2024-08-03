import { _decorator, Component, director, Node } from 'cc';
import { TileMapManger } from 'db://assets/Script/Tile/TileMapManger';
import { createUINode } from '../../Utils';
import Levels, { ILevel } from 'db://assets/Levels/index';
import DataManger, { IRecord } from '../../Runtime/DataManager';
import { TILE_BASE_HEIGHT, TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import EventManager from '../../Runtime/EventManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, SCREEN_ENUM } from '../../Enums';
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
    private inited: boolean = false;

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
        EventManager.instance.on(EVENT_ENUM.RECORD_STEP, this.record, this);
        EventManager.instance.on(EVENT_ENUM.REVOKE_STEP, this.revoke, this);
        EventManager.instance.on(EVENT_ENUM.RESTART_LEVEL, this.initLevel, this);
        EventManager.instance.on(EVENT_ENUM.OUT_BATTLE, this.outBattle, this);
    }

    onDestroy() {
        // 销毁进入下一关事件
        EventManager.instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel);
        EventManager.instance.off(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke);
        EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived);
        EventManager.instance.off(EVENT_ENUM.RECORD_STEP, this.record);
        EventManager.instance.off(EVENT_ENUM.REVOKE_STEP, this.revoke);
        EventManager.instance.off(EVENT_ENUM.RESTART_LEVEL, this.initLevel);
        EventManager.instance.off(EVENT_ENUM.OUT_BATTLE, this.outBattle);
    }

    // 初始化关卡
    async initLevel() {
        const level = Levels[`level${DataManger.instance.levelIndex}`];
        if (level) {
            if (this.inited) {
                await FaderManager.instance.fadeIn();
            } else {
                await FaderManager.instance.mask();
            }
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
            this.inited = true;
        } else {
            // 没有关卡时退出战斗
            this.outBattle();
        }
    }

    async outBattle() {
        await FaderManager.instance.fadeIn();
        director.loadScene(SCREEN_ENUM.Start);
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

    record() {
        const item: IRecord = {
            player: {
                x: DataManger.instance.player.x,
                y: DataManger.instance.player.y,
                state:
                    DataManger.instance.player.state === ENTITY_STATE_ENUM.IDLE ||
                    DataManger.instance.player.state === ENTITY_STATE_ENUM.DEATH ||
                    DataManger.instance.player.state === ENTITY_STATE_ENUM.AIRDEATH
                        ? DataManger.instance.player.state
                        : ENTITY_STATE_ENUM.IDLE,
                direction: DataManger.instance.player.direction,
                type: DataManger.instance.player.type,
            },
            door: {
                x: DataManger.instance.door.x,
                y: DataManger.instance.door.y,
                state: DataManger.instance.door.state,
                type: DataManger.instance.door.type,
                direction: DataManger.instance.door.direction,
            },
            enemies: DataManger.instance.enemies.map(({ x, y, direction, state, type }) => ({
                x,
                y,
                direction,
                state,
                type,
            })),
            bursts: DataManger.instance.bursts.map(({ x, y, direction, state, type }) => ({
                x,
                y,
                direction,
                state,
                type,
            })),
            spikes: DataManger.instance.spikes.map(({ x, y, count, type }) => ({
                x,
                y,
                count,
                type,
            })),
        };
        DataManger.instance.records.push(item);
    }

    revoke() {
        const item = DataManger.instance.records.pop();
        if (item) {
            // 玩家
            DataManger.instance.player.x = DataManger.instance.player.targetX = item.player.x;
            DataManger.instance.player.y = DataManger.instance.player.targetY = item.player.y;
            DataManger.instance.player.direction = item.player.direction;
            DataManger.instance.player.state = item.player.state;

            // 门
            DataManger.instance.door.x = item.door.x;
            DataManger.instance.door.y = item.door.y;
            DataManger.instance.door.direction = item.door.direction;
            DataManger.instance.door.state = item.door.state;

            // 敌人
            for (let i = 0; i < DataManger.instance.enemies.length; i++) {
                const enemy = item.enemies[i];
                DataManger.instance.enemies[i].x = enemy.x;
                DataManger.instance.enemies[i].y = enemy.y;
                DataManger.instance.enemies[i].direction = enemy.direction;
                DataManger.instance.enemies[i].state = enemy.state;
            }

            // 地裂
            for (let i = 0; i < DataManger.instance.bursts.length; i++) {
                const burst = item.bursts[i];
                DataManger.instance.bursts[i].x = burst.x;
                DataManger.instance.bursts[i].y = burst.y;
                DataManger.instance.bursts[i].state = burst.state;
            }

            // 地刺
            for (let i = 0; i < DataManger.instance.spikes.length; i++) {
                const one = item.spikes[i];
                DataManger.instance.spikes[i].x = one.x;
                DataManger.instance.spikes[i].y = one.y;
                DataManger.instance.spikes[i].count = one.count;
                DataManger.instance.spikes[i].type = one.type;
            }
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
