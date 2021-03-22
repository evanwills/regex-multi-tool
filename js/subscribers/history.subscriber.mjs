/* global history */
export const historySubscriber = (store) => {
  const tmpState = store.getState()
  let currentHref = tmpState.url.href

  return () => {
    const previousHref = currentHref
    const state = store.getState()
    currentHref = state.url.href

    if (previousHref !== currentHref) {
      history.pushState(state, '', currentHref)
    }
  }
}
