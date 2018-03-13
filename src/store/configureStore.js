import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import { makeRootReducer } from './reducers'
import sagas from './sagas'
import { composeWithDevTools } from 'remote-redux-devtools';

const sagaMiddleware = createSagaMiddleware()

export default (initialState = {}, history) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [sagaMiddleware, routerMiddleware(history)]

  if (__DEV__) {
    const { logger } = require('redux-logger')

    middleware.push(logger)
  }

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )

  store.asyncReducers = {}

  // ======================================================
  // Inject sagas
  // ======================================================
  Object.keys(sagas).map(sagaName => sagaMiddleware.run(sagas[sagaName]))

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').makeRootReducer

      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}
