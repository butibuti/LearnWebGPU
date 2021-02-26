import THREE = require("three");
import IObject =require("../IObject")
window.addEventListener("DOMContentLoaded", init);

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { isCallChain } from "typescript";
class SceneWrapper{
  private scene:THREE.Scene;
  private map_DrawObj=new Map<String,THREE.Object3D>();
  constructor(){
    this.scene=new THREE.Scene();
  }
  /**
   * AddDrawObject
 arg_obj: THREE.Object3D   */
  public AddDrawObject( arg_obj: THREE.Object3D,arg_objName:string):string {
    if(this.map_DrawObj.has(arg_objName)){
      var output:string=arg_objName;
      var hasCount=1;
      while(this.map_DrawObj.has(output+"_"+hasCount)){

        hasCount++;
      }
      this.map_DrawObj.set(output+"_"+hasCount,arg_obj);
      this.scene.add(arg_obj);
      return output+"_"+hasCount;
    }
    this.map_DrawObj.set(arg_objName,arg_obj);
    this.scene.add(arg_obj);
    return arg_objName;
  }
  /**
   * RemoveDrawObject
arg_objName:string   */
  public RemoveDrawObject(arg_objName:string) {  
    if(!this.map_DrawObj.has(arg_objName)){
      return;
    }
    var removeObj=this.map_DrawObj.get(arg_objName) as THREE.Object3D;
    this.map_DrawObj.delete(arg_objName);

    this.scene.remove(removeObj);
  }
  /**
   * GetDrawObject
   */
  public GetDrawObject(arg_objName:string) :THREE.Object3D{
    
    return this.map_DrawObj.get(arg_objName) as THREE.Object3D;
  }

  get Scene():THREE.Scene{
    return this.scene;
  }
  
}

class CameraWrapper{
  private camera:THREE.Camera;
  constructor(arg_fov:number,arg_width:number,arg_height:number,arg_near:number,arg_far:number, arg_isPerse:boolean){
    if(arg_isPerse){

      this.camera = new THREE.PerspectiveCamera(
        arg_fov,
        arg_width / arg_height,
        arg_near,
        arg_far
      );
    }else{
      this.camera=new  THREE.OrthographicCamera(-arg_width/2,arg_width/2,-arg_height/2,arg_height/2,arg_near,arg_height);
    }
  }
  get Camera():THREE.Camera{
    return this.camera;
  }
}

class EditorCameraMan extends IObject.IObject{
  isClick_L:boolean=false;
  isClick_R:boolean=false;
  camera:CameraWrapper ;
  constructor(arg_camera:CameraWrapper){
    super();
    this.camera=arg_camera;
  }
  OnMouseButtonDown(e:MouseEvent) :void{
    const button=e.button;
    if(button==0){
      this.isClick_L=true;
    }else if(button==2){
      this.isClick_R=true;
    }
    
  }
  OnMouseButtonUp(e:MouseEvent) :void{
    const button=e.button;
    if((button==0)){
      this.isClick_L=false;
    }
    if(button==2){
      this.isClick_R=false;
    }
  }
  OnMouseWheel(e:WheelEvent):void{
    const vector=e.deltaY;
    this.camera.Camera.translateOnAxis(new THREE.Vector3(0,0,1),vector*0.001);
  }
  OnMouseMove(e:MouseEvent):void{
    if(this.isClick_L){
    this.camera.Camera.translateOnAxis(new THREE.Vector3(1,0,0),e.movementX *0.01);
    this.camera.Camera.translateOnAxis(new THREE.Vector3(0,1,0),e.movementY *-0.01);
    return;
    }else if(this.isClick_R){
    this.camera.Camera.rotateOnAxis(new THREE.Vector3(1,0,0),e.movementY *-0.01)
    this.camera.Camera.rotateOnWorldAxis(new THREE.Vector3(0,1,0),e.movementX *-0.01)
    }
  }
}

class RendererWrapper{
  
  private renderer:THREE.Renderer;
  
  constructor(arg_renderer:THREE.Renderer){
    this.renderer=arg_renderer;
  }
}

const outlineVertexShader =  [
  "uniform float offset;",
  THREE.ShaderChunk["common"],
  THREE.ShaderChunk["skinning_pars_vertex"], 
  "void main() {",
     "vec3 transformed = vec3(position + normal * offset);",
     THREE.ShaderChunk["skinbase_vertex"],
     THREE.ShaderChunk["skinning_vertex"],
     THREE.ShaderChunk["project_vertex"],
  "}"
].join( "\n" )

const fragOut = `
uniform vec3 uOutlineColor;
void main( void ) {
  gl_FragColor = vec4(uOutlineColor, 1.0 );
}
`

const vertex_default= `
varying vec2 vUv;
void main() {
  vUv=uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}
`

const frag_post = `
varying vec2 vUv;
uniform sampler2D uTex;
void main() {

  vec4 color= texture2D(uTex, vUv);
  float postValue=8.0f;
  float r=float(floor(color.r*postValue))/(postValue);
  float g=float(floor(color.g*postValue))/(postValue);
  float b=float(floor(color.b*postValue))/(postValue);

  gl_FragColor = vec4(r,g,b , color.a );
}
`

class OutlineUniform extends IObject.IObject{
  range:HTMLInputElement;
  color:HTMLInputElement;

  value: {
    uOutlineColor: {
        value: THREE.Color;
    };
    offset: {
        value: number;
    };
}

  OnMouseMove(event:MouseEvent){
    this.value.offset.value=Number( this.range.value) *0.001;
  }
  OnInputChange(event:InputEvent){
    this.value.uOutlineColor.value=new THREE.Color(( this.color.value));
  }

  constructor(){
    super();
    this.value= {
      uOutlineColor: {
        value: new THREE.Color(0x000000),
      },
      offset:{
        value:0.02
      }
    }
    this.range=document.getElementById("outlineOffset")as HTMLInputElement;
    this.color=document.getElementById("outlineColor") as HTMLInputElement;
    IObject.EventManager.RegistMouseMoveEvent(this,"range",this.range);
    IObject.EventManager.RegistInputChangeEvent(this,"color",this.color);
    this.range.value=(this.value.offset.value*1000).toString();
  }
}

function init() {
  const width = 512;
  const height = 512;

  var canvas :HTMLCanvasElement= document.getElementById('myCanvas') as HTMLCanvasElement;

  canvas.oncontextmenu = function () {return false;};
  canvas.addEventListener('mousewheel', function(event) {event.preventDefault()}, { passive: false });
  
  const renderer = new THREE.WebGLRenderer({canvas:canvas,alpha:true  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(0x0000ff,0.0);
  renderer.outputEncoding = THREE.GammaEncoding;


  // シーンを作成
  const scene = new SceneWrapper();
  const subScene = new SceneWrapper();

var renderTarget = new THREE.WebGLRenderTarget(width/8, height/8,{

  magFilter: THREE.NearestFilter,
  minFilter: THREE.NearestFilter,

});

const geometry = new THREE.PlaneGeometry(width,height);

var planeMat =  new THREE.ShaderMaterial({
  vertexShader:vertex_default,
  fragmentShader: frag_post,
  side: THREE.DoubleSide, 
  transparent: true,
  uniforms: {
    uTex: { value: renderTarget.texture }// テスクチャを uTex として渡す
  },
})
  var plane= new THREE.Mesh(geometry,planeMat);
  plane.scale.y=-1;
  subScene.AddDrawObject(plane,"dotPlane");

  // カメラを作成
  const camera = new CameraWrapper(45,width, height,0.01,10000,true );
  const dotCamera = new CameraWrapper(45,width, height,0.01,10000,false );
  camera.Camera.position.set(0, 1, 2);
  dotCamera.Camera.position.set(0,0,2);

  const uniform =new OutlineUniform();

  const outlineMaterial = new THREE.ShaderMaterial({
    vertexShader: outlineVertexShader, // 頂点シェーダ
    fragmentShader: fragOut, // フラグメントシェーダ,
    side: THREE.BackSide,
    uniforms: uniform.value,
    skinning:true
  })


var mixer:THREE.AnimationMixer;
var outlineMixer:THREE.AnimationMixer;
var animationIndex:number=0;
var animations: THREE.AnimationClip[]
var model1:THREE.Object3D;
var outlineModel:THREE.Object3D;

  ModelLoad('../model/miruku/scene.gltf');
  
  {

    const light = new THREE.DirectionalLight(0xffffff);
    light.intensity = 2; // 光の強さを倍に
    light.position.set(1, 1, -1);
    // シーンに追加
    scene.AddDrawObject(light,"DirectionaLight");
    subScene.AddDrawObject(light,"dirLight");
  }

  var cameraController=new EditorCameraMan(camera);

  IObject.EventManager.RegistMousePushEvent(cameraController,"cameraController",canvas);
  IObject.EventManager.RegistMouseReleaseEvent(cameraController,"cameraController",canvas);
  IObject.EventManager.RegistMouseMoveEvent(cameraController,"cameraController",canvas);
  IObject.EventManager.RegistWheelEvent(cameraController,"cameraController",canvas);
  
  let clock = new THREE.Clock();

  
  const downloadButton=document.getElementById("dwonloadButton") as HTMLInputElement;
  
  downloadButton.addEventListener("click",canvasDownload,true);

  // 初回実行
  tick();

  function tick() {
    requestAnimationFrame(tick);
    if(mixer){
      mixer.update(clock.getDelta());
      outlineMixer.update(clock.getDelta());
    }
    // レンダリング
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene.Scene, camera.Camera);
    renderer.setRenderTarget(null);
    renderer.render(subScene.Scene,dotCamera.Camera);
  }


  function OnBefAnimPush(e:Event){
    
    animationIndex--;
    ChangeAnim();
  }
  function OnNextAnimPush(e:Event){
    animationIndex++;
    ChangeAnim();
  }

  function ChangeAnim(){
        if(animations &&animationIndex>=0 && animationIndex<=( animations.length-1)) {
            //Animation Mixerインスタンスを生成
            mixer.stopAllAction();
            //全てのAnimation Clipに対して
                let animation = animations[animationIndex];
                //Animation Actionを生成
                let action = mixer.clipAction(animation) ;
                let outAct=outlineMixer.clipAction(animation);
     
                action.loop=THREE.LoopRepeat;
                outAct.loop=THREE.LoopRepeat;
                //アニメーションの最後のフレームでアニメーションが終了
                action.clampWhenFinished = true;
    
                //アニメーションを再生
                action.play();
                outAct.play();
        }
  }
  
function canvasDownload(){
  renderer.render(subScene.Scene,dotCamera.Camera);
  var link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "canvas.png";
  link.click();
}
  function ModelLoad(path:string){

    scene.RemoveDrawObject("model"); 
    scene.RemoveDrawObject("outlineModel"); 
    const　gltfLoader = new GLTFLoader();
    gltfLoader.load(path,function(data){
      const gltf = data;
      var model = gltf.scene.clone() ;
  
      model.traverse((object) => { //モデルの構成要素をforEach的に走査
        if(object instanceof THREE.Mesh) { //その構成要素がメッシュだったら
      object .material=outlineMaterial;
  }
    })
  
    animations = gltf.animations;
    
      
    scene.AddDrawObject(gltf.scene,"model"); 
    scene.AddDrawObject(model,"outlineModel"); 
    model1=(gltf.scene);
    outlineModel=(model);
  
    gltf.scene.add(model);
  
    mixer = new THREE.AnimationMixer(model1);
    outlineMixer=new THREE.AnimationMixer(outlineModel);
    ChangeAnim();
    });
  }
}