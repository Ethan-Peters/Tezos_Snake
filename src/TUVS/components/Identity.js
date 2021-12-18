import React from 'react';
import Entry from './Entry'

function Identity(props) {

    return (
        <div>
            {props.entries &&
            Array.from(props.entries.values()).map((entry, i) => {
                return props.title === entry.title && <Entry key={i} data={entry}/>;
            })}
        </div>
    )
}

export default Identity;