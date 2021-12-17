import React from 'react';
import Entry from './Entry'

function Identity(props) {
    return (
        <div>
            <h1>Entries:</h1>
            {props.entries &&
            Array.from(props.entries.values()).map((entry, i) => {
                console.log("title: " + entry.title);
                return <Entry key={i} data={entry}/>;
            })}
        </div>
    )
}

export default Identity;