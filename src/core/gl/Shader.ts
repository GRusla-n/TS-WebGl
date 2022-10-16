import { gl } from './GL';

export class Shader {
    private readonly _name: string;
    private _program?: WebGLProgram;
    private _attributes: { [name: string]: number } = {};
    private _uniforms: { [name: string]: WebGLUniformLocation } = {};

    constructor(name: string, VSource: string, FSource: string) {
        this._name = name;
        const VShader = this.loadShader(VSource, gl.VERTEX_SHADER);
        const FShader = this.loadShader(FSource, gl.FRAGMENT_SHADER);

        if (VShader && FShader) {
            this.createProgram(VShader, FShader);
        }

        this.detectAttributes();
        this.detectUniforms();
    }

    get name() {
        return this._name;
    }

    use() {
        gl.useProgram(this._program!);
    }

    getAttributeLocation(attributeName: string) {
        const attributeLocation = this._attributes[attributeName];

        if (attributeLocation === undefined) {
            throw new Error(
                `Unable to find attribute ${attributeName} in shader ${this._name}`
            );
        }

        return attributeLocation!;
    }

    getUniformLocation(uniformName: string) {
        const uniformLocation = this._uniforms[uniformName];

        if (uniformLocation === undefined) {
            throw new Error(
                `Unable to find attribute ${uniformLocation} in shader ${this._name}`
            );
        }

        return uniformLocation!;
    }

    private loadShader(source: string, shaderType: number) {
        const shader = gl.createShader(shaderType);
        if (shader == null) {
            console.error('unable to create shader');
            return null;
        }

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        const error = gl.getShaderInfoLog(shader);

        if (error) {
            throw new Error(`Error compile shader ${this._name}:` + error);
        }

        return shader;
    }

    private createProgram(VShader: WebGLShader, FShader: WebGLShader) {
        const program = gl.createProgram();

        if (program) {
            gl.attachShader(program, VShader);
            gl.attachShader(program, FShader);
            gl.linkProgram(program);

            const error = gl.getProgramInfoLog(program);
            if (error) {
                throw new Error(`Error linking shader ${this._name}:` + error);
            }

            this._program = program;
        }
    }

    private detectAttributes() {
        if (this._program) {
            const attributeCount = gl.getProgramParameter(
                this._program,
                gl.ACTIVE_ATTRIBUTES
            );
            for (let i = 0; i < attributeCount; i++) {
                const attributeInfo = gl.getActiveAttrib(this._program, i);
                if (!attributeInfo) {
                    break;
                }

                this._attributes[attributeInfo.name] = gl.getAttribLocation(
                    this._program,
                    attributeInfo.name
                );
            }
        }
    }

    private detectUniforms() {
        if (this._program) {
            const uniformCount = gl.getProgramParameter(
                this._program,
                gl.ACTIVE_UNIFORMS
            );

            for (let i = 0; i < uniformCount; i++) {
                const uniformInfo = gl.getActiveUniform(this._program, i);
                if (!uniformInfo) {
                    break;
                }

                this._uniforms[uniformInfo.name] = gl.getUniformLocation(
                    this._program,
                    uniformInfo.name
                )!;
            }
        }
    }
}
