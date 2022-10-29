const listener = new THREE.AudioListener();
camera.add(listener);

// Create a global audio source
const sound = new THREE.Audio(listener);
// THREE.PositionalAudio

// Load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.setPath('audio/');
audioLoader.load('music.mp3', function(buffer)
{
	sound.setBuffer(buffer);
	sound.setLoop(true);
	sound.setVolume(1.0);
    // El audio todo el tiempo es muy molesto asi que lo comente, descomentar esto para escuchar
	//sound.play();
});