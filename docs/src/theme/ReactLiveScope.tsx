import React from 'react';
import * as leva from 'leva';
import useBaseUrl from '@docusaurus/useBaseUrl';

// Add react-live imports you need here
const ReactLiveScope = {
    React,
    ...React,

    useBaseUrl,

    leva,
    Leva: leva.Leva,
    LevaPanel: leva.LevaPanel,
};

export default ReactLiveScope;
