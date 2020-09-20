import { all, put, takeEvery } from 'redux-saga/effects'

import { FETCH_YML } from './constants';


export function* fetchYmlAsync() {

}


export default function* watchAll() {
    yield all([
        takeEvery(FETCH_YML, fetchYmlAsync),
    ])
    
}