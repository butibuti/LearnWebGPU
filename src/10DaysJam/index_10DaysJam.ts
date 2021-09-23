import THREE = require("three");
import ButiLib =require("../ButiLib")
window.addEventListener("DOMContentLoaded", init);

import  Title =require("./Title");
import  GamePlay =require("./GamePlay");
import { isCallChain } from "typescript";
import { GameSceneManager } from "../ButiGameLib";


class EditorCameraMan extends ButiLib.IObject{
  isClick_L:boolean=false;
  isClick_R:boolean=false;
  camera:ButiLib. CameraWrapper ;
  constructor(arg_camera:ButiLib.CameraWrapper){
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
  OnKeyDown(e:KeyboardEvent){
    console.log(this.camera.Camera.position);
    console.log(this.camera.Camera.rotation);
  }
}





function init() {
  const width = 1024;
  const height = 1024;

  var canvas :HTMLCanvasElement= document.getElementById('myCanvas') as HTMLCanvasElement;

  canvas.oncontextmenu = function () {return false;};
  canvas.addEventListener('mousewheel', function(event) {event.preventDefault()}, { passive: false });
  
  const renderer = new ButiLib.RendererWrapper(canvas,width,height);
  

  renderer.Renderer.setClearColor(0x000000);
  

  var cameraEditScene=new GamePlay.GameOverScene(width,height);


  GameSceneManager.GetInstance().AddScene("Title",new Title.TitleScene(width,height));
  GameSceneManager.GetInstance().AddScene("GamePlay",new GamePlay.GamePlayScene(width,height));
  GameSceneManager.GetInstance().AddScene("GameOver",cameraEditScene);
  GameSceneManager.GetInstance().ChangeScene("Title");
  var cameraController=new EditorCameraMan(cameraEditScene.camera);

  // ButiLib.EventManager.RegistMousePushIObjectEvent(cameraController,"cameraController",canvas);
  // ButiLib.EventManager.RegistMouseReleaseIObjectEvent(cameraController,"cameraController",canvas);
  // ButiLib.EventManager.RegistMouseMoveIObjectEvent(cameraController,"cameraController",canvas);
  // ButiLib.EventManager.RegistWheelIObjectEvent(cameraController,"cameraController",canvas);
  // ButiLib.EventManager.RegistKeyPushIObjectEvent(cameraController,"cameraController",document);
  
  const clock = new THREE.Clock();

  
  const downloadButton=document.getElementById("dwonloadButton") as HTMLInputElement;
  
  downloadButton.addEventListener("click",()=>{renderer.CanvasDownload("Image.png",cameraEditScene. postDrawScene,cameraEditScene.postCamera);},true);

  tick();

  function tick() {
    requestAnimationFrame(tick);
    ButiLib.EventManager.ExecuteExEvent("GameUpdate");
    // レンダリング
    GameSceneManager.GetInstance().OnDrawUpdate(renderer);
  }


}