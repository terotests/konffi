import {ServerFile} from '../model'
import * as Doremifa from 'doremifa'
import {
  getCurrentFile,
  getCurrentFolder,
  getFileMetadata,
  findFile,
  findRoot,
  forDirectory
} from './api'

const aceState = {
  fileid : '',
}

export interface ACEContainer {
  aceDOMContainer : HTMLElement
  aceDOM : HTMLElement
}

export const createAceContainer = () : ACEContainer => {
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

// only one ace editor for now...
let aceEditor = null
let settingValue = false
const aceHolder = createAceContainer()

export const getAceHolder = () : ACEContainer => {
  return aceHolder
}
// The ACE editor updater
export const updateAceEditor = ( theFile:ServerFile ) => {

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

aceEditor = ace.edit(aceHolder.aceDOM);
aceEditor.setTheme("ace/theme/monokai");
aceEditor.session.setMode("ace/mode/typescript");

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
    Doremifa.setState({currentFile:{
      ...state.currentFile,
      contents : strnow
    }})  
  } else {
    console.log('did not set state for editor change... settingValue', settingValue)
    console.log(state)
  }
});