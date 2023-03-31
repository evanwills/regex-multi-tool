/**
 * Set the maximum height on the main input text area field to allow
 * it to fill the block without needing to scroll
 */
export const optimiseInputHeight = () => {
  let subtractor = 6.5;
  let inputBox = document.getElementsByClassName('repeat-input');

  if (inputBox.length > 0) {
    inputBox = inputBox[0];
  } else {
    inputBox = document.getElementById('input')
    subtractor += 1
  }

  if (inputBox !== null) {
    const pageRoot = document.documentElement;
    const windowHeight = ((window.innerHeight / 16));
    const inputHeight = windowHeight - subtractor - (inputBox.offsetTop / 16);

    if (typeof pageRoot !== 'undefined') {
      pageRoot.style.setProperty('--input-height', (Math.round(inputHeight * 100) / 100) + 'rem')
    }
  }
}
