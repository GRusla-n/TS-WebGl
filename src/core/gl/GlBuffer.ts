import { gl } from './GL';

export class AttributeInfo {
    location?: number;
    size?: number;
    offset?: number;

    constructor(location?: number, size?: number, offset?: number) {
        this.location = location;
        this.size = size;
        this.offset = offset;
    }
}

export class GlBuffer {
    private _hasAttributeLocation: boolean = false;

    private _elementSize: number;
    private _stride: number;
    private _buffer: WebGLBuffer;

    private _targetBufferType: number;
    private _dataType: number;
    private _mode: number;
    private _typeSize: number;

    private _data: number[] = [];
    private _attributes: AttributeInfo[] = [];

    /**
     * Create a new GL buffer
     * @param elementSize
     * @param dataType
     * @param targetBufferType
     * @param mode
     */

    constructor(
        elementSize: number,
        dataType: number = gl.FLOAT,
        targetBufferType: number = gl.ARRAY_BUFFER,
        mode: number = gl.TRIANGLES
    ) {
        this._elementSize = elementSize;
        this._dataType = dataType;
        this._targetBufferType = targetBufferType;
        this._mode = mode;

        switch (this._dataType) {
            case gl.FLOAT:
            case gl.INT:
            case gl.UNSIGNED_INT:
                this._typeSize = 4;
                break;
            case gl.SHORT:
            case gl.UNSIGNED_SHORT:
                this._typeSize = 2;
                break;
            case gl.BYTE:
            case gl.UNSIGNED_BYTE:
                this._typeSize = 1;
                break;
            default:
                throw new Error('Unrecognized dataType:' + dataType.toString());
        }

        this._stride = this._typeSize * this._elementSize;
        this._buffer = gl.createBuffer()!;
    }

    destroy() {
        gl.deleteBuffer(this._buffer);
    }

    bind(normalized: boolean = false) {
        gl.bindBuffer(this._targetBufferType, this._buffer);

        if (this._hasAttributeLocation) {
            for (const a of this._attributes) {
                gl.vertexAttribPointer(
                    a.location,
                    a.size,
                    this._dataType,
                    normalized,
                    this._stride,
                    a.offset * this._typeSize
                );
                gl.enableVertexAttribArray(a.location);
            }
        }
    }

    unbind() {
        for (let a of this._attributes) {
            a.location && gl.disableVertexAttribArray(a.location);
        }

        gl.bindBuffer(this._targetBufferType, null);
    }

    addAttributeLocation(info: AttributeInfo) {
        this._hasAttributeLocation = true;
        this._attributes.push(info);
    }

    pushBackData(data: number[]) {
        for (const d of data) {
            this._data.push(d);
        }
    }

    upload() {
        gl.bindBuffer(this._targetBufferType, this._buffer);

        let bufferData: ArrayBuffer;
        switch (this._dataType) {
            case gl.FLOAT:
                bufferData = new Float32Array(this._data);
                break;
            case gl.INT:
                bufferData = new Int32Array(this._data);
                break;
            case gl.UNSIGNED_INT:
                bufferData = new Uint32Array(this._data);
                break;
            case gl.SHORT:
                bufferData = new Int16Array(this._data);
                break;
            case gl.UNSIGNED_SHORT:
                bufferData = new Uint16Array(this._data);
                break;
            case gl.BYTE:
                bufferData = new Int8Array(this._data);
                break;
            case gl.UNSIGNED_BYTE:
                bufferData = new Uint8Array(this._data);
                break;
        }

        gl.bufferData(this._targetBufferType, bufferData, gl.STATIC_DRAW);
    }

    draw() {
        if (this._targetBufferType === gl.ARRAY_BUFFER) {
            gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
        } else if (this._targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
            gl.drawElements(this._mode, this._data.length, this._dataType, 0);
        }
    }
}
