
const SEPARATOR_TYPE = {
  NORMAL : 'normal',
  LISTNAME_LISTDATE : 'listName_listDate',
  CLEAR : 'clear'
}

function Separator({type, extraStyle = ""}) {
  switch(type) {
    case SEPARATOR_TYPE.NORMAL : 
      return (
        <hr 
        className={`border-0 h-0.5 w-full rounded-full ${extraStyle}`}/>
      )
  }
}

export {
  Separator,
  SEPARATOR_TYPE
}