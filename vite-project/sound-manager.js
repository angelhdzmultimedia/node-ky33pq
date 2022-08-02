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

  static playMany(names) {
    for (const name of names) {
      this.play(name);
    }
  }

  static _sequence = [];

  static async _cb(e) {
    const _name = e.target.name;
    const sound = this.sounds[_name];
    sound.audio.removeEventListener('ended', sound.audio._cb);
    this.next();
  }

  static async next() {
    if (this._sequence.length > 0) {
      const _name = this._sequence.shift();
      console.log(`Playing ${_name}, remaining: ${this._sequence}...`);
      this.sounds[_name].audio.name = _name;
      this.sounds[_name].audio.event = 'ended';
      this.sounds[_name].audio.isActive = true;
      this.sounds[_name].audio._cb = this._cb.bind(this);
      this.sounds[_name].audio.addEventListener(
        'ended',
        this.sounds[_name].audio._cb
      );
      this.play(_name);
    } else {
      console.log('Sequence finished.');
      console.groupEnd();
    }
  }

  static async playSequence(names) {
    this._sequence = names;
    if (this.isDebugging) {
      console.group('[SOUND MANAGER]: Playing sequence...');
    }
    this.next();
  }

  static stopMany(names) {
    for (const name of names) {
      this.stop(name);
    }
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
      if (sound.audio.isActive) {
        console.log(`Removing: ${sound.audio.event}, ${sound.audio._cb}`);
        sound.audio.removeEventListener(sound.audio.event, sound.audio._cb);
        this.stop(sound.name);
        sound.audio.isActive = false;
      }
    }
    this._sequence = [];
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

  static once(name, event, fn) {
    if (!this.isRegistered(name)) return;
    this.sounds[name].audio.name = name;
    this.sounds[name].audio.event = event;
    this.sounds[name].audio.fn = fn.bind(this);
    this.sounds[name].audio._cb = _cb;
    function _cb(e) {
      e.target.removeEventListener(event, e.target._cb);
      if (event === 'ended') {
        this.sounds[name].isPlaying = false;
      }
      this.sounds[name].currentTime = this.sounds[name].audio.currentTime;
      fn(this.sounds[name]);
    }
    this.sounds[name].audio.addEventListener(event, _cb.bind(this));
  }

  static async _play(name) {
    try {
      this.sounds[name].isPlaying = true;
      this.sounds[name].audio.play();
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
    this._play(name);
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
