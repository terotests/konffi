
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

import axios from 'axios'
import * as UI from './ui'
import {
  createAceContainer,
  getAceHolder
} from './ace'
import { updateAceEditor } from './ace'

Doremifa.setState({
  editors : {},
  loaded : false,
  files : []
})

const html = Doremifa.html;
const setState = Doremifa.setState
const getState = Doremifa.getState

export function showFolders( state ) {

  const currFolder = getCurrentFolder()
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
            window.location.hash = '#file/folderid/' + item.id 
          }
        }
      }>${item.name}</div>
    `}
    )
  }
  </div>
  `
}
const readProjectFolder = async (project:ServerProject, path:string ) : Promise<ServerFile> => {
  return (await axios.post('/folder/' + project.id, {
    path : path
  })).data
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

const refreshData = async () => {
  const projectList = (await axios.get('/projects')).data
  setState({projectList})
  setState({currentProject:projectList[0]})  

  // Just load the project
  const proj = await readProjectFolder( projectList[0], '/' )
  setState({
    activeProject :{
      folder : proj
    },    
    currentFileID : 0,
    files : [],
    projectFolders: {
      ...getState().projectFolders,
      [projectList[0].id] : proj,
      activeProject : {
        folder : proj
      }
    }
  }) 
  if(!getState().params.folderid) window.location.hash = '#file/folderid/' + proj.id
  setState({loaded:true})  
}

const loadEditor = debounce(200, async () => {
  await refreshData()
})

// The Ace editor container..
let aceContainer = html`<div class="editor" id="editorHolder"
  style=${`flex:1;height:${window.innerHeight}`}></div>`.onReady( (tpl) => {
    const aceHolder = getAceHolder()
    tpl.ids.editorHolder.appendChild( aceHolder.aceDOMContainer )
  });

const defaultEditor = ( (state) => {
  return html`<div>${aceContainer}</div>`
})

const editorArea = (state) => {

  if(!state.loaded) {
    return html`<div>Loading...</div>`
  }

  const fileMeta = getFileMetadata()
  const editorName = ( fileMeta && fileMeta.editor ) || ''
  const editorFn = state.editors[editorName] || defaultEditor
  
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


export const initialize = () => {
  Doremifa.mount(document.body, state => html`
  <div style="display:flex;">
    <div class="filebrowser">
      ${Doremifa.router({  
        file : showFolders
      })}
    </div>
    ${editorArea(state)}
  </div>`.onReady(loadEditor));  
}

