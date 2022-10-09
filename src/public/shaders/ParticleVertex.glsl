#version 330 core

layout (location = 0) in vec3 a_Pos;
layout (location = 1) in vec2 a_TexCoords;

out vec2 fs_TexCoords;
out vec4 fs_ClipSpace;
out float fs_Blend;
out float fs_BlendAtlas;

uniform vec3 u_Scale;
uniform mat4 u_Model;
uniform mat4 u_View;
uniform mat4 u_Projection;
uniform float u_Blend;

void main() {

	mat4 modelView = u_View * u_Model;
	modelView[0][0] = u_Scale.x;
	modelView[0][1] = 0.0f;
	modelView[0][2] = 0.0f;
	modelView[1][0] = 0.0f;
	modelView[1][1] = u_Scale.y;
	modelView[1][2] = 0.0f;
	modelView[2][0] = 0.0f;
	modelView[2][1] = 0.0f;
	modelView[2][2] = u_Scale.z;

	gl_Position = u_Projection * modelView * vec4(a_Pos, 1.0f);
	fs_TexCoords = a_TexCoords;
	fs_Blend = u_Blend;

}