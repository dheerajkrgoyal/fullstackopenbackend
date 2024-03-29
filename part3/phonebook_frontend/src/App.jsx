import { useEffect, useState } from "react"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import personService from "./services/persons"
import Notification from "./components/Notification"
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [userMessage, setUserMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  const filteredPerson = persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const setNotification = (notificationMessage, error) => {
    setIsError(error)
    setUserMessage(notificationMessage)
    setTimeout(() => {
      setUserMessage(null)
    }, 2000)
  }

  useEffect(()=> {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        setNotification('Error loading data from the server. Please try later')
      })
  },[])

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const duplicate = persons.find(person => person.name === newName)
    if(!duplicate){
      const newPerson = {name: newName, number: newNumber}
      personService
        .create(newPerson)
        .then(createdObj => {
          setPersons(persons.concat(createdObj))
          setNotification(`Added ${newName}`, false)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setNotification(error.response.data.error, true)
        })
    }else{
      if(duplicate.number !== newNumber){
        if(confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
          const updateObj = {...duplicate, number: newNumber}
          personService
            .update(updateObj.id, updateObj)
            .then(updatedObj => {
              setPersons(persons.map(person => person.id !== updatedObj.id? person : updatedObj))
              setNotification(`${newName} is updated with new number ${newNumber}`, false)
            })
            .catch(error => {
              setNotification(error.response.data.error, true)
            })
          setNewName('')
          setNewNumber('')
        }
      }
      else{
        alert('Details already exist in the server')
        setNewName('')
        setNewNumber('')
      }
    } 
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification userMessage={userMessage} isError={isError} />
      <Filter searchTerm={searchTerm} handleSearchTerm={handleSearchTerm}/>
      
      <h3>Add a new</h3>
      <PersonForm handleSubmit={handleSubmit} newName={newName} handleNewName={handleNewName} newNumber={newNumber} handleNewNumber={handleNewNumber}/>
      
      <h3>Numbers</h3>
      <Persons filteredPerson={filteredPerson} persons={persons} setPersons={setPersons}/>
    </div>
  )

}

export default App