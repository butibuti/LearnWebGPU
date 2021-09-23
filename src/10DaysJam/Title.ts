import ButiGameLib=require("../ButiGameLib")
import ButiLib=require("../ButiLib")
import THREE = require("three");

import { Easing } from "../Easing"



const modelNameTable=["koma_hu","koma_kyosha","koma_keima","koma_gin","koma_kin","koma_kaku","koma_hisha","koma_ohsho"];

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
  vec2 center = vec2( .5, .5 );
  float dist = length( vUv - center );
  color.rgb*=(1.0-dist*dist);

  gl_FragColor = color;
}
`
class FallAnimation{
  model:ButiLib.ModelWrapper;
  speed=0;
  rotationSpeed=0;
  rotation:THREE.Vector3;
  name:string;
  constructor(arg_name:string){
    this.model=new ButiLib.ModelWrapper();
    this.rotation=(new THREE.Vector3(Math.random(),Math.random(),Math.random())).normalize();
    this.name=arg_name;
    this.rotationSpeed=Math.random()-0.5;
  }

  RegistEvent(){
    this.model.threeObj.position.set(ButiLib.GetRandomArbitrary(-5,5),ButiLib.GetRandomArbitrary(5,7),ButiLib.GetRandomArbitrary(-20,-3));
    this.speed=-Math.abs( this.model.threeObj.position.z)*0.02;
    ButiLib.EventManager.RegistExEvent({handleEvent:()=>
      {
        if(this.model.threeObj.position.y<-8){
          this.model.threeObj.position.set(ButiLib.GetRandomArbitrary(-5,5),ButiLib.GetRandomArbitrary(5,7),ButiLib.GetRandomArbitrary(-20,-3));
        }
        this.model.threeObj.rotateOnWorldAxis(this.rotation,this.rotationSpeed);
        this.model.threeObj.position.add(new THREE.Vector3(0,this.speed,0));
        
      }},"GameUpdate",this.name+":FallUpdate");

  }
  UnRegistEvent(){
    ButiLib.EventManager.UnRegistExEvent("GameUpdate",this.name+":FallUpdate");

  }
}

export class TitleScene extends ButiGameLib.GameScene{
  
  transitionShoji_L:ButiGameLib.ObjectTransformMove;
  transitionShoji_R:ButiGameLib.ObjectTransformMove;
  fallPieces:FallAnimation[]=[];
    constructor(arg_width:number,arg_height:number){
        super(null,null,null,null,true,arg_width,arg_height,false,arg_width,arg_height);
    }
    OnInit():void{
{

  {
    var husumaCloseSound=new ButiLib.Sound("../../sound/husuma.mp3");
    var husumaOpenSound=new ButiLib.Sound("../../sound/husumaOpen.mp3");
    var komaput=new ButiLib.Sound("../../sound/pachinn.mp3");
    ButiLib.EventManager.RegistExEvent({handleEvent:()=>{husumaCloseSound.Play_new()}},"HusumaCloseSoundPlay","husuma");
    ButiLib.EventManager.RegistExEvent({handleEvent:()=>{husumaOpenSound.Play_new()}},"HusumaOpenSoundPlay","husuma");
    ButiLib.EventManager.RegistExEvent({handleEvent:()=>{komaput.Play_new()}},"KomaSoundPlay","koma");
  }

    const geometry = new THREE.PlaneGeometry(this.drawScene.RenderTarget.width,this.drawScene.RenderTarget.height);
  
    var planeMat =  new THREE.ShaderMaterial({
      vertexShader:vertex_default,
      fragmentShader: frag_post,
      side: THREE.DoubleSide, 
      transparent: true,
      uniforms: {
        uTex: { value:this.drawScene. RenderTarget.texture }
      },
    })
      var plane= new THREE.Mesh(geometry,planeMat);
      plane.scale.y=-1;
      this.postDrawScene.AddDrawObject(plane,"dotPlane");
    
      var titleTex=ButiLib.CreateTexturePlane("../../img/10daysJam/title.png",1024,1024);
      titleTex.threeObj.position.set(-0,0,1);
      this.postDrawScene.AddDrawObject(titleTex.threeObj,"DeadByFire");
  }
  {
    
    var piece=new FallAnimation (modelNameTable[0]);
    this.fallPieces.push(piece);
    ButiGameLib. ModelLoad('../../model/10daysJam/'+modelNameTable[0]+'.gltf',piece.model,this.drawScene,null,null,null,null,()=>{
      piece.RegistEvent();
    });
    var piece1=new FallAnimation (modelNameTable[1]);
    this.fallPieces.push(piece1);
    ButiGameLib. ModelLoad('../../model/10daysJam/'+modelNameTable[1]+'.gltf',piece1.model,this.drawScene,null,null,null,null,()=>{
      piece1.RegistEvent();
    });
    var piece2=new FallAnimation (modelNameTable[2]);
    this.fallPieces.push(piece2);
    ButiGameLib. ModelLoad('../../model/10daysJam/'+modelNameTable[2]+'.gltf',piece2.model,this.drawScene,null,null,null,null,()=>{
      piece2.RegistEvent();
    });
    var piece3=new FallAnimation (modelNameTable[3]);
    this.fallPieces.push(piece3);
    ButiGameLib. ModelLoad('../../model/10daysJam/'+modelNameTable[3]+'.gltf',piece3.model,this.drawScene,null,null,null,null,()=>{
      piece3.RegistEvent();
    });
    var piece4=new FallAnimation (modelNameTable[4]);
    this.fallPieces.push(piece4);
    ButiGameLib. ModelLoad('../../model/10daysJam/'+modelNameTable[4]+'.gltf',piece4.model,this.drawScene,null,null,null,null,()=>{
      piece4.RegistEvent();
    });
    var piece5=new FallAnimation (modelNameTable[5]);
    this.fallPieces.push(piece5);
    ButiGameLib. ModelLoad('../../model/10daysJam/'+modelNameTable[5]+'.gltf',piece5.model,this.drawScene,null,null,null,null,()=>{
      piece5.RegistEvent();
    });
    var piece6=new FallAnimation (modelNameTable[6]);
    this.fallPieces.push(piece6);
    ButiGameLib. ModelLoad('../../model/10daysJam/'+modelNameTable[6]+'.gltf',piece6.model,this.drawScene,null,null,null,null,()=>{
      piece6.RegistEvent();
    });
    var piece7=new FallAnimation (modelNameTable[7]);
    this.fallPieces.push(piece7);
    ButiGameLib. ModelLoad('../../model/10daysJam/'+modelNameTable[7]+'.gltf',piece7.model,this.drawScene,null,null,null,null,()=>{
      piece7.RegistEvent();
    });
  }
var fire=new ButiLib.ModelWrapper();


ButiGameLib. ModelLoad('../../model/10daysJam/board_edge.gltf',fire,this.drawScene,null,new THREE.Vector3(0,0,10));
ButiGameLib. ModelLoad('../../model/10daysJam/fire.gltf',fire,this.drawScene,null,new THREE.Vector3(0,0,10));
  {

    const light = new THREE.DirectionalLight(0xffffff);
    light.intensity = 1; // 光の強さを倍に
    light.position.set(1, 1, -1);
    // シーンに追加
    this.drawScene.AddDrawObject(light,"DirectionaLight");
    this.postDrawScene.AddDrawObject(light,"dirLight");
  }


  const shoji_L=ButiLib.CreateTexturePlane("../../img/10daysJam/shoji.png",512,1024);
  const shoji_R=ButiLib.CreateTexturePlane("../../img/10daysJam/shoji.png",512,1024);
  shoji_L.threeObj.position.set(-256,0,3);
  shoji_R.threeObj.position.set(256,0,3);
  
  this.postDrawScene.AddDrawObject(shoji_L.threeObj,"TransitionShoji_L");
  this.postDrawScene.AddDrawObject(shoji_R.threeObj,"TransitionShoji_R");
  
  this.transitionShoji_L=new ButiGameLib.ObjectTransformMove(shoji_L);
  this.transitionShoji_L.InitPosition=new THREE.Vector3(-256,0,3);
  this.transitionShoji_L.TargetPosition=new THREE.Vector3(-1024,0,3);
  this.transitionShoji_L.speed=0.01;
  this.transitionShoji_L.easeFunction=Easing.EaseInOutCubic;
  this.transitionShoji_R=new ButiGameLib.ObjectTransformMove(shoji_R);
  this.transitionShoji_R.InitPosition=new THREE.Vector3(256,0,3);
  this.transitionShoji_R.TargetPosition=new THREE.Vector3(1024,0,3);
  this.transitionShoji_R.speed=0.01;
  this.transitionShoji_R.easeFunction=Easing.EaseInOutCubic;
}
OnEscape(){
  this.fallPieces.forEach(f=>{f.UnRegistEvent()});
}
    OnChange():void{
        this.transitionShoji_L.SetEvent(()=>{
          ButiLib.EventManager.UnRegistExEvent("GameUpdate","TiltleShojiUpdate");
          this.transitionShoji_R.InitPosition=new THREE.Vector3(1024,0,3);
          this.transitionShoji_R.TargetPosition=new THREE.Vector3(256,0,3);
          this.transitionShoji_L.InitPosition=new THREE.Vector3(-1024,0,3);
          this.transitionShoji_L.TargetPosition=new THREE.Vector3(-256,0,3);
          this.transitionShoji_L.Reset();
          this.transitionShoji_R.Reset();
          this.transitionShoji_L.SetEvent(()=>{
          ButiLib.EventManager.UnRegistExEvent("GameUpdate","TiltleShojiUpdate") 
          ButiLib.EventManager.UnRegistExEvent("GameUpdate","TitleUpdate");
          ButiGameLib.GameSceneManager.GetInstance().ChangeScene("GamePlay");   });
          
  ButiLib.EventManager.RegistExEvent({handleEvent :()=> {}},"GameUpdate","TitleUpdate");

  ButiLib.EventManager.RegistClickEvent({handleEvent:()=>{
    ButiLib.EventManager.ExecuteExEvent("HusumaCloseSoundPlay");
    ButiLib.EventManager.UnRegistClickEvent("SceneChange_TitleToPlay",document.getElementById('myCanvas'));
    ButiLib.EventManager.RegistExEvent({handleEvent:()=>{this.transitionShoji_L.Update();this.transitionShoji_R.Update()}}, "GameUpdate","TiltleShojiUpdate") 
}},"SceneChange_TitleToPlay",document.getElementById('myCanvas'));
        });

        ButiLib.EventManager.RegistExEvent({handleEvent:()=>{this.transitionShoji_L.Update();this.transitionShoji_R.Update()}}, "GameUpdate","TiltleShojiUpdate") 
  ButiLib.EventManager.RegistExEvent({handleEvent :()=> {}},"GameUpdate","TitleUpdate");

    
    }
}