/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { LAppDelegate } from './lappdelegate';
import{ LAppLive2DManager} from "./lapplive2dmanager"
import * as LAppDefine from './lappdefine';
import {ExUniforms,ExShaderInfo,ExShaderLoadInfo, ShaderType} from "./Framework/src/model/ExShader"

/**
 * ブラウザロード後の処理
 */
window.onload = (): void => {

  LAppDelegate.CreateInstance();

  var load=new ExShaderLoadInfo((document.getElementById("fs_block") as HTMLScriptElement).text);
  var load2=new ExShaderLoadInfo((document.getElementById("fs_rainbow") as HTMLScriptElement).text);

  if (LAppDelegate.getInstance().initialize([load,load2]) == false) {
    return;
  }

  var modelName=(document.getElementById("modelName") as HTMLScriptElement).text;
  
  var exInfo=new ExShaderInfo("ArtMesh80",0);
  var exInfo2=new ExShaderInfo("ArtMesh81",0);
  var aurora=new ExShaderInfo("ArtMesh79",1);
  var aurora2=new ExShaderInfo("ArtMesh85",1);
  //exInfo.exUniform.time=0;
  exInfo.exUniform.resolution_x=1024;exInfo2.exUniform.resolution_x=1024;
  exInfo.exUniform.resolution_y=1024;exInfo2.exUniform.resolution_y=1024;
  aurora.exUniform.resolution_y=1024;aurora.exUniform.resolution_y=1024;
  aurora2.exUniform.resolution_y=1024;aurora2.exUniform.resolution_y=1024;
  
  LAppDelegate.getInstance().LoadModel([modelName],[exInfo,exInfo2]);

  function Render(){
    exInfo.exUniform.time+=0.001;
    exInfo2.exUniform.time+=0.001;
    aurora.exUniform.time+=0.1;
    aurora2.exUniform.time+=0.1;
    LAppDelegate.getInstance().run();
    requestAnimationFrame(Render);
  }
Render();
};

/**
 * 終了時の処理
 */
window.onbeforeunload = (): void => LAppDelegate.releaseInstance();

/**
 * Process when changing screen size.
 */
window.onresize = () => {
  if (LAppDefine.CanvasSize === 'auto') {
    LAppDelegate.getInstance().onResize();
  }
};
