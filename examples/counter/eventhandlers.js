/* eslint-disable no-magic-numbers */
export default [
    {
        event: 'ADJUST_VALUE',
        handler: (delta, {getState, setState}) => {
            const currentCount = getState();
            setState(currentCount + delta);
        },
    },
];