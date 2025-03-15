import { Scenes } from 'telegraf';
import identificationScene from './identificationScene';
import counterSelectionScene from './counterSelectionScene';
import readingInputScene from './readingInputScene';
import readingConfirmationScene from './readingConfirmationScene';
import finalScene from './finalScene';

export function setupScenes(): Scenes.Stage<Scenes.SceneContext> {
  const stage = new Scenes.Stage<Scenes.SceneContext>([
    identificationScene,
    counterSelectionScene,
    readingInputScene,
    readingConfirmationScene,
    finalScene
  ]);
  return stage;
};
