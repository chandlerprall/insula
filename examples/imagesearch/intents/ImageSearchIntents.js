import Intent from 'insula/src/Intent';
import {SET_QUERY, START_SEARCH, SET_IS_LOADING, SET_RESULTS} from './IntentNames';
import {performQuery} from '../PixabayService';

// Query intents
export const setQuery = Intent(SET_QUERY, (previous, query) => query);

// Search intents
export const startSearch = Intent(START_SEARCH, (query, ignore, {dispatch}) => {
    dispatch(SET_QUERY, '');
    dispatch(SET_IS_LOADING, true);

    performQuery(query).then(({hits}) => {
        dispatch(SET_RESULTS, hits);
    });
});

export const setIsLoading = Intent(SET_IS_LOADING, (results, isLoading) => ({...results, isLoading}));

export const setResults = Intent(SET_RESULTS, (results, hits) => ({isLoading: false, hits}));