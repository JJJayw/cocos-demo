export enum TILE_TYPE_ENUM {
    WALL_ROW = 'WALL_ROW',
    WALL_COLUMN = 'WALL_COLUMN',
    WALL_LEFT_TOP = 'WALL_LEFT_TOP',
    WALL_LEFT_BOTTOM = 'WALL_LEFT_BOTTOM',
    WALL_RIGHT_BOTTOM = 'WALL_RIGHT_BOTTOM',
    WALL_RIGHT_TOP = 'WALL_RIGHT_TOP',
    CLIFF_CENTER = 'CLIFF_CENTER',
    CLIFF_LEFT = 'CLIFF_LEFT',
    CLIFF_RIGHT = 'CLIFF_RIGHT',
    FLOOR = 'FLOOR',
}

export enum EVENT_ENUM {
    NEXT_LEVEL = 'NEXT_LEVEL',
    PLAYER_CTRL = 'PLAYER_CTRL',
    PLAYER_MOVE_END = 'PLAYER_MOVE_END',
    PLAYER_BORN = 'PLAYER_BORN',
    ATTACK_PLAYER = 'ATTACK_PLAYER',
    ATTACK_ENEMY = 'ATTACK_ENEMY',
    DOOR_OPEN = 'DOOR_OPEN',
}

export enum CONTROLLER_ENUM {
    TOP = 'TOP',
    BOTTOM = 'BOTTOM',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    TURNLEFT = 'TURNLEFT',
    TURNRIGHT = 'TURNRIGHT',
}

export enum FSM_PARAMS_TYPE_ENUM {
    TRIGGER = 'TRIGGER',
    NUMBER = 'NUMBER',
}

export enum PARAMS_NAME_ENUM {
    IDLE = 'IDLE',
    TURNLEFT = 'TURNLEFT',
    TURNRIGHT = 'TURNRIGHT',
    DIRECTION = 'DIRECTION',
    BLOCKFRONT = 'BLOCKFRONT',
    BLOCKBACK = 'BLOCKBACK',
    BLOCKLEFT = 'BLOCKLEFT',
    BLOCKRIGHT = 'BLOCKRIGHT',
    BLOCKTURNLEFT = 'BLOCKTURNLEFT',
    BLOCKTURNRIGHT = 'BLOCKTURNRIGHT',
    ATTACK = 'ATTACK',
    DEATH = 'DEATH',
    AIRDEATH = 'AIRDEATH',
    SPIKES_CUR_COUNT = 'SPIKES_CUR_COUNT',
    SPIKES_TOTAL_COUNT = 'SPIKES_TOTAL_COUNT',
}

export enum DIRECTION_ENUM {
    TOP = 'TOP',
    BOTTOM = 'BOTTOM',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
}

export enum ENTITY_STATE_ENUM {
    IDLE = 'IDLE',
    TURNLEFT = 'TURNLEFT',
    TURNRIGHT = 'TURNRIGHT',
    BLOCKFRONT = 'BLOCKFRONT',
    BLOCKBACK = 'BLOCKBACK',
    BLOCKLEFT = 'BLOCKLEFT',
    BLOCKRIGHT = 'BLOCKRIGHT',
    BLOCKTURNLEFT = 'BLOCKTURNLEFT',
    BLOCKTURNRIGHT = 'BLOCKTURNRIGHT',
    ATTACK = 'ATTACK',
    DEATH = 'DEATH',
    AIRDEATH = 'AIRDEATH',
}

export enum DIRECTION_ORDER_ENUM {
    TOP = 0,
    BOTTOM = 1,
    LEFT = 2,
    RIGHT = 3,
}

export enum ENTITY_TYPE_ENUM {
    PLAYER = 'PLAYER',
    WOODEN_SKELETON = 'WOODEN_SKELETON',
    IRON_SKELETON = 'IRON_SKELETON',
    DOOR = 'DOOR',
    BURST = 'BURST',
    SPIKES_ONE = 'SPIKES_ONE',
    SPIKES_TWO = 'SPIKES_TWO',
    SPIKES_THREE = 'SPIKES_THREE',
    SPIKES_FOUR = 'SPIKES_FOUR',
}

export enum SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM {
    SPIKES_ONE = 2,
    SPIKES_TWO = 3,
    SPIKES_THREE = 4,
    SPIKES_FOUR = 5,
}

export enum SPIKES_COUNT_ENUM {
    ZERO = 'ZERO',
    ONE = 'ONE',
    TWO = 'TWO',
    THREE = 'THREE',
    FOUR = 'FOUR',
    FIVE = 'FIVE',
}

export enum SPIKES_COUNT_MAP_NUMBER_ENUM {
    ZERO = 0,
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
}