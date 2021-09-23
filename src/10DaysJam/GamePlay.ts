import ButiGameLib=require("../ButiGameLib")
import ButiLib=require("../ButiLib")
import Grid=require("./Grid")
import Piece=require("./Piece")
import Effect=require("./Effect")
import THREE = require("three")
import CameraLib=require("./Camera")
import Score=require("./Score")
import { Easing } from "../Easing"
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
export class GamePlayScene extends ButiGameLib.GameScene{
    scoreModel:Score.ScoreModel;
    gridManager:Grid.GridManager;
    playersPiece:Piece.Piece_Player;
    enemyManager:Piece.PieceManager;
    gamePlayCameraControler:CameraLib.GamePlayCamera;
    transitionShoji_L:ButiGameLib.ObjectTransformMove;
    transitionShoji_R:ButiGameLib.ObjectTransformMove;
    constructor(arg_width:number,arg_height:number){
        super(null,null,null,null,true,arg_width,arg_height,false,arg_width,arg_height);
    }
    OnDestroy():void{
      this.playersPiece.OnUnSet();
      this.enemyManager.OnUnSet();
      this.gridManager.OnUnSet();
      
      ButiLib.EventManager.UnRegistExEvent("PlayerTurnEnd","ShowScore");
    }
    OnInit():void{
        {
            const geometry = new THREE.PlaneGeometry(this.drawScene.RenderTarget.width,this.drawScene.RenderTarget.height);
            
            var planeMat =  new THREE.ShaderMaterial({
              vertexShader:vertex_default,
              fragmentShader: frag_post,
              side: THREE.DoubleSide, 
              transparent: true,
              uniforms: {
                uTex: { value:this.drawScene. RenderTarget.texture }// テスクチャを uTex として渡す
              },
            })
              var plane= new THREE.Mesh(geometry,planeMat);
              plane.scale.y=-1;
              this.postDrawScene.AddDrawObject(plane,"PostDrawPlane");
            
          }
        this.gamePlayCameraControler=new CameraLib.GamePlayCamera(this.camera);
        this.camera.Camera.lookAt(new THREE.Vector3(0, 0, 0.5));
        {
            const light = new THREE.DirectionalLight(0xffffff);
            light.intensity = 1;
            light.position.set(0, 20, -10);
            this.drawScene.AddDrawObject(light,"DirectionaLight");
        }
        
        this.scoreModel=new Score.ScoreModel(this,-400,-300,-400,-300,64);
        this.gridManager=new Grid.GridManager(this);
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
    OnChange():void{
      
  ButiLib.EventManager.ExecuteExEvent("HusumaOpenSoundPlay");
        this.gridManager.Generate();
        this.playersPiece=new Piece.Piece_Player(0,this,this.gridManager,6,5,this.gamePlayCameraControler);
        this.playersPiece.OnSet();
        this.gamePlayCameraControler.CameraPosition=new THREE.Vector3 (-12,20,27);
        this.gamePlayCameraControler.TargetPosition.set(this.playersPiece.currentPosition.x,20,this.playersPiece.currentPosition.z+20);
        this.enemyManager=new Piece.PieceManager(this.playersPiece, this.gridManager, this);


        ButiLib.EventManager.RegistExEvent({handleEvent:()=>this.scoreModel.ShowScore(Score.Score.Score)},"PlayerTurnEnd","ShowScore");
        this.scoreModel.ShowScore(Score.Score.Score);
        this.transitionShoji_L.SetEvent(()=>{
          ButiLib.EventManager.UnRegistExEvent("GameUpdate","GamePlayShojiUpdate");
          this.transitionShoji_R.InitPosition=new THREE.Vector3(1024,0,3);
          this.transitionShoji_R.TargetPosition=new THREE.Vector3(256,0,3);
          this.transitionShoji_L.InitPosition=new THREE.Vector3(-1024,0,3);
          this.transitionShoji_L.TargetPosition=new THREE.Vector3(-256,0,3);
          this.transitionShoji_L.Reset();
          this.transitionShoji_R.Reset();
          this.transitionShoji_L.SetEvent(()=>{
          ButiLib.EventManager.UnRegistExEvent("GameUpdate","GamePlayShojiUpdate") 
          ButiGameLib.GameSceneManager.GetInstance().ChangeScene("GameOver");
         });


         ButiLib.EventManager.RegistExEvent({handleEvent:()=>{ 
           
    ButiLib.EventManager.ExecuteExEvent("HusumaCloseSoundPlay");
          ButiLib.EventManager.UnRegistExEvent("PlayerDeadByEnemy","ChangeSceneGameOver");
          ButiLib.EventManager.UnRegistExEvent("PlayerDeadByFire","ChangeSceneGameOver");
          ButiLib.EventManager.RegistExEvent({handleEvent:()=>{this.transitionShoji_L.Update();this.transitionShoji_R.Update()}}, "GameUpdate","GamePlayShojiUpdate") 
  
        }},"PlayerDeadByFire","ChangeSceneGameOver");
        ButiLib.EventManager.RegistExEvent({handleEvent:()=>{ 
          ButiLib.EventManager.ExecuteExEvent("HusumaCloseSoundPlay");
         ButiLib.EventManager.UnRegistExEvent("PlayerDeadByEnemy","ChangeSceneGameOver");
         ButiLib.EventManager.UnRegistExEvent("PlayerDeadByFire","ChangeSceneGameOver");
         ButiLib.EventManager.RegistExEvent({handleEvent:()=>{this.transitionShoji_L.Update();this.transitionShoji_R.Update()}}, "GameUpdate","GamePlayShojiUpdate") 
 
       }},"PlayerDeadByEnemy","ChangeSceneGameOver");
        });

        ButiLib.EventManager.RegistExEvent({handleEvent:()=>{this.transitionShoji_L.Update();this.transitionShoji_R.Update()}}, "GameUpdate","GamePlayShojiUpdate") 

        //this.enemyManager.AddEnemy(new Piece.Piece_enemy(this.enemyManager, Piece.PieceType.Kyousha, this.playersPiece , "koma_hisha",0,this,this.gridManager,5,5));
        this.enemyManager.AddEnemy(new Piece.Piece_enemy(this.enemyManager, Piece.PieceType.Kin, this.playersPiece , "koma_kin",1,this,this.gridManager,8,8));
        this.enemyManager.AddEnemy(new Piece.Piece_enemy(this.enemyManager, Piece.PieceType.Gin, this.playersPiece , "koma_gin",2,this,this.gridManager,8,7));
    
        
    }
}

export class GameOverScene extends ButiGameLib.GameScene{
  score:number;
  fireEffect:Effect.Fire;
  scoreModel:Score.ScoreModel;
  deadReasonModel:ButiGameLib.ObjectTransformMove;
  deadByFireModel:ButiLib.ModelWrapper;
  deadByEnemyModel:ButiLib.ModelWrapper;
  transitionShoji_L:ButiGameLib.ObjectTransformMove;
  transitionShoji_R:ButiGameLib.ObjectTransformMove;
  constructor(arg_width:number,arg_height:number){
    super(null,null,null,null,true,arg_width,arg_height,false,arg_width,arg_height);
}

OnInit():void{
  {
    
    const geometry = new THREE.PlaneGeometry(this.drawScene.RenderTarget.width,this.drawScene.RenderTarget.height);
        
    var planeMat =  new THREE.ShaderMaterial({
      vertexShader:vertex_default,
      fragmentShader: frag_post,
      side: THREE.DoubleSide, 
      transparent: true,
      uniforms: {
        uTex: { value:this.drawScene. RenderTarget.texture }// テスクチャを uTex として渡す
      },
    })
      var plane= new THREE.Mesh(geometry,planeMat);
      plane.scale.y=-1;
      this.postDrawScene.AddDrawObject(plane,"PostDrawPlane");
  }
    {
    
        
      this.deadByFireModel=ButiLib.CreateTexturePlane("../../img/10daysJam/deadByFire.png",512,512);
      this.deadByFireModel.threeObj.position.set(-256,0,1);
      this.deadByEnemyModel=ButiLib.CreateTexturePlane("../../img/10daysJam/deadByEnemy.png",512,512);
      this.deadByEnemyModel.threeObj.position.set(-256,0,1);
          const shoji_L=ButiLib.CreateTexturePlane("../../img/10daysJam/shoji.png",512,1024);
          const shoji_R=ButiLib.CreateTexturePlane("../../img/10daysJam/shoji.png",512,1024);
          
          shoji_L.threeObj.position.set(-256,0,3);
          shoji_R.threeObj.position.set(256,0,3);
          
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

          this.deadReasonModel=new ButiGameLib.ObjectTransformMove( this.deadByFireModel,()=>{ 
          ButiLib.EventManager.UnRegistExEvent("GameUpdate","FadeDeadByFire");
          ButiLib.EventManager.RegistClickEvent({handleEvent:()=>{
            
          ButiLib.EventManager.ExecuteExEvent("HusumaCloseSoundPlay");
            ButiLib.EventManager.UnRegistClickEvent("SceneChange_GameOverToPlay",document.getElementById('myCanvas'));
            this.transitionShoji_L.InitPosition=new THREE.Vector3(-1024,0,3);
            this.transitionShoji_L.TargetPosition=new THREE.Vector3(-256,0,3);
            this.transitionShoji_L.Reset();
            this.transitionShoji_R.InitPosition=new THREE.Vector3(1024,0,3);
            this.transitionShoji_R.TargetPosition=new THREE.Vector3(256,0,3);
            this.transitionShoji_R.Reset();

            this.transitionShoji_L.SetEvent(()=>{this.SceneChange_GameOverToPlay();
              ButiLib.EventManager.UnRegistExEvent("GameUpdate","transitionShoji_L_deadByFire");});
            ButiLib.EventManager.RegistExEvent({handleEvent:()=>{
                this.transitionShoji_L.Update();
                this.transitionShoji_R.Update();
                }},"GameUpdate","transitionShoji_L_deadByFire",false);
          }},"SceneChange_GameOverToPlay",document.getElementById('myCanvas'));
        });
          this.deadReasonModel.InitPosition=new THREE.Vector3(-256,0,1);
          this.deadReasonModel.TargetPosition=new THREE.Vector3(-256,1024,1);
          this.deadReasonModel.speed=0.016;
          this.deadReasonModel.easeFunction=Easing.EaseOutSine;

          
          this.postDrawScene.AddDrawObject(shoji_L.threeObj,"TransitionShoji_L");
          this.postDrawScene.AddDrawObject(shoji_R.threeObj,"TransitionShoji_R");
      }
      
    var pieceModel=new ButiLib.ModelWrapper();
    var boardModel=new ButiLib.ModelWrapper();
    ButiGameLib. ModelLoad('../../model/10daysJam/board_edge.gltf',pieceModel,this.drawScene,null,new THREE.Vector3(0,0,0));
    ButiGameLib. ModelLoad('../../model/10daysJam/koma_ohsho.gltf',boardModel,this.drawScene,null,new THREE.Vector3(0,1.25,0));
    this.scoreModel=new Score.ScoreModel(this,-256,-800,-256,0,128);
    var boadModel=ButiLib.CreateTextureCube("../../img/10daysJam/board.png",2);
    this.drawScene.AddDrawObject(boadModel.threeObj,"BoardModel");

    this.camera.Camera.position.set(-5,6.3,6.5);
    this.camera.Camera.rotation.set(-0.3184,-0.3914,-0.125);
    {
        const light = new THREE.DirectionalLight(0xffffff);
        light.intensity =1;
        light.position.set(-5, 20, 10);
        this.drawScene.AddDrawObject(light,"DirectionaLight");
    }
    

  ButiLib.EventManager.RegistExEvent({handleEvent:()=>{ 
    ButiGameLib.GameSceneManager.GetInstance().ChangeScene("GamePlay");

}},"Retry","RetryByFire");
  
ButiLib.EventManager.RegistExEvent({handleEvent:()=>{ 
  this.postDrawScene.RemoveDrawObject("DeadReason");
  this.deadReasonModel.Model=this.deadByFireModel;
  this.postDrawScene.AddDrawObject(this.deadReasonModel.Model.threeObj,"DeadReason");
  }},"PlayerDeadByFire","ChangeGameOverReason");
  ButiLib.EventManager.RegistExEvent({handleEvent:()=>{ 
      this.postDrawScene.RemoveDrawObject("DeadReason");
      this.deadReasonModel.Model=this.deadByEnemyModel;
      this.postDrawScene.AddDrawObject(this.deadReasonModel.Model.threeObj,"DeadReason");
      
      }},"PlayerDeadByEnemy","ChangeGameOverReason");
}
OnChange():void{

  
  ButiLib.EventManager.ExecuteExEvent("HusumaOpenSoundPlay");
  if(!this.fireEffect){
    
  this.fireEffect=new Effect.Fire(this,"Fire");
  this.fireEffect.DrawRegist();
  this.fireEffect.Position=new THREE.Vector3(0,1.5,0);
  }
  this.transitionShoji_L.InitPosition=new THREE.Vector3(-256,0,3);
  this.transitionShoji_L.TargetPosition=new THREE.Vector3(-1024,0,3);
  this.transitionShoji_R.InitPosition=new THREE.Vector3(256,0,3);
  this.transitionShoji_R.TargetPosition=new THREE.Vector3(1024,0,3);
  this.transitionShoji_L.Reset();
  this.transitionShoji_R.Reset();
  this.transitionShoji_L.SetEvent(()=>{
    ButiLib.EventManager.RegistClickEvent({handleEvent:()=>{this.ShowScore();}},"ShowScore",document.getElementById('myCanvas'));
      ButiLib.EventManager.UnRegistExEvent("GameUpdate","transitionShoji_L_deadByFire");

  })
  ButiLib.EventManager.RegistExEvent({handleEvent:()=>{
    this.transitionShoji_L.Update();
    this.transitionShoji_R.Update();
    
}},"GameUpdate","transitionShoji_L_deadByFire",false);

ButiGameLib.GameSceneManager.GetInstance().RemoveScene("GamePlay"); 
ButiGameLib.GameSceneManager.GetInstance().AddScene("GamePlay",new GamePlayScene(this.drawScene.RenderTarget.width,this.drawScene.RenderTarget.height));
  this.score=Score.Score.Score;
  Score.Score.Reset();
}
ShowScore(){
  
  this.scoreModel.ShowScore(this.score);
  
  ButiLib.EventManager.RegistExEvent({handleEvent:()=>{
    this.deadReasonModel.Update();
    
}},"GameUpdate","FadeDeadByFire",false);
ButiLib.EventManager.UnRegistClickEvent("ShowScore",document.getElementById('myCanvas'));

}
SceneChange_GameOverToPlay(){

  ButiLib.EventManager.ExecuteExEvent("Retry");

  this.scoreModel.ModelPositionReset();
  this.deadReasonModel.Reset();
}


}