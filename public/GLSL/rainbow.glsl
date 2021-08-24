<script id="fs_rainbow" type="x-shader/x-fragment">
  precision mediump float; 
  varying vec2       v_texCoord;  //v2f.texcoord
  uniform vec4       u_baseColor; 
  uniform vec2       u_mousePos; 
  uniform vec2       u_resolution; 
  uniform float      u_time; 
  uniform sampler2D  s_texture0;  //_MainTex


  const float Pi = 3.14159;
  
  const int   complexity      = 47;    // More points of color.
  const float fluid_speed     = 200.0;  // Drives speed, higher number will make it slower.
  const float color_intensity = 0.8;
    
  
  void main()
  {
    vec2 p=(2.0*gl_FragCoord.xy-u_resolution)/max(u_resolution.x,u_resolution.y);
    for(int i=1;i<complexity;i++)
    {
      vec2 newp=p + u_time*0.001;
      newp.x+=0.6/float(i)*sin(float(i)*p.y+u_time/fluid_speed+0.3*float(i)) + 0.5; 
      newp.y+=0.6/float(i)*sin(float(i)*p.x+u_time/fluid_speed+0.3*float(i+10)) - 0.5; 
      p=newp;
    }
    vec3 col=vec3(color_intensity*sin(3.0*p.x)+color_intensity,color_intensity*sin(3.0*p.y)+color_intensity,color_intensity*sin(p.x+p.y)+color_intensity);
    
    vec4 tex=texture2D(s_texture0 , v_texCoord);
    tex.rgb*=col;
    gl_FragColor =tex; 
  }
</script>