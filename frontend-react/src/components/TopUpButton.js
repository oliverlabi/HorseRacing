import './styles/TopUpButton.css';

const TopUpButton = () => {
    return (
        <div className='circle' onContextMenu={(e)=> e.preventDefault()}>
            <p
                style={{
                    color: 'white', 
                    paddingTop: '30px',
                    userSelect: 'none',
                    fontSize: '25px'
                }}
            > +1 c
            </p>
        </div>
    )
}

export default TopUpButton;