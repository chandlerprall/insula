import React, {PureComponent} from 'react';
import Capacitor from '../../../src/Capacitor';
import Store from 'capacitor/src/Store';
import Section from 'capacitor/src/Section';
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
            <Capacitor store={this.store}>
                <div>
                    <QueryView/>
                    <SearchResults/>
                    <br/><br/><br/>
                    <a href="https://pixabay.com/">powered by pixabay</a>
                </div>
            </Capacitor>
        );
    }
}

ImageSearchApp.displayName = 'ImageSearchApp';