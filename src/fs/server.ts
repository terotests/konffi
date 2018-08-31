
import { FileContent, ServerFile, ServerProject } from '../model'
import { read } from 'fs';

export interface ServerOptions {
  port : number,
  path : string,
}

const ignore_folders = [
  'node_modules',
  '.git'
]
const fileHash = {}
var crypto = require('crypto');
const createHash = (data) => crypto.createHash('md5').update(data).digest("hex")

const getFile = (hash) => {
  return fileHash[hash]
}

const mkdir = (path:string) => {
  const fs = require('fs')
  const fPath = require('path')
  const parts:string[] = fPath.normalize(path).split('/')
  let curr_path = ''
  for( let p of parts ) {
    curr_path = curr_path + p + '/'
    if(!fs.existsSync(curr_path)) {
      fs.mkdirSync(curr_path);
    }
  }
}

const projects : ServerProject[] = []


export async function getProjects() : Promise<ServerProject[]> {
  return projects
}

export async function findProject( id:string ) : Promise<ServerProject> {
  return projects.filter( p => p.id === id ).pop()
}

// TODO: use file ID values
export async function readFileContent( id:string ) : Promise<FileContent> {
  // TODO: Check that the folder is allowed

  const fileObj = fileHash[ id ]
  if( fileObj ) {
    const fs = require('fs')
    const fsPath = require('path')
    return fs.readFileSync( fileObj.full_path, 'utf8')  
  }
  return {
    text : ''
  }
}

const read_dir = async (path:string, parent:ServerFile, recursive = false ) : Promise<ServerFile[]> => {

  const fs = require('fs')
  const fsPath = require('path')  
  const res : ServerFile[] = []
  
  for( let file of fs.readdirSync(path) ) {
    const full_path = fsPath.normalize( path + '/' + file )
    const obj = {
      id : createHash(full_path),
      name : file,
      path : '',
      full_path,
      is_file : true,
      is_folder : false,
      typename : 'file',
      exttype : fsPath.extname(full_path),
      files : []
    }
    fileHash[obj.id] = obj
    const stat = fs.lstatSync(full_path)
    obj.is_folder = stat.isDirectory()
    obj.is_file = stat.isFile()
    obj.typename = obj.is_folder ? 'folder' : 'file'

    // add the file to the parent folder
    parent.files.push( obj )

    if(obj.is_folder && recursive) {
      await read_dir( obj.full_path, obj )
    }
  }
/*
stats.isFile()
stats.isDirectory()
stats.isBlockDevice()
stats.isCharacterDevice()
stats.isSymbolicLink() (only valid with fs.lstat())
stats.isFIFO()
stats.isSocket()
*/   
  return res

}


export async function readFolder( path:string, recursive:boolean = false ) : Promise<ServerFile> {

  // TODO: Check that the folder is allowed

  const fs = require('fs')
  const fsPath = require('path')
  const root_path = fsPath.normalize( path + '/')
  const root = {
    id : createHash(root_path),
    path : '',
    name : '/',
    full_path : root_path,
    is_file : false,
    is_folder : true,
    typename : 'folder',
    exttype : '',
    files : []
  }  
  await read_dir( path, root, recursive )
  return root
}

export async function readDirectory( id:string ) : Promise<FileContent> {
  // TODO: Check that the folder is allowed

  const fileObj = fileHash[ id ]
  if( fileObj ) {
    const fs = require('fs')
    const fsPath = require('path')
    return fs.readFileSync( fileObj.full_path, 'utf8')  
  }
  return {
    text : ''
  }
}

const readProjectFolder = async (project:ServerProject, path:string, recursive = false, parent? : ServerFile ) : Promise<ServerFile> => {

  const fs = require('fs')
  const fsPath = require('path')  
  const root_path = fsPath.normalize( project.full_path + '/' + path + '/')

  let root:ServerFile = {
    id : createHash(root_path),
    path : path,
    name : path,
    full_path : root_path,
    is_file : false,
    is_folder : true,
    typename : 'folder',
    exttype : '',
    files : []
  } 
  if(parent) root = parent;
  
  for( let file of fs.readdirSync(root_path) ) {
    const full_path = fsPath.normalize( root_path + '/' + file )
    const stat = fs.lstatSync(full_path)
    const is_dir = stat.isDirectory()
    const obj = {
      id : createHash(full_path),
      name : file,
      path : fsPath.normalize( path +'/' + file ),
      full_path,
      is_file : true,
      is_folder : false,
      typename : 'file',
      exttype : fsPath.extname(full_path),
      files : [],
      contents : ''
    }
    fileHash[obj.id] = obj
    obj.is_folder = stat.isDirectory()
    obj.is_file = stat.isFile()
    obj.typename = obj.is_folder ? 'folder' : 'file'

    // read all contents
    if(obj.is_file) {
      obj.contents = fs.readFileSync( obj.full_path, 'utf8') 
    }

    if(ignore_folders.indexOf(obj.name) < 0 ) {      
      root.files.push( obj )
    }

    if(recursive && obj.is_folder) {
      // filter node_modules away from this...
      if(obj.path.indexOf('node_modules') < 0 ) {
        readProjectFolder( project, obj.path, recursive, obj )
      }
    }

  }
/*
stats.isFile()
stats.isDirectory()
stats.isBlockDevice()
stats.isCharacterDevice()
stats.isSymbolicLink() (only valid with fs.lstat())
stats.isFIFO()
stats.isSocket()
*/   
  return root
}

// read a directory of a project
export async function readDir( project:ServerProject, path:string, recursive = false ) : Promise<ServerFile> {

  // TODO: Check that the folder is allowed
  const fsPath = require('path')
  return await readProjectFolder( project, fsPath.normalize( path ), recursive  )
}

const _readProjectFile = async (project:ServerProject, path:string ) : Promise<ServerFile> => {

  const fs = require('fs')
  const fsPath = require('path')  
  const root_path = fsPath.normalize( project.full_path + '/' + path)
  const full_path = root_path

  return {
    id : createHash(root_path),
    path : path,
    name : fsPath.basename(path),
    full_path : root_path,
    is_file : true,
    is_folder : false,
    typename : 'file',
    exttype : fsPath.extname(full_path),
    files : [],
    contents : fs.readFileSync( full_path, 'utf8')
  } 
}
export async function readProjectFile( project:ServerProject, path:string ) : Promise<ServerFile> {

  // TODO: Check that the folder is allowed
  const fsPath = require('path')
  return await _readProjectFile( project, path )
}

// saveProjectFile

const _saveProjectFile = async (project:ServerProject, path:string, content:string ) => {

  console.log('... saving file...')
  const fs = require('fs')
  const fsPath = require('path')  
  const root_path = fsPath.normalize( project.full_path + '/' + path)

  // make sure the path does exist...
  mkdir( fsPath.dirname( root_path ))
  fs.writeFileSync(root_path, content)
}

export async function saveProjectFile( project:ServerProject, path:string, content:string ) : Promise<ServerFile> {

  // TODO: Check that the folder is allowed
  const fsPath = require('path')
  await _saveProjectFile( project, path, content )
  return await _readProjectFile( project, path )
}

export function startServer( options:ServerOptions )  {

  projects.push( {id:'1', name : 'project 1', full_path : options.path } )

  const express = require('express');
  const app = express();
  app.use(express.json()); 
  app.get('/files', async (req,res) => {
    // return something
    const data = await readFolder( process.cwd(), true )
    res.json( data )
  })
  .get('/projects/', async (req, res) => {
    res.json( await getProjects() )
  })
  // reading a project file
  .post('/folder/:id', async (req, res) => {
    const project = await findProject( req.params.id )
    res.json( await readDir(project, req.body.path, true ) )
  })
  .post('/readfile/:id', async (req,res) => {
    const project = await findProject( req.params.id )
    res.json( await readProjectFile( project, req.body.path ) )
  })
  .post('/savefile/:id', async (req,res) => {
    const project = await findProject( req.params.id )
    res.json( await saveProjectFile( project, req.body.path, req.body.content ) )
  })
  app.use(express.static('static'))
  app.listen(options.port)
}