
import * as Doremifa from 'doremifa'
import * as UI from './editors/ui'
import  {
  initialize
} from './editors/main'

Doremifa.setState(
  {
    editors : {
      "tables" : UI.tablesView,
      "boxes" : UI.boxesView,
      "tsconfig" : UI.tsConfigView
  } 
})
initialize()
