import ButiLib=require("../ButiLib")
import Easing=require("../Easing")
import ButiGameLib=require("../ButiGameLib")

import THREE = require("three")
export class GamePlayCamera extends ButiLib.IObject{
    private camera:ButiLib. CameraWrapper ;
    private initCameraPosition=new THREE.Vector3();
    private currentCameraPosition=new THREE.Vector3();
    private targetPosition=new THREE.Vector3();
    private time:number=0;
    private updateeventKey:string;
    constructor(arg_camera:ButiLib.CameraWrapper){
      super();
      this.camera=arg_camera;
      this.initCameraPosition=this.camera.Camera.position.clone();
    }
    OnUpdate():void{

        this.time+=0.0166;
        if(this.time>1.0){
            ButiLib.EventManager.UnRegistExEvent("GameUpdate",this.updateeventKey);
            this.updateeventKey=null;
            this.initCameraPosition=this.currentCameraPosition;
            this.time=0;
            return;
        }
        this.currentCameraPosition=this.initCameraPosition.clone().add(this.targetPosition.clone().sub(this.initCameraPosition).multiplyScalar(Easing.Easing.EaseInOutQuart(this.time)));
        this.camera.Camera.position.set(this.currentCameraPosition.x,this.currentCameraPosition.y,this.currentCameraPosition.z);
    }
    set CameraPosition(other:THREE.Vector3){
        if(!this.updateeventKey){
            this.updateeventKey=ButiLib.EventManager.RegistExEvent({handleEvent :()=> {this.OnUpdate(); }},"GameUpdate","GamePlayCamera",true);
        }
        this.time=0;
        this.initCameraPosition=other;
        this.currentCameraPosition=this.initCameraPosition.clone();
    }
    set TargetPosition(other:THREE.Vector3){
        if(!this.updateeventKey){
            this.updateeventKey=ButiLib.EventManager.RegistExEvent({handleEvent :()=> {this.OnUpdate(); }},"GameUpdate","GamePlayCamera",true);
        }
        this.time=0;
        this.targetPosition=other;
        this.initCameraPosition=this.currentCameraPosition;
    }
    get CameraPosition():THREE.Vector3{
        
        if(!this.updateeventKey){
            this.updateeventKey=ButiLib.EventManager.RegistExEvent({handleEvent :()=> {this.OnUpdate(); }},"GameUpdate","GamePlayCamera",true);
        }
        this.currentCameraPosition=this.initCameraPosition;
        this.time=0;
        return this.initCameraPosition;
    }
    get TargetPosition():THREE.Vector3{
        if(!this.updateeventKey){
            this.updateeventKey=ButiLib.EventManager.RegistExEvent({handleEvent :()=> {this.OnUpdate(); }},"GameUpdate","GamePlayCamera",true);
        }
        this.initCameraPosition=this.currentCameraPosition;
        this.time=0;
        return this.targetPosition;
    }
}