

const $ = (selector) => document.querySelector(selector);

const divApp = $('#div-app');

const buttonPhone = $('#button-phone');
const buttonGlassBreak = $('#button-glass-break');
const buttonGunshot = $('#button-gunshot');

const buttons = [buttonPhone, buttonGunshot, buttonGlassBreak];

buttons.forEach((button) => {
  const id = button.getAttribute('id');
  const sound = id.replace('button-', '');
  button.sound = sound;

  // Registers a sound.
  SoundManager.register(
    sound,
    `https://github.com/angelhdzmultimedia/node-ky33pq/blob/main/assets/sounds/${sound}-sound.wav?raw=true`
  );

  button.addEventListener('click', (event) => {
    const sound = event.target.sound;
    // Plays a sound.
    SoundManager.play(sound);
  });
});

//Loads all the registered sounds.
SoundManager.load();

// If SoundManager.isDebugging is true, trying to play an unregistered sound will display a warning.
SoundManager.play('unregistered-sound');


