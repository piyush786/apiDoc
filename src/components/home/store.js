import { 
  FETCH_YML
} from './constants';


export default function storeCases(state = {}, action) {

  switch (action.type) {
  case FETCH_YML :
   return  { ...state }

   default:
    return state
  }
}

