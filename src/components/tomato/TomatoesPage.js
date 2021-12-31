import React from "react";
import { connect } from "react-redux";
import * as tomatoActions from "../../redux/actions/tomatoActions";
// Prop types helps us specify that props that our component accepts
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import * as itemService from "../../services/itemService";
import * as dsService from "../../services/dsService";

itemService.getItems().then((s) => {
  console.log(s);
});

itemService.getItemById("53440160-326a-11eb-8521-0b87dfab7e46").then((s) => {
  console.log(s);
});

dsService.getContexts().then((s) => {
  console.log(s);
});

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
