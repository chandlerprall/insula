import React, {PropTypes} from 'react';

export default function ItemList({items, onClick}) {
    return (
        <ul>
            {items.map(item => (
                <li key={item.id} onClick={() => onClick(item.clickIntent)} className={item.isFinished}>{item.text}</li>
            ))}
        </ul>
    );
};

ItemList.displayName = 'ItemList';

ItemList.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        isFinished: PropTypes.bool.isRequired,
        text: PropTypes.string.isRequired,
        clickIntent: PropTypes.string.isRequired
    })).isRequired,
    onClick: PropTypes.any.isRequired
};