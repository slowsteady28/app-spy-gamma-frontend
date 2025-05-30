function Message () {
    const name = "";
    if (name) 
        return <h1>Hello {name}</h1> 
    return (
        <div className="message">
        <h1>Message</h1>
        <p>This is a message component.</p>
        </div>
    )
}

export default Message