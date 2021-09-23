/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CSM_ASSERT } from '../utils/cubismdebug';
import { CubismModel } from './cubismmodel';
import {ExShaderInfo ,ExShaderParam, ExUniforms} from "./ExShader"


/**
 * Mocデータの管理
 *
 * Mocデータの管理を行うクラス。
 */
export class CubismMoc {
  /**
   * Mocデータの作成
   */
  public static create(mocBytes: ArrayBuffer): CubismMoc {
    let cubismMoc: CubismMoc = null;
    const moc: Live2DCubismCore.Moc = Live2DCubismCore.Moc.fromArrayBuffer(
      mocBytes
    );

    if (moc) {
      cubismMoc = new CubismMoc(moc);
    }

    return cubismMoc;
  }

  /**
   * Mocデータを削除
   *
   * Mocデータを削除する
   */
  public static delete(moc: CubismMoc): void {
    moc._moc._release();
    moc._moc = null;
    moc = null;
  }

  /**
   * モデルを作成する
   *
   * @return Mocデータから作成されたモデル
   */
  createModel(arg_exShaderInfo: Array<ExShaderInfo> ): CubismModel {
    let cubismModel: CubismModel = null;

    const model: Live2DCubismCore.Model = Live2DCubismCore.Model.fromMoc(
      this._moc
    );
    var shaderParam=new ExShaderParam();
    const drawableCount=model.drawables.count;
    shaderParam.exShaderIndicies=new Array(drawableCount);
    shaderParam.exuniforms=new Map<number,ExUniforms>();
    for( var i=0;i<drawableCount;i++){
      shaderParam.exShaderIndicies[i]=-1;
    }
    var shaderInfoSize=arg_exShaderInfo.length;
    for(var i=0;i< model.drawables.ids.length;i++){

      for(var j=0;j<shaderInfoSize;j++){
        if(arg_exShaderInfo[j].artMeshID==model.drawables.ids[i]){
          shaderParam.exShaderIndicies[i]=arg_exShaderInfo[j].exShaderIndex;
          shaderParam.exuniforms.set(i,arg_exShaderInfo[j].exUniform);
        }
      }
    }

    if (model) {
      cubismModel = new CubismModel(model,shaderParam);
      cubismModel.initialize();

      ++this._modelCount;
    }

    return cubismModel;
  }

  /**
   * モデルを削除する
   */
  deleteModel(model: CubismModel): void {
    if (model != null) {
      model.release();
      model = null;
      --this._modelCount;
    }
  }

  /**
   * コンストラクタ
   */
  private constructor(moc: Live2DCubismCore.Moc) {
    this._moc = moc;
    this._modelCount = 0;
  }

  /**
   * デストラクタ相当の処理
   */
  public release(): void {
    CSM_ASSERT(this._modelCount == 0);

    this._moc._release();
    this._moc = null;
  }

  _moc: Live2DCubismCore.Moc; // Mocデータ
  _modelCount: number; // Mocデータから作られたモデルの個数
}

// Namespace definition for compatibility.
import * as $ from './cubismmoc';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismMoc = $.CubismMoc;
  export type CubismMoc = $.CubismMoc;
}