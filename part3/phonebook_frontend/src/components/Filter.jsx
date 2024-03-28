const Filter = ({searchTerm, handleSearchTerm}) => {
    return (
        <div>
            Filter shown with <input value={searchTerm} onChange={handleSearchTerm}/>
        </div>
    )
}

export default Filter