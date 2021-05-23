
import querystring from 'querystring';


import Tlor from '../src/record/index';
import TlorReplay from '../src/replay/index';

const { mode } = querystring.parse(location.search.replace('?', ''));
console.log(mode)
if (mode as any == 1) {
    (Tlor as any).init({ pid: "test", domain: 'http://localhost:3000/demo' })
} else {
    (TlorReplay as any).init({
        pid: 'test',
        domain: 'http://localhost:3000/demo'
    })



}





// declare var Tlor: any
// (Tlor as any).default.init({ id: 1111 })