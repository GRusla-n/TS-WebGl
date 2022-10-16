import { gl } from '../gl/GL';
import { AttributeInfo, GlBuffer } from '../gl/GlBuffer';
import { Vector3 } from '../utils/Vector3';

export class Sprite {
    private _width: number;
    private _height: number;
    private _name: string;
    private _buffer?: GlBuffer;

    position: Vector3 = new Vector3();

    constructor(name: string, width: number = 100, height: number = 100) {
        this._name = name;
        this._width = width;
        this._height = height;
    }

    load() {
        this._buffer = new GlBuffer(
            2,
            gl.FLOAT,
            gl.ARRAY_BUFFER,
            gl.TRIANGLE_STRIP
        );
        const attributeInfo = new AttributeInfo(0, 2, 0);
        if (this._buffer) {
            // prettier-ignore
            const vertices = [
                this._width, this._height,
                this._width, 0,
                0, this._height,
                0, 0,
            ];
            this._buffer.addAttributeLocation(attributeInfo);
            this._buffer.pushBackData(vertices);
            this._buffer.upload();
            this._buffer.unbind();
        }
    }

    update(time: number) {}

    draw() {
        this._buffer?.bind();
        this._buffer?.draw();
    }
}
