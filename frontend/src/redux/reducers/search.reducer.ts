const SET_SEARCH = 'GLOBAL_SET_SEARCH'
const CLEAR_SEARCH = 'GLOBAL_CLEAR_SEARCH'

export interface SearchState {
  term: string
}

const initialState: SearchState = {
  term: '',
}

interface Action {
  type: string
  payload?: unknown
}

export const searchActions = {
  setSearch: (term: string) => ({ type: SET_SEARCH, payload: term }),
  clearSearch: () => ({ type: CLEAR_SEARCH }),
}

const searchReducer = (state: SearchState = initialState, action: Action): SearchState => {
  switch (action.type) {
    case SET_SEARCH:
      return { ...state, term: action.payload as string }
    case CLEAR_SEARCH:
      return { ...state, term: '' }
    default:
      return state
  }
}

export default searchReducer
