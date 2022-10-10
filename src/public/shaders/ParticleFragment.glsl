varying float v_Blend;

void main()
{
    gl_FragColor = vec4(1.0f, 0.0f, 0.0f, v_Blend);
}

/*
#version 330 core

layout (location = 0) out vec4 o_FragColor;

in vec2 fs_TexCoords;
in float fs_Blend;
in int fs_TotalRows;

uniform sampler2D u_Texture;
uniform int u_TotalRows;
uniform int u_Index1;
uniform int u_Index2;
uniform float u_BlendAtlas;

void main() {

	vec2 offset1;
	offset1.x = float(u_Index1 % u_TotalRows) / u_TotalRows;
	offset1.y = floor(float(u_Index1) / u_TotalRows) / u_TotalRows;
	
	vec2 offset2;
	offset2.x = float(u_Index2 % u_TotalRows) / u_TotalRows;
	offset2.y = floor(float(u_Index2) / u_TotalRows) / u_TotalRows;
	
	vec2 tileTexCoords1 = fs_TexCoords / u_TotalRows + offset1;
	vec2 tileTexCoords2 = fs_TexCoords / u_TotalRows + offset2;
	
	vec4 texture1 = texture(u_Texture, tileTexCoords1);
	vec4 texture2 = texture(u_Texture, tileTexCoords2);

	vec4 textureFinal = mix(texture1, texture2, u_BlendAtlas);

	o_FragColor = textureFinal;

}
*/