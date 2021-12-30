import React from "react";
import { connect } from "react-redux";
import * as contextActions from "../../redux/actions/contextActions";
// Prop types helps us specify that props that our component accepts
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import ContextsList from "./ContextsList";

class ContextsPage extends React.Component {
  componentDidMount() {
    this.props.actions.loadContexts().catch((error) => {
      alert(error);
    });
  }

  render() {
    return (
      <>
        <h2>Contexts</h2>
        <ContextsList contexts={this.props.contexts}></ContextsList>
      </>
    );
  }
}

ContextsPage.propTypes = {
  contexts: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

// This determines what part of the State we expose to the component
function mapStateToProps(state) {
  return {
    contexts: state.contexts,
  };
}

// Map the call to dispatch into the props for cleaner dispatch
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(contextActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContextsPage);
