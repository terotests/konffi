
module.exports.run = function(wr) {
  
  const model = wr.getState()

  /*
  wr.getFileWriter('/src/', 'client.ts').raw(`
import * as Doremifa from 'doremifa'

const html = Doremifa.html;
const setState = Doremifa.setState

Doremifa.setState({
  time:(new Date).toTimeString(),
})
Doremifa.mount(document.body, state => html\`<div>Hello World! \${state.time}</div>\`)
setInterval( _ => { setState({time:(new Date).toTimeString()})},1000)  
  `)
  */
  

}