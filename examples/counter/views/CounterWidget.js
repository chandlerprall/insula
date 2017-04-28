import React from 'react';
import {func, number} from 'prop-types';
import connect from '../../../src/Connect';
import {ADJUST_VALUE} from '../CounterConstants';

const ONE_VALUE = 1;

function CounterWidget({countDown, countUp, stepDown, stepUp, value}) {
    return (
        <div>
            <button onClick={stepDown}>&laquo;</button>
            <button onClick={countDown}>&lt;</button>
            <input type="text" value={value}/>
            <button onClick={countUp}>&gt;</button>
            <button onClick={stepUp}>&raquo;</button>
        </div>
    );
}

CounterWidget.displayName = 'CounterWidget';

CounterWidget.propTypes = {
    countDown: func.isRequired,
    countUp: func.isRequired,
    stepDown: func.isRequired,
    stepUp: func.isRequired,
    value: number.isRequired,
};

export default connect(
    [[]],
    ([value, props], {bindDispatch}) => {
        const {stepValue} = props;
        return {
            countDown: bindDispatch(ADJUST_VALUE, -ONE_VALUE),
            countUp: bindDispatch(ADJUST_VALUE, ONE_VALUE),
            stepDown: bindDispatch(ADJUST_VALUE, -stepValue),
            stepUp: bindDispatch(ADJUST_VALUE, stepValue),
            value,
        };
    },
    {
        listeners: {
            [ADJUST_VALUE]: (delta, {getState, setState}) => {
                const currentCount = getState();
                setState(currentCount + delta);
            },
        },
    }
)(CounterWidget);