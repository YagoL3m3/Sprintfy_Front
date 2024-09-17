import './User.css'

const User = (props) => {
    return (
        <div className='Usuario'>
            <h2>Usuario: {props.usuario}</h2>
            <h3>ID: {props.Id}</h3>
            <hr></hr>
        </div>
    );
}

export default User