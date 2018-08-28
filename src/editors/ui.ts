
import * as Doremifa from 'doremifa'
import { FileContent, ServerFile, ServerProject } from '../model'
import {
  getCurrentFile,
  getCurrentFolder,
  getFileMetadata,
  findFile,
  findRoot,
  forDirectory
} from '.'

const html = Doremifa.html;
const setState = Doremifa.setState
const getState = Doremifa.getState


export const tablesView = (state) => {
    
    const file = getCurrentFile()
    if(!file) return html`<div></div>`
    const data = JSON.parse( file.contents )

    return html`
<div>
    <h4>Tables editor</h4>
    <div>
      <button onclick=${()=>{
        data.push({name:'new row'})
        setState({currentFile:{
          ...file,
          contents : JSON.stringify(data, null, 2)
        }})
      }}>+ row</button>
    </div>
    ${data.map( row => {
      return html`<div>${JSON.stringify(row)}</div>`
    })}
</div>    
    `    
  }

  // simple "boxes" -editor...
export const boxesView = (state) => {

    const file = getCurrentFile()

    // load items...
    if(!state.editorFilePath || state.editorFilePath !== file.path ) {
      setState({
        editorFilePath : file.path ,
        data : JSON.parse( file.contents )
      })
      return html`<div></div>`
    }

    // These items should be in the state...

    let dragged = null
    let draggedItem = null 

    return html`
<div>
    <h4>Boxes editor</h4>
    Filename : ${file.path}
    <div>
    <button onclick=${()=>{
      const items = state.data.items
      items.push( {x:10,y:10,width:100,height:100,color:"green"} )
      setState({})
    }}>+ box</button>
    <button onclick=${()=>{
        const currFile = getCurrentFile()
        currFile.contents = JSON.stringify( state.data, null, 2 )
        setState({})
      }}>Update</button>
     ${ state.activeItem ? html`<input type="color" value=${state.activeItem.color} 
        onchange=${(e)=>{
          if(e.target.value) {
            state.activeItem.color = e.target.value 
            setState({})
          }
        }}
      />`  : ''}

      ${ state.activeItem ? html`<input style="width:60px;" value=${state.activeItem.width} 
      onkeyup=${(e)=>{
        if(e.target.value) {
          state.activeItem.width = parseInt( e.target.value ) 
          setState({})
        }
      }}
    />`  : ''} 
    x
    ${ state.activeItem ? html`<input style="width:60px;" value=${state.activeItem.height} 
    onkeyup=${(e)=>{
      if(e.target.value) {
        state.activeItem.height = parseInt( e.target.value ) 
        setState({})
      }
    }}
  />`  : ''}

  ${ state.activeItem ? html`<input style="width:60px;" value=${state.activeItem.opacity || 0.5} 
  onkeyup=${(e)=>{
    if(e.target.value) {
      state.activeItem.opacity = parseFloat( e.target.value ) 
      setState({})
    }
  }}
/>`  : ''}

    </div>
    <div>
    <svg width=${state.data.width} height=${state.data.height}
        onmousemove=${(e)=>{
          if(state.draggedItem) {
            const dx = e.pageX - state.dragStart.mx
            const dy = e.pageY - state.dragStart.my
            state.draggedItem.x = state.dragStart.itemx + dx
            state.draggedItem.y = state.dragStart.itemy + dy
            setState({})
          }
        }}
        onmouseup=${()=>{
          setState({draggedItem:null})
        }}
        onmouseleave=${()=>{
          setState({draggedItem:null})
        }}
      >
      ${
        state.data.items.map( item => html`
          <rect x=${item.x} y=${item.y} onmousedown=${
            (e)=> {
              // mark item as dragged
              if(!state.draggedItem) {
                console.log(e)
                setState({
                  draggedItem:item, 
                  activeItem : item,
                  dragStart : {
                  itemx : item.x,
                  itemy : item.y,
                  mx : e.pageX,
                  my : e.pageY
                }})  
              }
            }
          } width=${item.width} height=${item.height} fill=${item.color} opacity=${item.opacity || 0.5}></rect>
        `)
      }
    </svg>
    </div>

</div>    
    `
}

export const tsConfigView = (state) => {
    const file = state.currentFile

    // These items should be in the state...

    let dragged = null
    let draggedItem = null 

    return html`
<div>
    <h4>TypeScript configuration</h4>
    Filename : ${file.path}
    <div>
    <svg width="300" height="300"
        onmousemove=${(e)=>{
          if(state.draggedItem) {
            const dx = e.pageX - state.dragStart.mx
            const dy = e.pageY - state.dragStart.my
            state.draggedItem.x = state.dragStart.itemx + dx
            state.draggedItem.y = state.dragStart.itemy + dy
            setState({})
          }
        }}
        onmouseup=${()=>{
          setState({draggedItem:null})
        }}
        onmouseleave=${()=>{
          setState({draggedItem:null})
        }}
      >
      ${
        state.items.map( item => html`
          <rect x=${item.x} y=${item.y} onmousedown=${
            (e)=> {
              // mark item as dragged
              if(!state.draggedItem) {
                console.log(e)
                setState({draggedItem:item, dragStart : {
                  itemx : item.x,
                  itemy : item.y,
                  mx : e.pageX,
                  my : e.pageY
                }})  
              }
            }
          } width=${item.width} height=${item.height} fill=${item.color} opacity="0.4"></rect>
        `)
      }
    </svg>
    </div>

</div>    
    `
}


