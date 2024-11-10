import './User.css'

const User = (props) => {
    return (
        <div className='Usuario'>
            <h2>Usuario: {props.usuario}</h2>
            <hr></hr>
        </div>
    );
}

export default User