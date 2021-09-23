import ButiLib=require("./ButiLib")
import EasingLib=require("./Easing")
import THREE=require("three")
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

var map_GLTFModels=new Map<string,THREE.Object3D>();
export function ModelLoad(path:string,arg_model:ButiLib. ModelWrapper,arg_sceneRef:ButiLib.SceneWrapper,arg_key?:ButiLib. StringRef,arg_initPostion ?:THREE.Vector3,arg_initRotation ?:THREE.Vector3,arg_material?:THREE.Material,arg_func?:()=>void):void{

    if(map_GLTFModels.has(path)){
        arg_model.threeObj=(map_GLTFModels.get(path).clone());
        if(arg_initPostion){
            arg_model.threeObj.position.set(arg_initPostion.x,arg_initPostion.y,arg_initPostion.z);
        }
        if(arg_initRotation){
            arg_model.threeObj.setRotationFromEuler(new THREE.Euler(arg_initRotation.x,arg_initRotation.y,arg_initRotation.z));
        }
        if(arg_material){
            arg_model.threeObj.traverse((object) => { 
                if(object instanceof THREE.Mesh) { 
              object .material=arg_material;
          }})
        }

        if(!arg_key){
            arg_sceneRef.AddDrawObject(arg_model.threeObj,"model");
        }else
        if(arg_key.value){
            arg_key.value=arg_sceneRef.AddDrawObject(arg_model.threeObj,arg_key.value);
        }
        else{
            arg_key.value=arg_sceneRef.AddDrawObject(arg_model.threeObj,"model");
        }

        if(arg_func){
            arg_func();
        }
        return;  
    }

  const　gltfLoader = new GLTFLoader();
  gltfLoader.load(path,function(data){
    const gltf = data;
    map_GLTFModels.set(path,gltf.scene);
    arg_model.threeObj=(gltf.scene.clone());

    if(arg_initPostion){
        arg_model.threeObj.position.set(arg_initPostion.x,arg_initPostion.y,arg_initPostion.z);
    }
    if(arg_initRotation){
        arg_model.threeObj.setRotationFromEuler(new THREE.Euler(arg_initRotation.x,arg_initRotation.y,arg_initRotation.z));
    }
    if(arg_material){
        arg_model.threeObj.traverse((object) => { 
            if(object instanceof THREE.Mesh) { 
          object .material=arg_material;
      }})
    }
    if(!arg_key){
        arg_sceneRef.AddDrawObject(arg_model.threeObj,"model");
    }else
    if(arg_key.value){
        arg_key.value=arg_sceneRef.AddDrawObject(arg_model.threeObj,arg_key.value);
    }
    else{
        arg_key.value=arg_sceneRef.AddDrawObject(arg_model.threeObj,"model");
    }
    if(arg_func){
        arg_func();
    }
  });

}

export class GameScene{
    drawScene:ButiLib.SceneWrapper;
    postDrawScene:ButiLib.SceneWrapper;
    camera:ButiLib.CameraWrapper;
    postCamera:ButiLib.CameraWrapper;
    constructor(arg_drawscene: ButiLib.SceneWrapper,arg_postDrawscene: ButiLib.SceneWrapper,arg_camera:ButiLib.CameraWrapper,arg_postDrawCamera:ButiLib.CameraWrapper ,isUseRenderTarget?:boolean,arg_renderWidth ?:number,arg_renderHeight?:number,isUseRenderTarget_post?:boolean,arg_renderWidth_post ?:number,arg_renderHeight_post?:number){
        this.drawScene=arg_drawscene;
        this.camera=arg_camera;

        if(!this.drawScene){
            this.drawScene=new ButiLib.SceneWrapper(isUseRenderTarget,arg_renderWidth,arg_renderHeight,0x000000);
        }
        if(!this.camera){
            this.camera=new ButiLib.CameraWrapper(45,arg_renderWidth, arg_renderHeight,0.01,10000,true);
        }
        
        this.postDrawScene=arg_postDrawscene;
        this.postCamera=arg_postDrawCamera;

        if(!this.postDrawScene){
            this.postDrawScene=new ButiLib.SceneWrapper(isUseRenderTarget_post,arg_renderWidth_post,arg_renderHeight_post);
        }
        if(!this.postCamera){
            this.postCamera=new ButiLib.CameraWrapper(45,arg_renderWidth_post, arg_renderHeight_post,0.01,10000,false);
        }
        this.camera.Camera.position.set(0, 1, 2);
        this.postCamera.Camera.position.set(0,0,50);
    }
    OnInit():void{}
    OnUpdate():void{}
    OnChange():void{}
    OnEscape():void{}
    OnDestroy():void{}
    OnDraw(arg_renderer:ButiLib.RendererWrapper):void{
        arg_renderer.Renderer.setRenderTarget(this.drawScene.RenderTarget);
        arg_renderer.Renderer.render(this.drawScene.Scene,this.camera.Camera);
        arg_renderer.Renderer.setRenderTarget(this.postDrawScene.RenderTarget);
        arg_renderer.Renderer.render(this.postDrawScene.Scene,this.postCamera.Camera);
    }
    
}
export class GameObject{
    name:string;
    tag:string="none";
    scene:GameScene;
    constructor(arg_scene:GameScene, arg_name:string,arg_tag ? :string){
        this.scene=arg_scene;
        this.name=arg_name;
        if(arg_tag){
            this.tag=arg_tag;
        }
    }
    OnSet():void{ }
    OnUnSet():void{ }
    get Name(): string{
        return this.name;
    }
    get Tag(): string{
        return this.name;
    }
}
export class GameSceneManager{
    private static instance=new GameSceneManager();
    private map_scene=new Map<string,GameScene>();
    private currentScene:GameScene=null;
    OnDrawUpdate(arg_renderer:ButiLib.RendererWrapper):void{
        this.currentScene.OnDraw(arg_renderer);
    }
    ChangeScene(arg_sceneName: string){
        if(this.currentScene){
            this.currentScene.OnEscape();
        }
        this.currentScene=this.map_scene.get(arg_sceneName);
        this.currentScene.OnChange();
    }
    RemoveScene(arg_sceneName:string){
        if(this.map_scene.has(arg_sceneName)){
            this.map_scene.get(arg_sceneName).OnDestroy();
            this.map_scene.delete(arg_sceneName);
        }
    }
    AddScene(arg_sceneName:string,arg_scene:GameScene){
        if(!this.map_scene.has(arg_sceneName)){
            this.map_scene.set(arg_sceneName,arg_scene);
            arg_scene.OnInit();
        }
    }
    static GetInstance():GameSceneManager{
        return this.instance;
    }
}
export class ObjectTransformMove{
    private model:ButiLib.ModelWrapper;
    private targetPos:THREE.Vector3;
    private initPos:THREE.Vector3;
    private velocity:THREE.Vector3;
    private endEvent:()=>void;
    easeFunction:(x:number)=>number=EasingLib.Easing.Liner;
    set TargetPosition(other:THREE.Vector3){
        this.targetPos=other;
        if(this.initPos)
        this.velocity=this.targetPos.clone().sub(this.initPos);
    }
    set InitPosition(other:THREE.Vector3){
        this.initPos=other;
        if(this.targetPos)
        this.velocity=this.targetPos.clone().sub(this.initPos);
    }
    set Model(other:ButiLib.ModelWrapper){
        this.model=other;
    }
    get Model():ButiLib.ModelWrapper{
        return this.model;
    }
    animProgress=0;
    speed=0;
    constructor(arg_model:ButiLib.ModelWrapper,arg_event?:()=>void){
        this.model=arg_model;
        this.endEvent=arg_event;
    }
    SetEvent(arg_event:()=>void){
        this.endEvent=arg_event;
    }
    Update(){
        this.animProgress+=this.speed;
        if(this.animProgress>1.0){
            this.animProgress=1.0;
            if(this.endEvent){
                this.endEvent();
            }
        }
        const current=this.initPos.clone().add(this.velocity.clone().multiplyScalar(this.easeFunction( this.animProgress)));
        this.model.threeObj.position.set(current.x,current.y,current.z);
    }
    Reset(){
        this.model.threeObj.position.set(this.initPos.x,this.initPos.y,this.initPos.z);
        this.animProgress=0;
    }
}