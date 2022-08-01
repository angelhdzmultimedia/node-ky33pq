class SoundManager {
  static sounds = {};
  static isDebugging = true;

  static register(name, url) {
    this.sounds[name] = {
      name,
      url,
      audio: null,
      isPlaying: false,
      currentTime: null,
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

  static pause(name) {
    if (!this.isRegistered(name)) return;
    this.sounds[name].currentTime = this.sounds[name].audio.currentTime;
    this.sounds[name].audio.pause();
  }

  static async resume(name) {
    if (!this.isRegistered(name)) return;
    if (this.sounds[name].currentTime >= 0) {
      this.sounds[name].audio.currentTime = this.sounds[name].currentTime;
      await this._play(name);
    }
  }

  static on(name, event, fn) {
    if (!this.isRegistered(name)) return;
    this.sounds[name].audio.addEventListener(event, () => {
      if (event === 'ended') {
        this.sounds[name].isPlaying = false;
      }
      this.sounds[name].currentTime = this.sounds[name].audio.currentTime;
      fn(this.sounds[name]);
    });
  }

  static async _play(name) {
    try {
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

  static async play(name) {
    if (!this.isRegistered(name)) return;
    this.sounds[name].audio.currentTime = 0;
    await this._play(name);
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
