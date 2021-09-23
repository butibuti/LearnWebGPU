import ButiLib=require("../ButiLib")
import ButiGameLib=require("../ButiGameLib")
import Grid=require("./Grid")
import CameraLib=require("./Camera")
import Score=require("./Score")
import THREE = require("three")
import { Easing } from "../Easing"
import { Vector3 } from "three"
const pieceMoveSpeed=0.04;
const pieceLiftHeight=3.0;
const MoveOffsetTable =[
    //hu
    [new ButiLib.Int2(0,-1)],
    //kyosha
    [new ButiLib.Int2(0,-10),new ButiLib.Int2(0,-9),new ButiLib.Int2(0,-8),new ButiLib.Int2(0,-7),new ButiLib.Int2(0,-6),new ButiLib.Int2(0,-5),new ButiLib.Int2(0,-4),new ButiLib.Int2(0,-3),new ButiLib.Int2(0,-2),new ButiLib.Int2(0,-1)],
    //keima
    [new ButiLib.Int2(-1,-2),new ButiLib.Int2(1,-2)],
    //kin
    [new ButiLib.Int2(-1,-1),new ButiLib.Int2(1,-1),new ButiLib.Int2(0,-1),new ButiLib.Int2(-1,0),new ButiLib.Int2(1,0),new ButiLib.Int2(0,1)],
    //gin
    [new ButiLib.Int2(-1,-1),new ButiLib.Int2(1,-1),new ButiLib.Int2(0,-1),new ButiLib.Int2(-1,1),new ButiLib.Int2(1,1)],
    //kaku
    [new ButiLib.Int2(-1,-1),new ButiLib.Int2(1,1),new ButiLib.Int2(1,-1),new ButiLib.Int2(-1,1),new ButiLib.Int2(-2,-2),new ButiLib.Int2(2,2),new ButiLib.Int2(2,-2),new ButiLib.Int2(-2,2),
        new ButiLib.Int2(-3,-3),new ButiLib.Int2(3,3),new ButiLib.Int2(3,-3),new ButiLib.Int2(-3,3),new ButiLib.Int2(-4,-4),new ButiLib.Int2(4,4),new ButiLib.Int2(4,-4),new ButiLib.Int2(-4,4),
        new ButiLib.Int2(-5,-5),new ButiLib.Int2(5,5),new ButiLib.Int2(5,-5),new ButiLib.Int2(-5,5),new ButiLib.Int2(-6,-6),new ButiLib.Int2(6,6),new ButiLib.Int2(6,-6),new ButiLib.Int2(-6,6),
        new ButiLib.Int2(-7,-7),new ButiLib.Int2(7,7),new ButiLib.Int2(7,-7),new ButiLib.Int2(-7,7),new ButiLib.Int2(-8,-8),new ButiLib.Int2(8,8),new ButiLib.Int2(8,-8),new ButiLib.Int2(-8,8),
        new ButiLib.Int2(-9,-9),new ButiLib.Int2(9,9),new ButiLib.Int2(9,-9),new ButiLib.Int2(-9,9),new ButiLib.Int2(-10,-10),new ButiLib.Int2(10,10),new ButiLib.Int2(10,-10),new ButiLib.Int2(-10,10),
        new ButiLib.Int2(-11,-11),new ButiLib.Int2(11,11),new ButiLib.Int2(11,-11),new ButiLib.Int2(-11,11),new ButiLib.Int2(-12,-12),new ButiLib.Int2(12,12),new ButiLib.Int2(12,-12),new ButiLib.Int2(-12,12),
        new ButiLib.Int2(-13,-13),new ButiLib.Int2(13,13),new ButiLib.Int2(13,-13),new ButiLib.Int2(-13,13),new ButiLib.Int2(-14,-14),new ButiLib.Int2(14,14),new ButiLib.Int2(14,-14),new ButiLib.Int2(-14,14),
        new ButiLib.Int2(-15,-15),new ButiLib.Int2(15,15),new ButiLib.Int2(15,-15),new ButiLib.Int2(-15,15),new ButiLib.Int2(-16,-16),new ButiLib.Int2(16,16),new ButiLib.Int2(16,-16),new ButiLib.Int2(-16,16),
    ],
    //hisha
    [new ButiLib.Int2(-1,0),new ButiLib.Int2(1,0),new ButiLib.Int2(0,-1),new ButiLib.Int2(0,1),new ButiLib.Int2(-2,0),new ButiLib.Int2(2,0),new ButiLib.Int2(0,-2),new ButiLib.Int2(0,2),
    new ButiLib.Int2(-3,0),new ButiLib.Int2(3,0),new ButiLib.Int2(0,-3),new ButiLib.Int2(0,3),new ButiLib.Int2(-4,0),new ButiLib.Int2(4,0),new ButiLib.Int2(0,-4),new ButiLib.Int2(0,4),
    new ButiLib.Int2(-5,0),new ButiLib.Int2(5,0),new ButiLib.Int2(0,-5),new ButiLib.Int2(0,5),new ButiLib.Int2(-6,0),new ButiLib.Int2(6,0),new ButiLib.Int2(0,-6),new ButiLib.Int2(0,6),
    new ButiLib.Int2(-7,0),new ButiLib.Int2(7,0),new ButiLib.Int2(0,-7),new ButiLib.Int2(0,7),new ButiLib.Int2(-8,0),new ButiLib.Int2(8,0),new ButiLib.Int2(0,-8),new ButiLib.Int2(0,8),
    new ButiLib.Int2(-9,0),new ButiLib.Int2(9,0),new ButiLib.Int2(0,-9),new ButiLib.Int2(0,9),new ButiLib.Int2(-10,0),new ButiLib.Int2(10,0),new ButiLib.Int2(0,-10),new ButiLib.Int2(0,10),
    new ButiLib.Int2(-11,0),new ButiLib.Int2(11,0),new ButiLib.Int2(0,-11),new ButiLib.Int2(0,11),new ButiLib.Int2(-12,0),new ButiLib.Int2(12,0),new ButiLib.Int2(0,-12),new ButiLib.Int2(0,12),
    new ButiLib.Int2(-13,0),new ButiLib.Int2(13,0),new ButiLib.Int2(0,-13),new ButiLib.Int2(0,13),new ButiLib.Int2(-14,0),new ButiLib.Int2(14,0),new ButiLib.Int2(0,-14),new ButiLib.Int2(0,14),
    new ButiLib.Int2(-15,0),new ButiLib.Int2(15,0),new ButiLib.Int2(0,-15),new ButiLib.Int2(0,15),new ButiLib.Int2(-16,0),new ButiLib.Int2(16,0),new ButiLib.Int2(0,-16),new ButiLib.Int2(0,16),
    ],
[new ButiLib.Int2(-1,-1),new ButiLib.Int2(0,-1),new ButiLib.Int2(+1,-1),new ButiLib.Int2(-1,0),new ButiLib.Int2(+1,0),new ButiLib.Int2(-1,+1),new ButiLib.Int2(0,+1),new ButiLib.Int2(+1,+1)]]

export enum PieceType{
    Hu,Kyousha,Keima,Kin,Gin,Kaku,Hisha
}

export class Piece extends ButiGameLib.GameObject{
    model=new ButiLib.ModelWrapper();
    modelKey=new ButiLib.StringRef();
    selectableGrids:Grid.Grid[]=[];
    selectableGridsIndex:ButiLib.Int2[]=[];
    targetPosition:THREE.Vector3;
    currentPosition:THREE.Vector3;
    initPosition:THREE.Vector3;
    translateVelocity:THREE.Vector3;
    destroyEnemy:Piece;
    
    horizontalIndex:number;
    verticalIndex:number;
    gridManager:Grid.GridManager;
    currentGrid:Grid.Grid;
    animationProgress=0;
    constructor(arg_modelName:string, arg_index:number, arg_scene:ButiGameLib.GameScene,arg_gridManager:Grid.GridManager,arg_horizontalIndex:number,arg_verticalIndex:number,arg_initRotation:THREE.Vector3){
        super(arg_scene,"Piece_"+arg_index);
        this.gridManager=arg_gridManager;
        this.horizontalIndex=arg_horizontalIndex;
        this.verticalIndex=arg_verticalIndex;
        this.currentPosition=this.gridManager.GetGridPosition(this.horizontalIndex,this.verticalIndex);
        this.initPosition=this.currentPosition;
        this.currentPosition.setY(1.5);
        this.targetPosition=null;

        this.currentGrid= this.gridManager.GetGrid(this.horizontalIndex,this.verticalIndex);

        ButiGameLib. ModelLoad('../../model/10daysJam/'+arg_modelName+'.gltf',this.model,arg_scene.drawScene,this.modelKey,this.currentPosition,arg_initRotation);
    }
    OnUpdate():void{
        
    }
    OnSet():void{
        
    }
    OnUnSet():void{
        
        this.selectableGrids.forEach(grid=>{grid.ColorAnim.Release();})
        this.gridManager=null;
        this.currentGrid=null;
        this.scene.drawScene.RemoveDrawObject(this.modelKey.value);
        
    }
    OnDeadByFire():void{
        if(this.currentGrid){
            this.currentGrid.Piece=null;
        }
        this.OnUnSet();
    }
    OnDeadByEnemy():void{
        this.OnUnSet();
    }
    OnDeadByVoid(){
        this.OnUnSet();
    }
    Move(arg_horizontalIndex:number,arg_verticalIndex:number):void{

        this.horizontalIndex=arg_horizontalIndex;
        this.verticalIndex=arg_verticalIndex;
        this.currentGrid.Piece=null;
        this.currentGrid= this.gridManager.GetGrid(this.horizontalIndex,this.verticalIndex);
        if(this.currentGrid.Piece&&this.currentGrid.Piece!=this){
            this.destroyEnemy=this.currentGrid.Piece;
        }
        this.currentGrid.Piece=this;
    }
}
export class Piece_enemy extends Piece{ 

    private piece_player:Piece_Player;
    
    private pieceManager:PieceManager;
    constructor(arg_pieceManager:PieceManager, arg_pieceType:PieceType, arg_player:Piece_Player, arg_pieceModelName:string, arg_index:number, arg_scene:ButiGameLib.GameScene,arg_gridManager:Grid.GridManager,arg_horizontalIndex:number,arg_verticalIndex:number){
    super(arg_pieceModelName,arg_index,arg_scene,arg_gridManager,arg_horizontalIndex,arg_verticalIndex,new THREE.Vector3(0,180*Math.PI/180,0));
    this.tag="enemy";
    this.selectableGridsIndex=MoveOffsetTable[arg_pieceType];
    this.Move(this.horizontalIndex,this.verticalIndex);
    this.piece_player=arg_player;
    this.pieceManager=arg_pieceManager;
    }
    OnUnSet(){
        this.pieceManager.RemoveEnemy(this);
        super.OnUnSet();
        ButiLib.EventManager.UnRegistExEvent("GameUpdate","Piece_Enemy:"+this.horizontalIndex+","+this.verticalIndex);
    }
    OnUpdate(){

        if(!this.currentGrid){
            return;
        }
        this.animationProgress+=pieceMoveSpeed;
        this.currentPosition=this.initPosition.clone().add(this.translateVelocity.clone().multiplyScalar(Easing.EaseInQuart( this.animationProgress)));
        this.currentPosition.setY(this.initPosition.y+ Easing.Parabola(this.animationProgress)*pieceLiftHeight);
        this.model.threeObj.position.set(this.currentPosition.x,this.currentPosition.y,this.currentPosition.z);
        if(this.animationProgress>1.0){
            this.animationProgress=0.0;
            this.currentPosition=this.targetPosition;
            this.initPosition=this.targetPosition;
            this.targetPosition=null;
            ButiLib.EventManager.UnRegistExEvent("GameUpdate","Piece_Enemy:"+this.horizontalIndex+","+this.verticalIndex);

            ButiLib.EventManager.ExecuteExEvent("KomaSoundPlay");
            if(this.currentGrid.IsBurning){
                this.OnDeadByFire();
            }
            if(this.destroyEnemy){
                this.destroyEnemy.OnDeadByEnemy();
                this.destroyEnemy=null;
            }
            ButiLib.EventManager.ExecuteExEvent("EnemyMoveEnd");
            return;
        }
    }
    Move(arg_horizontalIndex:number,arg_verticalIndex:number){
        super.Move(arg_horizontalIndex,arg_verticalIndex);
        this.selectableGrids.forEach(grid=>{grid.ColorAnim.Release();})
        this.selectableGrids.length=0;
        
        this.selectableGridsIndex.forEach(x=>{
            if(this.horizontalIndex+x.x>this.gridManager.HorizontalEndIndex||this.horizontalIndex+x.x<this.gridManager.HorizontalStartIndex||this.verticalIndex+x.y>this.gridManager.VerticalEndIndex||this.verticalIndex+x.y<this.gridManager.VerticalStartIndex){
                return;
            }
            this.selectableGrids.push(this.gridManager.GetGrid(this.horizontalIndex+x.x,this.verticalIndex+x.y))
        })
        
        this.selectableGrids.forEach(grid=>{grid.ColorAnimStart (new THREE.Vector4(1,1,1,1),new THREE.Vector4(1.0,0.5,0.5,1),0.02,true);})
    }
    CalcNearestPlayer():number{
        var distance=Math.abs(this.piece_player.horizontalIndex-this.horizontalIndex)+Math.abs(this.piece_player.verticalIndex-this.verticalIndex);
        for(var i=0;i< this.selectableGridsIndex.length;i++){
            var checkDistance=Math.abs (this.horizontalIndex+this.selectableGridsIndex[i].x-this.piece_player.horizontalIndex )+Math.abs(this.verticalIndex+this.selectableGridsIndex[i].y-this.piece_player.verticalIndex);
            if(checkDistance<=distance){
                distance=checkDistance;
            }
        }
        return distance;
    }

    MoveNearestPlayer(){
        var nearestIndex=0;
        var cantMoveCount=0;
        var distance=Math.abs(this.piece_player.horizontalIndex-this.horizontalIndex)+Math.abs(this.piece_player.verticalIndex-this.verticalIndex);
        for(var i=0;i< this.selectableGrids.length;i++){
            var checkDistance=Math.abs (this.horizontalIndex+this.selectableGridsIndex[i].x-this.piece_player.horizontalIndex )+Math.abs(this.verticalIndex+this.selectableGridsIndex[i].y-this.piece_player.verticalIndex);
            
            
            if(checkDistance<distance){
                if(this.selectableGrids[i].Piece&&(this.selectableGrids[i].Piece.tag=="enemy")){
                    cantMoveCount++;
                    continue;
                }
                distance=checkDistance;
                nearestIndex=i;
            }
        }
        var xMovement=0;
        var yMovement=0;
        if(cantMoveCount!=this.selectableGrids.length){
            xMovement=this.selectableGridsIndex[nearestIndex].x;
            yMovement=this.selectableGridsIndex[nearestIndex].y;
        }

        this.horizontalIndex=ButiLib.Clamp(this.gridManager.HorizontalStartIndex,this.gridManager.HorizontalEndIndex,this.horizontalIndex+xMovement) ;
        this.verticalIndex=ButiLib.Clamp(this.gridManager.VerticalStartIndex,this.gridManager.VerticalEndIndex,this.verticalIndex+yMovement) ;
        
        
        const nextPos=this.gridManager.GetGridPosition(this.horizontalIndex,this.verticalIndex);
        this.targetPosition=new THREE.Vector3 (nextPos.x,1.25,nextPos.z);
        this.translateVelocity=this.targetPosition.clone().sub(this.initPosition);
        this.Move(this.horizontalIndex,this.verticalIndex);
        ButiLib.EventManager.RegistExEvent({handleEvent :()=> {this.OnUpdate(); }},"GameUpdate","Piece_Enemy:"+this.horizontalIndex+","+this.verticalIndex);


    }
}

const spawnTypeTable=[PieceType.Hu,PieceType.Hu,PieceType.Hu,PieceType.Hu,PieceType.Hu,
    PieceType.Kyousha,PieceType.Kyousha,PieceType.Kyousha,
    PieceType.Keima,PieceType.Keima,PieceType.Keima,PieceType.Keima,
    PieceType.Gin,PieceType.Gin,PieceType.Gin,PieceType.Kin,PieceType.Kin,PieceType.Kaku,PieceType.Kaku,PieceType.Hisha];
const spawnNameTable=["koma_hu","koma_hu","koma_hu","koma_hu","koma_hu",
    "koma_kyosha","koma_kyosha","koma_kyosha",
    "koma_keima","koma_keima","koma_keima","koma_keima",
    "koma_gin","koma_gin","koma_gin","koma_kin","koma_kin","koma_kaku","koma_kaku","koma_hisha"];

export class PieceManager extends ButiGameLib.GameObject{

    endObjectsCount=0;
    pieces=new Map<string,Piece_enemy>();
    gridManager:Grid.GridManager;
    player:Piece_Player;
    spawnedCount=0;
    constructor(arg_player:Piece_Player, arg_gridManager:Grid.GridManager, arg_scene:ButiGameLib.GameScene){
        super(arg_scene,"PieceManager");
        this.player=arg_player;
        this.gridManager=arg_gridManager;
        this.gridManager.PieceManager=this;
        ButiLib.EventManager.RegistExEvent({handleEvent:()=>{

            if(!this.pieces.size){
                ButiLib.EventManager.ExecuteExEvent("EnemyTurnEnd");
                return;
            }
            var pieceArray=Array.from(this.pieces,x=>x[1]);
            pieceArray.sort((x)=>{return x.CalcNearestPlayer()})

            pieceArray.forEach(x=>x.MoveNearestPlayer())


        }},"PlayerTurnEnd","EnemyPieceCalc");
        ButiLib.EventManager.RegistExEvent({handleEvent:()=>this.AddEnemyTurnEndCount()},"EnemyMoveEnd","EnemyManager");
    }
    SpawnCheckOnVerticalExtend(){

        const score=Score.Score.Score;

        //
        for(var i=this.gridManager.HorizontalStartIndex+1;i< this.gridManager.HorizontalEndIndex;i++){
            const r=(Math.random()* Easing.EaseInOutExpo( score*0.1));

            
            if(r>0.9-ButiLib.Clamp( score*0.02, 0,0.4)){
                const enemyPattern=ButiLib.GetRandomInt(0,20);
                this.AddEnemy(new Piece_enemy(this, spawnTypeTable[enemyPattern], this.player, spawnNameTable[enemyPattern],this.spawnedCount,this.scene,this.gridManager,i,this.gridManager.VerticalEndIndex))
                this.spawnedCount++;
            }

        }

        ButiLib.EventManager.ExecuteExEvent("EnemySpawnTurnEnd");
    }
    SpawnCheckOnHorizontalExtend(){

        const score=Score.Score.Score;

        //
        for(var i=this.gridManager.VerticalStartIndex+1;i< this.gridManager.VerticalEndIndex;i++){
            const r=(Math.random()* Easing.EaseInOutExpo( score*0.01));

            if(r>0.9-ButiLib.Clamp( score*0.02, 0,0.4)){
                const enemyPattern=ButiLib.GetRandomInt(0,20);
                this.AddEnemy(new Piece_enemy(this, spawnTypeTable[enemyPattern], this.player, spawnNameTable[enemyPattern],this.spawnedCount,this.scene,this.gridManager,this.gridManager.HorizontalEndIndex,i))
                this.spawnedCount++;
            }

        }
        ButiLib.EventManager.ExecuteExEvent("EnemySpawnTurnEnd");

    }
    NoSpawn(){
        ButiLib.EventManager.ExecuteExEvent("EnemySpawnTurnEnd");
    }
    AddEnemy(arg_enemy:Piece_enemy){
        
        this.pieces.set(arg_enemy.Name,arg_enemy);
    }
    RemoveEnemy(arg_enemy:Piece_enemy){
        this.pieces.delete(arg_enemy.Name);
    }
    AddEnemyTurnEndCount(){
        this.endObjectsCount++;
        if(this.endObjectsCount>=this.pieces.size){
            ButiLib.EventManager.ExecuteExEvent("EnemyTurnEnd");
        }
    }
    OnSet(){

    }
    OnUnSet(){
        
        var pieceArray=Array.from(this.pieces,x=>x[1]);
        pieceArray.forEach(x=>x.OnUnSet())

        ButiLib.EventManager.UnRegistExEvent("PlayerTurnEnd","EnemyPieceCalc");
        ButiLib.EventManager.UnRegistExEvent("EnemyMoveEnd","EnemyManager");
        
        this.gridManager=null;
    }
}

const playerOffsetTable =[new ButiLib.Int2(-1,-1),new ButiLib.Int2(0,-1),new ButiLib.Int2(+1,-1),new ButiLib.Int2(-1,0),new ButiLib.Int2(+1,0),new ButiLib.Int2(-1,+1),new ButiLib.Int2(0,+1),new ButiLib.Int2(+1,+1)]
export class Piece_Player extends Piece{
    cameraControler:CameraLib.GamePlayCamera;
    mousePos=new THREE.Vector2();
    constructor(arg_index:number, arg_scene:ButiGameLib.GameScene,arg_gridManager:Grid.GridManager,arg_horizontalIndex:number,arg_verticalIndex:number,arg_cameraControler:CameraLib.GamePlayCamera){
        super("koma_ohsho", arg_index,arg_scene,arg_gridManager,arg_horizontalIndex,arg_verticalIndex,new THREE.Vector3());
        this.tag="Player";
        this.cameraControler=arg_cameraControler;
        this.selectableGridsIndex=playerOffsetTable;
        this.Move(this.horizontalIndex,this.verticalIndex);
    }
    OnUpdate():void{
        
        if(!this.currentGrid){
            return;
        }
        this.animationProgress+=pieceMoveSpeed;
        this.currentPosition=this.initPosition.clone().add(this.translateVelocity.clone().multiplyScalar(Easing.EaseInQuart( this.animationProgress)));
        this.currentPosition.setY(this.initPosition.y+ Easing.Parabola(this.animationProgress)*pieceLiftHeight);
        this.model.threeObj.position.set(this.currentPosition.x,this.currentPosition.y,this.currentPosition.z);
        if(this.animationProgress>1.0){
            this.animationProgress=0.0;
            this.currentPosition=this.targetPosition;
            this.initPosition=this.targetPosition;
            this.targetPosition=null;
            ButiLib.EventManager.UnRegistExEvent("GameUpdate","Piece_ohsho");

            ButiLib.EventManager.ExecuteExEvent("KomaSoundPlay");
            Score.Score.AddScore(1);
            if(this.destroyEnemy){
                this.destroyEnemy.OnDeadByEnemy();
                this.destroyEnemy=null;
            }
            if(this.currentGrid.IsBurning){
                this.OnDeadByFire();
            }
            ButiLib.EventManager.ExecuteExEvent("PlayerTurnEnd");
            return;
        }
    }
    Move(arg_horizontalIndex:number,arg_verticalIndex:number):void{
        super.Move(arg_horizontalIndex,arg_verticalIndex);
        this.gridManager.SetPiece(this,this.horizontalIndex,this.verticalIndex);
        this.selectableGrids.forEach(grid=>{grid.ColorAnim.Release();})
        this.selectableGrids.length=0;
        
        this.selectableGridsIndex.forEach(x=>{this.selectableGrids.push(this.gridManager.GetGrid(this.horizontalIndex+x.x,this.verticalIndex+x.y))})
        
        this.selectableGrids.forEach(grid=>{grid.ColorAnimStart (new THREE.Vector4(1,1,1,1),new THREE.Vector4(0.5,0.5,1,1),0.02,true);})
    }
    OnDeadByFire():void{
        ButiLib.EventManager.ExecuteExEvent("PlayerDeadByFire");
    }
    OnDeadByEnemy(){
        ButiLib.EventManager.ExecuteExEvent("PlayerDeadByEnemy");
    }
    ClickEventFunc(event:MouseEvent){
        
            if(this.targetPosition){
                return;
            }
              const element = event.currentTarget as HTMLCanvasElement;
            // canvas要素上のXY座標
            const x = event.offsetX, y = event.offsetY, w = element.offsetWidth, h = element.offsetHeight;
          
            // -1〜+1の範囲で現在のマウス座標を登録する
            this.mousePos.x = (x/w -0.5)*2;
            this.mousePos.y =- (y/h -0.5)*2;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(this.mousePos, this.scene.camera.Camera);

            
            for(var i=0;i<this.selectableGrids.length;i++){
                const intersects = raycaster.intersectObject(this.selectableGrids[i].model.threeObj);
                if(intersects.length > 0){

                    if(i==6){
                        
            const currentGridIntersects = raycaster.intersectObject(this.currentGrid.model.threeObj);
            if(currentGridIntersects.length>0){
                return;
            }
                    }

                    this.horizontalIndex+=this.selectableGridsIndex[i].x;
                    if(this.horizontalIndex<this.gridManager.HorizontalStartIndex){
                        this.horizontalIndex=this.gridManager.HorizontalStartIndex;
                    }         
                    this.verticalIndex+=this.selectableGridsIndex[i].y;
                    if(this.verticalIndex<this.gridManager.VerticalStartIndex){
                        this.verticalIndex=this.gridManager.VerticalStartIndex;
                    }    
                    this.OnClick();
                    break;
                }
            }
            

    }
    OnSet():void{
        ButiLib.EventManager.RegistClickEvent( {handleEvent:(event:MouseEvent)=>this.ClickEventFunc(event)},"Piece_ohshoControl",document.getElementById('myCanvas'));
        ButiLib.EventManager.RegistExEvent({handleEvent:()=>{ButiLib.EventManager.RegistClickEvent( {handleEvent:(event:MouseEvent)=>{
            this.ClickEventFunc(event);}},"Piece_ohshoControl",document.getElementById('myCanvas')); }},"EnemySpawnTurnEnd","PlayerClickEventRegist");
    }
    OnUnSet():void{
        super.OnUnSet();
        ButiLib.EventManager.UnRegistExEvent("GameUpdate","Piece_ohsho");
        ButiLib.EventManager.UnRegistExEvent("EnemySpawnTurnEnd","PlayerClickEventRegist");
        ButiLib.EventManager.UnRegistClickEvent("Piece_ohshoControl",document.getElementById('myCanvas'));
    }
    OnClick(){
        const nextPos=this.gridManager.GetGridPosition(this.horizontalIndex,this.verticalIndex);
        this.targetPosition=new THREE.Vector3 (nextPos.x,1.25,nextPos.z);
        this.translateVelocity=this.targetPosition.clone().sub(this.initPosition);
        this.Move(this.horizontalIndex,this.verticalIndex);
        this.cameraControler.TargetPosition.set(this.targetPosition.x,20,this.targetPosition.z+20);
        ButiLib.EventManager.RegistExEvent({handleEvent :()=> {this.OnUpdate(); }},"GameUpdate","Piece_ohsho");
        ButiLib.EventManager.UnRegistClickEvent("Piece_ohshoControl",document.getElementById('myCanvas'));
    }
}