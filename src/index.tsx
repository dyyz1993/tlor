import React from 'react';
import ReactDom from 'react-dom';
import Draggabilly from 'draggabilly';
import './index.scss';
type ITlorProps = Partial<{
    id:string|number,
    network:boolean,
    console:boolean
}>

function Tlor(props:ITlorProps){
    return <>上报BUG</>
}

Tlor.init = function(config:ITlorProps){
    let container = document.body.appendChild(document.createElement('div'))
    container.id='tlor'
    let draggie = new Draggabilly( container, {
    //   containment:document.body
    });
    draggie.on( 'staticClick', function( event, pointer ) {
        console.log('click')
    })
    ReactDom.render(<Tlor {...config} ></Tlor>,container);
}


export default Tlor;

// Tlor.init({pid:'',network:true,console:true})