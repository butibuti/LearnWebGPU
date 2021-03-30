
export class ExShaderInfo{

    constructor(arg_artMeshID:string,arg_exShaderIndex:number){
        this.artMeshID=arg_artMeshID;
        this.exShaderIndex=arg_exShaderIndex;
        this.exUniform=new ExUniforms();
    }

    /*
    *追加シェーダーの番号
    */
    exShaderIndex: number;
    /*
    *アートメッシュのID
    */
    artMeshID:string;
/*
    *追加シェーダーのUniform
    */
    exUniform:ExUniforms;
}

export enum ShaderType{
  // SetupMask
    ShaderType_SetupMask,

  // Normal
    ShaderType_NormalPremultipliedAlpha,
    ShaderType_NormalMaskedPremultipliedAlpha,
    ShaderType_NomralMaskedInvertedPremultipliedAlpha,

  // Add
    ShaderType_AddPremultipliedAlpha,
    ShaderType_AddMaskedPremultipliedAlpha,
    ShaderType_AddMaskedPremultipliedAlphaInverted,

  // Mult
    ShaderType_MultPremultipliedAlpha,
    ShaderType_MultMaskedPremultipliedAlpha,
    ShaderType_MultMaskedPremultipliedAlphaInverted
}

export class ExShaderLoadInfo{

    constructor(arg_exShaderSrc: string ,arg_shaderType?:ShaderType){
        this.exShaderSrc=arg_exShaderSrc;
        if(arg_shaderType){
            this.shaderType=arg_shaderType;
        }else{
            this.shaderType=ShaderType.ShaderType_NormalPremultipliedAlpha;
        }
    }

    /*
    *追加シェーダーのソース
    */
    exShaderSrc: string;
    /*
    *適用するタイプ
    */
    shaderType:ShaderType;
}

export class ExUniforms{

    constructor(){
        this.time=0;
        this.resolution_x=0;
        this.resolution_y=0;
        this.mousePos_x=0;
        this.mousePos_y=0;
    }

    resolution_x:number;
    resolution_y:number;
    time:number;
    mousePos_x:number;
    mousePos_y:number;
}

export class ExShaderParam{
    exShaderIndicies:Array<number>;
    exuniforms:Map<number, ExUniforms>;
}