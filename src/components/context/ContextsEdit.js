import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as contextActions from "../../redux/actions/contextActions";
// Prop types helps us specify that props that our component accepts
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import ContextForm from "./ContextForm";
import Loading from "../common/Loading";
import { toast } from "react-toastify";

const emptyCtx = {
  created: null,
  createdBy: null,
  default: false,
  label: "",
  private: true,
  deleted: false,
};

const ContextsEdit = ({ match, contexts, actions, ...props }) => {
  const [context, setContext] = useState({ ...props.context });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (contexts.length === 0) {
      actions.loadContexts().catch((error) => {
        alert(error);
      });
    } else {
      setContext({ ...props.context });
    }
  }, [props.context]);

  function handleChange(event) {
    const { name, value } = event.target;
    setContext((prevCtx) => ({
      ...prevCtx,
      [name]:
        name === "private" || name === "default" ? event.target.checked : value,
    }));
  }

  function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    actions
      .saveContext(context)
      .then(() => {
        console.log(toast);
        toast.success("Course saved");
        props.history.push("/contexts");
      })
      .catch((error) => {
        setSaving(false);
        setErrors({ onSave: error.message });
      });
  }

  if (contexts.length > 0) {
    return (
      <>
        <ContextForm
          context={context}
          onChange={handleChange}
          onSave={handleSave}
          errors={errors}
          saving={saving}
        ></ContextForm>
      </>
    );
  } else {
    return <Loading></Loading>;
  }
};

ContextsEdit.propTypes = {
  match: PropTypes.object.isRequired,
  contexts: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

function getContextById(contexts, id) {
  return contexts.find((ctx) => ctx.tomatoContextId === parseInt(id)) || null;
}

// This determines what part of the State we expose to the component
// Runs every time the redux store state changes
function mapStateToProps(state, ownProps) {
  const id = ownProps.match.params.id;
  const context =
    id && state.contexts.length > 0
      ? getContextById(state.contexts, id)
      : emptyCtx;

  return {
    contexts: state.contexts, // This one is actually wired up to Redux
    context,
  };
}

// Map the call to dispatch into the props for cleaner dispatch
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(contextActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContextsEdit);
