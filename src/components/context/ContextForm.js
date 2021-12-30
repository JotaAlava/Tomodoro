import React, { useState } from "react";
import PropTypes from "prop-types";
import TextInput from "../common/TextInput";
import BooleanInput from "../common/BooleanInput";

const ContextForm = ({
  context,
  onSave,
  onChange,
  saving = false,
  ...props
}) => {
  const [ctx, setContext] = useState({ ...props.context });
  const [errors, setErrors] = useState({});

  return (
    <form onSubmit={onSave}>
      <h2>{context && context.tomatoContextId ? "Edit" : "Add"} Context</h2>
      {errors.onSave && (
        <div className="alert alert-danger" role="alert">
          {errors.onSave}
        </div>
      )}
      <TextInput
        name="label"
        label="Label"
        value={context.label}
        onChange={onChange}
        error={errors.label}
      />
      <BooleanInput
        name="private"
        label="private"
        value={context.private}
        onChange={onChange}
        error={errors.private}
      />

      <BooleanInput
        name="default"
        label="default"
        value={context.default}
        onChange={onChange}
        error={errors.default}
      />

      <button type="submit" disabled={saving} className="btn btn-primary">
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

ContextForm.propTypes = {
  context: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};

export default ContextForm;
