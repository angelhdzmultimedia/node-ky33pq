const $ = (selector) => document.querySelector(selector);

const divApp = $('#div-app');

const buttonPhone = $('#button-phone');
const buttonGlassBreak = $('#button-glass-break');
const buttonGunshot = $('#button-gunshot');
const buttonStopAll = $('#button-stop-all');

const buttons = [buttonPhone, buttonGunshot, buttonGlassBreak];

buttons.forEach((button) => {
  const id = button.getAttribute('id');
  const sound = id.replace('button-', '');
  button.sound = sound;

  // Registers a sound.
  SoundManager.register(
    sound,
    `https://github.com/angelhdzmultimedia/node-ky33pq/blob/main/vite-project/public/assets/sounds/${sound}-sound.wav?raw=true`
  );

  button.addEventListener('click', (event) => {
    const sound = event.target.sound;
    // Plays a sound.
    SoundManager.play(sound);
  });
});

buttonStopAll.addEventListener('click', () => {
  SoundManager.stopAll();
});

SoundManager.register('my-snd', `asdasdasd`);

//Loads all the registered sounds.
SoundManager.load();

// If SoundManager.isDebugging is true, trying to play an unregistered sound will display a warning.
SoundManager.play('my-snd');
