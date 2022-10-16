import { gl, GLUtils } from './gl/GL';
import { RESIZE_EVENT, Size } from './utils/Size';
import { Shader } from './gl/Shader';
import { Sprite } from './graphics/Sprite';
import { Matrix4x4 } from './utils/Matrix4x4';

export let engine: Engine;

export class Engine {
    private readonly _canvas: HTMLCanvasElement;
    private readonly _size: Size;
    private _shader?: Shader;
    private _sprite?: Sprite;
    private _projection?: Matrix4x4;

    constructor() {
        if (engine) {
            return engine;
        }
        engine = this;

        this._canvas = GLUtils.initialize('webgl');
        this._size = new Size(this._canvas);
        this._size.on(RESIZE_EVENT, () => {
            this.resize();
        });
    }

    start() {
        gl.clearColor(0, 0, 0, 1);

        this.loadShader();
        this._shader?.use();

        this._projection = Matrix4x4.orthographic(
            0,
            this._canvas.width,
            0,
            this._canvas.height,
            -100.0,
            100
        );

        this._sprite = new Sprite('test');
        this._sprite.load();
        this._sprite.position.x = 200;

        this.loop();
    }

    private loop() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        const colorPosition = this._shader?.getUniformLocation('u_FragColor');
        colorPosition && gl.uniform4f(colorPosition, 1, 0.5, 0, 1);

        const projectionPosition =
            this._shader?.getUniformLocation('u_Projection');
        projectionPosition &&
            this._projection?.data &&
            gl.uniformMatrix4fv(
                projectionPosition,
                false,
                new Float32Array(this._projection?.data)
            );

        const modelLocation = this._shader?.getUniformLocation('u_Model');
        modelLocation &&
            this._sprite &&
            gl.uniformMatrix4fv(
                modelLocation,
                false,
                new Float32Array(
                    Matrix4x4.translation(this._sprite.position).data
                )
            );

        this._sprite?.draw();

        requestAnimationFrame(this.loop.bind(this));
    }

    resize() {
        this._size.resize();
    }

    private loadShader() {
        const VSHADER_SOURCE = `
            attribute vec4 a_Position;
            uniform mat4 u_Projection;
            uniform mat4 u_Model;
            void main() {
              gl_Position = u_Projection * u_Model * a_Position;
            }
            `;

        const FSHADER_SOURCE = `
            precision mediump float;
            uniform vec4 u_FragColor;
            void main() {
              gl_FragColor = u_FragColor;
            }
            `;

        this._shader = new Shader('basic', VSHADER_SOURCE, FSHADER_SOURCE);
    }
}
