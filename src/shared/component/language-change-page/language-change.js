import { useTranslation } from 'react-i18next';
import React,{ useState } from 'react';
import EnFlag from '../../../assets/icons/flag-en.svg';
import './language-change.css';
import ArabicFlag from '../../../assets/images/flag-ua.svg';


const LanguageChange = () =>{

  const { t,i18n } = useTranslation();
  // const [lang, setLang] = useState('en');

    const [flagType, setFlagType] = useState(EnFlag);
    const engFlagLoc = '/static/media/flag-en.f2b03646.svg';
    const languageChangeHandler = (e) => {
        console.log(e.target.value);
  
        if (e.target.value === 'en') {
          console.log('eng',t('language-en'));
          setFlagType(EnFlag);
          changeLanguage(e.target.value);
        } else {
          setFlagType(ArabicFlag);
          changeLanguage(e.target.value);
          console.log('uae',t('language-arabic'));
        }
      };

 const changeLanguage = (data) => {
    // setLang(data);
    i18n.changeLanguage(data);
  };
      

   return(
       <div>
            <div
            className={
              'd-inline ' + (flagType === engFlagLoc ? 'select-div' : 'select-div')
            }
          >
            <img
              src={flagType}
              alt="En flag"
              style={{
                marginRight: '.4rem',
                height: '35px',
                width: '35px',
                borderRadius: '10px',
              }}
            />
            <select
              style={{ outline: 'none' }}
              aria-label="Default select lsnguage"
              onChange={languageChangeHandler}
            >
              <option value="en" selected>
                {t('language-en')}
              </option>
              <option value="arab">{t('language-arabic')}</option>
            </select>
          </div>
       </div>
   )
}

export default LanguageChange;
