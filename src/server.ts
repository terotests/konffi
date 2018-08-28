
import { 
  readFolder, 
  readFileContent, 
  getProjects, 
  findProject, 
  readDir, 
  readProjectFile,
  saveProjectFile,
} from './fs/server'

// Interesting:
// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API


function _start_server()  {
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
    console.log('at savefile...')
    const project = await findProject( req.params.id )
    res.json( await saveProjectFile( project, req.body.path, req.body.content ) )
  })
  app.use(express.static('static'))
  app.listen(3000)
}
_start_server()
 
  