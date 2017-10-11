import React from 'react';
import {arrayOf, bool, func, shape, string} from 'prop-types';

export default function ItemList({items, showStruckOut}) {
    return (
        <ul>
            {items.map(({text, onClick}, idx) =>
                <li key={idx} onClick={onClick} className={showStruckOut ? 'strikeout' : ''}>
                    {text}
                </li>)}
        </ul>
    );
}

ItemList.displayName = 'TodoList';

ItemList.propTypes = {
    items: arrayOf(shape({
        text: string.isRequired,
        onClick: func.isRequired,
    })).isRequired,
    showStruckOut: bool.isRequired,
};