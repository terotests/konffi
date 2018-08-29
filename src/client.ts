
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
import {
  createAceContainer,
  getAceHolder
} from './editors/ace'
import { updateAceEditor } from './editors/ace'

const html = Doremifa.html;
const setState = Doremifa.setState
const getState = Doremifa.getState
let rootFolder : ServerFile = null

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
let projectList = null
const fileIds = {}

// simple example of editors...

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
    const aceHolder = getAceHolder()
    tpl.ids.editorHolder.appendChild( aceHolder.aceDOMContainer )
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

const defaultEditor = ( (state) => {
  return html`<div>${aceContainer}</div>`
})

const editorArea = (state) => {

  if(!state.loaded) {
    return html`<div>Loading...</div>`
  }

  const fileMeta = getFileMetadata()
  const editorName = ( fileMeta && fileMeta.editor ) || ''
  const editorFn = usedEditors[editorName] || defaultEditor
  
  // update the ace
  updateAceEditor( getCurrentFile() )

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
