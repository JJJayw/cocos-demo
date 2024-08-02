import { EnemyManager } from '../Base/EnemyMagner';
import Singleton from '../Base/Singleton';
import { ITile } from '../Levels';
import { BurstManager } from '../Script/Burst/BurstManager';
import { DoorManager } from '../Script/Door/DoorManager';
import { PlayerManager } from '../Script/Player/PlayerManager';
import { SmokeManager } from '../Script/Smoke/SmokeManager';
import { SpikesManager } from '../Script/Spikes/SpikesManager';
import { TileManager } from '../Script/Tile/TileManager';

export default class DataManager extends Singleton {
    mapInfo: Array<Array<ITile>>;
    mapRowCount: number = 0;
    mapColumnCount: number = 0;
    levelIndex: number = 1;
    tileInfo: Array<Array<TileManager>>;
    player: PlayerManager;
    enemies: Array<EnemyManager>;
    door: DoorManager;
    bursts: Array<BurstManager>;
    spikes: Array<SpikesManager>;
    smoke:Array<SmokeManager>

    static get instance() {
        return super.getInstance<DataManager>();
    }

    reset() {
        this.mapInfo = [];
        this.tileInfo = [];
        this.enemies = [];
        this.bursts = [];
        this.spikes = [];
        this.smoke = [];
        this.mapRowCount = 0;
        this.mapColumnCount = 0;
        this.player = null;
        this.door = null;

    }
}
