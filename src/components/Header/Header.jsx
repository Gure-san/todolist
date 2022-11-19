import { ReactComponent as BrandDark } from '../../assets/Brand/appNameDark.svg';
import { ReactComponent as BrandLight } from '../../assets/Brand/appNameLight.svg';
import moonLight from '../../assets/Theme/moon-light.png';
import moonDark from '../../assets/Theme/moon-dark.png';
import sunLight from '../../assets/Theme/sun-light.png';
import sunDark from '../../assets/Theme/sun-dark.png';
import switchDark from '../../assets/Swap-Component-Position/swap-dark.png';
import switchLight from '../../assets/Swap-Component-Position/swap-light.png';
import { 
  CONFIG_ACTIONS, 
  INITIAL_APP_CONFIG, 
  SECTION_COMPONENT, 
  THEME_VARIANTS
} from '../../provider';

const WIDTH_ICON = 20;
const HEIGHT_ICON = 20;

function eventAppConfig({dispatch, appData, configType, value}) {
  let payload;

  switch(configType) {
    case CONFIG_ACTIONS.THEME :
      payload = {
        ...appData,
        theme : value
      }
      break;

    case CONFIG_ACTIONS.SWAP :

    default : 
      payload = null;
      break;
  }

  console.log(payload)

  return dispatch({
    section : SECTION_COMPONENT.APP,
    payload
  })
}

function Header({appData, dispatchApp}) {
  const { theme } = appData;
  let themeValueForDispatchApp, 
  titleThemeToggle, 
  srcThemeToggle,
  srcSwitchPosition,
  styleAppConfigBtns;

  if(theme === THEME_VARIANTS.DARK_MODE) {
    themeValueForDispatchApp = THEME_VARIANTS.LIGHT_MODE;
    titleThemeToggle = 'Light Mode';
    srcThemeToggle = sunDark;
    srcSwitchPosition = switchDark;
    styleAppConfigBtns = 'dark:bg-secondary-100 dark:hover:bg-secondary-150 dark:border-secondary-150 dark:shadow-primary dark:shadow-[inset_0px_0px_1rem_bg-primary]';
  }

  if(theme === THEME_VARIANTS.LIGHT_MODE) {
    themeValueForDispatchApp = THEME_VARIANTS.DARK_MODE,
    titleThemeToggle = 'Dark Mode',
    srcThemeToggle = moonLight,
    srcSwitchPosition = switchLight;
    styleAppConfigBtns = 'bg-tertiary-100 hover:bg-tertiary-150  border-tertiary-150 shadow-tertiary-150 shadow-[inset_0px_0px_1rem_bg-tertiary-150]';
  }

  return (
    <section 
    className='bg-inherit flex justify-between items-center py-8'>
      {/* Brand Name / App Name */}
      <div 
      className=''>
        {theme === THEME_VARIANTS.DARK_MODE ?  
        <BrandDark/> :
        <BrandLight/> }
      </div>

      {/* App Configuration */}
      <div 
      className=''>
        {/* Theme Toggle */}
        <button
        onClick={() => eventAppConfig({
          dispatch : dispatchApp,
          configType : CONFIG_ACTIONS.THEME,
          value : themeValueForDispatchApp,
          appData
        })}
        title={titleThemeToggle}
        className={`${styleAppConfigBtns} selection:bg-transparent p-2.5 rounded-full cursor-pointer duration-100 border-2 mr-2.5 active:translate-y-0.5`}>
          <img 
          src={srcThemeToggle} 
          height={HEIGHT_ICON} 
          width={WIDTH_ICON} />
        </button>

        {/* Swap Component Posistion */}
        <button
        title='Switch Position'
        className={`${styleAppConfigBtns} selection:bg-transparent p-2.5 rounded-full cursor-pointer duration-100 border-2  active:translate-y-0.5`}>
          <img 
          height={HEIGHT_ICON} 
          width={WIDTH_ICON}
          src={srcSwitchPosition} />
        </button>
      </div>
    </section>
  )
}

export {
  Header
}

