import React from 'react';
import './App.css';

const r = 0;
const g = 100;
const b = 0;
export default(props)=>{
    return(
        <div>
            {props.snakeDots.map((dot, i) => {
                const style = {
                    left: `${dot[0]}%`,
                    top: `${dot[1]}%`,
                    // backgroundColor: `rgb(${r}, ${b}, ${g})`,
                    backgroundColor: `${props.snakeColor}`,
                    border: `1px solid rgb(${r-20}, ${b-20}, ${g-20})`
                }
                return(
                    <div className = 'snake-dot' key={i} style = {style}></div>
                );
            })}
        </div>
    )
};
