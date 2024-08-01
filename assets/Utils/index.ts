import { Layers, Node, Sprite, SpriteFrame, UITransform } from 'cc';

export const createUINode = (name: string = '') => {
    const node = new Node(name);

    const transform = node.addComponent(UITransform);
    transform.setAnchorPoint(0, 1);
    node.layer = 1 << Layers.nameToLayer('UI_2D');
    return node;
};

export const randomByRange = (start: number, end: number) => {
    return Math.floor(start + (end - start) * Math.random());
};

// 正则表达式
const reg = /\((\d+)\)/;

const getNumberWithString = (str: string) => {
    return parseInt(str.match(reg)[1] || '0');
};

export const sortSpriteFrame = (spriteFrame: SpriteFrame[]) => spriteFrame.sort((a, b) => getNumberWithString(a.name) - getNumberWithString(b.name));

export const randomByLen = (len: number) => Array.from({ length: len }).reduce<string>((total, item) => total + Math.floor(Math.random() * 10), '');
