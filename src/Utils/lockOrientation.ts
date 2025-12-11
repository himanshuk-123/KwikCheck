import * as ScreenOrientation from 'expo-screen-orientation';

async function lockOrientationToLandscapeRight() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
}

async function resetOrientation() {
    await ScreenOrientation.unlockAsync();
}

export { lockOrientationToLandscapeRight, resetOrientation }