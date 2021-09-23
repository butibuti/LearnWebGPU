import { ScriptElementKind } from "typescript";
import ButiLib=require("../ButiLib")
window.addEventListener("DOMContentLoaded", init);

class MouseListner extends ButiLib.IObject{
    mx=0.0;
    my=0.0;

    OnMouseMove(e:MouseEvent){
        this.mx=e.offsetX/512.0;
        this.my=e.offsetY/512.0;
    }
}

function init() {

    var c:HTMLCanvasElement=document.getElementById('myCanvas')as HTMLCanvasElement;
    var context:WebGLRenderingContext;
    // canvas サイズ
    const width=512;
    const height=512;
    c.width = width; c.height =height;
    
    // エレメントを取得
    
    // イベントリスナー登録
    //c.addEventListener('mousemove', mouseMove, true);
    //eCheck.addEventListener('change', checkChange, true);
    
    // WebGL コンテキストを取得
    context =( c.getContext('webgl') || c.getContext('experimental-webgl')) as WebGLRenderingContext;
    
    // シェーダ周りの初期化

    var program = context.createProgram()as WebGLProgram;
    
    var vs=CreateVertexShader((document.getElementById("vs") as HTMLScriptElement).text );
    var fs=CreateFragmentShader((document.getElementById("fs") as HTMLScriptElement).text );
        // プログラムオブジェクトにシェーダを割り当てる
    context.attachShader(program, vs);
    context.attachShader(program, fs);
        
        // シェーダをリンク
    context.linkProgram(program);
    context.useProgram(program);

    var uniLocation=new Array<WebGLUniformLocation>();
    uniLocation.push( context.getUniformLocation(program, 'time') as WebGLUniformLocation);
    uniLocation.push(context.getUniformLocation(program, 'mouse')as WebGLUniformLocation);
    uniLocation.push( context.getUniformLocation(program, 'resolution')as WebGLUniformLocation);
    

    // 頂点データ回りの初期化
    var position :Array<number>= [
        -1.0,  1.0,  0.0,
         1.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
    ];
    var index :Array<number>= [
        0, 2, 1,
        1, 2, 3
    ];
    var vPosition = CreateVBO(position);
    var vIndex = CreateIBO(index);
    var vAttLocation = context.getAttribLocation(program, 'position');
    context.bindBuffer(context.ARRAY_BUFFER, vPosition);
    context.enableVertexAttribArray(vAttLocation);
    context.vertexAttribPointer(vAttLocation, 3, context.FLOAT, false, 0, 0);
    context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, vIndex);
    
    // その他の初期化
    context.clearColor(0.0, 0.0, 0.0, 1.0);
    var listner=new MouseListner();

    ButiLib.EventManager.RegistMouseMoveIObjectEvent(listner,"listner",c);

    var startTime = new Date().getTime();
    
    // レンダリング関数呼出
    var time=0;
    render();


    function render(){
        
    requestAnimationFrame(render);
        // 時間管理
        time = (new Date().getTime() - startTime) * 0.001;
        
        // カラーバッファをクリア
        context.clear(context.COLOR_BUFFER_BIT);
        
        // uniform 関連
        context.uniform1f(uniLocation[0],time );
        context.uniform2fv(uniLocation[1], [listner.mx, listner.my]);
        context.uniform2fv(uniLocation[2], [width ,height]);
        
        // 描画
        context.drawElements(context.TRIANGLES, 6, context.UNSIGNED_SHORT, 0);
        context.flush();
        
    }

    function CreateVertexShader(arg_source:string):WebGLShader{
        var shader:WebGLShader;
        shader =context.createShader(context.VERTEX_SHADER) as WebGLShader;
        // 生成されたシェーダにソースを割り当てる
        context.shaderSource(shader, arg_source);
        
    
        
        // シェーダをコンパイルする
        context.compileShader(shader);
        // シェーダが正しくコンパイルされたかチェック
        if(context.getShaderParameter(shader,context.COMPILE_STATUS)){
            
            // 成功していたらシェーダを返して終了
            return shader;
        }else{
            
            console.log("vertex shader failed");
            // 失敗していたらエラーログをアラートする
            alert(context.getShaderInfoLog(shader));
            return shader;
        }
    }
    function CreateFragmentShader(arg_source:string):WebGLShader{
        var shader:WebGLShader;
        shader = context.createShader(context.FRAGMENT_SHADER)as WebGLShader;
        
        
        
        // 生成されたシェーダにソースを割り当てる
        context.shaderSource(shader, arg_source);
        
        // シェーダをコンパイルする
        context.compileShader(shader);
        // シェーダが正しくコンパイルされたかチェック
        if(context.getShaderParameter(shader, context.COMPILE_STATUS)){
            
            // 成功していたらシェーダを返して終了
            return shader;
        }else{
            
            console.log("fragment shader failed");
            // 失敗していたらエラーログをアラートする
            alert(context.getShaderInfoLog(shader));
            return shader;
        }
    }
    function CreateVBO(arg_data:Array<number>):WebGLBuffer{

        // バッファオブジェクトの生成
        var vbo = context.createBuffer() as WebGLBuffer;
        
        // バッファをバインドする
        context.bindBuffer(context.ARRAY_BUFFER, vbo);
        
        // バッファにデータをセット
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(arg_data), context.STATIC_DRAW);
        
        // バッファのバインドを無効化
        context.bindBuffer(context.ARRAY_BUFFER, null);
        
        // 生成したVBOを返して終了
        return vbo;
      }
    function CreateIBO(arg_data:Array<number>):WebGLBuffer{
  
        // バッファオブジェクトの生成
        var ibo:WebGLBuffer = context.createBuffer()as WebGLBuffer;
        
        // バッファをバインドする
        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, ibo);
        
        // バッファにデータをセット
        context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Int16Array(arg_data), context.STATIC_DRAW);
        
        // バッファのバインドを無効化
        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);
        
        // 生成したIBOを返して終了
        return ibo;
      }
}