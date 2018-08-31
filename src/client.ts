
import * as Doremifa from 'doremifa'
import * as UI from './editors/ui'
import * as ACE from './editors/ace'
import * as API from './editors/api'
import  {
  initialize
} from './editors/main'

Doremifa.setState(
  {
    editors : {
      "tables" : UI.tablesView,
      "boxes" : UI.boxesView,
      "tsconfig" : UI.tsConfigView,
      "package" : (state) => {
        ACE.updateAceEditor( API.getCurrentFile() )
        return Doremifa.html`
<div>Editor for package.json</div>  
${ACE.getACETemplate()}
        `
      }
  } 
})
initialize()
