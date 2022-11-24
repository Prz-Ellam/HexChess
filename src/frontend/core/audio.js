import * as THREE from 'three';
import psychoticFlea from '@audios/Psychotic Flea/Psychotic_Flea.mp3';
import death from '@audios/death.mp3';
import powerup from '@audios/powerup.mp3';
import teleport from '@audios/teleport.mp3';
import wololo from '@audios/wololo.mp3';

export class AudioManager {

	constructor(camera) {
		const listener = new THREE.AudioListener();
		camera.add(listener);

		// Create a global audio source
		const sound = new THREE.Audio(listener);
		// THREE.PositionalAudio

		// Load a sound and set it as the Audio object's buffer
		const audioLoader = new THREE.AudioLoader();
		audioLoader.load(psychoticFlea, buffer => {
			sound.setBuffer(buffer);
			sound.setLoop(true);
			sound.setVolume(0.2);
			// El audio todo el tiempo es muy molesto asi que lo comente, descomentar esto para escuchar
			sound.play();
		});

		const deathAudio = new THREE.Audio(listener);
		audioLoader.load(death, buffer => {
			deathAudio.setBuffer(buffer);
			deathAudio.setLoop(false);
			deathAudio.setVolume(0.4);
		});

		this.death = deathAudio;

		const powerupAudio = new THREE.Audio(listener);
		audioLoader.load(powerup, buffer => {
			powerupAudio.setBuffer(buffer);
			powerupAudio.setLoop(false);
			powerupAudio.setVolume(0.4);
		});

		this.powerup = powerupAudio;

		const teleportAudio = new THREE.Audio(listener);
		audioLoader.load(teleport, buffer => {
			teleportAudio.setBuffer(buffer);
			teleportAudio.setLoop(false);
			teleportAudio.setVolume(0.4);
		});

		this.teleport = teleportAudio;
		
		const wololoAudio = new THREE.Audio(listener);
		audioLoader.load(wololo, buffer => {
			wololoAudio.setBuffer(buffer);
			wololoAudio.setLoop(false);
			wololoAudio.setVolume(0.4);
		})

		this.wololo = wololoAudio;
	}

}