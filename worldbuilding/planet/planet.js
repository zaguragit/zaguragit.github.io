main();

function main() {
    const canvas = document.querySelector("#canvas");
    const gl = canvas.getContext("webgl");
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    const vertexShaderSource = `
        attribute vec2 a_position;
        uniform vec2 u_resolution;

        varying vec2 uv;
        
        void main() {
            // gl_Position is a special variable a vertex shader
            // is responsible for setting
            gl_Position = vec4(a_position * normalize(u_resolution).yx, 0.0, 1.0);
            uv = a_position;
        }
    `;
    const fragmentShaderSource = `
        precision mediump float;
        
        uniform sampler2D u_image;
        varying vec2 uv;

        #define MAX_STEPS 100

        #define MAX_DIST 100.0
        #define MIN_DIST 0.0002

        float sdfSphere(vec3 c, float r, vec3 p) {
            return distance(p, c) - r - texture2D(u_image, p.xy * 0.5 + 0.5).r * 0.05;
        }

        float getDist(vec3 p) {
            return sdfSphere(vec3(0.0), 0.8, p);
        }

        float rayMarch(vec3 ro, vec3 rd) {
            float dist = 0.0;
            for (int i = 0; i < MAX_STEPS; i++) {
                vec3 itPos = ro + rd * dist;
                float itDist = getDist(itPos);
                dist += itDist;
                if (dist > MAX_DIST || dist < MIN_DIST)  
                    break;
            }
            return dist;
        }

        vec3 getNormal(vec3 p) {
            vec2 e = vec2(0.01, 0.);    
            return normalize(vec3(getDist(p + e.xyy), getDist(p + e.yxy), getDist(p + e.yyx)));    
        }

        float getLight(vec3 p) {
            vec3 lightPos = vec3(sin(1.0 * 3.), 3., -2.2);
            vec3 lightDir = normalize(p - lightPos);
            return -dot(getNormal(p), lightDir);    
        }

        void main() {
            float focalDist = 0.6;
            vec3 ro = vec3(0.0, 0.0, -1.6);
            vec3 rd = vec3(uv, focalDist);   
            vec3 col = vec3(0.01);
            
            float dist = rayMarch(ro, rd);
            if (dist < MAX_DIST) {
                vec3 pHit = ro + rd * dist;
                col = vec3(0.5, 0.6, 0.6);
                col *= vec3(getLight(pHit)) + vec3(0.1);
            }
            gl_FragColor = vec4(col, 1.0);
        }
    `;
     
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, -1, 1, 1, -1,
        -1,  1,  1, 1, 1, -1,
    ]), gl.STATIC_DRAW);
    // webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    let heightMap = createTexture(gl, "https://zagura.one/worldbuilding/planet/texture.jpg");
    gl.bindTexture(gl.TEXTURE_2D, heightMap);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    draw(gl);
}

function draw(gl) {

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function createTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    const image = new Image();
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        
        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        
        draw(gl);
    };
    image.src = url;
    return texture;
}

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}