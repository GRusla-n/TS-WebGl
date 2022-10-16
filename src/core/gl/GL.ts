export let gl: WebGLRenderingContext;

export class GLUtils {
    static initialize(canvasElementId: string) {
        const canvas = document.getElementById(
            canvasElementId
        ) as HTMLCanvasElement;
        const webglContext = canvas?.getContext('webgl');

        if (webglContext) {
            gl = webglContext;
        } else {
            throw new Error('Unable to init WebGL');
        }

        return canvas;
    }
}
