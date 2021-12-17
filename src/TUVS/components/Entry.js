import React from 'react';

function Entry(props) {

    console.log("Entry");

    return (
        <div>
            <h2>Data:</h2>
            <h3>{props.data.title}</h3>
            {Array.from(props.data.strings.entries()).map((item, i) => {
                return <p key={i} >{item[0]}: {item[1]}</p>;
            })}
            {Array.from(props.data.nats.entries()).map((item, i) => {
                // console.log(typeof(item));
                // console.log(JSON.stringify(item[0]));
                return <p key={i} >{item[0]}: {item[1].toNumber()}</p>;
            })}
        </div>
    )
}

export default Entry;