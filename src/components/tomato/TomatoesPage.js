import React from "react";
import { connect } from "react-redux";
import * as tomatoActions from "../../redux/actions/tomatoActions";
// Prop types helps us specify that props that our component accepts
import PropTypes from "prop-types";

class TomatoesPage extends React.Component {
  state = {
    tomato: {
      description: "initial description",
    },
  };

  handleChange = (event) => {
    const tomato = { ...this.state.tomato, description: event.target.value };
    this.setState({ tomato: tomato });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    debugger;
    this.props.dispatch(tomatoActions.createTomato(this.state.tomato));
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Tomatoes</h2>
        <h3>Save Tomato</h3>
        <input
          type="text"
          onChange={this.handleChange}
          value={this.state.tomato.description}
        ></input>

        <input type="submit" value="Save"></input>
        {this.props.tomatoes.map((tomato) => (
          <div key={tomato.description}> {tomato.description}</div>
        ))}
      </form>
    );
  }
}

TomatoesPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  tomatoes: PropTypes.array.isRequired,
};

// This determines what part of the State we expose to the component
function mapStateToProps(state) {
  return {
    tomatoes: state.tomatoes,
  };
}

export default connect(mapStateToProps)(TomatoesPage);
