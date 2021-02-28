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
export class SceneWrapper{
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

export class  EventManager{
    private static map_mouseClickEvent=new Map<String,{handleEvent: (event: MouseEvent) => void;}>();
    private static map_mousePushEvent=new Map<String,{handleEvent: (event: MouseEvent) => void;}>();
    private static map_mouseReleaseEvent=new Map<String,{handleEvent: (event: MouseEvent) => void;}>();
    private static map_mouseMoveEvent=new Map<String,{handleEvent: (event: MouseEvent) => void;}>();

    private static map_mouseWheelEvent=new Map<String,{handleEvent: (event: WheelEvent) => void;}>();

    private static map_keyPushEvent=new Map<String,{handleEvent: (event: KeyboardEvent) => void;}>();
    private static map_keyReleaseEvent=new Map<String,{handleEvent: (event: KeyboardEvent) => void;}>();

    private static map_inputChangeEvent=new Map<String,{handleEvent: (event: InputEvent) => void;}>();

    static RegistClickEvent(arg_obj:IObject,arg_eventName:string,target:EventTarget):string{
        var registEvent={handleEvent: (event: MouseEvent) => {
            arg_obj.OnClick(event);
        }
        };

        if(this.map_mouseClickEvent.has(arg_eventName)){
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
    static RegistMousePushEvent(arg_obj:IObject,arg_eventName:string,target:EventTarget):string{
        var registEvent={handleEvent: (event: MouseEvent) => {
            arg_obj.OnMouseButtonDown(event);
        }
        };

        if(this.map_mousePushEvent.has(arg_eventName)){
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
    static UnRegistMoudePushEvent(arg_eventName:string,target:EventTarget){
        if(this.map_mousePushEvent.has(arg_eventName)){
            target.removeEventListener("mousedown",this.map_mousePushEvent.get(arg_eventName)as {handleEvent: (event: MouseEvent) => void;} ,true);
            this.map_mousePushEvent.delete(arg_eventName);
        }
        
    }

    
    static RegistMouseReleaseEvent(arg_obj:IObject,arg_eventName:string,target:EventTarget):string{
        var registEvent={handleEvent: (event: MouseEvent) => {
            arg_obj.OnMouseButtonUp(event);
        }
        };

        if(this.map_mouseReleaseEvent.has(arg_eventName)){
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
    
    static RegistMouseMoveEvent(arg_obj:IObject,arg_eventName:string,target:EventTarget):string{
        var registEvent={handleEvent: (event: MouseEvent) => {
            arg_obj.OnMouseMove(event);
        }
        };

        if(this.map_mouseMoveEvent.has(arg_eventName)){
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

    static RegistWheelEvent(arg_obj:IObject,arg_eventName:string,target:EventTarget):string{
        var registEvent={handleEvent: (event: WheelEvent) => {
            arg_obj.OnMouseWheel(event);
        }
        };

        if(this.map_mouseWheelEvent.has(arg_eventName)){
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

    static RegistKeyPushEvent(arg_obj:IObject,arg_eventName:string ,target:EventTarget):string{
        var registEvent={handleEvent: (event: KeyboardEvent) => {
            arg_obj.OnKeyDown(event);
        }
        };

        if(this.map_keyPushEvent.has(arg_eventName)){
            var output:string=arg_eventName;
            var hasCount=1;
            while(this.map_keyPushEvent.has(output+"_"+hasCount)){
                hasCount++;
            }
            output+="_"+hasCount;
            this.map_keyPushEvent.set(output,registEvent);
            target.addEventListener("keydown",registEvent,true);
            return output;
        }
        this.map_keyPushEvent.set(arg_eventName,registEvent);
        target.addEventListener("keydown",registEvent,true);
        return arg_eventName;

    }
    static UnRegistKeyPushEvent(arg_eventName:string ,target:EventTarget){
        if(this.map_keyPushEvent.has(arg_eventName)){
            target.removeEventListener("keydown",this.map_keyPushEvent.get(arg_eventName) as {handleEvent: (event: KeyboardEvent) => void;},true)
            this.map_keyPushEvent.delete(arg_eventName);
        }
    }


    static RegistKeyReleaseEvent(arg_obj:IObject,arg_eventName:string,target:EventTarget):string{
        var registEvent={handleEvent: (event: KeyboardEvent) => {
            arg_obj.OnKeyUp(event);
        }
        };

        if(this.map_keyReleaseEvent.has(arg_eventName)){
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

    static RegistInputChangeEvent(arg_obj:IObject,arg_eventName:string,target:EventTarget):string{
        var registEvent={handleEvent: (event: InputEvent) => {
            arg_obj.OnInputChange(event);
        }
        };

        if(this.map_inputChangeEvent.has(arg_eventName)){
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
}