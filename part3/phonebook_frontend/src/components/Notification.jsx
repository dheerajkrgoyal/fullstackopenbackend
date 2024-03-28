const Notification = ({userMessage, isError}) => {
    if(userMessage === null){
        return null
    }
    if(!isError && userMessage !== null){
        return (
            <div className="successMessage">
                {userMessage}
            </div>
        )
    }
    if(isError && userMessage !== null){
        return (
            <div className="errorMessage">
                {userMessage}
            </div>
        )
    }
}

export default Notification