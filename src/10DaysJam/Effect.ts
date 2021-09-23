import ButiGameLib=require("../ButiGameLib")
import ButiLib=require("../ButiLib")
import THREE = require("three");


class FireUniform extends ButiLib.IObject{

  value: {
    uColor: {
        value: THREE.Color;
    };
    time: {
        value: number;
    };
    uTex:{
      value:THREE.Texture
    }
}

  constructor(){
    super();
    this.value= {
      uColor: {
        value: new THREE.Color(0xffffff),
      },
      time:{
        value:Math.random()
      },
      uTex:{
        value:ButiLib.TextureLoad("../../model/10daysJam/texture/fire.png")
      }
      
    }
    
  }
}
const fireVertexShader =  [
  "varying vec2 vUv;",
  "uniform float time;",
  THREE.ShaderChunk["common"],
  "void main() {",
      "float xswing = 0.5*(sin((position.y+time)*3.0));",
      "float yswing = 0.01*(cos((position.y+time)*4.0));",
      "float zswing = 0.25*(cos((position.y+time)*3.0));",
      "vUv = uv;",
      "vec3 transformed = vec3(position);",
      "transformed.x+=xswing;",
      "transformed.y+=yswing;",
      "transformed.z+=zswing;",
      THREE.ShaderChunk["project_vertex"],
  "}"
].join( "\n" )

const fragOut = `
varying vec2 vUv;
uniform vec3 uColor;
uniform sampler2D uTex;
void main( void ) {
  vec4 texColor= texture2D(uTex, vUv);
  gl_FragColor =texColor* vec4(uColor,1.0 );
}
`
export class Fire extends ButiGameLib.GameObject{
  private model=new ButiLib.ModelWrapper();
  private model2=new ButiLib.ModelWrapper();
  modelKey=new ButiLib.StringRef();
  modelKey2=new ButiLib.StringRef();
  fireUniform:FireUniform;
  fireUniform2:FireUniform;
    constructor(arg_scene:ButiGameLib.GameScene,arg_name:string){
        super(arg_scene,arg_name);
        
    }
    set Position(other:THREE.Vector3){
      this.model.threeObj.position.set(other.x,other.y,other.z);
    }
    DrawRegist(){
      this.modelKey.value=this.name;
      this.modelKey2.value=this.name;
      this.fireUniform  =new FireUniform();
      this.fireUniform2  =new FireUniform();
      
      const fireMaterial = new THREE.ShaderMaterial({
        vertexShader: fireVertexShader, // 頂点シェーダ
        fragmentShader: fragOut, // フラグメントシェーダ,
        side: THREE.BackSide,
        transparent: true,
        uniforms: this.fireUniform.value,
      })
      const innerFire= new THREE.ShaderMaterial({
        vertexShader: fireVertexShader, // 頂点シェーダ
        fragmentShader: fragOut, // フラグメントシェーダ,
        side: THREE.BackSide,
        transparent: true,
        uniforms: this.fireUniform2.value,
        blending:THREE.AdditiveBlending
        
      })
      innerFire.depthTest=false;
      ButiGameLib. ModelLoad('../../model/10daysJam/fire.gltf',this.model,this.scene.drawScene,this.modelKey,null,null,fireMaterial);
      ButiGameLib. ModelLoad('../../model/10daysJam/fire.gltf',this.model2,this.scene.drawScene,this.modelKey2,null,null,innerFire);

      this.model2.threeObj.scale.multiplyScalar(0.55);
      this.model.threeObj.add(this.model2.threeObj);
      this.model.threeObj.scale.set(0,0,0);
      ButiLib.EventManager.RegistExEvent({handleEvent:()=>{
        this.fireUniform.value.time.value+=0.02;
        this.fireUniform2.value.time.value+=0.02;
      }},"GameUpdate",this.name+ "AnimationUpdate");
      ButiLib.EventManager.RegistExEvent({handleEvent:()=>{
        this.model.threeObj.scale.addScalar(0.02);
        if(this.model.threeObj.scale.x>=1.0){
          ButiLib.EventManager.UnRegistExEvent("GameUpdate",this.name+ "ScaleUpdate");
        }
      }},"GameUpdate",this.name+ "ScaleUpdate");
    }
    DrawUnRegist(){
      ButiLib.EventManager.UnRegistExEvent("GameUpdate",this.name+ "AnimationUpdate");
      ButiLib.EventManager.UnRegistExEvent("GameUpdate",this.name+ "ScaleUpdate");
      this.scene.drawScene.RemoveDrawObject(this.modelKey.value);
      this.scene.drawScene.RemoveDrawObject(this.modelKey2.value);
    }
}
