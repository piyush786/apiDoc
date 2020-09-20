import { fork, all } from 'redux-saga/effects';
import homeSaga from '../components/home/saga'

export default function* rootSaga() {
    yield all([
        fork(homeSaga),
    ]);
}