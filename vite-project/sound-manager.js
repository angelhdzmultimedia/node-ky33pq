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

  static warn(message) {
    console.warn(`[SOUND MANAGER]: ${message}`);
  }

  static async play(name) {
    if (!this.sounds[name]) {
      if (this.isDebugging) {
        this.warn(`Sound ${name} not registered.`);
      }
      return;
    }
    try {
      this.sounds[name].audio.currentTime = 0;
      await this.sounds[name].audio.play();
    } catch (error) {
      if (this.isDebugging) {
        this.warn(
          `Sound did not load. ${this.sounds[name].url} is not a valid URL.`
        );
      }
    }
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
