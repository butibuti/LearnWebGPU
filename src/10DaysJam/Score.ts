import ButiLib=require("../ButiLib")
import EasingLib=require("../Easing")
import ButiGameLib=require("../ButiGameLib")
import Grid=require("./Grid")
import CameraLib=require("./Camera")
import THREE =require("three");

export class Score{
    private static score:number=0;
    static  get Score():number{
        return this.score;
    }

    static AddScore(arg_addition:number){
        this.score+=arg_addition;
    }
    static Reset():void{
        this.score=0;
    }
}

function CreateNumberModelGroup(arg_filePath:string,arg_fileExtension:string, arg_number: number,arg_width:number,arg_height:number,arg_isVertical:boolean,arg_offset:number):THREE.Object3D{
    const output = new THREE.Object3D(); 
    const numStr=arg_number+"";
    var offset:THREE.Vector3;
    var unit:THREE.Vector3;
    if(arg_isVertical){
        offset=new THREE.Vector3(0,-(numStr.length-1+arg_offset)*0.5*arg_height,0);
        unit=new THREE.Vector3( 0,arg_height,0);
    }else{
        offset=new THREE.Vector3((numStr.length-1+arg_offset)*0.5*arg_width,0,0);
        unit=new THREE.Vector3( arg_width,0,0);
    }
    for(var i=0;i<numStr.length;i++){
        const num=numStr[i];
        const model=ButiLib.CreateTexturePlane(arg_filePath+num+arg_fileExtension, arg_width,arg_height).threeObj;
        model.position.add(offset);
        output.add(model);
        offset.add(unit);
    }
    return output;
}

export class ScoreModel extends ButiGameLib.GameObject{
    private score:number;
    private animationModel:ButiGameLib. ObjectTransformMove;
    private endModel:ButiLib.ModelWrapper;
    private size=0;
    constructor(arg_scene:ButiGameLib.GameScene,arg_initX:number,arg_inity:number,arg_targetX:number,arg_targetY:number,arg_size:number){
        super(arg_scene,"scoreResult");
        this.size=arg_size;
        this.endModel= ButiLib.CreateTexturePlane("../../img/10daysJam/scoreCount_end.png",this.size,this.size);
        this.animationModel=new ButiGameLib.ObjectTransformMove(new ButiLib.ModelWrapper(new THREE.Object3D()) ,()=>{
            ButiLib.EventManager.UnRegistExEvent("GameUpdate","ShowScore");});
        this.scene.postDrawScene.AddDrawObject(this.animationModel.Model.threeObj,"ScoreResultModel");
        this.animationModel.Model.threeObj.position.set(arg_initX,arg_inity,2);
        this.animationModel.InitPosition=new THREE.Vector3(arg_initX,arg_inity,2);
        this.animationModel.TargetPosition=new THREE.Vector3(arg_targetX,arg_targetY,2);
        this.animationModel.speed=0.016;
        this.animationModel.easeFunction=EasingLib.Easing.EaseOutSine;
    }

    ShowScore(arg_score:number){
        this.score=arg_score;
        const scoreModel=CreateNumberModelGroup("../../img/10daysJam/score_",".png",this.score,this.size,this.size,true,1);
        this.animationModel.Model.threeObj.clear();
        this.animationModel.Model.threeObj.add(scoreModel);
        this.endModel.threeObj.position.setY(scoreModel.children.slice(-1)[0].position.y+this.size);
        this.animationModel.Model.threeObj.add(this.endModel.threeObj);
        ButiLib.EventManager.RegistExEvent({handleEvent:()=>{
            
            this.animationModel.Update();
        }},"GameUpdate","ShowScore",false);
    }
    ModelPositionReset(){
        this.animationModel.Reset();
    }
}