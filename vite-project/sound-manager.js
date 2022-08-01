class SoundManager {
  static sounds = {};
  static isDebugging = true;

  static register(name, url) {
    this.sounds[name] = {
      name,
      url,
      audio: null,
    };
  }

  static print(message) {
    console.warn(`[SOUND MANAGER]: ${message}`);
  }

  static play(name) {
    if (!this.sounds[name]) {
      if (this.isDebugging) {
        this.print(`Sound ${name} not registered.`);
      }
      return;
    }
    this.sounds[name].audio.currentTime = 0;
    this.sounds[name].audio.play();
  }

  static load() {
    if (this.isDebugging) console.group('[SOUND MANAGER]: Loading sounds...');
    for (const sound of Object.values(this.sounds)) {
      sound.audio = new Audio(sound.url);
      sound.audio.autoplay = false;
      if (this.isDebugging)
        console.log(`[SOUND MANAGER]: ${sound.url} loaded.`);
    }
    if (this.isDebugging) console.groupEnd();
  }
}
