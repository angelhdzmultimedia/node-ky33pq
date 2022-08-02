const $ = (selector) => document.querySelector(selector);

const divApp = $('#div-app');

const buttonPhone = $('#button-phone');
const buttonGlassBreak = $('#button-glass-break');
const buttonGunshot = $('#button-gunshot');
const buttonStopAll = $('#button-stop-all');
const buttonPlaySequence = $('#button-play-sequence');

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

// Notes
for (let i = 0; i < 6; i++) {
  const button = $(`#button-note-${i + 1}`);
  const sound = `sound_00${i + 1}`;
  button.sound = sound;

  // Registers a sound.
  SoundManager.register(
    sound,
    `https://github.com/angelhdzmultimedia/dartpad_json/blob/master/${sound}.mp3?raw=true`
  );

  button.addEventListener('click', (event) => {
    const sound = event.target.sound;
    // Plays a sound.
    SoundManager.play(sound);
  });
}

buttonStopAll.addEventListener('click', () => {
  SoundManager.stopAll();
});

SoundManager.register('my-snd', `asdasdasd`);

//Loads all the registered sounds.
SoundManager.load();

// Trying to play an unregistered sound will display a warning (if SoundManager.isDebugging is set to true).
SoundManager.play('unregistered-sound');

// Sound finished playing event.
/* SoundManager.once('glass-break', 'ended', (phone) => {
  console.group('ended');
  console.log(JSON.stringify(phone));
  console.groupEnd();
}); */

// Sound is playing event.
/* SoundManager.on('phone', 'timeupdate', (phone) => {
  console.group('timeupdate');
  console.log(JSON.stringify(phone));
  console.groupEnd();
});
 */
buttonPlaySequence.addEventListener('click', () => {
  SoundManager.playSequence([
    'sound_001',
    'sound_002',
    'sound_003',
    'sound_002',
    'sound_001',
  ]);
});
