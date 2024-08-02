import { animation, AnimationClip, Sprite, SpriteFrame } from 'cc';
import ResourceManger from '../Runtime/ResourceManager';
import { StateMachine } from './StateMachine';
import { sortSpriteFrame } from '../Utils';

export const ANIMATION_SPEED = 1 / 8;

/**
 * 1. 需要知道animationClip
 * 2. 需要播放动画的能力Animation
 */
export default class state {
    private animationClip: AnimationClip;

    constructor(
        private fsm: StateMachine,
        private path: string,
        private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
        private speed: number = ANIMATION_SPEED,
    ) {
        this.init();
    }

    async init() {
        const promise = ResourceManger.instance.loadResource(this.path);
        this.fsm.waitingList.push(promise);

        const spriteFrames = await promise;
        this.animationClip = new AnimationClip();
        this.animationClip.duration = 1.0; // 整个动画剪辑的周期
        const track = new animation.ObjectTrack();
        track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame');
        const frames: Array<[number, SpriteFrame]> = sortSpriteFrame(spriteFrames).map((item, index) => [this.speed * index, item]);
        track.channel.curve.assignSorted(frames);
        // 最后将轨道添加到动画剪辑以应用
        this.animationClip.addTrack(track);
        this.animationClip.name = this.path;
        this.animationClip.duration = frames.length * this.speed;
        this.animationClip.wrapMode = this.wrapMode;
    }

    run() {
        if (this.fsm.animationComponent?.defaultClip?.name === this.animationClip.name) {
            return;
        }
        this.fsm.animationComponent.defaultClip = this.animationClip;
        this.fsm.animationComponent.play();
    }
}
