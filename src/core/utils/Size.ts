import Events from 'events';
import { gl } from '../gl/GL';

export const RESIZE_EVENT = 'resize';

export class Size extends Events {
    _canvas: HTMLCanvasElement;

    width: number;
    height: number;

    constructor(canvas: HTMLCanvasElement) {
        super();

        this._canvas = canvas;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this._canvas.width = this.width;
        this._canvas.height = this.height;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        window.addEventListener('resize', () => {
            this.emit(RESIZE_EVENT);
        });
    }

    resize() {
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
        gl.viewport(-1, 1, -1, 1);
    }
}
