import React, {PureComponent} from 'react';
import Insula from '../../../src/Insula';
import Store from 'insula/src/Store';
import Section from 'insula/src/Section';
import {setQuery, startSearch, setIsLoading, setResults} from '../intents/ImageSearchIntents';
import QueryView from './QueryView';
import SearchResults from './SearchResults';

export default class ImageSearchApp extends PureComponent {
    constructor(...args) {
        super(...args);
        
        this.store = Store({
            sections: {
                query: Section('', setQuery, startSearch),
                results: Section({isLoading: false, hits: []}, setIsLoading, setResults)
            }
        });
    }
    
    render() {
        return (
            <Insula store={this.store}>
                <div>
                    <QueryView/>
                    <SearchResults/>
                    <br/><br/><br/>
                    <a href="https://pixabay.com/">powered by pixabay</a>
                </div>
            </Insula>
        );
    }
}

ImageSearchApp.displayName = 'ImageSearchApp';