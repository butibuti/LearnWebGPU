import { Fog } from "three";
import THREE = require("three");
export class IObject{
    constructor(){}

    /**
     * OnInputChange
     */
    OnInputChange(e:InputEvent) {
        
    }

    /**
     * OnClick
     */
    OnClick(e:MouseEvent) :void{

    }
    
    /**
     * OnMouseButtonUp
     */
    OnMouseButtonUp(e:MouseEvent) {
        
    }
    /**
     * OnMouseButtonDown
     */
    OnMouseButtonDown(e:MouseEvent) {
        
    }
    /**
     * OnMouseMove
     */
    OnMouseMove(e:MouseEvent) :void{

    }
    /**
     * OnMouseWheel
     */
    OnMouseWheel(e:WheelEvent) :void{

    }
    /**
     * OnKeyDown
     */
    OnKeyDown(e:KeyboardEvent) :void{

    }
    /**
     * OnKeyUp
     */
    OnKeyUp(e:KeyboardEvent) :void{

    }
}
export class RendererWrapper extends IObject{
  
    private renderer:THREE.WebGLRenderer;
    canvas :HTMLCanvasElement;
    constructor(arg_canvas :HTMLCanvasElement,width:number,height:number ){
      super();
      this.canvas=arg_canvas;
      this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,alpha:true  });
  
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(width, height);
      this.renderer.setClearColor(0x0000ff,0.0);
      this.renderer.outputEncoding = THREE.GammaEncoding;
    }
    get Renderer():THREE.WebGLRenderer{
      return this.renderer;
    }
    CanvasDownload(arg_filename:string, arg_scene: SceneWrapper,arg_camera: CameraWrapper):void{
      this.Renderer.render(arg_scene.Scene,arg_camera.Camera);
      var link = document.createElement("a");
      link.href =this. canvas.toDataURL("image/png");
      link.download = arg_filename;
      link.click();
    }
  }

  
var map_textures=new Map<string,THREE.Texture>();
const textureLoader=new  THREE.TextureLoader();
export function TextureLoad(path:string):THREE.Texture{

    if(map_textures.has(path)){
        return map_textures.get(path);  
    }

    map_textures.set(path, textureLoader.load(path));
    return  map_textures.get(path);  
}


  export class StringRef{
      value:string;
  }

export class SceneWrapper{
    private scene:THREE.Scene;
    private map_DrawObj=new Map<String,THREE.Object3D>();
    private renderTarget:THREE.WebGLRenderTarget=null;
    constructor(arg_useRenderTarget: boolean,arg_renderTargetWidth ?:number,arg_renderTargetHeight ?:number,arg_fogColor? :number,arg_fogNear?:number,arg_fogFar?:number){
      this.scene=new THREE.Scene();
      if(arg_useRenderTarget){this.renderTarget= new THREE.WebGLRenderTarget(arg_renderTargetWidth, arg_renderTargetHeight);}

      if(arg_fogColor){
          if(!arg_fogNear){
              arg_fogNear=20;
          }
          if(!arg_fogFar){
              arg_fogFar=1000;
          }
          this.scene.fog=new THREE.Fog(arg_fogColor,arg_fogNear,arg_fogFar);
      }
    }
    get DrawObjectSize():number{
        return this.map_DrawObj.size;
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
    get RenderTarget():THREE.WebGLRenderTarget{
        return this.renderTarget;
    }
  }
  
export  class CameraWrapper{
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
  export class ModelWrapper{
      constructor(arg_threeObj?:THREE.Object3D){
          if(arg_threeObj){
              this.threeObj=arg_threeObj;
          }
      }
    threeObj:THREE.Object3D=null;
  }
  export class StandardMaterialWrapper{
    material:THREE.MeshStandardMaterial=null;
  }


export function CreateTextureCube(arg_texturePath:string,arg_size:number,arg_material?:StandardMaterialWrapper):ModelWrapper{
    var output=new ModelWrapper();

    
    const geometry = new THREE.BoxGeometry(arg_size,arg_size,arg_size);
    
  const material = new THREE.MeshStandardMaterial({
    map: TextureLoad(arg_texturePath),
  });

  if(arg_material){
      arg_material.material=material;
  }
  // メッシュを作成
  output.threeObj = new THREE.Mesh(geometry, material);

  
    return output;
}
export function CreateTexturePlane(arg_texturePath:string,arg_width:number,arg_height:number):ModelWrapper{
    var output=new ModelWrapper();

    
    const geometry = new THREE.BoxGeometry(arg_width,arg_height,1);
    
  const material = new THREE.MeshBasicMaterial({
    map: TextureLoad(arg_texturePath),transparent:true
  });
  // メッシュを作成
  output.threeObj = new THREE.Mesh(geometry, material);

  output.threeObj.scale.y=-1;
  output.threeObj.scale.x=-1;
    return output;
}

class EventMessenger{
    map_events=new Map<String,{handleEvent: () => void;}>();
}
export class  EventManager{
    private static map_mouseClickEvent=new Map<String,{handleEvent: (event: MouseEvent) => void;}>();
    private static map_mousePushEvent=new Map<String,{handleEvent: (event: MouseEvent) => void;}>();
    private static map_mouseReleaseEvent=new Map<String,{handleEvent: (event: MouseEvent) => void;}>();
    private static map_mouseMoveEvent=new Map<String,{handleEvent: (event: MouseEvent) => void;}>();

    private static map_mouseWheelEvent=new Map<String,{handleEvent: (event: WheelEvent) => void;}>();

    private static map_keyPushEvent=new Map<String,{handleEvent: (event: KeyboardEvent) => void;}>();
    private static map_keyReleaseEvent=new Map<String,{handleEvent: (event: KeyboardEvent) => void;}>();

    private static map_inputChangeEvent=new Map<String,{handleEvent: (event: InputEvent) => void;}>();
    private static map_exEvent=new Map<string,EventMessenger>();

    static RegistClickIObjectEvent(arg_obj:IObject,arg_eventName:string,target:EventTarget,isDuplicate?:boolean):string{
        var registEvent={handleEvent: (event: MouseEvent) => {
            arg_obj.OnClick(event);
        }
        };
        return EventManager. RegistClickEvent(registEvent,arg_eventName,target,isDuplicate);

    }
    static RegistClickEvent(arg_eventListner:{handleEvent: (event: MouseEvent)=>void},arg_eventName:string,target:EventTarget,isDuplicate?:boolean):string{
        var registEvent=arg_eventListner;

        if(this.map_mouseClickEvent.has(arg_eventName)){
            if(!isDuplicate){
                return arg_eventName;
            }
            var output:string=arg_eventName;
            var hasCount=1;
            while(this.map_mouseClickEvent.has(output+"_"+hasCount)){
                hasCount++;
            }
            this.map_mouseClickEvent.set(output+"_"+hasCount,registEvent);
            target.addEventListener("click",registEvent,true);
            return output+"_"+hasCount;
        }
        this.map_mouseClickEvent.set(arg_eventName,registEvent);
        target.addEventListener("click",registEvent,true);
        return arg_eventName;

    }
    static UnRegistClickEvent(arg_eventName:string,target:EventTarget){
        if(this.map_mouseClickEvent.has(arg_eventName)){
            target.removeEventListener("click",this.map_mouseClickEvent.get(arg_eventName)as {handleEvent: (event: MouseEvent) => void;} ,true);
            this.map_mouseClickEvent.delete(arg_eventName);
        }
        
    }
    static RegistMousePushEvent(arg_eventListner:{handleEvent: (event: MouseEvent)=>void},arg_eventName:string,target:EventTarget,isDuplicate?:boolean):string{
        var registEvent=arg_eventListner;

        if(this.map_mousePushEvent.has(arg_eventName)){
            if(!isDuplicate){
                return arg_eventName;
            }
            var output:string=arg_eventName;
            var hasCount=1;
            while(this.map_mousePushEvent.has(output+"_"+hasCount)){
                hasCount++;
            }
            this.map_mousePushEvent.set(output+"_"+hasCount,registEvent);
            target.addEventListener("mousedown",registEvent,true);
            return output+"_"+hasCount;
        }
        this.map_mousePushEvent.set(arg_eventName,registEvent);
        target.addEventListener("mousedown",registEvent,true);
        return arg_eventName;

    }
    static RegistMousePushIObjectEvent(arg_obj:IObject,arg_eventName:string,target:EventTarget,isDuplicate?:boolean):string{
        var registEvent={handleEvent: (event: MouseEvent) => {
            arg_obj.OnMouseButtonDown(event);
        }
        };
        return EventManager. RegistMousePushEvent(registEvent,arg_eventName,target,isDuplicate);

    }
    static UnRegistMoudePushEvent(arg_eventName:string,target:EventTarget){
        if(this.map_mousePushEvent.has(arg_eventName)){
            target.removeEventListener("mousedown",this.map_mousePushEvent.get(arg_eventName)as {handleEvent: (event: MouseEvent) => void;} ,true);
            this.map_mousePushEvent.delete(arg_eventName);
        }
        
    }

    
    static RegistMouseReleaseIObjectEvent(arg_obj:IObject,arg_eventName:string,target:EventTarget,isDuplicate?:boolean):string{
        var registEvent={handleEvent: (event: MouseEvent) => {
            arg_obj.OnMouseButtonUp(event);
        }
        };

        return EventManager. RegistMouseReleaseEvent(registEvent,arg_eventName,target,isDuplicate);

    }
    static RegistMouseReleaseEvent(arg_eventListner:{handleEvent: (event: MouseEvent)=>void},arg_eventName:string,target:EventTarget,isDuplicate?:boolean):string{
        var registEvent=arg_eventListner;

        if(this.map_mouseReleaseEvent.has(arg_eventName)){
            if(!isDuplicate){
                return arg_eventName;
            }
            var output:string=arg_eventName;
            var hasCount=1;
            while(this.map_mouseReleaseEvent.has(output+"_"+hasCount)){
                hasCount++;
            }
            this.map_mouseReleaseEvent.set(output+"_"+hasCount,registEvent);
            target.addEventListener("mouseup",registEvent,true);
            return output+"_"+hasCount;
        }
        this.map_mouseReleaseEvent.set(arg_eventName,registEvent);
        target.addEventListener("mouseup",registEvent,true);
        return arg_eventName;

    }
    static UnRegistMoudeReleaseEvent(arg_eventName:string,target:EventTarget){
        if(this.map_mouseReleaseEvent.has(arg_eventName)){
            target.removeEventListener("mouseup",this.map_mouseReleaseEvent.get(arg_eventName)as {handleEvent: (event: MouseEvent) => void;} ,true);
            this.map_mouseReleaseEvent.delete(arg_eventName);
        }
        
    }
    
    static RegistMouseMoveIObjectEvent(arg_obj:IObject,arg_eventName:string,target:EventTarget,isDuplicate?:boolean):string{
        var registEvent={handleEvent: (event: MouseEvent) => {
            arg_obj.OnMouseMove(event);
        }
        };

        return EventManager. RegistMouseMoveEvent(registEvent,arg_eventName,target,isDuplicate);

    }
    static RegistMouseMoveEvent(arg_eventListner:{handleEvent: (event: MouseEvent)=>void},arg_eventName:string,target:EventTarget,isDuplicate?:boolean):string{
        var registEvent=arg_eventListner;

        if(this.map_mouseMoveEvent.has(arg_eventName)){
            if(!isDuplicate){
                return arg_eventName;
            }
            var output:string=arg_eventName;
            var hasCount=1;
            while(this.map_mouseMoveEvent.has(output+"_"+hasCount)){
                hasCount++;
            }
            this.map_mouseMoveEvent.set(output+"_"+hasCount,registEvent);
            target.addEventListener("mousemove",registEvent,true);
            return output+"_"+hasCount;
        }
        this.map_mouseMoveEvent.set(arg_eventName,registEvent);
        target.addEventListener("mousemove",registEvent,true);
        return arg_eventName;

    }
    static UnRegistMoudeMoveEvent(arg_eventName:string,target:EventTarget){
        if(this.map_mouseMoveEvent.has(arg_eventName)){
            target.removeEventListener("mousemove",this.map_mouseMoveEvent.get(arg_eventName)as {handleEvent: (event: MouseEvent) => void;} ,true);
            this.map_mouseMoveEvent.delete(arg_eventName);
        }
        
    }

    static RegistWheelIObjectEvent(arg_obj:IObject,arg_eventName:string,target:EventTarget,isDuplicate?:boolean):string{
        var registEvent={handleEvent: (event: WheelEvent) => {
            arg_obj.OnMouseWheel(event);
        }
        };

        return EventManager. RegistWheelEvent(registEvent,arg_eventName,target,isDuplicate);

    }
    static RegistWheelEvent(arg_eventListner:{handleEvent: (event: WheelEvent)=>void},arg_eventName:string,target:EventTarget,isDuplicate?:boolean):string{
        var registEvent=arg_eventListner;

        if(this.map_mouseWheelEvent.has(arg_eventName)){
            if(!isDuplicate){
                return arg_eventName;
            }
            var output:string=arg_eventName;
            var hasCount=1;
            while(this.map_mouseWheelEvent.has(output+"_"+hasCount)){
                hasCount++;
            }
            this.map_mouseWheelEvent.set(output+"_"+hasCount,registEvent);
            target.addEventListener("mousewheel",registEvent,true);
            return output+"_"+hasCount;
        }
        this.map_mouseWheelEvent.set(arg_eventName,registEvent);
        target.addEventListener("mousewheel",registEvent,true);
        return arg_eventName;

    }
    static UnRegistWheelEvent(arg_eventName:string,target:EventTarget){

        if(this.map_mouseWheelEvent.has(arg_eventName)){
            target.removeEventListener("mousewheel",this.map_mouseWheelEvent.get(arg_eventName)as {handleEvent: (event: WheelEvent) => void;},true );
            this.map_mouseWheelEvent.delete(arg_eventName);
        }
    }

    static RegistKeyPushIObjectEvent(arg_obj:IObject,arg_eventName:string ,target:EventTarget,isDuplicate?:boolean):string{
        var registEvent={handleEvent: (event: KeyboardEvent) => {
            arg_obj.OnKeyDown(event);
        }
        };

        return EventManager. RegistKeyPushEvent(registEvent,arg_eventName,target,isDuplicate);

    }
    
    static RegistKeyPushEvent(arg_listner:{handleEvent: (event: KeyboardEvent) => void;},arg_eventName:string ,target:EventTarget,isDuplicate?:boolean):string{
        
        

        if(this.map_keyPushEvent.has(arg_eventName)){
            if(!isDuplicate){
                return arg_eventName;
            }
            var output:string=arg_eventName;
            var hasCount=1;
            while(this.map_keyPushEvent.has(output+"_"+hasCount)){
                hasCount++;
            }
            output+="_"+hasCount;
            this.map_keyPushEvent.set(output,arg_listner);
            target.addEventListener("keydown",arg_listner,true);
            return output;
        }
        this.map_keyPushEvent.set(arg_eventName,arg_listner);
        target.addEventListener("keydown",arg_listner,true);
        return arg_eventName;

    }
    static UnRegistKeyPushEvent(arg_eventName:string ,target:EventTarget){
        if(this.map_keyPushEvent.has(arg_eventName)){
            target.removeEventListener("keydown",this.map_keyPushEvent.get(arg_eventName) as {handleEvent: (event: KeyboardEvent) => void;},true)
            this.map_keyPushEvent.delete(arg_eventName);
        }
    }


    static RegistKeyReleaseIObjectEvent(arg_obj:IObject,arg_eventName:string,target:EventTarget,isDuplicate?:boolean):string{
        var registEvent={handleEvent: (event: KeyboardEvent) => {
            arg_obj.OnKeyUp(event);
        }
        };

        return EventManager. RegistKeyReleaseEvent(registEvent,arg_eventName,target,isDuplicate);

    }
    static RegistKeyReleaseEvent(arg_listner:{handleEvent: (event: KeyboardEvent) => void;},arg_eventName:string,target:EventTarget,isDuplicate?:boolean):string{
        var registEvent=arg_listner;

        if(this.map_keyReleaseEvent.has(arg_eventName)){
            if(!isDuplicate){
                return arg_eventName;
            }
            var output:string=arg_eventName;
            var hasCount=1;
            while(this.map_keyReleaseEvent.has(output+"_"+hasCount)){
                hasCount++;
            }
            this.map_keyReleaseEvent.set(output+"_"+hasCount,registEvent);
            
            target.addEventListener("keyup",registEvent,true);
            return output+"_"+hasCount;
        }
        this.map_keyReleaseEvent.set(arg_eventName,registEvent);
        target.addEventListener("keyup",registEvent,true);
        return arg_eventName;

    }
    static UnRegistKeyReleaseEvent(arg_eventName:string,target:EventTarget){
        if(this.map_keyReleaseEvent.has(arg_eventName)){
        target.removeEventListener("keyup",this.map_keyReleaseEvent.get(arg_eventName) as {handleEvent: (event: KeyboardEvent) => void;},true)
        this.map_keyReleaseEvent.delete(arg_eventName);
    }
    }

    static RegistInputChangeIObjectEvent(arg_obj:IObject,arg_eventName:string,target:EventTarget,isDuplicate?:boolean):string{
        var registEvent={handleEvent: (event: InputEvent) => {
            arg_obj.OnInputChange(event);
        }
        };

        return EventManager. RegistInputChangeEvent(registEvent,arg_eventName,target,isDuplicate);

    }
    static RegistInputChangeEvent(arg_listner:{handleEvent: (event: InputEvent) => void;},arg_eventName:string,target:EventTarget,isDuplicate?:boolean):string{
        var registEvent=arg_listner;

        if(this.map_inputChangeEvent.has(arg_eventName)){
            if(!isDuplicate){
                return arg_eventName;
            }
            var output:string=arg_eventName;
            var hasCount=1;
            while(this.map_inputChangeEvent.has(output+"_"+hasCount)){
                hasCount++;
            }
            this.map_inputChangeEvent.set(output+"_"+hasCount,registEvent);
            
            target.addEventListener("change",registEvent,true);
            return output+"_"+hasCount;
        }
        this.map_inputChangeEvent.set(arg_eventName,registEvent);
        target.addEventListener("change",registEvent,true);
        return arg_eventName;

    }
    static UnRegistInputChangeEvent(arg_eventName:string,target:EventTarget){
        if(this.map_inputChangeEvent.has(arg_eventName)){
        target.removeEventListener("change",this.map_inputChangeEvent.get(arg_eventName) as {handleEvent: (event: InputEvent) => void;},true)
        this.map_inputChangeEvent.delete(arg_eventName);
    }
    }
    static RegistExEvent(arg_listner:{handleEvent: () => void;},arg_eventMessengerName:string,arg_eventName:string,isDuplicate?:boolean):string{

        if(!this.map_exEvent.has(arg_eventMessengerName)){
            this.map_exEvent.set(arg_eventMessengerName,new EventMessenger());
        }
        if(this.map_exEvent.get(arg_eventMessengerName).map_events. has(arg_eventName)){
            if(!isDuplicate){
                return arg_eventName;
            }
            var output:string=arg_eventName;
            var hasCount=1;
            while(this.map_exEvent.get(arg_eventMessengerName).map_events.has(output+"_"+hasCount)){
                hasCount++;
            }
            this.map_exEvent.get(arg_eventMessengerName).map_events.set(output+"_"+hasCount,arg_listner);
            
            
            return output+"_"+hasCount;
        }
        this.map_exEvent.get(arg_eventMessengerName).map_events.set(arg_eventName,arg_listner);
        
        return arg_eventName;

    }
    static UnRegistExEvent(arg_eventMessengerName:string, arg_eventName:string){
        
        if(!this.map_exEvent.has(arg_eventMessengerName)){
            return ;
        }
        if(this.map_exEvent.get(arg_eventMessengerName).map_events.has(arg_eventName)){
        this.map_exEvent.get(arg_eventMessengerName).map_events.delete(arg_eventName);
    }
    }
    static async ExecuteExEvent(arg_eventMessengerName:string){

        if(!this.map_exEvent.has(arg_eventMessengerName)){
            return ;
        }
        this.map_exEvent.get(arg_eventMessengerName).map_events.forEach(v=>{v.handleEvent()});
    }

}
export class ColorAnim{
    private colorAnimProgress:number=0;
    speed:number;
    private reference=0;
    private initColor:THREE.Vector4;
    private targetColor:THREE.Vector4;
    private currentColor:THREE.Vector4;
    private colorVeloc:THREE.Vector4;
    private isLoop:boolean;
    constructor(arg_initColor:THREE.Vector4,arg_targetColor:THREE.Vector4, arg_speed:number,arg_isLoop:boolean){

        this.initColor=arg_initColor;
        this.targetColor=arg_targetColor;;
        this.colorVeloc=this.targetColor.clone().sub(this.initColor);
        this.currentColor=this.initColor.clone();
        this.speed=arg_speed;
        this.isLoop=arg_isLoop;
    }
    set InitColor(other:THREE.Vector4){

        this.colorAnimProgress=0;
        this.currentColor=other;
        this.initColor=other;
        this.colorVeloc=this.targetColor.clone().sub(this.initColor);
    }
    set TargetColor(other:THREE.Vector4){

        this.colorAnimProgress=0;
        this.targetColor=other;
        this.initColor=this.currentColor;
        this.colorVeloc=this.targetColor.clone().sub(this.initColor);
    }
    set IsLoop(other:boolean){
        this.isLoop=other;
    }
    get IsLoop(){
        return this.isLoop;
    }
    Release(){
        this.reference--;
        if(this.reference<=0){
            this.TargetColor=new THREE.Vector4(1,1,1,1);this.speed=0.04;this.IsLoop=false;
        }
    }
    AddRef(){
        this.reference++;
    }
    Update():boolean{
        this.colorAnimProgress+=this.speed;
        this.currentColor=this.initColor.clone().add(this.colorVeloc.clone().multiplyScalar(this.colorAnimProgress));
        if(this.colorAnimProgress>1){
            if(this.isLoop){
                this.colorAnimProgress=0;
                const temp=this.targetColor;
                this.targetColor=this.initColor.clone();
                this.initColor=temp;
                this.colorVeloc=this.targetColor.clone().sub(this.initColor);
            }else{
                this.colorAnimProgress=0;
                return true;
            }
        }
        return false;
    }
    GetColor():THREE.Color{
        return new THREE.Color(this.currentColor.x,this.currentColor.y,this.currentColor.z);
    }
}
export class Int2{
    constructor(x?:number,y?:number){
        if(x){
            this.x=x;
        }
        if(y){
            this.y=y;
        }
    }
    x:number=0;
    y:number=0;
}

export function GetRandomArbitrary(min:number, max:number) :number{
    return Math.random() * (max - min) + min;
  }
export function GetRandomInt(min:number, max:number):number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
export function GetRandomIntInclusive(min:number, max:number):number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); 
  }

  export function Clamp(min:number,max:number,v:number):number{
      if(v>max){return max;}
      if(v<min){return min;}
      return v;
  }
  
export class Sound {
    private volume=1.0;
    private audioElement:HTMLAudioElement;

    constructor (arg_src:string){
        this.audioElement=document.createElement('audio');
        this.audioElement.src=arg_src;
        this.audioElement.preload="auto";
    }

    Play(){
        this.audioElement.play();
    }
    Play_new(){
        var audioElement=document.createElement('audio');
        audioElement.src=this.audioElement.src;
        audioElement.volume=this.volume;
        audioElement.preload="auto";audioElement.play();
    }
    Pause(){
        this.audioElement.pause();
    }

    Mute(){
        this.audioElement.muted=true;
    }

    SetVolume(arg_volume:number){
        this.volume=arg_volume;
        this.audioElement.volume=arg_volume;
    }

    GetVolume():number{
        return this.audioElement.volume;
    }

    DisMute(){
        this.audioElement.muted=false;
    }

    Reset(){
        this.audioElement.currentTime=0.0;
    }

    SetLoop(arg_isLoop:boolean){
        this.audioElement.loop=arg_isLoop;
    }

}