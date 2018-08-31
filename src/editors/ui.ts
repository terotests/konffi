
import * as Doremifa from 'doremifa'
import { FileContent, ServerFile, ServerProject } from '../model'
import {
  getCurrentFile,
  getCurrentFolder,
  getFileMetadata,
  findFile,
  findRoot,
  forDirectory,
  collect,
} from './api'

const html = Doremifa.html;
const setState = Doremifa.setState
const getState = Doremifa.getState

export const tablesView = (state) => {
    
    const file = getCurrentFile()

    // setting the state data...
    if(!state.editorFilePath || state.editorFilePath !== file.path ) {
      setState({
        editorFilePath : file.path ,
        data : JSON.parse( file.contents )
      })
      return html`<div></div>`
    }

    // The data of the current item...
    const data = state.data

    const fields = Object.keys( data.reduce((prev,current) => {
      return {
        ...prev,
        ...current,
      }
    }, {}) );

    file.contents = JSON.stringify( state.data, null, 2 )

    // find arrays of primitives...
    let primitives = []
    collect( file => file.name == 'primitives.json')
    .forEach( file => {
      primitives = [...primitives, ...JSON.parse( file.contents ) ]
    })
    
    return html`
<div>
    <h4>${file.name}</h4>

    <button onclick=${()=>{
      // search all files having .json
      console.log( collect( (file, meta) => {
        if(meta) console.log('collect meta ', meta)
        return !!file.path.match('json')
      }))
    }}>Search JSON files</button>

    <div>
      <button onclick=${()=>{
        data.push({name:'new row', type:'string', required:'1'})
        setState({})
      }}>+ row</button>
    </div>

    <table>
    <tr>
      <td></td>
      ${fields.map( f => html`<td><b>${f}</b></td>`)}
    </tr>
    ${data.map( (row, i) => {
      return html`<tr>

        <td><button onclick=${()=>{
          data.splice( i, 1 )
          setState({})
        }}>x</button></td>
      
        ${fields.map( field=>{

          // types from primitives, TODO: modularize
          if(field === 'type') {
            return html`<td>
              <select onchange=${(e)=>{
                row[field] = e.target.value
              }}>
              ${primitives.map( item => {
                if(item.name ===row[field]) {
                  return html`<option selected value=${item.name}>${item.name}</option>`
                }
                return html`<option value=${item.name}>${item.name}</option>`
              })}
              </select>
            </td>`
          }

          // different editors for different types, but for now...
          return html`<td><input value=${row[field]} onkeyup=${
            (e) => {
              row[field] = e.target.value
              setState({})
            }
          }/></td>`
      })}</tr>`
    })}
    </table>
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
    let dragged = null
    let draggedItem = null 
    return html`
<div>
    <h4>SVG boxes editor</h4>
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


