attribute float a_Blend;

varying float v_Blend;

void main() {
	mat4 modelViewTran = modelViewMatrix;
	modelViewTran[0][0] = 1.0f;
	modelViewTran[0][1] = 0.0f;
	modelViewTran[0][2] = 0.0f;
	modelViewTran[1][0] = 0.0f;
	modelViewTran[1][1] = 1.0f;
	modelViewTran[1][2] = 0.0f;
	modelViewTran[2][0] = 0.0f;
	modelViewTran[2][1] = 0.0f;
	modelViewTran[2][2] = 1.0f;

	gl_Position = projectionMatrix * modelViewTran * vec4(position, 1.0f);
	v_Blend = a_Blend;
}