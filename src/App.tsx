
import React from 'react';
import NavBar from './components/NavBar/NavBar'
import ToolBox from './components/ToolBox/ToolBox'
import './App.css'
import GraphSchematics from './components/GraphSchematics/GraphSchematics';
import DataBar from './components/DataBar/DataBar';
import GraphSchematicsManager from './components/GraphSchematics/GraphSchematicsManager';
import { Toaster } from 'react-hot-toast';
import { IntlProvider } from 'react-intl';
import { LOCALES } from './i18n/locales';
import { Locale, messages } from "./i18n/messages";
import { Subject } from 'rxjs';


export default class App extends React.Component {
  private static changeLanguageSubject = new Subject<Locale>();

  state = {
    isPlaying: false,
    locale: LOCALES.PORTUGUESE
  };

  componentDidMount() {
    const getDefaultLocale = (): Locale => {
      const language = navigator.language || navigator.languages[0];
      return language.startsWith('pt') ? 'pt' : 'en';
    };
    this.setState({locale: getDefaultLocale()});
    App.changeLanguageSubject.subscribe((locale: Locale) => this.setState({locale}))
  }

  static changeLanguage(locale: Locale) {
    App.changeLanguageSubject.next(locale);
  }


  onChangePlayState = (state: boolean) => {
    this.setState({ isPlaying: state });
    GraphSchematicsManager.setPlayOrStop(state);
  }

  onKeyPressed(event: any) {
    const keycodeStatistics = "KeyS";
    if (event.code === keycodeStatistics) {
      this.forceUpdate();
    }
  }

  render() {
    const { locale } = this.state;
    return (
      <div id="app" className="App" tabIndex={0} onKeyDown={(event) => this.onKeyPressed(event)}>
        <IntlProvider
          messages={messages[locale]}
          locale={locale}
          defaultLocale={LOCALES.PORTUGUESE}
        >
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontSize: '14px', 
              background: '#333',
              color: '#fff',
              padding: '10px',
              borderRadius: '8px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
            },
            success: {
              style: {
                background: '#4caf50',
              },
            },
            error: {
              style: {
                background: '#f44336',
              },
            },
          }}
        />
        <NavBar></NavBar>
        <ToolBox callbackPlaying={this.onChangePlayState}></ToolBox>
        <div className='control'>
          <div className='control-top' onMouseDown={() => GraphSchematicsManager.controlMoveUp()}>▲</div>
          <div className='control-left' onMouseDown={() => GraphSchematicsManager.controlMoveLeft()}>◀</div>
          <div className='control-center' onMouseDown={() => GraphSchematicsManager.controlToCenter()}></div>
          <div className='control-right' onMouseDown={() => GraphSchematicsManager.controlMoveRight()}>▶</div>
          <div className='control-bottom' onMouseDown={() => GraphSchematicsManager.controlMoveDown()}>▼</div>
        </div>
        <GraphSchematics></GraphSchematics>
        <DataBar></DataBar>
        </IntlProvider>
      </div>
    );
  }
}
