import {VscBold} from 'react-icons/vsc'
import {GoItalic} from 'react-icons/go'
import {AiOutlineUnderline} from 'react-icons/ai'
import {Component} from 'react'
import {
  AppContainer,
  EditorContainer,
  SideImage,
  Heading,
  Toolbar,
  ButtonItem,
  BoldBtn,
  ItalicBtn,
  UnderlineBtn,
  TextArea,
} from './styledComponent'

class TextEditor extends Component {
  state = {bold: false, italic: false, underline: false}

  changeBold = () => {
    this.setState(prevState => ({bold: !prevState.bold}))
  }

  changeItalic = () => {
    this.setState(prevState => ({italic: !prevState.italic}))
  }

  changeUnderline = () => {
    this.setState(prevState => ({underline: !prevState.underline}))
  }

  render() {
    const {bold, italic, underline} = this.state

    return (
      <AppContainer>
        <SideImage
          src="https://assets.ccbp.in/frontend/react-js/text-editor-img.png"
          alt="text editor"
        />
        <EditorContainer>
          <Heading>Text Editor</Heading>
          <Toolbar>
            <ButtonItem>
              <BoldBtn
                onClick={this.changeBold}
                active={bold}
                data-testid="bold"
              >
                <VscBold size={20} />
              </BoldBtn>
            </ButtonItem>
            <ButtonItem>
              <ItalicBtn
                onClick={this.changeItalic}
                active={italic}
                data-testid="italic"
              >
                <GoItalic size={20} />
              </ItalicBtn>
            </ButtonItem>
            <ButtonItem>
              <UnderlineBtn
                onClick={this.changeUnderline}
                active={underline}
                data-testid="underline"
              >
                <AiOutlineUnderline size={20} />
              </UnderlineBtn>
            </ButtonItem>
          </Toolbar>
          <TextArea
            rows="15"
            cols="60"
            activeBold={bold}
            activeItalic={italic}
            activeUnderline={underline}
            placeholder="Start typing here..."
          />
        </EditorContainer>
      </AppContainer>
    )
  }
}

export default TextEditor

//styledComponent
import styled from 'styled-components'

export const AppContainer = styled.div`
  display: flex;
  background-color: #000; /* Black background */
  min-height: 100vh;
  padding: 40px;
  color: #ffffff;
  font-family: Arial, sans-serif;
`

export const SideImage = styled.img`
  width: 300px;
  height: auto;
  margin-right: 40px;
`

export const EditorContainer = styled.div`
  flex-grow: 1;
`

export const Heading = styled.h1`
  color: #ffffff;
  font-size: 28px;
  margin-bottom: 20px;
`

export const Toolbar = styled.ul`
  list-style: none;
  display: flex;
  padding: 0;
  margin-bottom: 20px;
  gap: 15px;
`

export const ButtonItem = styled.li``

// Shared button style
const BaseBtn = styled.button`
  color: ${props => (props.active ? '#000' : '#fff')};
  background-color: ${props => (props.active ? '#faff00' : 'transparent')};
  border: 1px solid #faff00;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #faff00;
    color: #000;
  }

  &:focus {
    outline: none;
  }
`

export const BoldBtn = styled(BaseBtn)``
export const ItalicBtn = styled(BaseBtn)``
export const UnderlineBtn = styled(BaseBtn)``

export const TextArea = styled.textarea`
  width: 100%;
  height: 250px;
  background-color: #1e1e1e;
  color: white;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  resize: none;

  font-weight: ${props => (props.activeBold ? 'bold' : 'normal')};
  font-style: ${props => (props.activeItalic ? 'italic' : 'normal')};
  text-decoration: ${props => (props.activeUnderline ? 'underline' : 'none')};

  &:focus {
    outline: none;
    border-color: #faff00;
  }
`
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//RegisterContext.js
import React from 'react'

const HistoryContext = React.createContext({
  isRegister: false,
  changeRegistrationStatus: () => {},
  name: '',
  updateName: () => {},
  topic: '',
  updateTopic: () => {},
  registerErr: false,
  updateErr: () => {},
})

export default HistoryContext


//Home Component
//index.js

import {Link} from 'react-router-dom'
import HistoryContext from '../../Context/RegisterContext'
import {
  MainDiv,
  BeforeRegisH1,
  BeforeRegisP,
  BeforeRegisBtn,
  BeforeRegisImg,
  AfterRegisImg,
  AfterRegisH1,
  AfterRegisP,
} from './styledComponent'
import NavBar from '../NavBar'

const Home = props => {
  const onClickRegister = () => {
    const {history} = props
    history.replace('/register')
  }

  const renderBeforeRegisteredView = () => (
    <>
      <BeforeRegisH1>Welcome to Meetup</BeforeRegisH1>
      <BeforeRegisP>Please register for the topic</BeforeRegisP>
      <Link to="/register">
        <BeforeRegisBtn onClick={onClickRegister}>Register</BeforeRegisBtn>
      </Link>
      <BeforeRegisImg
        src="https://assets.ccbp.in/frontend/react-js/meetup/meetup-img.png"
        alt="meetup"
      />
    </>
  )

  const renderAfterRegisteredView = (name, topic) => (
    <>
      <AfterRegisH1>{`Hello ${name}`}</AfterRegisH1>
      <AfterRegisP>{`Welcome to ${topic}`}</AfterRegisP>
      <AfterRegisImg
        src="https://assets.ccbp.in/frontend/react-js/meetup/meetup-img.png"
        alt="meetup"
      />
    </>
  )

  return (
    <HistoryContext.Consumer>
      {value => {
        const {isRegister, name, topic} = value
        return (
          <>
            <NavBar />
            <MainDiv>
              {isRegister
                ? renderAfterRegisteredView(name, topic)
                : renderBeforeRegisteredView()}
            </MainDiv>
          </>
        )
      }}
    </HistoryContext.Consumer>
  )
}

export default Home

// styledComponents.js
import styled from 'styled-components'

export const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`

export const BeforeRegisH1 = styled.h1`
  font-size: 50px;
  font-weight: 700;
  margin: 0px;
  color: #334155;
  margin-bottom: 15px;
`

export const BeforeRegisP = styled.p`
  font-size: 24px;
  margin: 0px;
  font-weight: 700;
  margin-bottom: 25px;
  color: #475569;
`

export const BeforeRegisBtn = styled.button`
  background-color: #2563eb;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  height: 40px;
  width: 120px;
  margin-bottom: 25px;
  cursor: pointer;
`

export const BeforeRegisImg = styled.img`
  height: 350px;
  width: 60%;
`

export const AfterRegisImg = styled.img`
  height: 350px;
  width: 60%;
`

export const AfterRegisH1 = styled.p`
  font-size: 70px;
  font-weight: 700;
  color: #3b82f6;
  margin: 0px;
  margin-bottom: 10px;
`

export const AfterRegisP = styled.p`
  font-size: 34px;
  font-weight: 700;
  margin: 0px;
  margin-bottom: 25px;
  color: #334155;
`


//NavBar Component
//index.js

import {Navbar, Logo} from './styledComponent' // Adjust the path if necessary

const NavBar = () => (
  <Navbar>
    <Logo
      src="https://assets.ccbp.in/frontend/react-js/meetup/website-logo-img.png"
      alt="website logo"
    />
  </Navbar>
)

export default NavBar

//styledComponent.js
import styled from 'styled-components'

export const Navbar = styled.nav`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 70px;
  padding-left: 20px;
  box-sizing: border-box;
  background-color: #ffffff;
`

export const Logo = styled.img`
  height: 60%;
  max-height: 50px;
  object-fit: contain;
`

//NotFound Component
//index.js
import {
  NotFoundDiv,
  NotFoundImg,
  NotFoundH1,
  NotFoundP,
} from './styledComponent'

const NotFound = () => (
  <NotFoundDiv>
    <NotFoundImg
      src="https://assets.ccbp.in/frontend/react-js/meetup/not-found-img.png"
      alt="not found"
    />
    <NotFoundH1>Page Not Found</NotFoundH1>
    <NotFoundP>
      We are sorry, the page you requested could not be found
    </NotFoundP>
  </NotFoundDiv>
)

export default NotFound

// styledComponent.js
import styled from 'styled-components'

export const NotFoundDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
`

export const NotFoundImg = styled.img`
  width: 50%;
  max-width: 500px;
`

export const NotFoundH1 = styled.h1`
  font-size: 34px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 10px;
`

export const NotFoundP = styled.p`
  font-size: 24px;
  font-weight: 500;
  color: #7b8794;
  margin-bottom: 10px;
`

//Rigister Component
//index.js
import NavBar from '../NavBar'
import HistoryContext from '../../Context/RegisterContext'
import {
  MainDiv,
  RegisterCardDiv,
  RegisterImg,
  RegisterForm,
  FormH1,
  Label,
  Input,
  Select,
  Option,
  FormBtn,
  ErrP,
} from './styledComponent'

const topicsList = [
  {id: 'ARTS_AND_CULTURE', displayText: 'Arts and Culture'},
  {id: 'CAREER_AND_BUSINESS', displayText: 'Career and Business'},
  {id: 'EDUCATION_AND_LEARNING', displayText: 'Education and Learning'},
  {id: 'FASHION_AND_BEAUTY', displayText: 'Fashion and Beauty'},
  {id: 'GAMES', displayText: 'Games'},
]

const Register = props => (
  <HistoryContext.Consumer>
    {value => {
      const {
        changeRegistrationStatus,
        updateName,
        updateTopic,
        topic,
        name,
        registerErr,
        updateErr,
      } = value

      const submitForm = event => {
        event.preventDefault()
        if (name !== '' && topic !== '') {
          changeRegistrationStatus()
          const {history} = props
          history.replace('/')
        } else {
          updateErr(true)
        }
      }

      const onChangeTopic = event => {
        updateTopic(event.target.value)
      }

      const onChangeName = event => {
        updateName(event.target.value)
      }

      return (
        <>
          <NavBar />
          <MainDiv>
            <RegisterCardDiv>
              <RegisterImg
                src="https://assets.ccbp.in/frontend/react-js/meetup/website-register-img.png"
                alt="website register"
              />
              <RegisterForm onSubmit={submitForm}>
                <FormH1>Let us join</FormH1>

                <Label htmlFor="name">NAME</Label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  placeholder="Your name"
                  onChange={onChangeName}
                />

                <Label htmlFor="topic">TOPICS</Label>
                <Select id="topic" value={topic} onChange={onChangeTopic}>
                  {topicsList.map(each => (
                    <Option key={each.id} value={each.id}>
                      {each.displayText}
                    </Option>
                  ))}
                </Select>

                <FormBtn type="submit">Register Now</FormBtn>
                {registerErr && <ErrP>Please enter your name</ErrP>}
              </RegisterForm>
            </RegisterCardDiv>
          </MainDiv>
        </>
      )
    }}
  </HistoryContext.Consumer>
)

export default Register

//styledComponents
import styled from 'styled-components'

export const MainDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding: 20px;
`

export const RegisterCardDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 80%;
  height: 70vh;
`

export const RegisterImg = styled.img`
  width: 40%;
`

export const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 60%;
  align-items: flex-start;
  margin-top: 20px;
`

export const FormH1 = styled.h1`
  font-size: 50px;
  font-weight: 500;
  margin: 0px;
  color: #334155;
  margin-bottom: 15px;
`

export const Label = styled.label`
  font-size: 16px;
  font-weight: 700;
  color: #768794;
  margin-bottom: 10px;
`

export const Input = styled.input`
  font-size: 16px;
  font-weight: 700;
  color: #7b8794;
  height: 40px;
  width: 50%;
  outline: none;
  padding-left: 15px;
  border: 1px solid #768794;
  margin-bottom: 30px;
`

export const Select = styled.select`
  font-size: 16px;
  background-color: transparent;
  font-weight: 700;
  color: #334155;
  height: 40px;
  width: 50%;
  padding-left: 15px;
  outline: none;
  border: 1px solid #7b8794;
  margin-bottom: 30px;
`

export const Option = styled.option`
  font-size: 16px;
  font-weight: 700;
  color: #334155;
`

export const FormBtn = styled.button`
  background-color: #2563eb;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  height: 40px;
  width: 200px;
  margin-bottom: 25px;
  cursor: pointer;
  margin-top: 20px;
`

export const ErrP = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #ff0b37;
  margin: 0px;
`

//App.js
// App.js
import {Component} from 'react'
import {Switch, Route} from 'react-router-dom'
import './App.css'
import HistoryContext from './Context/RegisterContext'
import Home from './components/Home'
import Register from './components/Register'
import NotFound from './components/NotFound'

class App extends Component {
  state = {
    isRegister: false,
    name: '',
    topic: 'Arts and Culture',
    registerErr: false,
  }

  changeRegistrationStatus = () => {
    this.setState({isRegister: true})
  }

  updateName = updateName => {
    this.setState({name: updateName})
  }

  updateTopic = updateTopic => {
    this.setState({topic: updateTopic})
  }

  updateErr = response => {
    this.setState({registerErr: response})
  }

  render() {
    const {isRegister, name, topic, registerErr} = this.state
    return (
      <HistoryContext.Provider
        value={{
          isRegister,
          changeRegistrationStatus: this.changeRegistrationStatus,
          name,
          topic,
          updateName: this.updateName,
          updateTopic: this.updateTopic,
          registerErr,
          updateErr: this.updateErr,
        }}
      >
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route component={NotFound} />
        </Switch>
      </HistoryContext.Provider>
    )
  }
}

export default App
