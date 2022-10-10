#define PI 3.1415926

const float waveLength = 4.0;
const float waveAmplitude = 0.2;

float generateOffset(float x, float z)
{
    float radX = (x / waveLength) * 2.0f * PI;
    float radZ = (z / waveLength) * 2.0f * PI;
    return waveAmplitude * 0.5f * (sin(radZ) * cos(radX));
}

vec3 applyDistortion(vec3 vector)
{
    vec3 distortion;
    distortion.x = generateOffset(vector.x, vector.z);
    distortion.y = generateOffset(vector.x, vector.z);
    distortion.z = generateOffset(vector.x, vector.z);
    return vector + distortion;
}

void main()
{
    vec3 currentVertex = vec3(position.x, 0.0, position.z);
    //currentVertex = applyDistortion(currentVertex);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(currentVertex, 1.0f);
}