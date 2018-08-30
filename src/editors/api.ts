import * as Doremifa from 'doremifa'
import { FileContent, ServerFile, ServerProject } from '../model'

const html = Doremifa.html;
const setState = Doremifa.setState
const getState = Doremifa.getState

// function to find certain files from the filesystem
export const forFiles = (root:ServerFile, fn:(file:ServerFile) => void ) => {
  fn(root)
  root.files.forEach( f => forFiles(f, fn ) )
}

export const findRoot = ( ) : ServerFile => {
  const state = getState()
  let res = null
  try {
    return state.projectFolders[state.currentProject.id]
  } catch(e) {
    console.error(e)
  }
  return res
  
}

export const collect = (fn:(file:ServerFile, meta?:any) => boolean ) : ServerFile[] => {
  const res = []
  try {
    // reads the active project files...
    forFiles( getState().activeProject.folder, (file)=> {
      if(fn(file, getFileMetadata(file))) res.push( file )
    })  
  } catch(e) {

  }
  return res
}

export const forDirectory = (fn:(file:ServerFile) => void ) => {
  const state = getState()
  const walk = (f:ServerFile) => {
    fn(f)
    f.files.forEach( walk )
  }
  walk( state.activeProject.folder )
}

export const findFile = ( id:string ) : ServerFile => {
  const state = getState()
  if(!state.activeProject) return null
  let found = null
  const walk = (f:ServerFile) => {
    if(found) return
    if(f.id === id) found = f
    f.files.forEach( walk )
  }
  walk( state.activeProject.folder )
  return found
}

export const getCurrentFolder = () =>  {
  return findFile( getState().params.folderid )
}

export const getCurrentFile = () =>  {
  return findFile( getState().params.fileid )
}

export const getFileMetadata = ( theFile?:ServerFile ) : any => {
  let metaData = null
  const state = getState()
  theFile = theFile || getCurrentFile()
  if(!theFile) return null
  const metaname = '/.fmeta' + theFile.path + '.fmeta'
  forFiles( state.activeProject.folder, (f) => {
    if(f.path === metaname) {
      metaData = JSON.parse(f.contents)
    }
  })
  return metaData
}