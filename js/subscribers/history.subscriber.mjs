/* global history */

const getUrlStr = (url) => {

}

export const historySubscriber = (store) => {
  const tmpState = store.getState()
  let currentURL = tmpState.url

  return () => {
    const previousURL = currentURL
    const state = store.getState()
    currentURL = state.url

    // hash has changed
    let update = (previousURL.hash !== currentURL.hash)

    if (update === false) {
      for (const key in currentURL.searchParams) {
        if (typeof (previousURL.searchParams[key]) === 'undefined' ||
            previousURL.searchParams[key] !== currentURL.searchParams[key]
        ) {
          // a search param has been added or updated
          update = true
          break
        }
      }
    }
    if (update === false) {
      for (const key in previousURL.searchParams) {
        if (typeof (currentURL.searchParams[key]) === 'undefined') {
          // a search param has been removed
          update = true
          break
        }
      }
    }
    // TODO: work out what I want to do with history

    if (update === true) {
      history.pushState(state, '', getUrlStr(currentURL))
    }
  }
}
