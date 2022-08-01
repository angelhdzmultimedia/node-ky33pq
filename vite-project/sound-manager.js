class SoundManager {
  static sounds = {};
  static isDebugging = true;

  static register(name, url) {
    this.sounds[name] = {
      name,
      url,
      audio: null,
      isPlaying: false,
    };
  }

  static isPlaying(name) {
    return this.sounds[name].isPlaying;
  }

  static isRegistered(name) {
    if (!this.sounds[name]) {
      if (this.isDebugging) {
        this.warn(`Sound ${name} not registered.`);
      }
      return false;
    }
    return true;
  }

  static unregister(name) {
    if (!this.isRegistered(name)) return;
    delete this.sounds[name];
  }

  static warn(message) {
    console.warn(`[SOUND MANAGER]: ${message}`);
  }

  static stop(name) {
    if (!this.isRegistered(name)) return;
    this.sounds[name].audio.currentTime = 0;
    this.sounds[name].audio.pause();
    this.sounds[name].isPlaying = false;
  }

  static stopAll() {
    for (const sound of Object.values(this.sounds)) {
      this.stop(sound.name);
    }
  }

  static on(name, event, fn) {
    this.sounds[name].audio.addEventListener(event, () => {
      fn(this.sounds[name]);
    });
  }

  static async play(name) {
    if (!this.isRegistered(name)) return;
    try {
      this.sounds[name].audio.currentTime = 0;
      this.sounds[name].isPlaying = true;
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
