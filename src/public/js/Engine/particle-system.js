import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

export class ParticleSystem
{
    constructor(scene, attributeParticle, count)
    {
        this.attributeParticle = attributeParticle;
        // The count of particles
        this.particles = [...Array(count)].map(() => {
            return {
                position: new THREE.Vector3(0.0, 0.0, 0.0),
                rotationBegin: 0.0,
                rotationEnd: 0.0,
                scaleBegin: new THREE.Vector3(1.0, 1.0, 1.0),
                scaleEnd: new THREE.Vector3(1.0, 1.0, 1.0),
                speed: new THREE.Vector3(1.0, 1.0, 1.0),
                lifetime: 1.0,
                lifeRemaining: 0.0,
                active: false
            };
        })
        this.particleIndex = this.particles.length - 1;


        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
        this.geometry.setAttribute('a_Blend', new THREE.Float32BufferAttribute([], 1));
        this.geometry.setIndex([])

        const vertex = `
            attribute float a_Blend;

            varying float v_Blend;
            
            void main()
            {
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
        `;

        const fragment = `
            varying float v_Blend;

            void main()
            {
                gl_FragColor = vec4(1.0f, 0.0f, 0.0f, v_Blend);
            }
        `;

        this.uniforms = {
            a_Blend: 1.0
        };

        this.mesh = new THREE.Mesh(
            this.geometry,
            new THREE.ShaderMaterial({
                uniforms: {},
                vertexShader: vertex,
                fragmentShader: fragment,
                side: THREE.DoubleSide,
                transparent: true
            }
        ));
        this.mesh.position.y = 2;
        scene.add(this.mesh);

    }

    emitParticles()
    {
        let particle = this.particles[this.particleIndex];

        particle.position =         new THREE.Vector3(this.attributeParticle.position.x, this.attributeParticle.position.y, this.attributeParticle.position.z);
        particle.rotationBegin =    this.attributeParticle.rotationBegin;
        particle.rotationBegin +=   this.attributeParticle.rotationVariation * Math.random();
        particle.rotationEnd =      this.attributeParticle.rotationEnd;
        particle.scaleBegin =       new THREE.Vector3(this.attributeParticle.scaleBegin.x, this.attributeParticle.scaleBegin.y, this.attributeParticle.scaleBegin.z);
        particle.scaleBegin.add(new THREE.Vector3(this.attributeParticle.scaleVariation.x, this.attributeParticle.scaleVariation.y, this.attributeParticle.scaleVariation.z).multiplyScalar(Math.random() - 0.5));
        particle.scaleEnd =         new THREE.Vector3(this.attributeParticle.scaleEnd.x, this.attributeParticle.scaleEnd.y, this.attributeParticle.scaleEnd.z);
        particle.speed =            new THREE.Vector3(this.attributeParticle.speed.x, this.attributeParticle.speed.y, this.attributeParticle.speed.z);
        particle.speed.x +=          this.attributeParticle.speedVariation.x * (Math.random() - 0.5);
        particle.speed.y +=          this.attributeParticle.speedVariation.y * (Math.random() - 0.5);
        particle.lifetime =         this.attributeParticle.lifetime;
        particle.lifeRemaining =    this.attributeParticle.lifetime;
        particle.active = true;
        
        --this.particleIndex;
        if (this.particleIndex < 0) this.particleIndex = this.particles.length - 1;

        console.log(particle.speed);
    }

    onUpdate(dt)
    {
        for (let particle of this.particles)
        { 
			if (!particle.active) {
				continue;
			}

			if (particle.lifeRemaining <= 0.0) {
                console.log('death');
				particle.active = false;
				continue;
			}

            particle.lifeRemaining -= dt;
            particle.position.x += particle.speed.x * dt;
            particle.position.y += particle.speed.y * dt;

        }
/*
        const vertices = new Float32Array([
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0,
             1.0,  1.0,  0.0,
            -1.0,  1.0,  0.0,

            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0
        ]);
        const indices = [ 0, 1, 2, 2, 3, 0, 4, 5, 6, 6, 7, 4 ];

        positions = [];
        positions.push(-1.0, -1.0, 0.0);
        positions.push( 1.0, -1.0, 0.0);
        positions.push( 1.0,  1.0, 0.0);
        positions.push(-1.0,  1.0, 0.0);
        positions.push(-1.0, -1.0, 1.0);
        positions.push( 1.0, -1.0, 1.0);
        positions.push( 1.0,  1.0, 1.0);
        positions.push(-1.0,  1.0, 1.0);
*/
    }

    onRender()
    {
        var positions = [];
        var indices = [];
        var blends = [];
        var i = 0;
        for (let particle of this.particles)
        {
            if (!particle.active) {
				continue;
			}

            positions.push(-0.1 + particle.position.x, -0.1 + particle.position.y, particle.position.z);
            positions.push( 0.1 + particle.position.x, -0.1 + particle.position.y, particle.position.z);
            positions.push( 0.1 + particle.position.x,  0.1 + particle.position.y, particle.position.z);
            positions.push(-0.1 + particle.position.x,  0.1 + particle.position.y, particle.position.z);

            indices.push(
                0 + i,
                1 + i,
                2 + i,
                2 + i,
                3 + i,
                0 + i
            );

            blends.push(particle.lifeRemaining / particle.lifetime);
            blends.push(particle.lifeRemaining / particle.lifetime);
            blends.push(particle.lifeRemaining / particle.lifetime);
            blends.push(particle.lifeRemaining / particle.lifetime);
            i += 4;
            /*
			glm::vec3 blendScale = glm::mix(particle.m_ScaleEnd, particle.m_ScaleBegin, blend);

			glm::mat4 transformation = transformationMatrix(particle.m_Position, blendScale);


			float index = (1 - blend) * m_TotalRows * m_TotalRows;

			int index1 = static_cast<int>(index);
			int index2 = static_cast<int>(index) + 1;

			float blendShader = index - static_cast<int>(index);

			shader->sendMat4("u_Model", transformation);
			shader->sendVec3("u_Scale", blendScale);
			shader->sendFloat("u_Blend", blend);
			shader->sendFloat("u_BlendAtlas", blendShader);
			shader->sendInt("u_TotalRows", m_TotalRows);
			shader->sendInt("u_Index1", index1);
			shader->sendInt("u_Index2", index2);

			Renderer::drawIndexed(m_Mesh);
            */
        }

        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        this.geometry.setAttribute('a_Blend', new THREE.Float32BufferAttribute(blends, 1));
        this.geometry.setIndex(indices);
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.a_Blend.needsUpdate = true;

    }
}