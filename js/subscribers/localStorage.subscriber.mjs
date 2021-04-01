/* globals localStorage */

export const localStorageSubscriber = (store) => () => {
  const tmpState = store.getState()

  // console.log('inside localStorageSubscriber()')

  if (localStorage.getItem('mode') !== tmpState.mode) {
    localStorage.setItem('mode', tmpState.mode)
  }
  if (localStorage.getItem('groups') !== tmpState.groups) {
    localStorage.setItem('groups', tmpState.groups)
  }

  localStorage.setItem('userSettings', JSON.stringify(tmpState.userSettings))
  localStorage.setItem('repeatable', JSON.stringify(tmpState.repeatable))
  localStorage.setItem('oneOff', JSON.stringify(tmpState.oneOff))
}
