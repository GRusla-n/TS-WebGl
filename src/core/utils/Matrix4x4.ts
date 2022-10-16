import { Vector3 } from './Vector3';

export class Matrix4x4 {
    private _data: number[] = [];

    private constructor() {
        // prettier-ignore
        this._data = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    }

    get data() {
        return this._data;
    }

    static identity() {
        return new Matrix4x4();
    }

    static orthographic(
        left: number,
        right: number,
        bottom: number,
        top: number,
        nearClip: number,
        farClip: number
    ) {
        const m = new Matrix4x4();

        const lr = 1.0 / (left - right);
        const bt = 1.0 / (bottom - top);
        const nf = 1.0 / (nearClip - farClip);

        m._data[0] = -2.0 * lr;
        m._data[5] = -2.0 * bt;
        m._data[10] = -2.0 * nf;
        m._data[12] = (left + right) * lr;
        m._data[13] = (top + bottom) * bt;
        m._data[14] = (nearClip + farClip) * nf;

        return m;
    }

    static translation(position: Vector3) {
        const m = new Matrix4x4();

        m._data[12] = position.x;
        m._data[13] = position.y;
        m._data[14] = position.z;

        return m;
    }
}
