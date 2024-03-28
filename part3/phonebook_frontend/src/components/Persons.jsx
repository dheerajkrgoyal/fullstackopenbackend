import personService from "../services/persons"

const Persons = ({filteredPerson, persons, setPersons}) => {
    const handleDelete = (id, name) => {
        if(confirm(`Delete ${name}?`)){
            personService.deletePerson(id)
            .then(deletedObj => {
                setPersons(persons.filter(person => person.id !== deletedObj.id))
            })
        }
    }

    return (
        <div>
            {filteredPerson.map(person => 
                <div key={person.name}>{person.name} {person.number} <button onClick = {() => handleDelete(person.id, person.name)}>Delete</button></div>
            )}
        </div>
    )
}

export default Persons