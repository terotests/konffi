
import { 
  startServer
} from './fs/server'

startServer({
  path : process.env.KONFFI || process.cwd(),
  port : 3000
})


  