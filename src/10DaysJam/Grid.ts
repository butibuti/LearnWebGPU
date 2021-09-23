import ButiLib=require("../ButiLib")
import ButiGameLib=require("../ButiGameLib")
import Peice=require("./Piece")
import Effect=require("./Effect")
import THREE = require("three")

const FireSpreadTable=[new ButiLib.Int2(0,1),new ButiLib.Int2(0,-1),new ButiLib.Int2(-1,0),new ButiLib.Int2(1,0),
        new ButiLib.Int2(1,1),new ButiLib.Int2(-1,1),new ButiLib.Int2(1,-1),new ButiLib.Int2(-1,-1),new ButiLib.Int2(1,0),new ButiLib.Int2(0,1)]

export class Grid extends ButiGameLib.GameObject{
    model:ButiLib.ModelWrapper;
    material=new ButiLib.StandardMaterialWrapper();
    edgeModel=new  ButiLib.ModelWrapper();
    effect:Effect.Fire=null;
    modelKey=new ButiLib.StringRef();
    horizontalIndex:number;
    verticlaIndex:number;
    colorAnimProgress:number=0;
    manager:GridManager;
    private isBurning:boolean;
    private peice:Peice.Piece=null;
    private colorAnim:ButiLib.ColorAnim;
    constructor(arg_index:number,arg_horIndex:number,arg_vertIndex:number, arg_scene:ButiGameLib.GameScene,arg_position:THREE.Vector3,arg_manager:GridManager){
        super(arg_scene,"Glid_"+arg_index);
        this.verticlaIndex=arg_vertIndex;
        this.horizontalIndex=arg_horIndex;
        this.manager=arg_manager;
        this.model=ButiLib.CreateTextureCube("../../img/10daysJam/board.png",2,this.material);
        this.model.threeObj.position.set(arg_position.x,arg_position.y,arg_position.z);
        this.scene.drawScene.AddDrawObject(this.model.threeObj,"BoardModel:"+this.horizontalIndex+","+this.verticlaIndex);
        ButiGameLib. ModelLoad('../../model/10daysJam/board_edge.gltf',this.edgeModel,this.scene.drawScene,this.modelKey,arg_position);
    }
    ColorAnimation():void{
        if(this.colorAnim.Update()){
            ButiLib.EventManager.UnRegistExEvent("GameUpdate","GridColorAnim:"+this.horizontalIndex+","+this.verticlaIndex);
        }
        this.material.material.color=this.colorAnim.GetColor();
        
    }
    get ColorAnim():ButiLib.ColorAnim{
        return this.colorAnim;
    }
    set ColorAnim(other:ButiLib.ColorAnim){
        this.colorAnim=other;
    }
    ColorAnimStart(arg_initColor:THREE.Vector4,arg_targetColor:THREE.Vector4, arg_speed:number,arg_isLoop:boolean){
        if(!this.colorAnim){
            this.colorAnim=new ButiLib.ColorAnim(arg_initColor,arg_targetColor,arg_speed,arg_isLoop);
        }else{
            this.colorAnim.InitColor=arg_initColor;
            this.colorAnim.TargetColor=arg_targetColor;
            this.colorAnim.speed=arg_speed;
            this.colorAnim.IsLoop=arg_isLoop;
        }this.colorAnim.AddRef();
        ButiLib.EventManager.RegistExEvent({handleEvent:()=>this.ColorAnimation()}, "GameUpdate","GridColorAnim:"+this.horizontalIndex+","+this.verticlaIndex);
    }
    OnSet():void{
    }
    OnUnSet():void{
        if(this.Piece){
            this.Piece.OnDeadByVoid();
        }
        this.Piece=null;
        this.scene.drawScene.RemoveDrawObject(this.modelKey.value);
        this.scene.drawScene.RemoveDrawObject("BoardModel:"+this.horizontalIndex+","+this.verticlaIndex);
        ButiLib.EventManager.UnRegistExEvent("EnemyTurnEnd","GridFireSpread"+this.horizontalIndex+":"+this.verticlaIndex);
        if(this.effect){
            
            this.effect.DrawUnRegist();
        }
        ButiLib.EventManager.UnRegistExEvent( "GameUpdate","GridColorAnim:"+this.horizontalIndex+","+this.verticlaIndex);
    }
    SpreadFire():void{
        if(ButiLib.GetRandomArbitrary(0,1)>0.9){
            const dir=FireSpreadTable[ButiLib.GetRandomInt(0,10)];
            this.manager.GetGrid(this.horizontalIndex+dir.x,this.verticlaIndex+dir.y).IsBurning=true;
        }
        ButiLib.EventManager.ExecuteExEvent("FireTurnEnd");
    }
    get IsBurning():boolean{
        return this.isBurning;
    }
    set IsBurning(other:boolean){
        if(!this.isBurning&&other){
            this.effect=new Effect.Fire(this.scene,"GridFire"+this.horizontalIndex+":"+this.verticlaIndex);
            this.effect.DrawRegist();
            this.effect.Position =new THREE.Vector3(this.model.threeObj.position.x,this.model.threeObj.position.y+2,this.model.threeObj.position.z);
            ButiLib.EventManager.RegistExEvent({handleEvent :()=>{this.SpreadFire(); }},"EnemyTurnEnd","GridFireSpread"+this.horizontalIndex+":"+this.verticlaIndex);
            if(this.Piece){
                this.Piece.OnDeadByFire();
            }
        }
        this.isBurning=other;
    }
    get Piece():Peice.Piece   {return this.peice; }
    set Piece(arg_piece:Peice.Piece){this.peice=arg_piece;}

}
const buffer=5;
const size=15;
export class GridManager extends ButiGameLib.GameObject{
    private horizontalStartIndex:number=0;
    private horizontalEndIndex:number =size ;
    private verticalStartIndex:number=0;
    private verticalEndIndex:number =size;
    private gridCount:number=0;
    private grids=new Map<number,Map<number,Grid>>();
    private pieceManager:Peice.PieceManager;

    set PieceManager(other:Peice.PieceManager){
        this.pieceManager=other;
    }

    get HorizontalStartIndex():number{
        return this.horizontalStartIndex;
    }
    get HorizontalEndIndex():number{
        return this.horizontalEndIndex;
    }
    get VerticalStartIndex():number{
        return this.verticalStartIndex;
    }
    get VerticalEndIndex():number{
        return this.verticalEndIndex;
    }

    constructor( arg_scene:ButiGameLib.GameScene){
        super(arg_scene,"GlidManager");
    }
    
    OnSet():void{
    }
    OnUnSet():void{
        this.grids.forEach(map=>{map.forEach(grid=>{grid.OnUnSet();})});
        ButiLib.EventManager.UnRegistExEvent("FireTurnEnd","SpawnCheckOnVerticalExtend");
        ButiLib.EventManager.UnRegistExEvent("FireTurnEnd","SpawnCheckOnHorizontalExtend");
    }
    Generate():void{
        for(var i:number=this.verticalStartIndex;i<=this.verticalEndIndex;i++){
            this.grids.set(i,new Map<number,Grid>());
            for(var j:number=this.horizontalStartIndex;j<=this.horizontalEndIndex;j++){

                this.grids.get(i).set(j,new Grid(this.gridCount,j,i,this.scene,new THREE.Vector3(-j*2,0.0,-i*2),this))
                this.gridCount++;
            }
        }
        
        this.BurnBottomEdge();
        this.BurnRightEdge();
    }
    GetGridPosition(arg_horizontalIndex:number,arg_verticalIndex:number):THREE.Vector3{
        return new THREE.Vector3(-2*arg_horizontalIndex,0,-2*arg_verticalIndex);
    }

    GetGrid(arg_horizontalIndex:number,arg_verticalIndex:number):Grid{
        arg_horizontalIndex=ButiLib.Clamp(this.horizontalStartIndex,this.horizontalEndIndex,arg_horizontalIndex);
        arg_verticalIndex=ButiLib.Clamp(this.verticalStartIndex,this.verticalEndIndex,arg_verticalIndex);
        return this.grids.get(arg_verticalIndex).get(arg_horizontalIndex);
    }
    SetPiece(arg_piece:Peice.Piece,arg_horizontalIndex:number,arg_verticalIndex:number):Grid{
        
        arg_horizontalIndex=ButiLib.Clamp(this.horizontalStartIndex,this.horizontalEndIndex,arg_horizontalIndex);
        arg_verticalIndex=ButiLib.Clamp(this.verticalStartIndex,this.verticalEndIndex,arg_verticalIndex);
        this.grids.get(arg_verticalIndex).get(arg_horizontalIndex).Piece=arg_piece;


        var isSpawnCall=false;

        if(this.verticalEndIndex-  arg_verticalIndex<buffer){

            ButiLib.EventManager.RegistExEvent({handleEvent:()=>{
                this.pieceManager .SpawnCheckOnVerticalExtend();
                ButiLib.EventManager.UnRegistExEvent("FireTurnEnd","SpawnCheckOnVerticalExtend");
            }},"FireTurnEnd","SpawnCheckOnVerticalExtend");
            this.grids.get(this.verticalStartIndex).forEach(grid=>{grid.OnUnSet()});
            this.grids.get(this.verticalStartIndex).clear();
            this.grids.delete(this.verticalStartIndex);

            this.verticalEndIndex=arg_verticalIndex+buffer;
            this.grids.set(this.verticalEndIndex, new Map<number,Grid>());
            

            this.verticalStartIndex=this.verticalEndIndex-size;
            for(var i=this.horizontalStartIndex;i<=this.horizontalEndIndex;i++){
                this.grids.get(this.verticalEndIndex).set(i,new Grid(this.gridCount,i,this.verticalEndIndex,this.scene,new THREE.Vector3(-i*2,0.0,-this.verticalEndIndex*2),this))
                this.gridCount++;
            }
            this.BurnRightEdge();
            this.BurnBottomEdge();
            isSpawnCall=true;
        }
        if(this.horizontalEndIndex-  arg_horizontalIndex<buffer){

            ButiLib.EventManager.RegistExEvent({handleEvent:()=>{
                this.pieceManager.SpawnCheckOnHorizontalExtend();
                ButiLib.EventManager.UnRegistExEvent("FireTurnEnd","SpawnCheckOnHorizontalExtend");
            }},"FireTurnEnd","SpawnCheckOnHorizontalExtend");
            this.grids.forEach(map=>{map.get(
                this.horizontalStartIndex).OnUnSet();
                map.delete(this.horizontalStartIndex);});

            this.horizontalEndIndex=arg_horizontalIndex+buffer;
            this.horizontalStartIndex=this.horizontalEndIndex-size;
            for(var i=this.verticalStartIndex;i<=this.VerticalEndIndex;i++){
                this.grids.get(i).set(this.horizontalEndIndex,new Grid(this.gridCount,this.horizontalEndIndex,i,this.scene,new THREE.Vector3(-this.horizontalEndIndex*2,0.0,-i*2),this))
                this.gridCount++;
            }

            this.BurnRightEdge();
            this.BurnBottomEdge();
            isSpawnCall=true;
        }
        if(isSpawnCall=true){
            ButiLib.EventManager.RegistExEvent({handleEvent:()=>{
                this.pieceManager.NoSpawn();
                ButiLib.EventManager.UnRegistExEvent("FireTurnEnd","NoSpawn");
            }},"FireTurnEnd","NoSpawn");
        }

        return this.grids.get(arg_verticalIndex).get(arg_horizontalIndex);
    }
    GetPiece(arg_horizontalIndex:number,arg_verticalIndex:number):Peice.Piece{
        
        arg_horizontalIndex=ButiLib.Clamp(this.horizontalStartIndex,this.horizontalEndIndex,arg_horizontalIndex);
        arg_verticalIndex=ButiLib.Clamp(this.verticalStartIndex,this.verticalEndIndex,arg_verticalIndex);
        return this.grids.get(arg_verticalIndex).get(arg_horizontalIndex).Piece;
    }

    BurnRightEdge():void{
        
        this.grids.forEach(map=>{map.get(
            this.horizontalStartIndex).IsBurning=true;});
    }
    BurnBottomEdge():void{
        
        this.grids.get(this.verticalStartIndex).forEach(grid=>{grid.IsBurning=true;});
    }
}