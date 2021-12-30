import React from "react";
import { connect } from "react-redux";
import * as tomatoActions from "../../redux/actions/tomatoActions";
// Prop types helps us specify that props that our component accepts
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";

class TomatoesPage extends React.Component {
  render() {
    return (
      <>
        <h2>Tomatoes</h2>
        {this.props.tomatoes.map((tomato) => (
          <div key={tomato.description}> {tomato.description}</div>
        ))}
      </>
    );
  }
}

TomatoesPage.propTypes = {
  tomatoes: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

// This determines what part of the State we expose to the component
function mapStateToProps(state) {
  return {
    tomatoes: state.tomatoes,
  };
}

// Map the call to dispatch into the props for cleaner dispatch
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(tomatoActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TomatoesPage);
