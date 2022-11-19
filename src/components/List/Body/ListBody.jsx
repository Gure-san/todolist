import EmptyListCover from './EmptyListCover';
import { ListMenu, LISTMENU_TYPE} from './ListMenu';
import { Separator, SEPARATOR_TYPE } from './Separator';

export default function ListBody() {
  return (
    <section>
      <Separator 
      type={SEPARATOR_TYPE.NORMAL} 
      extraStyle={"my-6 bg-extra-100"} />
      <ListMenu type={LISTMENU_TYPE.COLLAPSIBLE}/>
    </section>
  )
}