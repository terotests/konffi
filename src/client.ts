
import * as Doremifa from 'doremifa'
import axios from 'axios'

import { FileContent, ServerFile, ServerProject } from './model'
import {
  getCurrentFile,
  getCurrentFolder,
  getFileMetadata,
  findFile,
  findRoot,
  forDirectory
} from './editors'

import * as UI from './editors/ui'

const html = Doremifa.html;
const setState = Doremifa.setState
const getState = Doremifa.getState
let rootFolder : ServerFile = null

// <div id="editor1container" style="flex:1;display:flex;"><div id="editor1" style="flex:1;"></div></div>

interface ACEContainer {
  aceDOMContainer : HTMLElement
  aceDOM : HTMLElement
}

const createAceContainer = () : ACEContainer => {
  let aceDOMContainer = document.createElement('div')
  let aceDOM =  document.createElement('div')
  aceDOM.setAttribute('style', 'flex:1;')
  aceDOMContainer.setAttribute('style', 'flex:1;display:flex;')
  aceDOMContainer.appendChild( aceDOM )
  document.body.appendChild( aceDOMContainer )
  return {
    aceDOMContainer,
    aceDOM
  }
}

const aceHolder = createAceContainer()

Doremifa.setState({
  loaded : false,
  editorBinded : false,
  files : [],
  time:(new Date).toTimeString(),
  // test items from the state
  items : [
    {x: 100, y:100, color:"blue", width:100, height:100},
    {x: 110, y:110, color:"red", width:100, height:100},
    {x: 50, y:50, color:"orange", width:44, height:44},
  ]
})

console.log(JSON.stringify([
  {x: 100, y:100, color:"blue", width:100, height:100},
  {x: 110, y:110, color:"red", width:100, height:100},
  {x: 50, y:50, color:"orange", width:44, height:44},
], null, 2))

// OK, these could be in state too...
let aceEditor = null
let projectList = null
let settingValue = false
const fileIds = {}

// simple example of editors...


const aceState = {
  fileid : '',
}

const updateAceEditor = () => {
  const theFile = getCurrentFile()
  if(!theFile) return
  if(theFile.id === aceState.fileid ) return

  aceState.fileid  = theFile.id

  const meta = getFileMetadata()

  if(meta && meta.editor) {
    aceHolder.aceDOMContainer.style.display = 'none'
  } else {
    aceHolder.aceDOMContainer.style.display = 'block'
  }

  const item = theFile
  if(aceEditor && theFile) {
    aceEditor.setValue( theFile.contents, 1 )
    aceEditor.resize()
    settingValue = false

    // the cursor position for the file ??? 
    if(theFile.cursorPosition) {
      const cursor = theFile.cursorPosition
      aceEditor.focus();
      aceEditor.gotoLine(cursor.row + 1, cursor.column, true);              
    }     
    switch( item.exttype ) {
      case ".ts":
        aceEditor.session.setMode("ace/mode/typescript");
        break
      case ".md":
      aceEditor.session.setMode("ace/mode/markdown");
        break
      default:
        aceEditor.session.setMode("ace/mode/typescript");
    }
    aceEditor.setOptions({
        maxLines: 30
    });              
  }  
}

const usedEditors = {
  "tables" : UI.tablesView,
  "boxes" : UI.boxesView,
  "tsconfig" : UI.tsConfigView
}

const readProjectFolder = async (project:ServerProject, path:string ) : Promise<ServerFile> => {

  const state = getState()
  if(state.projectFolders && state.projectFolders[project.id]) {
    // locate the path inside the porject folders
    let found = null
    const walk_project = (folder) => {
      if(found) return
      if(folder.path == path) {
        found = folder
      } else {
        for( let f of folder.files ) {
          if(f.is_folder) walk_project( f )
        }
      }
    }
    walk_project( state.projectFolders[project.id] )
    return found
  }

  // Fetching some folder...
  const rootOf = (await axios.post('/folder/' + project.id, {
    path : path
  })).data

  const mapFiles = (folder:ServerFile) => {
    fileIds[folder.id] = folder
    folder.files.forEach( mapFiles )
  }
  mapFiles( rootOf )
  rootOf.is_read = true

  return rootOf
}

function showFiles( state ) {

  const currFolder = fileIds[state.params.folderid] 
  if(!currFolder) return html `<div></div>`

  const files = currFolder.files as ServerFile[]
  const sorter = ( a, fn ) => a.slice().sort(fn)
  return html`

  <button onclick=${()=>{
    window.location.hash = '#file/folderid/' + state.activeProject.folder.id
  }}>/</button>
  <!-- the fields -->

  <div>${
    sorter(files, (a,b) => {
      if(a.is_file) return 1
      return -1
    }).map( item => {  
      return html`
      <div 
        class=${item.typename}
        onclick=${
        async () => {
          //  && state.currentFileID !== item.id
          if(item.is_file) {
            // Move to the file...
            window.location.hash = '#file/fileid/' + item.id + "/folderid/" + currFolder.id
          } 
          if( item.is_folder ) {
            const folder = await readProjectFolder( state.currentProject, item.path )
            window.location.hash = '#file/folderid/' + folder.id + "/fileid/" + folder.id
          }
        }
      }>${item.name}</div>
    `}
    )
  }
  </div>
  `
}

const height = window.innerHeight

const debounce = (delay, fn) => {
  let iv = null
  return ()=>{
    if(iv) clearTimeout(iv)
    iv = setTimeout( ()=>{
      fn()
    }, delay)
  }
}

const refreshData = debounce(200, async () => {

  const projectList = (await axios.get('/projects')).data
  setState({projectList})
  setState({currentProject:projectList[0]})  

  // Just load the project
  const proj = await readProjectFolder( projectList[0], '/' )
  setState({
    currentFileID : 0,
    files : [],
    projectFolders: {
    ...getState().projectFolders,
    [projectList[0].id] : proj,
    activeProject : {
      folder : proj
    }
  }}) 

  // Loading the File...
  const state = getState()
  if(state.currentFile) {

  } else {

  }

  window.location.hash = '#file/folderid/' + proj.id
  setState({loaded:true})  
})

const loadEditor = debounce(200, async () => {

  const state = getState()

  const projectList = (await axios.get('/projects')).data
  setState({projectList})
  setState({currentProject:projectList[0]})  

  const proj = await readProjectFolder( projectList[0], '/' )

  // Set the project folder...
  setState({
    activeProject :{
      folder : proj
    },
    projectFolders: {
      ...getState().projectFolders,
      [projectList[0].id] : proj,
    }}) 
  const currFolder = getCurrentFolder()
  if(!state.params.folderid) window.location.hash = '#file/folderid/' + proj.id
  setState({loaded:true})  
})

// The Ace editor container..
let aceContainer = html`<div class="editor" id="editorHolder"
  style=${`flex:1;height:${window.innerHeight}`}></div>`.onReady( (tpl) => {
    console.log('container @ ready ')
    console.log(tpl)
    tpl.ids.editorHolder.appendChild( aceHolder.aceDOMContainer )

    if(aceEditor) {
      aceEditor.resize()
    }
    // console.log('onReady at aceContainer ', tpl)
  });


// 
const editJSON = ( strdata ) => {
  const data = JSON.parse(strdata)
  if(Array.isArray( data )) {
    const allKeys = Object.keys(data.reduce( (prev, curr) => {
      return {...prev, ...curr}
    }, {}))
    return html`
<table>
  <thead>
    <tr>
    ${allKeys.map( colname => {
      return html`<td>${colname}</td>`
    })}   
    </tr>
  </thead>
  ${data.map( item => {
    return html`<tr>
      ${allKeys.map( colname => {
        const c = item[colname]
        if(c.length > 20) {
          return html`<td><div class="incomplete">${c.substring(0,20)}...</div></td>`
        }
        return html`<td>${c}</td>`
      })}
    </tr>`
  })}
</table>    
    `
  }
  return html`<pre>${JSON.stringify(data, null, 2)}</pre>`
}

// currently default editor === n
const defaultEditor = ( (state) => {
  return html`<div style="border:1px solid blue;">container : ${aceContainer}</div>`
})

const editorArea = (state) => {

  if(!state.loaded) {
    return html`<div>Loading...</div>`
  }

  const fileMeta = getFileMetadata()
  const editorName = ( fileMeta && fileMeta.editor ) || ''
  const editorFn = usedEditors[editorName] || defaultEditor
  
  // update the ace
  updateAceEditor()

  return html`
<div style=${`flex:1;height:${window.innerHeight}`}>
  <div>
    <button onclick=${async ()=>{
      const currentFile = getCurrentFile()
      if(currentFile) {
        const res = await axios.post('/savefile/' + state.currentProject.id, {
          path : currentFile.path,
          content : currentFile.contents
        })     
      }
    }}>Save Me!</button>

    <button onclick=${async ()=>{
      
      const curr = getCurrentFile()
      
      const res = await axios.post('/savefile/' + state.currentProject.id, {
        path : '/.fmeta/' + curr.path + '.fmeta',
        content : JSON.stringify({
          info : 'Saved info about ' + curr.name
        })
      })   
      
    }}>Save info of current file</button>

    <button onclick=${async ()=>{
      // setState({})
      refreshData()
    }} >Refresh</button>

  </div>
  <div>
    ${ ( fileMeta && fileMeta.editor) || 'no editor defined' }
  </div>
  <div>
    ${fileMeta ? fileMeta.info : ''}
  </div>
    ${editorFn(state)} 
</div>
  `.onReady( tpl => {  

  })
}


// main HTML...
// Simple JSON data editor built using doremifa
Doremifa.mount(document.body, state => html`
<div style="display:flex;">
  <div class="filebrowser">
    ${Doremifa.router({  
      file : showFiles
    })}
  </div>
  ${editorArea(state)}
</div>`.onReady(loadEditor));

// setInterval( _ => { setState({time:(new Date).toTimeString()})},1000)  

// Editor must be placed into an existing DOM element
aceEditor = ace.edit(aceHolder.aceDOM);
aceEditor.setTheme("ace/theme/monokai");
aceEditor.session.setMode("ace/mode/typescript");

// problem: also fired when setValue() is called
aceEditor.getSession().on('change', function() {

  const state = Doremifa.getState()
  const strnow = aceEditor.getValue()

  const currentFile = getCurrentFile()

  // TODO: handle better...
  if(currentFile && !settingValue) {

    currentFile.contents = strnow
    currentFile.cursorPosition = aceEditor.getCursorPosition()
    // state.files[currentFile.id].contents = strnow
    // state.files[currentFile.id].cursorPosition = aceEditor.getCursorPosition()
  }
  if(currentFile && !settingValue) {
    setState({currentFile:{
      ...state.currentFile,
      contents : strnow
    }})  
  } else {
    console.log('did not set state for editor change... settingValue', settingValue)
    console.log(state)
  }
});
  