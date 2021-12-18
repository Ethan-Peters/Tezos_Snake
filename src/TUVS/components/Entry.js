import React from 'react';

function Entry(props) {

    console.log("Entry");

    return (
        <div class="idContainer">
            <div class="entryContainer">
            <div class="entryTitle">Welcome back, {props.data.strings.get("User Name")}!</div>
            {Array.from(props.data.strings.entries()).map((item, i) => {
                if(item[0] !== "User Name") {
                    return <p key={i} >{item[0]}: {item[1]}</p>;
                }
            })}
            {Array.from(props.data.nats.entries()).map((item, i) => {
                // console.log(typeof(item));
                // console.log(JSON.stringify(item[0]));
                return <p key={i} >{item[0]}: {item[1].toNumber()}</p>;
            })}
            </div>
        </div>
    )
}

export default Entry;