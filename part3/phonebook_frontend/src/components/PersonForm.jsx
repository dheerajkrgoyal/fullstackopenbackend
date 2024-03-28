const PersonForm = (props) => {
    return (
        <form onSubmit={props.handleSubmit}>
            <div>
            Name: <input value={props.newName} onChange={props.handleNewName}/>
            </div>
            <div>
            Number: <input value={props.newNumber} onChange={props.handleNewNumber}/>
            </div>
            <div>
            <button type='submit'>Add</button>
            </div>
        </form>
    )
}

export default PersonForm