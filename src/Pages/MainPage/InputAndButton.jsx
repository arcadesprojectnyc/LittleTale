import React from 'react';
import { useNavigate } from 'react-router-dom';

class InputAndButtonClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };
    }

    handleInputChange = (event) => {
        this.setState({ value: event.target.value });
    }

    handleButtonClick = () => {
        if (this.state.value == "") {
            alert(`Input the token to start writing`);
        } else {
            let path = "/select-page/" + this.state.value
            this.props.navigateTo(path);
        }
    }

    render() {
        return (
            <div>
                <p style={{ fontSize: '20px' }}>Input OpenAI's Token below and start writing:</p>
                <input type="text" value={this.state.value} onChange={this.handleInputChange} />
                <button onClick={this.handleButtonClick}>Start Writing</button>
            </div>
        );
    }
}

const InputAndButton = () => {
    const navigate = useNavigate();
    return <InputAndButtonClass navigateTo={(value) => navigate(value)} />;
};

export default InputAndButton;